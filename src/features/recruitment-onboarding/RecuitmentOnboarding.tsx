import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecruitmentOverview from './tabs/RecruitmentOverview';
import RecruitmentPipeline from './tabs/RecruitmentPipeline';
import RecruitmentJobPostings from './tabs/RecruitmentJobPostings';
import RecruitmentInterviews from './tabs/RecruitmentInterviews';
import RecruitmentHired from './tabs/RecruitmentHired';
import { useRecruitmentData } from './hooks/useRecruitmentData';
import { useRecruitmentDialogs } from './hooks/useRecruitmentDialog';

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
                        onOpenCandidateDetail={setSelectedCandidate}
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
                        onOpenCandidateDetail={setSelectedCandidate}
                        onMoveCandidateStage={() => { }} // You'll need to pass this
                        onHireCandidate={() => { }} // You'll need to pass this
                    />
                </TabsContent>

                <TabsContent value="jobs" className="mt-6">
                    <RecruitmentJobPostings
                        jobs={jobs}
                        loading={loading}
                        onShowJobDialog={setShowJobDialog}
                        onOpenJobDetail={setSelectedJob}
                    />
                </TabsContent>

                <TabsContent value="interviews" className="mt-6">
                    <RecruitmentInterviews
                        interviews={interviews}
                        candidates={applicants}
                        onShowInterviewDialog={setShowInterviewDialog}
                        onUpdateInterviewStatus={() => { }} // You'll need to pass this
                    />
                </TabsContent>

                <TabsContent value="hired" className="mt-6">
                    <RecruitmentHired
                        hiredEmployees={hiredEmployees}
                        onSearchChange={setSearchTerm}
                    />
                </TabsContent>
            </Tabs>

            {/* Dialogs would go here */}
        </div>
    );
};

export default RecruitmentOnboarding;