import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from 'lucide-react';
import { mockEmployees } from '@/features/data/mockData';

interface InterviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    newInterview: any;
    onNewInterviewChange: (interview: any) => void;
    candidates: any[];
    onScheduleInterview: (interview: any) => void;
    loading: boolean;
}

const InterviewDialog = ({
    open,
    onOpenChange,
    newInterview,
    onNewInterviewChange,
    candidates,
    onScheduleInterview,
    loading
}: InterviewDialogProps) => {
    const handleSubmit = async () => {
        const success: any = await onScheduleInterview(newInterview);
        if (success) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto ">
                <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                    <DialogDescription>
                        Set up an interview with a candidate
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="candidate">Candidate *</Label>
                        <Select
                            value={newInterview.candidateId}
                            onValueChange={(value) => {
                                const candidate = candidates.find(c => c.id === value);
                                onNewInterviewChange({
                                    ...newInterview,
                                    candidateId: value,
                                    candidateName: candidate?.name || '',
                                    position: candidate?.position || ''
                                });
                            }}
                        >
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
                            <Select
                                value={newInterview.interviewer}
                                onValueChange={(value) => onNewInterviewChange({ ...newInterview, interviewer: value })}
                            >
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
                            <Select
                                value={newInterview.type}
                                onValueChange={(value: any) => onNewInterviewChange({ ...newInterview, type: value })}
                            >
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
                                onChange={(e) => onNewInterviewChange({ ...newInterview, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time *</Label>
                            <Input
                                id="time"
                                type="time"
                                value={newInterview.time}
                                onChange={(e) => onNewInterviewChange({ ...newInterview, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="interviewLocation">Location (optional)</Label>
                        <Input
                            id="interviewLocation"
                            placeholder="e.g., Office - Conference Room A"
                            value={newInterview.location}
                            onChange={(e) => onNewInterviewChange({ ...newInterview, location: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="meetingLink">Meeting Link (optional)</Label>
                        <Input
                            id="meetingLink"
                            placeholder="e.g., https://zoom.us/j/123456789"
                            value={newInterview.meetingLink}
                            onChange={(e) => onNewInterviewChange({ ...newInterview, meetingLink: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="interviewNotes">Notes (optional)</Label>
                        <Textarea
                            id="interviewNotes"
                            placeholder="Any additional notes..."
                            rows={3}
                            value={newInterview.notes}
                            onChange={(e) => onNewInterviewChange({ ...newInterview, notes: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Interview
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InterviewDialog;