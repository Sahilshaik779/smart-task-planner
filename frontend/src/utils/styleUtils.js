// A modern, professional color palette for task phases.
export const getPhaseStyles = (phase) => {
    const styles = {
        'Planning': 'border-indigo-400 text-indigo-700 bg-indigo-50',
        'Design': 'border-purple-400 text-purple-700 bg-purple-50',
        'Development': 'border-sky-400 text-sky-700 bg-sky-50',
        'Testing': 'border-amber-400 text-amber-700 bg-amber-50',
        'Launch': 'border-rose-400 text-rose-700 bg-rose-50',
    };
    return styles[phase] || 'border-slate-400 text-slate-700 bg-slate-50';
};

export const getPriorityStyles = (priority) => {
    const styles = {
        'Critical': { iconColor: 'text-red-500', bgColor: 'bg-red-100' },
        'High': { iconColor: 'text-amber-500', bgColor: 'bg-amber-100' },
        'Medium': { iconColor: 'text-sky-500', bgColor: 'bg-sky-100' },
        'Low': { iconColor: 'text-slate-500', bgColor: 'bg-slate-100' },
    };
    return styles[priority] || styles.Medium;
};