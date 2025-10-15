import React, { useState, useMemo } from 'react';
import { getPhaseStyles, getPriorityStyles } from '../../utils/styleUtils';
import { GitBranch, AlertOctagon, Flame, ChevronUp, ChevronsUp, ChevronDown, CornerDownRight } from 'lucide-react';

const priorityIcons = {
    'Critical': <Flame className="w-4 h-4" />,
    'High': <ChevronsUp className="w-4 h-4" />,
    'Medium': <ChevronUp className="w-4 h-4" />,
    'Low': <AlertOctagon className="w-4 h-4" />,
};

const TaskCard = ({ task, isExpanded, onToggle, dependents }) => {
    const phaseStyles = getPhaseStyles(task.phase);
    const priorityStyles = getPriorityStyles(task.priority);

    return (
        <div className={`ml-4 pl-8 py-5 border-l-2 ${phaseStyles.split(' ')[0]} relative`}>
            {/* Dot on the timeline */}
            <div className={`absolute -left-[11px] top-7 w-5 h-5 rounded-full ${phaseStyles.split(' ')[2]} border-4 border-white dark:border-slate-800`}></div>

            {/* Main Clickable Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-2">
                    {/* Phase and Priority Badges */}
                    <div className="flex items-center gap-2">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${phaseStyles}`}>
                            {task.phase}
                        </span>
                        <div title={task.priority} className={`flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${priorityStyles.iconColor} ${priorityStyles.bgColor}`}>
                            {priorityIcons[task.priority] || priorityIcons['Medium']}
                            <span>{task.priority}</span>
                        </div>
                    </div>
                    {/* Expand/Collapse Button */}
                    <button onClick={onToggle} className="text-slate-400 hover:text-indigo-600 p-1 rounded-full">
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>

                <h4 className="text-lg font-bold text-slate-800 mb-4">{task.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                    <div><strong>Duration:</strong> {task.duration}</div>
                    <div><strong>Est. Hours:</strong> {task.estimatedHours}h</div>
                    <div><strong>Start:</strong> {new Date(task.start_date).toLocaleDateString()}</div>
                    <div><strong>End:</strong> {new Date(task.end_date).toLocaleDateString()}</div>
                </div>

                {/* ---  Expanded Details View --- */}
                {isExpanded && (
                    <div className="mt-5 pt-4 border-t border-slate-200 space-y-4">
                        {task.dependencies && task.dependencies.length > 0 && (
                            <div className="text-sm text-slate-500">
                                <p className="flex items-center gap-2 font-semibold mb-1">
                                    <GitBranch className="w-4 h-4" /> Prerequisites (Depends on):
                                </p>
                                <div className="pl-6 text-indigo-600 font-medium">
                                    {task.dependencies.join(', ')}
                                </div>
                            </div>
                        )}
                        {dependents && dependents.length > 0 && (
                             <div className="text-sm text-slate-500">
                                <p className="flex items-center gap-2 font-semibold mb-1">
                                    <CornerDownRight className="w-4 h-4" /> Blocks the following tasks:
                                </p>
                                <div className="pl-6 text-rose-600 font-medium">
                                    {dependents.join(', ')}
                                </div>
                            </div>
                        )}
                        <div className="text-sm text-slate-500">
                             <p className="font-semibold mb-1">Notes & Blockers:</p>
                             <textarea 
                                placeholder="Add notes about progress or any issues..." 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                             ></textarea>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const TaskList = ({ tasks }) => {
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    const dependentsMap = useMemo(() => {
        const map = new Map();
        tasks.forEach(task => {
            if (task.dependencies) {
                task.dependencies.forEach(depId => {
                    if (!map.has(depId)) {
                        map.set(depId, []);
                    }
                    map.get(depId).push(task.temp_id);
                });
            }
        });
        return map;
    }, [tasks]);

    const handleToggle = (taskId) => {
        setExpandedTaskId(currentId => (currentId === taskId ? null : taskId));
    };

    const tasksByPhase = tasks.reduce((acc, task) => {
        const phase = task.phase || 'Uncategorized';
        if (!acc[phase]) acc[phase] = [];
        acc[phase].push(task);
        return acc;
    }, {});

    return (
        <div>
            <h3 className="text-3xl font-bold text-slate-800 mb-6">Project Timeline</h3>
            <div className="space-y-4">
                {Object.entries(tasksByPhase).map(([phase, phaseTasks]) => {
                    const phaseStyles = getPhaseStyles(phase);
                    return (
                        <div key={phase}>
                            <h4 className={`text-xl font-bold sticky top-0 py-2 bg-slate-50/80 backdrop-blur-sm z-10 ${phaseStyles.split(' ')[1]}`}>
                                {phase}
                            </h4>
                            <div className="space-y-1">
                                {phaseTasks.map(task => (
                                    <TaskCard 
                                        key={task.temp_id} 
                                        task={task} 
                                        isExpanded={expandedTaskId === task.temp_id}
                                        onToggle={() => handleToggle(task.temp_id)}
                                        dependents={dependentsMap.get(task.temp_id) || []}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};