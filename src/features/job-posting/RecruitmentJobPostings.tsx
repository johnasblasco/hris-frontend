import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, DollarSign, Eye, Trash2, Plus, Clock, Users } from "lucide-react";
import { getStatusIcon } from "./constant";
import JobFormDialog from "./components/JobFormDialog";
import { toast } from "sonner";
import { useRecruitmentDialogs } from "../recruitment-onboarding/hooks/useRecruitmentDialog";
import api from "@/utils/axios";
import { jobPostingAPI } from "./api";

const RecruitmentJobPostings = () => {
    const [loading, setLoading] = useState(false);
    const [, setError] = useState<string | null>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [searchTerm] = useState("");

    const {
        showJobDialog,
        setShowJobDialog,
        setSelectedJob,
        setShowJobDetailDialog,
    } = useRecruitmentDialogs();

    const [newJob, setNewJob] = useState({
        title: "",
        department_id: "",
        work_type: "On-site",
        employment_type: "Full-time",
        location: "",
        salary_range: "",
        status: "draft",
        description: "",
        posted_date: new Date().toISOString().split("T")[0],
        deadline_date: "",
    });

    // Fetch jobs
    const fetchJobPostings = async () => {
        setLoading(true);
        try {
            const response = await jobPostingAPI.getAll({
                search: searchTerm,
                per_page: 50,
            });

            if (response.data.isSuccess) {
                const transformedJobs = response.data.job_postings.map((job: any) => ({
                    id: job.id.toString(),
                    title: job.title,
                    department: job.department?.department_name || "Unknown",
                    location: job.location,
                    type: job.employment_type || "Full-time",
                    salary_range: job.salary_range,
                    status: job.status,
                    applications_count: job.applications_count || 0,
                    posted_date: job.posted_date,
                    deadline_date: job.deadline_date,
                    work_type: job.work_type || "On-site",
                    description: job.description,
                }));

                setJobs(transformedJobs);
            }
        } catch (error) {
            console.error("Error fetching job postings:", error);
            toast.error("Failed to fetch job postings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobPostings();
    }, []);

    const createJobPosting = async (jobData: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/jobs", jobData);
            if (response.data.isSuccess) {
                toast.success("Job created successfully!");
                await fetchJobPostings();
                return true;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to create job posting";
            setError(message);
            toast.error(message);
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
                toast.success(`Job ${status === "active" ? "published" : status === "closed" ? "closed" : "updated"} successfully`);
                await fetchJobPostings();
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to update job status";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const deleteJob = async (jobId: string) => {
        if (!confirm("Are you sure you want to delete this job posting?")) return;

        setLoading(true);
        setError(null);
        try {
            const response = await api.delete(`/jobs/${jobId}`);
            if (response.data.isSuccess) {
                toast.success("Job deleted successfully");
                await fetchJobPostings();
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to delete job";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenJobDetail = (job: any) => {
        setSelectedJob(job);
        setShowJobDetailDialog(true);
    };

    const handleCreateJobPosting = async () => {
        const success = await createJobPosting(newJob);
        if (success) setShowJobDialog(false);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getApplicationsText = (count: number) => {
        if (count === 0) return "No applications";
        if (count === 1) return "1 application";
        return `${count} applications`;
    };

    return (
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
                        <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            Loading job postings...
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <Card key={job.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-lg">{job.title}</CardTitle>
                                                {getStatusIcon(job.status)}
                                            </div>
                                            <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="w-4 h-4" />
                                                    {job.department || "No department"}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {job.location || "Remote"}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    {job.salary_range || "Salary not specified"}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {job.employment_type}
                                                </span>
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant={
                                                job.status === "active"
                                                    ? "default"
                                                    : job.status === "draft"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {getApplicationsText(job.applications_count)}
                                            </span>
                                            {job.posted_date && <span>Posted: {formatDate(job.posted_date)}</span>}
                                            {job.deadline_date && <span>Deadline: {formatDate(job.deadline_date)}</span>}
                                            {job.work_type && <span>{job.work_type}</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenJobDetail(job)}>
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                            {job.status === "active" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateJobStatus(job.id, "closed")}
                                                >
                                                    Close
                                                </Button>
                                            )}
                                            {job.status === "draft" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateJobStatus(job.id, "active")}
                                                >
                                                    Publish
                                                </Button>
                                            )}
                                            {job.status === "closed" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateJobStatus(job.id, "active")}
                                                >
                                                    Reopen
                                                </Button>
                                            )}
                                            <Button variant="outline" size="sm" onClick={() => deleteJob(job.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">No job postings found</h3>
                                <p className="text-muted-foreground mb-4">
                                    Create your first job posting to start receiving applications.
                                </p>
                                <Button onClick={() => setShowJobDialog(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Job Posting
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            <JobFormDialog
                open={showJobDialog}
                onOpenChange={setShowJobDialog}
                newJob={newJob}
                onNewJobChange={setNewJob}
                onCreateJob={handleCreateJobPosting}
                loading={loading}
            />
        </div>
    );
};

export default RecruitmentJobPostings;
