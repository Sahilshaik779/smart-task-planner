import React from 'react';
import { usePlanGenerator } from '../hooks/usePlanGenerator';
import { GoalInputForm } from '../components/planner/GoalInputForm';
import { PlanDisplay } from '../components/planner/PlanDisplay';
import { AlertCircle } from 'lucide-react';

export const PlannerPage = () => {
    const { plan, loading, error, saveStatus, generatePlan, savePlan } = usePlanGenerator();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-2">Smart Task Planner</h1>
                    <p className="text-slate-500 text-lg">Turn your goals into actionable plans with AI.</p>
                </div>

                <GoalInputForm onSubmit={generatePlan} loading={loading} />

                {error && (
                    <div className="mt-8 p-4 bg-red-100 text-red-800 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-6 h-6" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}
                
                {plan && (
                    <div className="mt-12">
                        <PlanDisplay 
                            plan={plan} 
                            saveStatus={saveStatus} 
                            onSave={savePlan} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};