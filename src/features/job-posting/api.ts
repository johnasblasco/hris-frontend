import axios from 'axios';
const API_BASE_URL = 'https://api-hris.slarenasitsolutions.com/public/api';
// Job Posting API
export const jobPostingAPI = {
    // Get all job postings with optional filters
    getAll: (params?: {
        search?: string;
        department_id?: string;
        status?: string;
        per_page?: number;
    }) => axios.get(`${API_BASE_URL}/job-postings`, { params }),

    // Create a new job posting
    create: (data: {
        title: string;
        department_id: string;
        work_type: string;
        employment_type: string;
        location?: string;
        salary_range?: string;
        description?: string;
        status?: 'draft' | 'active' | 'closed';
        posted_date?: string;
        deadline_date?: string;
    }) => axios.post(`${API_BASE_URL}/create/job-postings`, data),

    // Update a job posting
    update: (id: string, data: {
        title?: string;
        department_id?: string;
        work_type?: string;
        employment_type?: string;
        location?: string;
        salary_range?: string;
        description?: string;
        status?: 'draft' | 'active' | 'closed';
        posted_date?: string;
        deadline_date?: string;
    }) => axios.post(`${API_BASE_URL}/update/job-postings/${id}`, data),

    // Archive a job posting
    archive: (id: string) => axios.post(`${API_BASE_URL}/archive/job-postings/${id}`),
};


