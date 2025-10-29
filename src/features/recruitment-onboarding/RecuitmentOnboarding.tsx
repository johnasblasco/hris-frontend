import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecruitmentOverview from './tabs/RecruitmentOverview';
import RecruitmentPipeline from './tabs/RecruitmentPipeline';
import RecruitmentJobPostings from './tabs/RecruitmentJobPostings';
import RecruitmentInterviews from './tabs/RecruitmentInterviews';
import RecruitmentHired from './tabs/RecruitmentHired';
import JobFormDialog from './components/JobFormDialog';
import InterviewDialog from './components/InterviewDialog';
import CandidateDialog from './components/CandidateDialog';
import JobDetailDialog from './components/JobDetailDialog';
import { useRecruitmentData } from './hooks/useRecruitmentData';
import { useRecruitmentDialogs } from './hooks/useRecruitmentDialog';
import { useRecruitmentActions } from './hooks/useRecruitmentAction';

const RecruitmentOnboarding = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const {
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
    } = useRecruitmentData(activeTab);


    const {
        showJobDialog,
        setShowJobDialog,
        showInterviewDialog,
        setShowInterviewDialog,
        showCandidateDialog,
        setShowCandidateDialog,
        showJobDetailDialog,
        setShowJobDetailDialog,
        selectedCandidate,
        setSelectedCandidate,
        selectedJob,
        setSelectedJob,
        newJob,
        setNewJob,
        newInterview,
        setNewInterview
    } = useRecruitmentDialogs();

    const {
        moveCandidateToStage,
        hireApplicant,
        createJobPosting,
        updateJobStatus,
        deleteJob,
        scheduleInterview,
        updateInterviewStatus,
        submitInterviewFeedback
    } = useRecruitmentActions({
        fetchApplicants,
        fetchHiredApplicants,
        fetchJobPostings,
        fetchInterviews
    });

    // Handler for opening candidate detail
    const handleOpenCandidateDetail = (candidate: any) => {
        setSelectedCandidate(candidate);
        setShowCandidateDialog(true);
    };

    // Handler for opening job detail
    const handleOpenJobDetail = (job: any) => {
        setSelectedJob(job);
        setShowJobDetailDialog(true);
    };

    // Handler for creating job posting
    const handleCreateJobPosting = async () => {
        const success = await createJobPosting(newJob);
        if (success) {
            setShowJobDialog(false);
        }
    };

    // Handler for scheduling interview
    const handleScheduleInterview = async () => {
        const success = await scheduleInterview(newInterview);
        if (success) {
            setShowInterviewDialog(false);
        }
    };

    return (
        <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Recruitment</h1>
                        <p className="text-muted-foreground">Manage your hiring process</p>
                    </div>
                </div>

                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="pipeline">Candidates</TabsTrigger>
                    <TabsTrigger value="jobs">Job Postings</TabsTrigger>
                    <TabsTrigger value="interviews">Interviews</TabsTrigger>
                    <TabsTrigger value="hired">Hired</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <RecruitmentOverview
                        applicants={applicants}
                        interviews={interviews}
                        loading={loading}
                        onOpenCandidateDetail={handleOpenCandidateDetail}
                        onShowJobDialog={setShowJobDialog}
                        onShowInterviewDialog={setShowInterviewDialog}
                        onSetActiveTab={setActiveTab}
                    />
                </TabsContent>

                <TabsContent value="pipeline" className="mt-6">
                    <RecruitmentPipeline
                        applicants={applicants}
                        loading={loading}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onRefresh={fetchApplicants}
                        onOpenCandidateDetail={handleOpenCandidateDetail}
                        onMoveCandidateStage={moveCandidateToStage}
                        onHireCandidate={hireApplicant}
                    />
                </TabsContent>

                <TabsContent value="jobs" className="mt-6">
                    <RecruitmentJobPostings
                        jobs={jobs}
                        loading={loading}
                        onShowJobDialog={setShowJobDialog}
                        onOpenJobDetail={handleOpenJobDetail}
                        onUpdateJobStatus={updateJobStatus}
                        onDeleteJob={deleteJob}
                    />
                </TabsContent>

                <TabsContent value="interviews" className="mt-6">
                    <RecruitmentInterviews
                        interviews={interviews}
                        candidates={applicants}
                        onShowInterviewDialog={setShowInterviewDialog}
                        onUpdateInterviewStatus={updateInterviewStatus}
                        onSubmitInterviewFeedback={submitInterviewFeedback}
                    />
                </TabsContent>

                <TabsContent value="hired" className="mt-6">
                    <RecruitmentHired
                        hiredEmployees={hiredEmployees}
                        onSearchChange={setSearchTerm}
                    />
                </TabsContent>
            </Tabs>

            {/* Job Form Dialog */}
            <JobFormDialog
                open={showJobDialog}
                onOpenChange={setShowJobDialog}
                newJob={newJob}
                onNewJobChange={setNewJob}
                onCreateJob={handleCreateJobPosting}
                loading={loading}
            />

            {/* Interview Dialog */}
            <InterviewDialog
                open={showInterviewDialog}
                onOpenChange={setShowInterviewDialog}
                newInterview={newInterview}
                onNewInterviewChange={setNewInterview}
                candidates={applicants}
                onScheduleInterview={handleScheduleInterview}
                loading={loading}
            />

            {/* Candidate Detail Dialog */}
            <CandidateDialog
                open={showCandidateDialog}
                onOpenChange={setShowCandidateDialog}
                candidate={selectedCandidate}
                onMoveCandidateStage={moveCandidateToStage}
                onScheduleInterview={() => {
                    setShowCandidateDialog(false);
                    setShowInterviewDialog(true);
                    if (selectedCandidate) {
                        setNewInterview({
                            ...newInterview,
                            candidateId: selectedCandidate.id,
                            candidateName: selectedCandidate.name,
                            position: selectedCandidate.position,
                        });
                    }
                }}
            />

            {/* Job Detail Dialog */}
            <JobDetailDialog
                open={showJobDetailDialog}
                onOpenChange={setShowJobDetailDialog}
                job={selectedJob}
            />
        </div>
    );
};

export default RecruitmentOnboarding;