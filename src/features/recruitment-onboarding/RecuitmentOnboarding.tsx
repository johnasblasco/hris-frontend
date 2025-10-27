import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    MapPin,
    DollarSign,
    Clock,
    Users,
    Plus,
    Filter,
    Eye,
    MessageSquare,
    Phone,
    Mail,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    Building2,
    Briefcase,
    ArrowRight,
    Download,
    Trash2,
    Send,
    Link as LinkIcon,
    RefreshCw
} from 'lucide-react';
import { toast } from "sonner";
import { mockCandidates, mockInterviews, mockHiredEmployees, mockDepartments, mockEmployees } from '../data/mockData';
import { applicantAPI, jobPostingAPI, interviewAPI } from './services/api'; // Added interviewAPI import
import type { BackendApplicant, JobStatus, NewJobData, Applicant, TransformedJobPosting, HiredEmployee, Interview, Candidate, JobPosting } from './recruitmentTypes';

// Added missing recruitmentStages array
const recruitmentStages = [
    { id: 'new', label: 'New Applications', color: 'bg-blue-100 text-blue-800', icon: FileText },
    { id: 'screening', label: 'Screening', color: 'bg-purple-100 text-purple-800', icon: Filter },
    { id: 'phone-screening', label: 'Phone Screening', color: 'bg-indigo-100 text-indigo-800', icon: Phone },
    { id: 'assessment', label: 'Assessment', color: 'bg-yellow-100 text-yellow-800', icon: FileText },
    { id: 'technical-interview', label: 'Technical Interview', color: 'bg-orange-100 text-orange-800', icon: Users },
    { id: 'final-interview', label: 'Final Interview', color: 'bg-pink-100 text-pink-800', icon: Users },
    { id: 'offer', label: 'Offer Extended', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { id: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
];

const recruitmentMetrics = [
    { label: 'Open Positions', value: 12, change: '+2', icon: Briefcase },
    { label: 'Active Candidates', value: 45, change: '+8', icon: Users },
    { label: 'This Month Hires', value: 3, change: '+1', icon: CheckCircle },
    { label: 'Avg Time to Hire', value: '18 days', change: '-2', icon: Clock },
];

// Stage mapping between frontend and backend
const stageMapping = {
    'new': 'new_application',
    'screening': 'screening',
    'phone-screening': 'phone_screening',
    'assessment': 'assessment',
    'technical-interview': 'technical_interview',
    'final-interview': 'final_interview',
    'offer': 'offer_extended',
    'hired': 'hired'
} as const;

const reverseStageMapping = {
    'new_application': 'new',
    'screening': 'screening',
    'phone_screening': 'phone-screening',
    'assessment': 'assessment',
    'technical_interview': 'technical-interview',
    'final_interview': 'final-interview',
    'offer_extended': 'offer',
    'hired': 'hired'
} as const;

const RecruitmentOnboarding = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [hiredApplicants, setHiredApplicants] = useState<Applicant[]>([]);
    const [activeTab, setActiveTab] = useState('pipeline');
    const [pipelineView, setPipelineView] = useState<'pipeline' | 'table'>('pipeline');
    const [showJobDialog, setShowJobDialog] = useState(false);
    const [showInterviewDialog, setShowInterviewDialog] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [showCandidateDialog, setShowCandidateDialog] = useState(false);
    const [showJobDetailDialog, setShowJobDetailDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState<string>('all');
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState<TransformedJobPosting[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
    const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
    const [hiredEmployees, setHiredEmployees] = useState<HiredEmployee[]>(mockHiredEmployees);
    const [departments, setDepartments] = useState(mockDepartments);


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



    const [newJob, setNewJob] = useState<NewJobData>({
        title: '',
        department_id: '',
        work_type: 'On-site',
        employment_type: 'Full-time',
        location: '',
        salary_range: '',
        status: 'draft',
        description: '',
        posted_date: new Date().toISOString().split('T')[0],
        deadline_date: '',
    });

    const [newInterview, setNewInterview] = useState<Partial<Interview>>({
        candidateId: '',
        candidateName: '',
        position: '',
        interviewer: '',
        date: '',
        time: '',
        type: 'Phone Screening',
        status: 'scheduled',
        notes: '',
        location: '',
        meetingLink: '',
    });


    // Add transformInterview function
    const transformInterview = (backendInterview: any): Interview => {
        if (!backendInterview) {
            console.warn('Received undefined backendInterview');
            return createDefaultInterview();
        }

        try {
            // Parse the scheduled_at datetime into separate date and time
            const scheduledAt = backendInterview.scheduled_at;
            let date = '';
            let time = '';

            if (scheduledAt) {
                const datetime = new Date(scheduledAt);
                date = datetime.toISOString().split('T')[0];
                time = datetime.toTimeString().split(' ')[0].substring(0, 5); // Get HH:MM format
            }

            return {
                id: backendInterview.id?.toString() || 'unknown',
                candidateId: backendInterview.applicant_id?.toString() || '',
                candidateName: backendInterview.applicant ?
                    `${backendInterview.applicant.first_name} ${backendInterview.applicant.last_name}` :
                    'Unknown Candidate',
                position: backendInterview.position ||
                    backendInterview.applicant?.job_posting?.title ||
                    'Not specified',
                interviewer: backendInterview.interviewer ?
                    `${backendInterview.interviewer.first_name} ${backendInterview.interviewer.last_name}` :
                    'Unknown Interviewer',
                date: date,
                time: time,
                type: backendInterview.mode === 'in-person' ? 'In-Person' :
                    backendInterview.mode === 'virtual' ? 'Virtual' :
                        backendInterview.stage || 'Phone Screening',
                status: backendInterview.status || 'scheduled',
                notes: backendInterview.notes || '',
                location: backendInterview.mode === 'in-person' ? backendInterview.location_link : '',
                meetingLink: backendInterview.mode === 'virtual' ? backendInterview.location_link : '',
                created_at: backendInterview.created_at || new Date().toISOString(),
                updated_at: backendInterview.updated_at || new Date().toISOString()
            };
        } catch (error) {
            console.error('Error transforming interview:', error, backendInterview);
            return createDefaultInterview();
        }
    };

    const createDefaultInterview = (): Interview => ({
        id: 'default',
        candidateId: '',
        candidateName: 'Unknown Candidate',
        position: 'Not specified',
        interviewer: '',
        date: '',
        time: '',
        type: 'Phone Screening',
        status: 'scheduled',
        notes: '',
        location: '',
        meetingLink: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });


    // Add function to update interview status
    const updateInterviewStatus = async (interviewId: string, status: string, additionalData: any = {}) => {
        try {
            const response = await interviewAPI.update(interviewId, {
                status,
                ...additionalData
            });

            if (response.data.isSuccess) {
                toast.success(`Interview ${status} successfully`);
                fetchInterviews(); // Refresh the list
            }
        } catch (error: any) {
            console.error('Error updating interview:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update interview';
            toast.error(errorMessage);
        }
    };

    // Add function to submit feedback
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

    // Update useEffect to fetch interviews when the interviews tab is active
    useEffect(() => {
        if (activeTab === 'interviews') {
            fetchInterviews();
        }
        if (activeTab === 'pipeline' || activeTab === 'candidates') {
            fetchApplicants();
        }
        if (activeTab === 'hired') {
            fetchHiredApplicants();
        }
    }, [activeTab]);









    // Fixed transformApplicant function with proper typing
    const transformApplicant = (backendApplicant: any): Applicant => {
        // Add comprehensive safety checks
        if (!backendApplicant) {
            console.warn('Received undefined backendApplicant');
            return createDefaultApplicant();
        }

        // Debug the incoming data
        console.log('Transforming applicant:', backendApplicant);

        try {
            return {
                id: backendApplicant.id?.toString() || 'unknown',
                name: backendApplicant.first_name + " " + backendApplicant.last_name || 'Unknown Candidate',
                email: backendApplicant.email || '',
                phone: backendApplicant.phone || '',
                experience: backendApplicant.experience || '',
                stage: getSafeStage(backendApplicant.stage),
                position: backendApplicant.job_posting?.title || backendApplicant.position || 'Not specified',
                source: backendApplicant.source || '',
                appliedDate: getSafeDate(backendApplicant.applied_date, backendApplicant.created_at),
                rating: backendApplicant.rating || 0,
                notes: backendApplicant.notes || '',
                resume: backendApplicant.resume || '',
                skills: getSafeSkills(backendApplicant.skills),
                is_archived: backendApplicant.is_archived || false,
                job_posting: backendApplicant.job_posting ? {
                    id: backendApplicant.job_posting.id?.toString() || 'unknown',
                    title: backendApplicant.job_posting.title || '',
                    department: backendApplicant.job_posting.department?.department_name || 'Unknown',
                    location: backendApplicant.job_posting.location || ''
                } : undefined,
                created_at: backendApplicant.created_at || new Date().toISOString(),
                updated_at: backendApplicant.updated_at || new Date().toISOString()
            };
        } catch (error) {
            console.error('Error transforming applicant:', error, backendApplicant);
            return createDefaultApplicant();
        }
    };

    // Helper functions for safe data transformation
    const createDefaultApplicant = (): Applicant => ({
        id: 'default',
        name: 'Unknown Candidate',
        email: '',
        phone: '',
        experience: '',
        stage: 'new',
        position: 'Not specified',
        source: '',
        appliedDate: new Date().toISOString().split('T')[0],
        rating: 0,
        notes: '',
        resume: '',
        skills: [],
        is_archived: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const getSafeStage = (stage: any): string => {
        if (!stage) return 'new';

        const safeStage = reverseStageMapping[stage as keyof typeof reverseStageMapping];
        return safeStage || stage || 'new';
    };

    const getSafeDate = (appliedDate: any, createdDate: any): string => {
        const date = appliedDate || createdDate;
        if (!date) return new Date().toISOString().split('T')[0];

        try {
            return date.split('T')[0];
        } catch {
            return new Date().toISOString().split('T')[0];
        }
    };

    const getSafeSkills = (skills: any): string[] => {
        if (Array.isArray(skills)) return skills;
        if (typeof skills === 'string') {
            try {
                return JSON.parse(skills);
            } catch {
                return [];
            }
        }
        return [];
    };

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const response = await applicantAPI.getAll();
            console.log('API Response:', response); // Debug the actual response

            if (response.data.isSuccess) {
                console.log('API Data:', response.data.data); // Debug the data structure

                // Add safety check for the data structure
                if (!response.data.data || !Array.isArray(response.data.data)) {
                    console.error('Invalid data structure:', response.data.data);
                    toast.error('Invalid data received from server');
                    return;
                }

                const transformedApplicants = response.data.data.map(transformApplicant);
                console.log('Transformed Applicants:', transformedApplicants); // Debug transformed data

                setApplicants(transformedApplicants);
                setCandidates(transformedApplicants);
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

    // Move applicant to different stage
    const moveCandidateToStage = async (candidateId: string, newStage: string) => {
        try {
            const backendStage = stageMapping[newStage as keyof typeof stageMapping];

            const response = await applicantAPI.moveStage(candidateId, backendStage);

            if (response.data.isSuccess) {
                setApplicants(prev => prev.map(app =>
                    app.id === candidateId ? { ...app, stage: newStage } : app
                ));
                setCandidates(prev => prev.map(c =>
                    c.id === candidateId ? { ...c, stage: newStage } : c
                ));

                toast.success(`Candidate moved to ${getStageLabel(newStage)}`);

                if (newStage === 'hired') {
                    fetchHiredApplicants(); // Refresh hired list
                    toast.success('Candidate hired successfully!');
                }
            }
        } catch (error: any) {
            console.error('Error moving applicant stage:', error);
            const errorMessage = error.response?.data?.message || 'Failed to move applicant stage';
            toast.error(errorMessage);
        }
    };

    // Hire applicant - Fixed to use the correct API
    const hireApplicant = async (candidateId: string) => {
        try {
            const response = await applicantAPI.hire(candidateId);

            if (response.data.isSuccess) {
                // Update the stage to 'hired'
                setApplicants(prev => prev.map(app =>
                    app.id === candidateId ? { ...app, stage: 'hired' } : app
                ));
                setCandidates(prev => prev.map(c =>
                    c.id === candidateId ? { ...c, stage: 'hired' } : c
                ));
                fetchHiredApplicants(); // Refresh hired list
                toast.success('Candidate hired successfully!');
            }
        } catch (error: any) {
            console.error('Error hiring applicant:', error);
            const errorMessage = error.response?.data?.message || 'Failed to hire applicant';
            toast.error(errorMessage);
        }
    };

    // Fetch applicant by ID for details
    const fetchApplicantById = async (id: string) => {
        try {
            const response = await applicantAPI.getById(id);
            if (response.data.isSuccess) {
                return transformApplicant(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching applicant details:', error);
            toast.error('Failed to fetch applicant details');
        }
        return null;
    };

    // Update useEffect to fetch data
    useEffect(() => {
        if (activeTab === 'pipeline' || activeTab === 'candidates') {
            fetchApplicants();
        }
        if (activeTab === 'hired') {
            fetchHiredApplicants();
        }
    }, [activeTab]);

    // Update the openCandidateDetail function
    const openCandidateDetail = async (candidate: Candidate) => {
        setSelectedCandidate(candidate);

        // Fetch fresh data for the candidate
        const freshData = await fetchApplicantById(candidate.id);
        if (freshData) {
            setSelectedCandidate(freshData);
        }

        setShowCandidateDialog(true);
    };

    // Update the getCandidatesByStage function to use applicants
    const getCandidatesByStage = (stageId: string) => {
        return applicants.filter(app => app.stage === stageId && !app.is_archived);
    };

    const filteredCandidates = applicants.filter(applicant => {
        const name = applicant.name?.toLowerCase() || '';
        const position = applicant.position?.toLowerCase() || '';
        const email = applicant.email?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            name.includes(search) ||
            position.includes(search) ||
            email.includes(search);

        const matchesStage = filterStage === 'all' || applicant.stage === filterStage;

        return matchesSearch && matchesStage && !applicant.is_archived;
    });

    const fetchJobPostings = async () => {
        setLoading(true);
        try {
            const response = await jobPostingAPI.getAll({
                search: searchTerm,
                per_page: 50 // Adjust as needed
            });

            if (response.data.isSuccess) {
                const transformedJobs: TransformedJobPosting[] = response.data.job_postings.map((job: any) => ({
                    id: job.id.toString(),
                    title: job.title,
                    department: job.department?.department_name || 'Unknown',
                    location: job.location,
                    type: job.employment_type || 'Full-time',
                    salary: job.salary_range,
                    status: job.status,
                    applications: 0, // You might want to add this to your backend
                    posted: job.posted_date,
                    deadline: job.deadline_date,
                    description: job.job_posting?.description,
                    requirements: [], // You might want to add this to your backend
                    responsibilities: job.description, // Using description as fallback
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


    useEffect(() => {
        if (activeTab === 'jobs' || activeTab === 'overview') {
            fetchJobPostings();
        }
    }, [activeTab, searchTerm]);

    const getStageColor = (stage: string) => {
        const stageConfig = recruitmentStages.find(s => s.id === stage);
        return stageConfig?.color || 'bg-gray-100 text-gray-800';
    };

    const getStageLabel = (stage: string) => {
        const stageConfig = recruitmentStages.find(s => s.id === stage);
        return stageConfig?.label || stage;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'draft': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'closed': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return null;
        }
    };


    const createJobPosting = async () => {
        if (!newJob.title || !newJob.department_id || !newJob.location) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            // Convert the data to match API expectations
            const apiData = {
                ...newJob,
                status: newJob.status as JobStatus // This ensures type safety
            };

            const response = await jobPostingAPI.create(apiData);

            if (response.data.isSuccess) {
                const createdJob = response.data.data;
                const transformedJob: TransformedJobPosting = {
                    id: createdJob.id.toString(),
                    title: createdJob.title,
                    department: departments.find(d => d.id.toString() === createdJob.department_id)?.name || 'Unknown',
                    location: createdJob.location,
                    type: createdJob.employment_type,
                    salary: createdJob.salary_range,
                    status: createdJob.status,
                    applications: 0,
                    posted: createdJob.posted_date,
                    deadline: createdJob.deadline_date,
                    description: createdJob.description,
                    requirements: [],
                    responsibilities: createdJob.description,
                };

                setJobs(prev => [...prev, transformedJob]);
                toast.success('Job posting created successfully!');
                setShowJobDialog(false);
                setNewJob({
                    title: '',
                    department_id: '',
                    work_type: 'On-site',
                    employment_type: 'Full-time',
                    location: '',
                    salary_range: '',
                    status: 'draft',
                    description: '',
                    posted_date: new Date().toISOString().split('T')[0],
                    deadline_date: '',
                });
            }
        } catch (error: any) {
            console.error('Error creating job posting:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create job posting';
            toast.error(errorMessage);
        }
    };

    // Fixed updateJobStatus
    const updateJobStatus = async (jobId: string, status: 'active' | 'draft' | 'closed') => {
        try {
            const response = await jobPostingAPI.update(jobId, { status });

            if (response.data.isSuccess) {
                setJobs(prev => prev.map(j =>
                    j.id === jobId ? { ...j, status } : j
                ));
                toast.success(`Job ${status === 'closed' ? 'closed' : 'updated'}`);
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
                setJobs(prev => prev.filter(j => j.id !== jobId));
                toast.success('Job posting archived successfully');
            }
        } catch (error: any) {
            console.error('Error archiving job posting:', error);
            const errorMessage = error.response?.data?.message || 'Failed to archive job posting';
            toast.error(errorMessage);
        }
    };

    const scheduleInterview = async () => {
        if (!newInterview.candidateId || !newInterview.date || !newInterview.time || !newInterview.interviewer) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            // Combine date and time into scheduled_at format
            const scheduledAt = `${newInterview.date} ${newInterview.time}:00`;

            const interviewData = {
                applicant_id: parseInt(newInterview.candidateId),
                position: newInterview.position,
                interviewer_id: 10, // You'll need to get this from your employees data
                mode: newInterview.type === 'Virtual' ? 'virtual' : 'in-person',
                scheduled_at: scheduledAt,
                stage: newInterview.type.toLowerCase().replace(' ', '_'), // Convert to backend stage format
                location_link: newInterview.type === 'Virtual' ? newInterview.meetingLink : newInterview.location,
                notes: newInterview.notes,
                status: 'scheduled'
            };

            const response = await interviewAPI.schedule(newInterview.candidateId, interviewData);

            if (response.data.isSuccess) {
                toast.success('Interview scheduled successfully!');
                setShowInterviewDialog(false);
                setNewInterview({
                    candidateId: '',
                    candidateName: '',
                    position: '',
                    interviewer: '',
                    date: '',
                    time: '',
                    type: 'Phone Screening',
                    status: 'scheduled',
                    notes: '',
                    location: '',
                    meetingLink: '',
                });
                fetchInterviews(); // Refresh the interviews list
            }
        } catch (error: any) {
            console.error('Error scheduling interview:', error);
            const errorMessage = error.response?.data?.message || 'Failed to schedule interview';
            toast.error(errorMessage);
        }
    };

    const sendEmail = (email: string) => {
        toast.success(`Email sent to ${email}`);
    };

    const callCandidate = (phone: string) => {
        toast.info(`Calling ${phone}...`);
    };

    // Add a safe initials function
    const getInitials = (name: string | undefined): string => {
        if (!name || typeof name !== 'string') return '??';

        try {
            return name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        } catch {
            return '??';
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recruitmentMetrics.map((metric, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                            <metric.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <p className="text-xs text-muted-foreground">{metric.change} from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common recruitment tasks</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button className="h-20 flex flex-col gap-2" onClick={() => setShowJobDialog(true)}>
                            <Plus className="w-6 h-6" />
                            Post New Job
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setActiveTab('pipeline')}>
                            <Users className="w-6 h-6" />
                            Review Candidates
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setShowInterviewDialog(true)}>
                            <Calendar className="w-6 h-6" />
                            Schedule Interview
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {applicants
                                .filter(app => app.stage === 'new')
                                .slice(0, 5)
                                .map((applicant) => (
                                    <div key={applicant.id} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer" onClick={() => openCandidateDetail(applicant)}>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback>
                                                    {/* Safe name splitting */}
                                                    {getInitials(applicant.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{applicant.name}</p>
                                                <p className="text-sm text-muted-foreground">{applicant.position}</p>
                                            </div>
                                        </div>
                                        <Badge className={getStageColor(applicant.stage)}>
                                            {getStageLabel(applicant.stage)}
                                        </Badge>
                                    </div>
                                ))}
                            {applicants.filter(app => app.stage === 'new').length === 0 && (
                                <p className="text-center text-muted-foreground py-4">No new applications</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Interviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {interviews.filter(i => i.status === 'scheduled').slice(0, 5).map((interview) => (
                                <div key={interview.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div>
                                        <p className="font-medium">{interview.candidateName}</p>
                                        <p className="text-sm text-muted-foreground">{interview.date} at {interview.time}</p>
                                    </div>
                                    <Badge variant="outline">{interview.type}</Badge>
                                </div>
                            ))}
                            {interviews.filter(i => i.status === 'scheduled').length === 0 && (
                                <p className="text-center text-muted-foreground py-4">No scheduled interviews</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderPipelineView = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Recruitment Pipeline</h2>
                    <p className="text-muted-foreground">Move candidates through hiring stages</p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                    />
                    <Button
                        variant="outline"
                        onClick={fetchApplicants}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex justify-center">
                <Tabs value={pipelineView} onValueChange={(value) => setPipelineView(value as 'pipeline' | 'table')} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
                        <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
                        <TabsTrigger value="table">Table View</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pipeline" className="mt-6">
                        {loading ? (
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div>Loading applicants...</div>
                                </CardContent>
                            </Card>
                        ) : (
                            <ScrollArea className="w-full overflow-x-auto">
                                <div className="flex gap-4 pb-4 flex-nowrap">
                                    {recruitmentStages.filter(stage => stage.id !== 'rejected').map((stage) => {
                                        const stageApplicants = getCandidatesByStage(stage.id);
                                        const StageIcon = stage.icon;

                                        return (
                                            <Card key={stage.id} className="min-w-[320px] flex-shrink-0">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <StageIcon className="w-4 h-4" />
                                                            <CardTitle className="text-sm">{stage.label}</CardTitle>
                                                        </div>
                                                        <Badge variant="secondary">{stageApplicants.length}</Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <ScrollArea className="h-[600px] pr-4">
                                                        <div className="space-y-3">
                                                            {stageApplicants.map((applicant) => (
                                                                <Card key={applicant.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                                                    <CardContent className="p-4">
                                                                        <div className="space-y-3">
                                                                            <div className="flex items-start justify-between">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Avatar className="h-8 w-8">
                                                                                        <AvatarFallback>{applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                                                    </Avatar>
                                                                                    <div>
                                                                                        <p className="font-medium text-sm">{applicant.name}</p>
                                                                                        <p className="text-xs text-muted-foreground">{applicant.position}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => openCandidateDetail(applicant)}
                                                                                >
                                                                                    <Eye className="w-4 h-4" />
                                                                                </Button>
                                                                            </div>

                                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                                <Mail className="w-3 h-3" />
                                                                                <span className="truncate">{applicant.email}</span>
                                                                            </div>

                                                                            <div className="flex items-center justify-between text-xs">
                                                                                <span className="text-muted-foreground">{applicant.experience} exp</span>
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="font-medium">{applicant.rating}</span>
                                                                                    <span className="text-muted-foreground">/ 5.0</span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex gap-1">
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="flex-1 h-7 text-xs"
                                                                                    onClick={() => {
                                                                                        const currentIndex = recruitmentStages.findIndex(s => s.id === stage.id);
                                                                                        if (currentIndex < recruitmentStages.length - 2) {
                                                                                            moveCandidateToStage(applicant.id, recruitmentStages[currentIndex + 1].id);
                                                                                        } else if (currentIndex === recruitmentStages.length - 2) {
                                                                                            hireApplicant(applicant.id);
                                                                                        }
                                                                                    }}
                                                                                    disabled={loading}
                                                                                >
                                                                                    <ArrowRight className="w-3 h-3 mr-1" />
                                                                                    {stage.id === 'offer' ? 'Hire' : 'Advance'}
                                                                                </Button>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="h-7 text-xs"
                                                                                    onClick={() => moveCandidateToStage(applicant.id, 'rejected')}
                                                                                    disabled={loading}
                                                                                >
                                                                                    <XCircle className="w-3 h-3" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}

                                                            {stageApplicants.length === 0 && (
                                                                <div className="text-center py-8 text-muted-foreground text-sm">
                                                                    No candidates in this stage
                                                                </div>
                                                            )}
                                                        </div>
                                                    </ScrollArea>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        )}
                    </TabsContent>

                    <TabsContent value="table" className="mt-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <Select value={filterStage} onValueChange={setFilterStage}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Filter by stage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Stages</SelectItem>
                                            {recruitmentStages.map(stage => (
                                                <SelectItem key={stage.id} value={stage.id}>{stage.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Candidate</TableHead>
                                                <TableHead>Position</TableHead>
                                                <TableHead>Stage</TableHead>
                                                <TableHead>Source</TableHead>
                                                <TableHead>Applied</TableHead>
                                                <TableHead>Rating</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredCandidates.filter(c => c.stage !== 'rejected').map((candidate) => (
                                                <TableRow key={candidate.id}>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium">{candidate.name}</div>
                                                                <div className="text-sm text-muted-foreground">{candidate.email}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{candidate.position}</TableCell>
                                                    <TableCell>
                                                        <Badge className={getStageColor(candidate.stage)}>
                                                            {getStageLabel(candidate.stage)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{candidate.source}</TableCell>
                                                    <TableCell>{candidate.appliedDate}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <span className="mr-2">{candidate.rating}</span>
                                                            <Progress value={candidate.rating * 20} className="w-16" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" onClick={() => openCandidateDetail(candidate)}>
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="outline" size="sm" onClick={() => sendEmail(candidate.email)}>
                                                                <MessageSquare className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="outline" size="sm" onClick={() => callCandidate(candidate.phone)}>
                                                                <Phone className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );

    const renderJobPostings = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Job Postings</h2>
                    <p className="text-muted-foreground">Manage your job openings</p>
                </div>
                <Button onClick={() => setShowJobDialog(true)} disabled={loading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                </Button>
            </div>

            {loading ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <div>Loading job postings...</div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <Card key={job.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle>{job.title}</CardTitle>
                                            {getStatusIcon(job.status)}
                                        </div>
                                        <CardDescription className="flex items-center gap-4 mt-2">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-4 h-4" />
                                                {job.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {job.salary}
                                            </span>
                                        </CardDescription>
                                    </div>
                                    <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                                        {job.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        <span>{job.applications} applications</span>
                                        <span>Posted: {job.posted}</span>
                                        <span>Deadline: {job.deadline}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => {
                                            setSelectedJob(job as JobPosting);
                                            setShowJobDetailDialog(true);
                                        }}>
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                        {job.status === 'active' && (
                                            <Button variant="outline" size="sm" onClick={() => updateJobStatus(job.id, 'closed')}>
                                                Close
                                            </Button>
                                        )}
                                        {job.status === 'draft' && (
                                            <Button variant="outline" size="sm" onClick={() => updateJobStatus(job.id, 'active')}>
                                                Publish
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm" onClick={() => {
                                            if (confirm('Are you sure you want to archive this job posting?')) {
                                                deleteJob(job.id);
                                            }
                                        }}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {jobs.length === 0 && !loading && (
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div>No job postings found.</div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );

    const renderInterviews = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Interviews</h2>
                    <p className="text-muted-foreground">Manage interview schedules</p>
                </div>
                <Button onClick={() => setShowInterviewDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Interview
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Interviewer</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Location/Link</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {interviews.map((interview) => (
                                <TableRow key={interview.id}>
                                    <TableCell>{interview.candidateName}</TableCell>
                                    <TableCell>{interview.position}</TableCell>
                                    <TableCell>{interview.interviewer}</TableCell>
                                    <TableCell>{interview.date} {interview.time}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{interview.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {interview.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {interview.location}
                                                </div>
                                            )}
                                            {interview.meetingLink && (
                                                <div className="flex items-center gap-1">
                                                    <LinkIcon className="w-3 h-3" />
                                                    <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        Join Meeting
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                interview.status === 'completed' ? 'default' :
                                                    interview.status === 'cancelled' ? 'destructive' :
                                                        interview.status === 'noshow' ? 'destructive' :
                                                            'secondary'
                                            }
                                            className={
                                                interview.status === 'completed' ? 'bg-green-500' :
                                                    interview.status === 'cancelled' ? 'bg-red-500' :
                                                        interview.status === 'noshow' ? 'bg-orange-500' :
                                                            interview.status === 'scheduled' ? 'bg-blue-500' :
                                                                ''
                                            }
                                        >
                                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {interview.status === 'scheduled' && (
                                                <>
                                                    <Button variant="outline" size="sm" onClick={() => updateInterviewStatus(interview.id, 'completed')}>
                                                        Complete
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => updateInterviewStatus(interview.id, 'cancelled')}>
                                                        Cancel
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => updateInterviewStatus(interview.id, 'noshow')}>
                                                        No Show
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="outline" size="sm" onClick={() => sendEmail(candidates.find(c => c.id === interview.candidateId)?.email || '')}>
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

    const renderHired = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Hired Employees</h2>
                    <p className="text-muted-foreground">View recently hired candidates</p>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search hired employees..."
                        className="w-64"
                    />
                    <Button variant="outline">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {hiredEmployees.map((hire) => (
                    <Card key={hire.id}>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-4 flex-1">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback>{hire.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold">{hire.name}</h3>
                                            <Badge className="bg-green-600 text-white">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Hired
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground mb-3">{hire.position}</p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Department</span>
                                                <p className="font-medium">{hire.department}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Description</span>
                                                <p className="font-medium">{hire.description}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Start Date</span>
                                                <p className="font-medium">{hire.startDate}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Salary</span>
                                                <p className="font-medium">{hire.salary}</p>
                                            </div>

                                        </div>

                                        <div className="mt-3">
                                            <div className="flex flex-wrap gap-2">
                                                {hire.skills.slice(0, 4).map((skill, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-1" />
                                        View Profile
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => sendEmail(hire.email)}>
                                        <Mail className="w-4 h-4 mr-1" />
                                        Contact
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {hiredEmployees.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-2">No hired employees yet</h3>
                        <p className="text-muted-foreground">
                            Hired candidates will appear here once they accept offers
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );

    const renderJobForm = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                        id="title"
                        placeholder="e.g., Senior Software Engineer"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="department_id">Department *</Label>
                    <Select
                        value={newJob.department_id}
                        onValueChange={(value) => setNewJob({ ...newJob, department_id: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            {departments.map(dept => (
                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                    {dept.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                        id="location"
                        placeholder="e.g., New York, NY"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="salary_range">Salary Range</Label>
                    <Input
                        id="salary_range"
                        placeholder="e.g., $70,000 - $90,000"
                        value={newJob.salary_range}
                        onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="posted_date">Posted Date</Label>
                    <Input
                        id="posted_date"
                        type="date"
                        value={newJob.posted_date}
                        onChange={(e) => setNewJob({ ...newJob, posted_date: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deadline_date">Application Deadline *</Label>
                    <Input
                        id="deadline_date"
                        type="date"
                        value={newJob.deadline_date}
                        onChange={(e) => setNewJob({ ...newJob, deadline_date: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                    id="description"
                    placeholder="Describe the role and responsibilities..."
                    rows={4}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                    value={newJob.status}
                    onValueChange={(value: any) => setNewJob({ ...newJob, status: value })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Recruitment</h1>
                        <p className="text-muted-foreground">Manage your hiring process</p>
                    </div>
                </div>

                {/* Updated to 5 tabs */}
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="pipeline">Candidates</TabsTrigger>
                    <TabsTrigger value="jobs">Job Postings</TabsTrigger>
                    <TabsTrigger value="interviews">Interviews</TabsTrigger>
                    <TabsTrigger value="hired">Hired</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    {renderOverview()}
                </TabsContent>

                <TabsContent value="pipeline" className="mt-6">
                    {renderPipelineView()}
                </TabsContent>

                <TabsContent value="jobs" className="mt-6">
                    {renderJobPostings()}
                </TabsContent>

                <TabsContent value="interviews" className="mt-6">
                    {renderInterviews()}
                </TabsContent>

                <TabsContent value="hired" className="mt-6">
                    {renderHired()}
                </TabsContent>
            </Tabs>

            <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Job Posting</DialogTitle>
                        <DialogDescription>
                            Add a new job posting to attract candidates
                        </DialogDescription>
                    </DialogHeader>
                    {renderJobForm()}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowJobDialog(false)}>Cancel</Button>
                        <Button onClick={createJobPosting} disabled={loading}>
                            {loading ? 'Creating...' : 'Create Job Posting'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Schedule Interview</DialogTitle>
                        <DialogDescription>
                            Set up an interview with a candidate
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="candidate">Candidate *</Label>
                            <Select value={newInterview.candidateId} onValueChange={(value) => {
                                const candidate = candidates.find(c => c.id === value);
                                setNewInterview({
                                    ...newInterview,
                                    candidateId: value,
                                    candidateName: candidate?.name || '',
                                    position: candidate?.position || ''
                                });
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select candidate" />
                                </SelectTrigger>
                                <SelectContent>
                                    {candidates.filter(c => c.stage !== 'rejected').map(candidate => (
                                        <SelectItem key={candidate.id} value={candidate.id}>
                                            {candidate.name} - {candidate.position}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="interviewer">Interviewer *</Label>
                                // Update the interviewer selection to use actual employees from your API
                                <Select value={newInterview.interviewer} onValueChange={(value) => setNewInterview({ ...newInterview, interviewer: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select interviewer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockEmployees.map(emp => (
                                            <SelectItem key={emp.id} value={emp.id.toString()}>
                                                {emp.firstName} {emp.lastName} - {emp.position}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="interviewType">Interview Type *</Label>
                                <Select value={newInterview.type} onValueChange={(value: any) => setNewInterview({ ...newInterview, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Phone Screening">Phone Screening</SelectItem>
                                        <SelectItem value="Technical">Technical</SelectItem>
                                        <SelectItem value="HR">HR</SelectItem>
                                        <SelectItem value="Final">Final</SelectItem>
                                        <SelectItem value="Panel">Panel</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={newInterview.date}
                                    onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time *</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={newInterview.time}
                                    onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interviewLocation">Location (optional)</Label>
                            <Input
                                id="interviewLocation"
                                placeholder="e.g., Office - Conference Room A"
                                value={newInterview.location}
                                onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meetingLink">Meeting Link (optional)</Label>
                            <Input
                                id="meetingLink"
                                placeholder="e.g., https://zoom.us/j/123456789"
                                value={newInterview.meetingLink}
                                onChange={(e) => setNewInterview({ ...newInterview, meetingLink: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interviewNotes">Notes (optional)</Label>
                            <Textarea
                                id="interviewNotes"
                                placeholder="Any additional notes..."
                                rows={3}
                                value={newInterview.notes}
                                onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>Cancel</Button>
                        <Button onClick={scheduleInterview}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Interview
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {selectedCandidate && (
                <Dialog open={showCandidateDialog} onOpenChange={setShowCandidateDialog}>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{selectedCandidate.name}</DialogTitle>
                            <DialogDescription>Candidate Profile & Actions</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className="text-xl">{selectedCandidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-xl">{selectedCandidate.name}</h3>
                                    <p className="text-muted-foreground">{selectedCandidate.position}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className={getStageColor(selectedCandidate.stage)}>
                                            {getStageLabel(selectedCandidate.stage)}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">{selectedCandidate.experience} experience</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{selectedCandidate.rating}</div>
                                        <div className="text-xs text-muted-foreground">Rating</div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <Label className="text-muted-foreground">Email</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <p>{selectedCandidate.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Phone</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <p>{selectedCandidate.phone}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Source</Label>
                                    <p className="mt-1">{selectedCandidate.source}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Applied Date</Label>
                                    <p className="mt-1">{selectedCandidate.appliedDate}</p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-muted-foreground">Skills</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedCandidate.skills.map((skill, index) => (
                                        <Badge key={index} variant="outline">{skill}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label className="text-muted-foreground">Resume</Label>
                                <div className="flex items-center gap-2 mt-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{selectedCandidate.resume}</span>
                                    <Button variant="outline" size="sm" onClick={() => toast.success('Downloading resume...')}>
                                        <Download className="w-4 h-4 mr-1" />
                                        Download
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label className="text-muted-foreground">Notes</Label>
                                <p className="text-sm mt-1">{selectedCandidate.notes}</p>
                            </div>

                            <Separator />

                            <div>
                                <Label className="mb-3 block">Move to Stage</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {recruitmentStages.filter(s => s.id !== selectedCandidate.stage && s.id !== 'rejected').map((stage) => (
                                        <Button
                                            key={stage.id}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                moveCandidateToStage(selectedCandidate.id, stage.id);
                                                setShowCandidateDialog(false);
                                            }}
                                        >
                                            {stage.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex justify-between">
                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        moveCandidateToStage(selectedCandidate.id, 'rejected');
                                        setShowCandidateDialog(false);
                                    }}
                                >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setShowCandidateDialog(false)}>Close</Button>
                                <Button onClick={() => {
                                    setShowCandidateDialog(false);
                                    setShowInterviewDialog(true);
                                    setNewInterview({
                                        ...newInterview,
                                        candidateId: selectedCandidate.id,
                                        candidateName: selectedCandidate.name,
                                        position: selectedCandidate.position,
                                    });
                                }}>
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Schedule Interview
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {selectedJob && (
                <Dialog open={showJobDetailDialog} onOpenChange={setShowJobDetailDialog}>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{selectedJob.title}</DialogTitle>
                            <DialogDescription>
                                {selectedJob.department} • {selectedJob.location}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Employment Type</Label>
                                    <p className="mt-1">{selectedJob.type}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Salary Range</Label>
                                    <p className="mt-1">{selectedJob.salary}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Applications</Label>
                                    <p className="mt-1">{selectedJob.applications}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <Badge className="mt-1" variant={selectedJob.status === 'active' ? 'default' : 'secondary'}>
                                        {selectedJob.status}
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <Label>Description</Label>
                                <p className="mt-2 text-sm text-muted-foreground">{selectedJob.description}</p>
                            </div>

                            {selectedJob.responsibilities && (
                                <div>
                                    <Label>Responsibilities</Label>
                                    <p className="mt-2 text-sm text-muted-foreground">{selectedJob.responsibilities}</p>
                                </div>
                            )}

                            <div>
                                <Label>Requirements</Label>
                                <ul className="mt-2 space-y-1">
                                    {selectedJob.requirements.map((req: any, index: any) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="text-muted-foreground">Posted Date</Label>
                                    <p className="mt-1">{selectedJob.posted}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Application Deadline</Label>
                                    <p className="mt-1">{selectedJob.deadline}</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowJobDetailDialog(false)}>Close</Button>
                            <Button onClick={() => {
                                setShowJobDetailDialog(false);
                                toast.success('Job link copied to clipboard!');
                            }}>
                                <Send className="w-4 h-4 mr-2" />
                                Share Job
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default RecruitmentOnboarding;