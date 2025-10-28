import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { applicantAPI, jobPostingAPI, interviewAPI } from '../services/api';
import { transformApplicant, transformInterview } from '../utils/transformer';

export const useRecruitmentData = (activeTab: string) => {
    const [applicants, setApplicants] = useState([]);
    const [hiredApplicants, setHiredApplicants] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [hiredEmployees, setHiredEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const response = await applicantAPI.getAll();
            if (response.data.isSuccess) {
                const transformedApplicants = response.data.data.map(transformApplicant);
                setApplicants(transformedApplicants);
            }
        } catch (error) {
            console.error('Error fetching applicants:', error);
            toast.error('Failed to fetch applicants');
        } finally {
            setLoading(false);
        }
    };

    const fetchHiredApplicants = async () => {
        try {
            const response = await applicantAPI.getHired();
            if (response.data.isSuccess) {
                const transformedHired = response.data.data.map(transformApplicant);
                setHiredApplicants(transformedHired);
                setHiredEmployees(transformedHired.map((applicant: any) => ({
                    id: applicant.id,
                    name: applicant.name,
                    email: applicant.email,
                    phone: applicant.phone,
                    position: applicant.position,
                    department: applicant.job_posting?.department || 'Unknown',
                    description: applicant.job_posting?.description || 'N/A',
                    startDate: applicant.appliedDate,
                    salary: 'To be determined',
                    source: applicant.source,
                    skills: applicant.skills
                })));
            }
        } catch (error) {
            console.error('Error fetching hired applicants:', error);
            toast.error('Failed to fetch hired applicants');
        }
    };

    const fetchJobPostings = async () => {
        setLoading(true);
        try {
            const response = await jobPostingAPI.getAll({
                search: searchTerm,
                per_page: 50
            });

            if (response.data.isSuccess) {
                const transformedJobs = response.data.job_postings.map((job: any) => ({
                    id: job.id.toString(),
                    title: job.title,
                    department: job.department?.department_name || 'Unknown',
                    location: job.location,
                    type: job.employment_type || 'Full-time',
                    salary: job.salary_range,
                    status: job.status,
                    applications: 0,
                    posted: job.posted_date,
                    deadline: job.deadline_date,
                    description: job.job_posting?.description,
                    requirements: [],
                    responsibilities: job.description,
                }));

                setJobs(transformedJobs);
            }
        } catch (error) {
            console.error('Error fetching job postings:', error);
            toast.error('Failed to fetch job postings');
        } finally {
            setLoading(false);
        }
    };

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            const response = await interviewAPI.getAll();
            if (response.data.isSuccess) {
                const transformedInterviews = response.data.data.map(transformInterview);
                setInterviews(transformedInterviews);
            }
        } catch (error) {
            console.error('Error fetching interviews:', error);
            toast.error('Failed to fetch interviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        switch (activeTab) {
            case 'overview':
                fetchApplicants();
                fetchInterviews();
                break;
            case 'pipeline':
            case 'candidates':
                fetchApplicants();
                break;
            case 'jobs':
                fetchJobPostings();
                break;
            case 'interviews':
                fetchInterviews();
                break;
            case 'hired':
                fetchHiredApplicants();
                break;
        }
    }, [activeTab]);

    return {
        applicants,
        hiredApplicants,
        jobs,
        interviews,
        hiredEmployees,
        loading,
        searchTerm,
        setSearchTerm,
        fetchApplicants,
        fetchHiredApplicants,
        fetchJobPostings,
        fetchInterviews
    };
};