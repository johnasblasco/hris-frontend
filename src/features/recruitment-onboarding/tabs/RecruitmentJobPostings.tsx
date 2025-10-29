import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, DollarSign, Eye, Trash2, Plus, Clock, Users } from 'lucide-react';
import { getStatusIcon } from '../utils/constant';

interface RecruitmentJobPostingsProps {
    jobs: any[];
    loading: boolean;
    onShowJobDialog: (show: boolean) => void;
    onOpenJobDetail: (job: any) => void;
    onUpdateJobStatus: (jobId: string, status: 'active' | 'draft' | 'closed') => void;
    onDeleteJob: (jobId: string) => void;
}

const RecruitmentJobPostings = ({
    jobs,
    loading,
    onShowJobDialog,
    onOpenJobDetail,
    onUpdateJobStatus,
    onDeleteJob
}: RecruitmentJobPostingsProps) => {

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getApplicationsText = (applicationsCount: number) => {
        if (applicationsCount === 0) return 'No applications';
        if (applicationsCount === 1) return '1 application';
        return `${applicationsCount} applications`;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Job Postings</h2>
                    <p className="text-muted-foreground">Manage your job openings</p>
                </div>
                <Button onClick={() => onShowJobDialog(true)} disabled={loading}>
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
                    {jobs.map((job) => (
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
                                                {job.department?.department_name || job.department_id || 'No department'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location || 'Remote'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {job.salary_range || 'Salary not specified'}
                                            </span>
                                            {job.employment_type && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {job.employment_type}
                                                </span>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant={
                                            job.status === 'active' ? 'default' :
                                                job.status === 'draft' ? 'secondary' : 'destructive'
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
                                            {getApplicationsText(job.applications_count || 0)}
                                        </span>
                                        {job.posted_date && (
                                            <span>Posted: {formatDate(job.posted_date)}</span>
                                        )}
                                        {job.deadline_date && (
                                            <span>Deadline: {formatDate(job.deadline_date)}</span>
                                        )}
                                        {job.work_type && (
                                            <span>{job.work_type}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onOpenJobDetail(job)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                        {job.status === 'active' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onUpdateJobStatus(job.id, 'closed')}
                                            >
                                                Close
                                            </Button>
                                        )}
                                        {job.status === 'draft' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onUpdateJobStatus(job.id, 'active')}
                                            >
                                                Publish
                                            </Button>
                                        )}
                                        {job.status === 'closed' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onUpdateJobStatus(job.id, 'active')}
                                            >
                                                Reopen
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to archive this job posting?')) {
                                                    onDeleteJob(job.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {jobs.length === 0 && !loading && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">No job postings found</h3>
                                <p className="text-muted-foreground mb-4">
                                    Create your first job posting to start receiving applications.
                                </p>
                                <Button
                                    onClick={() => onShowJobDialog(true)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Job Posting
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecruitmentJobPostings;