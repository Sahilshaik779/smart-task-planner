import React, { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';

export const GoalInputForm = ({ onSubmit, loading }) => {
    const [goal, setGoal] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ goal, deadline });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What's your goal?</label>
                    <textarea value={goal} onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., Launch a mobile app in 3 months..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        rows="3"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Deadline</label>
                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <button type="submit" disabled={loading || !goal || !deadline}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating Plan...</>
                    ) : (
                        <><Zap className="w-5 h-5" /> Generate Smart Plan</>
                    )}
                </button>
            </div>
        </form>
    );
};