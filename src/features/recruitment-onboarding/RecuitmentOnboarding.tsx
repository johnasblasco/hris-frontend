import { useState } from 'react';
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
    Search,
    Filter,
    Eye,
    MessageSquare,
    Phone,
    Mail,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    Building2,
    Briefcase,
    ArrowRight,
    Download,
    Edit,
    Trash2,
    Send,
    Link as LinkIcon
} from 'lucide-react';
import { toast } from "sonner";
import { mockJobPostings, mockCandidates, mockInterviews, mockHiredEmployees, mockDepartments, mockEmployees } from '../data/mockData';
import type { JobPosting, Candidate, Interview, HiredEmployee } from '../data/types';

// Recruitment stages
const recruitmentStages = [
    { id: 'new', label: 'New Applications', color: 'bg-blue-100 text-blue-800', icon: FileText },
    { id: 'screening', label: 'Screening', color: 'bg-purple-100 text-purple-800', icon: Search },
    { id: 'phone-screening', label: 'Phone Screening', color: 'bg-indigo-100 text-indigo-800', icon: Phone },
    { id: 'assessment', label: 'Assessment', color: 'bg-yellow-100 text-yellow-800', icon: FileText },
    { id: 'technical-interview', label: 'Technical Interview', color: 'bg-orange-100 text-orange-800', icon: Users },
    { id: 'final-interview', label: 'Final Interview', color: 'bg-pink-100 text-pink-800', icon: User },
    { id: 'offer', label: 'Offer Extended', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { id: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
];

const recruitmentMetrics = [
    { label: 'Open Positions', value: 12, change: '+2', icon: Briefcase },
    { label: 'Active Candidates', value: 45, change: '+8', icon: Users },
    { label: 'This Month Hires', value: 3, change: '+1', icon: CheckCircle },
    { label: 'Avg Time to Hire', value: '18 days', change: '-2', icon: Clock },
];

const RecruitmentOnboarding = () => {
    const [activeTab, setActiveTab] = useState('pipeline');
    const [showJobDialog, setShowJobDialog] = useState(false);
    const [showInterviewDialog, setShowInterviewDialog] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [showCandidateDialog, setShowCandidateDialog] = useState(false);
    const [showJobDetailDialog, setShowJobDetailDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState<string>('all');

    // State management
    const [jobs, setJobs] = useState<JobPosting[]>(mockJobPostings);
    const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
    const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
    const [hiredEmployees, setHiredEmployees] = useState<HiredEmployee[]>(mockHiredEmployees);

    // New Job Form State
    const [newJob, setNewJob] = useState<Partial<JobPosting>>({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        salary: '',
        status: 'active',
        description: '',
        requirements: [],
        responsibilities: '',
        deadline: '',
    });

    // New Interview Form State
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

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = filterStage === 'all' || candidate.stage === filterStage;
        return matchesSearch && matchesStage;
    });

    const getCandidatesByStage = (stageId: string) => {
        return candidates.filter(c => c.stage === stageId);
    };

    const moveCandidateToStage = (candidateId: string, newStage: string) => {
        setCandidates(prev => prev.map(c =>
            c.id === candidateId ? { ...c, stage: newStage } : c
        ));
        toast.success(`Candidate moved to ${getStageLabel(newStage)}`);

        // If moved to offer stage, create a notification
        if (newStage === 'offer') {
            toast.success('Candidate ready for offer letter!');
        }
    };

    const createJobPosting = () => {
        if (!newJob.title || !newJob.department || !newJob.location) {
            toast.error('Please fill in all required fields');
            return;
        }

        const jobPosting: JobPosting = {
            id: `${jobs.length + 1}`,
            title: newJob.title || '',
            department: newJob.department || '',
            location: newJob.location || '',
            type: (newJob.type as any) || 'Full-time',
            salary: newJob.salary || '',
            status: (newJob.status as any) || 'active',
            applications: 0,
            posted: new Date().toISOString().split('T')[0],
            deadline: newJob.deadline || '',
            description: newJob.description || '',
            requirements: newJob.requirements || [],
            responsibilities: newJob.responsibilities || '',
        };

        setJobs(prev => [...prev, jobPosting]);
        toast.success('Job posting created successfully!');
        setShowJobDialog(false);
        setNewJob({
            title: '',
            department: '',
            location: '',
            type: 'Full-time',
            salary: '',
            status: 'active',
            description: '',
            requirements: [],
            responsibilities: '',
            deadline: '',
        });
    };

    const scheduleInterview = () => {
        if (!newInterview.candidateId || !newInterview.date || !newInterview.time || !newInterview.interviewer) {
            toast.error('Please fill in all required fields');
            return;
        }

        const interview: Interview = {
            id: `${interviews.length + 1}`,
            candidateId: newInterview.candidateId || '',
            candidateName: newInterview.candidateName || '',
            position: newInterview.position || '',
            interviewer: newInterview.interviewer || '',
            date: newInterview.date || '',
            time: newInterview.time || '',
            type: (newInterview.type as any) || 'Phone Screening',
            status: 'scheduled',
            notes: newInterview.notes || '',
            location: newInterview.location,
            meetingLink: newInterview.meetingLink,
        };

        setInterviews(prev => [...prev, interview]);
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
    };

    const deleteJob = (jobId: string) => {
        setJobs(prev => prev.filter(j => j.id !== jobId));
        toast.success('Job posting deleted');
    };

    const updateJobStatus = (jobId: string, status: 'active' | 'draft' | 'closed') => {
        setJobs(prev => prev.map(j =>
            j.id === jobId ? { ...j, status } : j
        ));
        toast.success(`Job ${status === 'closed' ? 'closed' : 'updated'}`);
    };

    const sendEmail = (email: string) => {
        toast.success(`Email sent to ${email}`);
    };

    const callCandidate = (phone: string) => {
        toast.info(`Calling ${phone}...`);
    };

    const openCandidateDetail = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setShowCandidateDialog(true);
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Metrics Cards */}
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

            {/* Quick Actions */}
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
                        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setActiveTab('candidates')}>
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {candidates.filter(c => c.stage === 'new').slice(0, 5).map((candidate) => (
                                <div key={candidate.id} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer" onClick={() => openCandidateDetail(candidate)}>
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{candidate.name}</p>
                                            <p className="text-sm text-muted-foreground">{candidate.position}</p>
                                        </div>
                                    </div>
                                    <Badge className={getStageColor(candidate.stage)}>{getStageLabel(candidate.stage)}</Badge>
                                </div>
                            ))}
                            {candidates.filter(c => c.stage === 'new').length === 0 && (
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

    const renderPipeline = () => (
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
                </div>
            </div>

            <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4">
                    {recruitmentStages.filter(stage => stage.id !== 'rejected').map((stage) => {
                        const stageCandidates = getCandidatesByStage(stage.id);
                        const StageIcon = stage.icon;

                        return (
                            <Card key={stage.id} className="min-w-[320px] flex-shrink-0">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <StageIcon className="w-4 h-4" />
                                            <CardTitle className="text-sm">{stage.label}</CardTitle>
                                        </div>
                                        <Badge variant="secondary">{stageCandidates.length}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[600px] pr-4">
                                        <div className="space-y-3">
                                            {stageCandidates.map((candidate) => (
                                                <Card key={candidate.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="space-y-3">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="font-medium text-sm">{candidate.name}</p>
                                                                        <p className="text-xs text-muted-foreground">{candidate.position}</p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openCandidateDetail(candidate)}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </div>

                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <Mail className="w-3 h-3" />
                                                                <span className="truncate">{candidate.email}</span>
                                                            </div>

                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-muted-foreground">{candidate.experience} exp</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-medium">{candidate.rating}</span>
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
                                                                            moveCandidateToStage(candidate.id, recruitmentStages[currentIndex + 1].id);
                                                                        }
                                                                    }}
                                                                >
                                                                    <ArrowRight className="w-3 h-3 mr-1" />
                                                                    Advance
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-7 text-xs"
                                                                    onClick={() => moveCandidateToStage(candidate.id, 'rejected')}
                                                                >
                                                                    <XCircle className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}

                                            {stageCandidates.length === 0 && (
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
        </div>
    );

    const renderJobPostings = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Job Postings</h2>
                    <p className="text-muted-foreground">Manage your job openings</p>
                </div>
                <Button onClick={() => setShowJobDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                </Button>
            </div>

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
                                        setSelectedJob(job);
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
                                        if (confirm('Are you sure you want to delete this job posting?')) {
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
            </div>
        </div>
    );

    const renderCandidates = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Candidates</h2>
                    <p className="text-muted-foreground">Manage candidate applications</p>
                </div>
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
                    <Input
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                    />
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
                                            variant={interview.status === 'completed' ? 'default' : 'secondary'}
                                            className={interview.status === 'completed' ? 'bg-green-500' : ''}
                                        >
                                            {interview.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {interview.status === 'scheduled' && (
                                                <Button variant="outline" size="sm" onClick={() => {
                                                    setInterviews(prev => prev.map(i =>
                                                        i.id === interview.id ? { ...i, status: 'completed' } : i
                                                    ));
                                                    toast.success('Interview marked as completed');
                                                }}>
                                                    Complete
                                                </Button>
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
                                                <span className="text-muted-foreground">Start Date</span>
                                                <p className="font-medium">{hire.startDate}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Salary</span>
                                                <p className="font-medium">{hire.salary}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Source</span>
                                                <p className="font-medium">{hire.source}</p>
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

    return (
        <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Recruitment</h1>
                        <p className="text-muted-foreground">Manage your hiring process</p>
                    </div>
                </div>

                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                    <TabsTrigger value="jobs">Job Postings</TabsTrigger>
                    <TabsTrigger value="candidates">Candidates</TabsTrigger>
                    <TabsTrigger value="interviews">Interviews</TabsTrigger>
                    <TabsTrigger value="hired">Hired</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    {renderOverview()}
                </TabsContent>

                <TabsContent value="pipeline" className="mt-6">
                    {renderPipeline()}
                </TabsContent>

                <TabsContent value="jobs" className="mt-6">
                    {renderJobPostings()}
                </TabsContent>

                <TabsContent value="candidates" className="mt-6">
                    {renderCandidates()}
                </TabsContent>

                <TabsContent value="interviews" className="mt-6">
                    {renderInterviews()}
                </TabsContent>

                <TabsContent value="hired" className="mt-6">
                    {renderHired()}
                </TabsContent>
            </Tabs>

            {/* Job Posting Dialog */}
            <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Job Posting</DialogTitle>
                        <DialogDescription>
                            Add a new job posting to attract candidates
                        </DialogDescription>
                    </DialogHeader>
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
                                <Label htmlFor="department">Department *</Label>
                                <Select value={newJob.department} onValueChange={(value) => setNewJob({ ...newJob, department: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockDepartments.map(dept => (
                                            <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
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
                                <Label htmlFor="type">Employment Type *</Label>
                                <Select value={newJob.type} onValueChange={(value: any) => setNewJob({ ...newJob, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Intern">Intern</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary Range</Label>
                                <Input
                                    id="salary"
                                    placeholder="e.g., $70,000 - $90,000"
                                    value={newJob.salary}
                                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deadline">Application Deadline *</Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    value={newJob.deadline}
                                    onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
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
                            <Label htmlFor="responsibilities">Key Responsibilities</Label>
                            <Textarea
                                id="responsibilities"
                                placeholder="List main responsibilities..."
                                rows={3}
                                value={newJob.responsibilities}
                                onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                            <Input
                                id="requirements"
                                placeholder="e.g., 5+ years experience, React, Node.js"
                                value={newJob.requirements?.join(', ')}
                                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value.split(',').map(r => r.trim()) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={newJob.status} onValueChange={(value: any) => setNewJob({ ...newJob, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowJobDialog(false)}>Cancel</Button>
                        <Button onClick={createJobPosting}>Create Job Posting</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Interview Scheduling Dialog */}
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
                                <Select value={newInterview.interviewer} onValueChange={(value) => setNewInterview({ ...newInterview, interviewer: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select interviewer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockEmployees.map(emp => (
                                            <SelectItem key={emp.id} value={`${emp.firstName} ${emp.lastName}`}>
                                                {emp.firstName} {emp.lastName}
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

            {/* Candidate Detail Dialog */}
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

            {/* Job Detail Dialog */}
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
                                    {selectedJob.requirements.map((req, index) => (
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
}
export default RecruitmentOnboarding