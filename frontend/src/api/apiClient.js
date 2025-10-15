const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'An API error occurred');
    }
    return response.json();
};

export const apiClient = {
    generatePlan: async (goal, deadline) => {
        const response = await fetch(`${API_BASE_URL}/api/v1/plans/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal, deadline })
        });
        return handleResponse(response);
    },
    savePlan: async (plan) => {
        const response = await fetch(`${API_BASE_URL}/api/v1/plans/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plan)
        });
        return handleResponse(response);
    }
};