import { useState } from 'react';
import { apiClient } from '../api/apiClient';

export const usePlanGenerator = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null);

    const generatePlan = async ({ goal, deadline }) => {
        setLoading(true);
        setError(null);
        setPlan(null);
        try {
            const result = await apiClient.generatePlan(goal, deadline);
            setPlan(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const savePlan = async () => {
        if (!plan) return;
        try {
            const result = await apiClient.savePlan(plan);
            setSaveStatus({ type: 'success', message: `Plan saved! ID: ${result.id}` });
        } catch (err) {
            setSaveStatus({ type: 'error', message: 'Failed to save plan.' });
        } finally {
            setTimeout(() => setSaveStatus(null), 4000);
        }
    };

    return { plan, loading, error, saveStatus, generatePlan, savePlan };
};