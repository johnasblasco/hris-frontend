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