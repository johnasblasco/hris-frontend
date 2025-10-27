import axios from 'axios';

const API_BASE_URL = 'https://api-hris.slarenasitsolutions.com/public/api';

export const applicantAPI = {
    // Get all applicants
    getAll: () => axios.get(`${API_BASE_URL}/applicants`),

    // Get applicant by ID
    getById: (id: string) => axios.get(`${API_BASE_URL}/applicants/${id}`),

    // Move applicant to different stage
    moveStage: (id: string, stage: string) =>
        axios.post(`${API_BASE_URL}/applicants/${id}/move`, { stage }),

    // Hire applicant
    hire: (id: string) => axios.post(`${API_BASE_URL}/applicants/${id}/hire`),

    // Get hired applicants
    getHired: () => axios.get(`${API_BASE_URL}/hired`),
};

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





export const interviewAPI = {
    // Schedule a new interview
    schedule: (applicantId: string, data: any) =>
        axios.post(`${API_BASE_URL}/applicants/${applicantId}/schedule-interview`, data),

    // Get all interviews
    getAll: () =>
        axios.get(`${API_BASE_URL}/interviews`),

    // Get interviews for a specific applicant
    getForApplicant: (applicantId: string) =>
        axios.get(`${API_BASE_URL}/applicants/${applicantId}/interviews`),

    // Submit feedback for an interview
    submitFeedback: (id: string, data: any) =>
        axios.post(`${API_BASE_URL}/interviews/${id}/feedback`, data),

    // Update an interview
    update: (id: string, data: any) =>
        axios.post(`${API_BASE_URL}/interviews/${id}/update`, data),

    // Cancel an interview
    cancel: (id: string) =>
        axios.post(`${API_BASE_URL}/interviews/${id}/cancel`),

    // Mark interview as no-show
    noshow: (id: string) =>
        axios.post(`${API_BASE_URL}/interviews/${id}/noshow`),
};