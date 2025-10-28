import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, FileText, Download, XCircle, Calendar } from 'lucide-react';
import { recruitmentStages, getStageColor, getStageLabel, getInitials } from '../utils/constant';

interface CandidateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    candidate: any;
    onMoveCandidateStage: (candidateId: string, stage: string) => void;
    onScheduleInterview: () => void;
}

const CandidateDialog = ({
    open,
    onOpenChange,
    candidate,
    onMoveCandidateStage,
    onScheduleInterview
}: CandidateDialogProps) => {
    if (!candidate) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{candidate.name}</DialogTitle>
                    <DialogDescription>Candidate Profile & Actions</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="text-xl">
                                {getInitials(candidate.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="font-semibold text-xl">{candidate.name}</h3>
                            <p className="text-muted-foreground">{candidate.position}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className={getStageColor(candidate.stage)}>
                                    {getStageLabel(candidate.stage)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">{candidate.experience} experience</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <div className="text-2xl font-bold">{candidate.rating}</div>
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
                                <p>{candidate.email}</p>
                            </div>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Phone</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <p>{candidate.phone}</p>
                            </div>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Source</Label>
                            <p className="mt-1">{candidate.source}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Applied Date</Label>
                            <p className="mt-1">{candidate.appliedDate}</p>
                        </div>
                    </div>

                    <div>
                        <Label className="text-muted-foreground">Skills</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {candidate.skills?.map((skill: string, index: number) => (
                                <Badge key={index} variant="outline">{skill}</Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label className="text-muted-foreground">Resume</Label>
                        <div className="flex items-center gap-2 mt-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{candidate.resume}</span>
                            <Button variant="outline" size="sm" onClick={() => console.log('Download resume')}>
                                <Download className="w-4 h-4 mr-1" />
                                Download
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label className="text-muted-foreground">Notes</Label>
                        <p className="text-sm mt-1">{candidate.notes}</p>
                    </div>

                    <Separator />

                    <div>
                        <Label className="mb-3 block">Move to Stage</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {recruitmentStages
                                .filter(s => s.id !== candidate.stage && s.id !== 'rejected')
                                .map((stage) => (
                                    <Button
                                        key={stage.id}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            onMoveCandidateStage(candidate.id, stage.id);
                                            onOpenChange(false);
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
                                onMoveCandidateStage(candidate.id, 'rejected');
                                onOpenChange(false);
                            }}
                        >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                        <Button onClick={onScheduleInterview}>
                            <Calendar className="w-4 h-4 mr-1" />
                            Schedule Interview
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CandidateDialog;