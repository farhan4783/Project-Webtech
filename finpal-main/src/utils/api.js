// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
// Helper function to get auth token
export const getToken = () => {
    return localStorage.getItem('finsync_token');
};

// Helper function to set auth token
export const setToken = (token) => {
    localStorage.setItem('finsync_token', token);
};

// Helper function to remove auth token
export const removeToken = () => {
    localStorage.removeItem('finsync_token');
    localStorage.removeItem('finsync_user');
};

// Helper function to get user data
export const getUser = () => {
    const userStr = localStorage.getItem('finsync_user');
    return userStr ? JSON.parse(userStr) : null;
};

// Helper function to set user data
export const setUser = (user) => {
    localStorage.setItem('finsync_user', JSON.stringify(user));
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
export const authAPI = {
    signup: async (userData) => {
        const response = await apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        if (response.success && response.data.token) {
            setToken(response.data.token);
            setUser(response.data.user);
        }

        return response;
    },

    login: async (credentials) => {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (response.success && response.data.token) {
            setToken(response.data.token);
            setUser(response.data.user);
        }

        return response;
    },

    logout: () => {
        removeToken();
        window.location.href = '/';
    },

    getProfile: async () => {
        return await apiCall('/auth/me');
    },
};

// User API
export const userAPI = {
    getProfile: async () => {
        return await apiCall('/user/profile');
    },

    updateProfile: async (profileData) => {
        return await apiCall('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },

    addGoal: async (goalData) => {
        return await apiCall('/user/goals', {
            method: 'POST',
            body: JSON.stringify(goalData),
        });
    },

    updateGoal: async (goalId, goalData) => {
        return await apiCall(`/user/goals/${goalId}`, {
            method: 'PUT',
            body: JSON.stringify(goalData),
        });
    },

    deleteGoal: async (goalId) => {
        return await apiCall(`/user/goals/${goalId}`, {
            method: 'DELETE',
        });
    },
};

// Chat API
export const chatAPI = {
    sendMessage: async (message, type = null) => {
        return await apiCall('/chat', {
            method: 'POST',
            body: JSON.stringify({ message, type }),
        });
    },

    getHistory: async () => {
        return await apiCall('/chat/history');
    },

    analyzeStock: async (symbol) => {
        return await apiCall('/chat/stock-analysis', {
            method: 'POST',
            body: JSON.stringify({ symbol }),
        });
    },

    compareStocks: async (stock1, stock2) => {
        return await apiCall('/chat', {
            method: 'POST',
            body: JSON.stringify({
                type: 'stock_comparison',
                stock1,
                stock2,
            }),
        });
    },

    analyzeSpending: async (itemName, itemPrice) => {
        return await apiCall('/chat/spending-analysis', {
            method: 'POST',
            body: JSON.stringify({ itemName, itemPrice }),
        });
    },
};

// Reality Lens API (will proxy through Node backend)
export const realityLensAPI = {
    scanProduct: async (imageFile) => {
        const formData = new FormData();
        formData.append('file', imageFile);

        const token = getToken();

        const response = await fetch('http://localhost:8000/scan', {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        return await response.json();
    },
};

export default {
    auth: authAPI,
    user: userAPI,
    chat: chatAPI,
    realityLens: realityLensAPI,
};
