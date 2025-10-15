import { CheckCircle, Clock, Calendar, GitBranch } from 'lucide-react';

const Card = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 transition hover:shadow-lg hover:-translate-y-1">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export const SummaryCards = ({ plan }) => {
    const uniquePhases = [...new Set(plan.tasks.map(t => t.phase))].length;
    const deadlineDate = new Date(plan.deadline).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card 
                icon={<CheckCircle className="w-7 h-7 text-blue-600" />} 
                label="Total Tasks" 
                value={plan.total_tasks} 
                color="blue" 
            />
            <Card 
                icon={<Clock className="w-7 h-7 text-purple-600" />} 
                label="Est. Hours" 
                value={plan.estimated_hours} 
                color="purple" 
            />
            <Card 
                icon={<Calendar className="w-7 h-7 text-green-600" />} 
                label="Deadline" 
                value={deadlineDate} 
                color="green" 
            />
            <Card 
                icon={<GitBranch className="w-7 h-7 text-orange-600" />} 
                label="Phases" 
                value={uniquePhases} 
                color="orange" 
            />
        </div>
    );
};