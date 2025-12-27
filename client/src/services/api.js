import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,         // include cookies for authentication
})

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
    try {
        const response = await api.request({
            url: endpoint,
            method: options.method || "GET",
            params: options.params || null,          // better to pass query (filter related) params this way rather than appending to URL, this is better for encoding
            data: options.body ?? null,              // in axios data is used for request body
            headers: { "Content-Type": "application/json", ...options.headers },
        })

        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.response?.message || error.message || 'Api error occurred'
        const status = error.response?.status || 'N/A'

        throw new Error(`status: ${status}, message: ${message}`)
    }
}




// ============ AUTH API ============
export const authAPI = {
    login: (data) => apiRequest('/users/login', {
        method: 'POST',
        body: data,
    }),

    register: (data) => apiRequest('/users/register', {
        method: 'POST',
        body: data,
    }),

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