import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText } from 'lucide-react';

interface InterviewFeedback {
    rating: number;
    technicalSkills: number;
    communication: number;
    culturalFit: number;
    problemSolving: number;
    experience: number;
    recommendation: 'strong-hire' | 'hire' | 'maybe' | 'no-hire';
    strengths: string;
    weaknesses: string;
    detailedNotes: string;
    submittedBy: string;
    submittedAt: string;
}

interface Interview {
    id: string;
    candidateName: string;
    position: string;
    round?: number;
    interviewer: string;
    feedback?: InterviewFeedback;
}

interface InterviewFeedbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    interview: Interview | null;
    onSubmitFeedback: (interviewId: string, feedback: InterviewFeedback) => void;
}

const InterviewFeedbackDialog = ({
    open,
    onOpenChange,
    interview,
    onSubmitFeedback
}: InterviewFeedbackDialogProps) => {
    if (!interview) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const feedback: InterviewFeedback = {
            rating: Number(formData.get('rating')),
            technicalSkills: Number(formData.get('technicalSkills')),
            communication: Number(formData.get('communication')),
            culturalFit: Number(formData.get('culturalFit')),
            problemSolving: Number(formData.get('problemSolving')),
            experience: Number(formData.get('experience')),
            recommendation: formData.get('recommendation') as any,
            strengths: formData.get('strengths') as string,
            weaknesses: formData.get('weaknesses') as string,
            detailedNotes: formData.get('detailedNotes') as string,
            submittedBy: interview.interviewer,
            submittedAt: new Date().toLocaleString(),
        };

        onSubmitFeedback(interview.id, feedback);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Interview Feedback & Evaluation</DialogTitle>
                    <DialogDescription>
                        {interview.candidateName} - {interview.position} (Round {interview.round || 1})
                    </DialogDescription>
                </DialogHeader>

                {interview.feedback ? (
                    // View existing feedback
                    <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="font-medium">Overall Rating</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-2xl ${i < interview.feedback!.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                                ★
                                            </span>
                                        ))}
                                        <span className="ml-2 text-lg font-semibold">{interview.feedback.rating}/5</span>
                                    </div>
                                </div>
                                <Badge
                                    className={
                                        interview.feedback.recommendation === 'strong-hire' ? 'bg-green-600 text-lg px-4 py-2' :
                                            interview.feedback.recommendation === 'hire' ? 'bg-blue-600 text-lg px-4 py-2' :
                                                interview.feedback.recommendation === 'maybe' ? 'bg-yellow-600 text-lg px-4 py-2' :
                                                    'bg-red-600 text-lg px-4 py-2'
                                    }
                                >
                                    {interview.feedback.recommendation.replace('-', ' ').toUpperCase()}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Technical Skills</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < (interview.feedback?.technicalSkills || 0) ? 'text-yellow-500' : 'text-gray-300'}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Communication</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < (interview.feedback?.communication || 0) ? 'text-yellow-500' : 'text-gray-300'}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Cultural Fit</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < (interview.feedback?.culturalFit || 0) ? 'text-yellow-500' : 'text-gray-300'}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Problem Solving</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < (interview.feedback?.problemSolving || 0) ? 'text-yellow-500' : 'text-gray-300'}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label>Strengths</Label>
                            <p className="mt-2 text-sm p-3 bg-green-50 border border-green-200 rounded-md">
                                {interview.feedback.strengths}
                            </p>
                        </div>

                        <div>
                            <Label>Areas for Improvement</Label>
                            <p className="mt-2 text-sm p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                {interview.feedback.weaknesses}
                            </p>
                        </div>

                        <div>
                            <Label>Detailed Notes</Label>
                            <p className="mt-2 text-sm p-3 bg-muted rounded-md whitespace-pre-wrap">
                                {interview.feedback.detailedNotes}
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
                            <span className="text-muted-foreground">Submitted by</span>
                            <span className="font-medium">{interview.feedback.submittedBy}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
                            <span className="text-muted-foreground">Submitted on</span>
                            <span className="font-medium">{interview.feedback.submittedAt}</span>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </div>
                ) : (
                    // Add new feedback
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="rating">Overall Rating *</Label>
                            <Select name="rating" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select overall rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 - Exceptional</SelectItem>
                                    <SelectItem value="4">4 - Above Average</SelectItem>
                                    <SelectItem value="3">3 - Average</SelectItem>
                                    <SelectItem value="2">2 - Below Average</SelectItem>
                                    <SelectItem value="1">1 - Poor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="technicalSkills">Technical Skills</Label>
                                <Select name="technicalSkills" defaultValue="3">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 - Excellent</SelectItem>
                                        <SelectItem value="4">4 - Good</SelectItem>
                                        <SelectItem value="3">3 - Average</SelectItem>
                                        <SelectItem value="2">2 - Fair</SelectItem>
                                        <SelectItem value="1">1 - Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="communication">Communication</Label>
                                <Select name="communication" defaultValue="3">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 - Excellent</SelectItem>
                                        <SelectItem value="4">4 - Good</SelectItem>
                                        <SelectItem value="3">3 - Average</SelectItem>
                                        <SelectItem value="2">2 - Fair</SelectItem>
                                        <SelectItem value="1">1 - Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="culturalFit">Cultural Fit</Label>
                                <Select name="culturalFit" defaultValue="3">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 - Excellent</SelectItem>
                                        <SelectItem value="4">4 - Good</SelectItem>
                                        <SelectItem value="3">3 - Average</SelectItem>
                                        <SelectItem value="2">2 - Fair</SelectItem>
                                        <SelectItem value="1">1 - Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="problemSolving">Problem Solving</Label>
                                <Select name="problemSolving" defaultValue="3">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 - Excellent</SelectItem>
                                        <SelectItem value="4">4 - Good</SelectItem>
                                        <SelectItem value="3">3 - Average</SelectItem>
                                        <SelectItem value="2">2 - Fair</SelectItem>
                                        <SelectItem value="1">1 - Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience Level</Label>
                                <Select name="experience" defaultValue="3">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 - Expert</SelectItem>
                                        <SelectItem value="4">4 - Advanced</SelectItem>
                                        <SelectItem value="3">3 - Intermediate</SelectItem>
                                        <SelectItem value="2">2 - Beginner</SelectItem>
                                        <SelectItem value="1">1 - Novice</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="recommendation">Recommendation *</Label>
                                <Select name="recommendation" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select recommendation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="strong-hire">Strong Hire</SelectItem>
                                        <SelectItem value="hire">Hire</SelectItem>
                                        <SelectItem value="maybe">Maybe</SelectItem>
                                        <SelectItem value="no-hire">No Hire</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="strengths">Key Strengths *</Label>
                            <Textarea
                                name="strengths"
                                placeholder="List the candidate's main strengths and positive attributes..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weaknesses">Areas for Improvement</Label>
                            <Textarea
                                name="weaknesses"
                                placeholder="Note any concerns or areas where the candidate could improve..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="detailedNotes">Detailed Interview Notes *</Label>
                            <Textarea
                                name="detailedNotes"
                                placeholder="Provide detailed notes about the interview, responses to questions, overall impression, etc..."
                                rows={5}
                                required
                            />
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                <FileText className="w-4 h-4 mr-2" />
                                Submit Feedback
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default InterviewFeedbackDialog;