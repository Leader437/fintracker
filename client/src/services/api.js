import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = "https://fintracker-server-twcf.onrender.com/api/v1";

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,         // include cookies for authentication
})

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
    try {
        const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
        
        const response = await api.request({
            url: endpoint,
            method: options.method || "GET",
            params: options.params || null,
            data: options.body ?? {},
            headers: isFormData ? { ...options.headers } : { "Content-Type": "application/json", ...options.headers },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Api error occurred';
        throw message;
    }
}




// ============ AUTH API ============
export const authAPI = {
    login: (data) => apiRequest('/users/login', {
        method: 'POST',
        body: data,
    }),

    register: (data) => {
        // If FormData, don't set Content-Type header (let browser set it)
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        return apiRequest('/users/register', {
            method: 'POST',
            body: data,
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        });
    },

    logout: () => apiRequest('/users/logout', {
        method: 'POST',
    }),

    forgotPassword: (data) => apiRequest('/users/forgot-password', {
        method: 'POST',
        body: data,
    }),

    verifyOTP: (data) => apiRequest('/users/verify-otp', {
        method: 'POST',
        body: data,
    }),

    resetPassword: (data) => apiRequest('/users/reset-password', {
        method: 'POST',
        body: data,
    }),
};

export const userAPI = {
    getProfile: () => apiRequest('/users/profile'),
    refreshToken: () => apiRequest('/users/refresh-token', { method: 'POST' }),
    updateUserDetail: (data) => apiRequest('/users/update-user-detail', {
        method: 'POST',
        body: data,
    }),

    updateUserDisplayPicture: (data) => apiRequest('/users/update-user-dp', {
        method: 'POST',
        body: data,
    }),
};


export const expenseAPI = {
    addExpense: (data) => apiRequest('/expenses/add-expense', {
        method: 'POST',
        body: data,
    }),

    addExpensesBulk: (expenses) => apiRequest('/expenses/add-expenses-bulk', {
        method: 'POST',
        body: { expenses },
    }),

    getExpenses: () => apiRequest('/expenses/get-expense'),

    updateExpense: (id, data) => apiRequest(`/expenses/update-expense/${id}`, {
        method: 'PUT',
        body: data,
    }),

    deleteExpense: (id) => apiRequest(`/expenses/delete-expense/${id}`, {
        method: 'DELETE',
    }),
};



export default {
    auth: authAPI,
    users: userAPI,
    expense: expenseAPI,
};