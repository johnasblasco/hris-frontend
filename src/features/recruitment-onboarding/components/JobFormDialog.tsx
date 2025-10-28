import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockDepartments } from '@/features/data/mockData';

interface JobFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    newJob: any;
    onNewJobChange: (job: any) => void;
    onCreateJob: (job: any) => void;
    loading: boolean;
}

const JobFormDialog = ({
    open,
    onOpenChange,
    newJob,
    onNewJobChange,
    onCreateJob,
    loading
}: JobFormDialogProps) => {
    const handleSubmit = async () => {
        const success: any = await onCreateJob(newJob);
        if (success) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                                onChange={(e) => onNewJobChange({ ...newJob, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department_id">Department *</Label>
                            <Select
                                value={newJob.department_id}
                                onValueChange={(value) => onNewJobChange({ ...newJob, department_id: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockDepartments.map(dept => (
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
                                onChange={(e) => onNewJobChange({ ...newJob, location: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary_range">Salary Range</Label>
                            <Input
                                id="salary_range"
                                placeholder="e.g., $70,000 - $90,000"
                                value={newJob.salary_range}
                                onChange={(e) => onNewJobChange({ ...newJob, salary_range: e.target.value })}
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
                                onChange={(e) => onNewJobChange({ ...newJob, posted_date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline_date">Application Deadline *</Label>
                            <Input
                                id="deadline_date"
                                type="date"
                                value={newJob.deadline_date}
                                onChange={(e) => onNewJobChange({ ...newJob, deadline_date: e.target.value })}
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
                            onChange={(e) => onNewJobChange({ ...newJob, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={newJob.status}
                            onValueChange={(value: any) => onNewJobChange({ ...newJob, status: value })}
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
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Job Posting'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default JobFormDialog;