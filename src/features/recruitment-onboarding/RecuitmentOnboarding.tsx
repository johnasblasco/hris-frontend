import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecruitmentOverview from './tabs/RecruitmentOverview';
import RecruitmentPipeline from './tabs/RecruitmentPipeline';
import RecruitmentInterviews from './tabs/RecruitmentInterviews';
import RecruitmentHired from './tabs/RecruitmentHired';
import InterviewDialog from './components/InterviewDialog';
import CandidateDialog from './components/CandidateDialog';
import { useRecruitmentData } from './hooks/useRecruitmentData';
import { useRecruitmentDialogs } from './hooks/useRecruitmentDialog';
import { useRecruitmentActions } from './hooks/useRecruitmentAction';

const RecruitmentOnboarding = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const {
        applicants,
        interviews,
        hiredEmployees,
        loading,
        searchTerm,
        setSearchTerm,
        fetchApplicants,
        fetchHiredApplicants,
        fetchInterviews
    } = useRecruitmentData(activeTab);


    const {
        setShowJobDialog,
        showInterviewDialog,
        setShowInterviewDialog,
        showCandidateDialog,
        setShowCandidateDialog,
        selectedCandidate,
        setSelectedCandidate,
        newInterview,
        setNewInterview
    } = useRecruitmentDialogs();

    const {
        moveCandidateToStage,
        hireApplicant,
        scheduleInterview,
        updateInterviewStatus,
        submitInterviewFeedback
    } = useRecruitmentActions({
        fetchApplicants,
        fetchHiredApplicants,
        fetchInterviews
    });

    // Handler for opening candidate detail
    const handleOpenCandidateDetail = (candidate: any) => {
        setSelectedCandidate(candidate);
        setShowCandidateDialog(true);
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

                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="pipeline">Candidates</TabsTrigger>
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

        </div>
    );
};

export default RecruitmentOnboarding;