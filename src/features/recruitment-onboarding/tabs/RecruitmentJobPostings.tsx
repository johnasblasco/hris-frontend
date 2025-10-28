import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, DollarSign, Eye, Trash2, Plus } from 'lucide-react';
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
                            <CardContent className="p-6 text-center">
                                <div>No job postings found.</div>
                                <Button
                                    onClick={() => onShowJobDialog(true)}
                                    className="mt-4"
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