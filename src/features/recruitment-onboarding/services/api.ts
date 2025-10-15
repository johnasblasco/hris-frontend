import axios from 'axios';

const API_BASE_URL = 'http://hris-sms.slarenasitsolutions.com/api'; // Adjust to your Laravel backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add request interceptor to include auth token if needed
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const jobPostingAPI = {
    // Create a new job posting
    create: (jobData: any) => api.post('/job-postings', jobData),

    // Get all job postings with filters
    getAll: (params = {}) => api.get('/job-postings', { params }),

    // Update a job posting
    update: (id: any, jobData: any) => api.put(`/job-postings/${id}`, jobData),

    // Archive a job posting
    archive: (id: any) => api.delete(`/job-postings/${id}`),
};

export default api;