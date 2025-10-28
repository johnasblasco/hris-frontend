import { toast } from "sonner";
import { applicantAPI, jobPostingAPI, interviewAPI } from '../services/api';
import { stageMapping } from '../utils/constant';

export const useRecruitmentActions = ({
    fetchApplicants,
    fetchHiredApplicants,
    fetchJobPostings,
    fetchInterviews,
    setJobs,
    setApplicants,
    setInterviews
}: any) => {
    const moveCandidateToStage = async (candidateId: string, newStage: string) => {
        try {
            const backendStage = stageMapping[newStage as keyof typeof stageMapping];
            const response = await applicantAPI.moveStage(candidateId, backendStage);

            if (response.data.isSuccess) {
                setApplicants((prev: any) => prev.map((app: any) =>
                    app.id === candidateId ? { ...app, stage: newStage } : app
                ));

                toast.success(`Candidate moved to stage`);
                fetchApplicants();

                if (newStage === 'hired') {
                    fetchHiredApplicants();
                    toast.success('Candidate hired successfully!');
                }
            }
        } catch (error: any) {
            console.error('Error moving applicant stage:', error);
            const errorMessage = error.response?.data?.message || 'Failed to move applicant stage';
            toast.error(errorMessage);
        }
    };

    const hireApplicant = async (candidateId: string) => {
        try {
            const response = await applicantAPI.hire(candidateId);

            if (response.data.isSuccess) {
                setApplicants((prev: any) => prev.map((app: any) =>
                    app.id === candidateId ? { ...app, stage: 'hired' } : app
                ));

                fetchHiredApplicants();
                toast.success('Candidate hired successfully!');
            }
        } catch (error: any) {
            console.error('Error hiring applicant:', error);
            const errorMessage = error.response?.data?.message || 'Failed to hire applicant';
            toast.error(errorMessage);
        }
    };

    const createJobPosting = async (jobData: any) => {
        if (!jobData.title || !jobData.department_id || !jobData.location) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const response = await jobPostingAPI.create(jobData);

            if (response.data.isSuccess) {
                toast.success('Job posting created successfully!');
                fetchJobPostings();
                return true;
            }
        } catch (error: any) {
            console.error('Error creating job posting:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create job posting';
            toast.error(errorMessage);
        }
        return false;
    };

    const updateJobStatus = async (jobId: string, status: 'active' | 'draft' | 'closed') => {
        try {
            const response = await jobPostingAPI.update(jobId, { status });

            if (response.data.isSuccess) {
                setJobs((prev: any) => prev.map((j: any) =>
                    j.id === jobId ? { ...j, status } : j
                ));
                toast.success(`Job ${status === 'closed' ? 'closed' : 'updated'}`);
                fetchJobPostings();
            }
        } catch (error: any) {
            console.error('Error updating job status:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update job status';
            toast.error(errorMessage);
        }
    };

    const deleteJob = async (jobId: string) => {
        try {
            const response = await jobPostingAPI.archive(jobId);

            if (response.data.isSuccess) {
                setJobs((prev: any) => prev.filter((j: any) => j.id !== jobId));
                toast.success('Job posting archived successfully');
                fetchJobPostings();
            }
        } catch (error: any) {
            console.error('Error archiving job posting:', error);
            const errorMessage = error.response?.data?.message || 'Failed to archive job posting';
            toast.error(errorMessage);
        }
    };

    const scheduleInterview = async (interviewData: any) => {
        if (!interviewData.candidateId || !interviewData.date || !interviewData.time || !interviewData.interviewer) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const scheduledAt = `${interviewData.date} ${interviewData.time}:00`;
            const apiData = {
                applicant_id: parseInt(interviewData.candidateId),
                position: interviewData.position,
                interviewer_id: 10, // You'll need to get this from your employees data
                mode: interviewData.type === 'Virtual' ? 'virtual' : 'in-person',
                scheduled_at: scheduledAt,
                stage: interviewData.type.toLowerCase().replace(' ', '_'),
                location_link: interviewData.type === 'Virtual' ? interviewData.meetingLink : interviewData.location,
                notes: interviewData.notes,
                status: 'scheduled'
            };

            const response = await interviewAPI.schedule(interviewData.candidateId, apiData);

            if (response.data.isSuccess) {
                toast.success('Interview scheduled successfully!');
                fetchInterviews();
                return true;
            }
        } catch (error: any) {
            console.error('Error scheduling interview:', error);
            const errorMessage = error.response?.data?.message || 'Failed to schedule interview';
            toast.error(errorMessage);
        }
        return false;
    };

    const updateInterviewStatus = async (interviewId: string, status: string, additionalData: any = {}) => {
        try {
            const response = await interviewAPI.update(interviewId, {
                status,
                ...additionalData
            });

            if (response.data.isSuccess) {
                toast.success(`Interview ${status} successfully`);
                fetchInterviews();
            }
        } catch (error: any) {
            console.error('Error updating interview:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update interview';
            toast.error(errorMessage);
        }
    };

    const submitInterviewFeedback = async (interviewId: string, feedback: string) => {
        try {
            const response = await interviewAPI.submitFeedback(interviewId, { feedback });

            if (response.data.isSuccess) {
                toast.success('Feedback submitted successfully');
                fetchInterviews();
            }
        } catch (error: any) {
            console.error('Error submitting feedback:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit feedback';
            toast.error(errorMessage);
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
        submitInterviewFeedback
    };
};