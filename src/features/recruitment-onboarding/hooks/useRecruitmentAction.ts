// hooks/useRecruitmentActions.ts
import { useState } from 'react';
import api from '@/utils/axios';
import { stageMapping } from '../utils/constant';
interface UseRecruitmentActionsProps {
    fetchApplicants: () => void;
    fetchHiredApplicants: () => void;
    fetchJobPostings: () => void;
    fetchInterviews: () => void;
}

export const useRecruitmentActions = ({
    fetchApplicants,
    fetchHiredApplicants,
    fetchJobPostings,
    fetchInterviews
}: UseRecruitmentActionsProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // hooks/useRecruitmentActions.ts
    const moveCandidateToStage = async (candidateId: string, stage: string) => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔍 Original stage:', stage);

            // Map the frontend stage to backend stage
            const backendStage = stageMapping[stage as keyof typeof stageMapping];

            if (!backendStage) {
                throw new Error(`Invalid stage: ${stage}`);
            }

            console.log('🔧 Mapped to backend stage:', backendStage);

            const response = await api.post(`/applicants/${candidateId}/move`, {
                stage: backendStage
            });

            console.log('✅ API Response:', response.data);

            if (response.data.isSuccess) {
                await fetchApplicants();
                return true;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            console.error('❌ Error moving candidate:', {
                originalStage: stage,
                error: err.message,
                response: err.response?.data
            });
            setError(err.response?.data?.message || err.message || 'Failed to move candidate');
            return false;
        } finally {
            setLoading(false);
        }
    };
    const hireApplicant = async (candidateId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`/applicants/${candidateId}/hire`);

            if (response.data.isSuccess) {
                // Refetch both lists
                await Promise.all([fetchApplicants(), fetchHiredApplicants()]);
                return true;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to hire candidate');
            console.error('Error hiring candidate:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const createJobPosting = async (jobData: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/jobs', jobData);

            if (response.data.isSuccess) {
                await fetchJobPostings();
                return true;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to create job posting');
            console.error('Error creating job:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateJobStatus = async (jobId: string, status: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.patch(`/jobs/${jobId}/status`, { status });

            if (response.data.isSuccess) {
                await fetchJobPostings();
                return true;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update job status');
            console.error('Error updating job status:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteJob = async (jobId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.delete(`/jobs/${jobId}`);

            if (response.data.isSuccess) {
                await fetchJobPostings();
                return true;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to delete job');
            console.error('Error deleting job:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const scheduleInterview = async (interviewData: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/interviews', interviewData);

            if (response.data.isSuccess) {
                await fetchInterviews();
                return true;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to schedule interview');
            console.error('Error scheduling interview:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateInterviewStatus = async (interviewId: string, status: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.patch(`/interviews/${interviewId}/status`, { status });

            if (response.data.isSuccess) {
                await fetchInterviews();
                return true;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update interview status');
            console.error('Error updating interview status:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const submitInterviewFeedback = async (interviewId: string, feedback: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`/interviews/${interviewId}/feedback`, feedback);

            if (response.data.isSuccess) {
                await fetchInterviews();
                return true;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to submit feedback');
            console.error('Error submitting feedback:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        moveCandidateToStage,
        hireApplicant,
        createJobPosting,
        updateJobStatus,
        deleteJob,
        scheduleInterview,
        updateInterviewStatus,
        submitInterviewFeedback,
        loading,
        error
    };
};