import { Download } from 'lucide-react';
import { SummaryCards } from './summaryCards';
import { TaskList } from './TaskList';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState } from 'react';

export const PlanDisplay = ({ plan }) => {

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleExport = () => {
        if (!plan) return;
        const data = JSON.stringify(plan, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plan-${plan.id.substring(0, 8)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleGeneratePdf = () => {
        setIsGeneratingPdf(true);
        const input = document.getElementById('plan-to-print');

        html2canvas(input, {
            scale: 2, 
            useCORS: true,
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            const ratio = canvasWidth / pdfWidth;
            const calculatedHeight = canvasHeight / ratio;

            let heightLeft = calculatedHeight;
            let position = 0;


            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - calculatedHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`momentum-plan-${plan.id.substring(0, 8)}.pdf`);
            setIsGeneratingPdf(false);
        }).catch(err => {
            console.error("Error generating PDF:", err);
            setIsGeneratingPdf(false);
        });
    };

    return (
        <div className="space-y-8">
            {/* Action Buttons: "Save" is removed, "Generate PDF" is added */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={handleGeneratePdf}
                    disabled={isGeneratingPdf}
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50"
                >
                    <Download className="w-5 h-5" />
                    {isGeneratingPdf ? 'Generating...' : 'Generate PDF'}
                </button>
                <button 
                    onClick={handleExport} 
                    className="w-full sm:w-auto px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                    <Download className="w-5 h-5" /> Export as JSON
                </button>
            </div>
            
            {/* IMPORTANT: We wrap the content to be printed in a div with a specific ID */}
            <div id="plan-to-print">
                <SummaryCards plan={plan} />
                <div className="mt-8">
                    <TaskList tasks={plan.tasks} />
                </div>
            </div>
        </div>
    );
};