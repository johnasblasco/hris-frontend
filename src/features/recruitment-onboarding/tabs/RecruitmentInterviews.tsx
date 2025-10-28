import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Link as LinkIcon, Mail, Plus, Calendar, Clock, User } from 'lucide-react';

interface RecruitmentInterviewsProps {
    interviews: any[];
    candidates: any[];
    onShowInterviewDialog: (show: boolean) => void;
    onUpdateInterviewStatus: (interviewId: string, status: string, additionalData?: any) => void;
    onSubmitInterviewFeedback: (interviewId: string, feedback: string) => void;
}

const RecruitmentInterviews = ({
    interviews,
    candidates,
    onShowInterviewDialog,
    onUpdateInterviewStatus,
    onSubmitInterviewFeedback
}: RecruitmentInterviewsProps) => {
    const getStatusBadge = (status: string) => {
        const variant =
            status === 'completed' ? 'default' :
                status === 'cancelled' ? 'destructive' :
                    status === 'noshow' ? 'destructive' :
                        'secondary';

        const className =
            status === 'completed' ? 'bg-green-500' :
                status === 'cancelled' ? 'bg-red-500' :
                    status === 'noshow' ? 'bg-orange-500' :
                        status === 'scheduled' ? 'bg-blue-500' :
                            '';

        return (
            <Badge variant={variant} className={className}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getUpcomingInterviews = () => {
        return interviews.filter(interview =>
            interview.status === 'scheduled' &&
            new Date(`${interview.date}T${interview.time}`) > new Date()
        );
    };

    const getPastInterviews = () => {
        return interviews.filter(interview =>
            interview.status !== 'scheduled' ||
            new Date(`${interview.date}T${interview.time}`) <= new Date()
        );
    };

    const formatDateTime = (date: string, time: string) => {
        const interviewDate = new Date(`${date}T${time}`);
        const now = new Date();
        const isToday = interviewDate.toDateString() === now.toDateString();

        if (isToday) {
            return `Today at ${time}`;
        } else {
            return `${date} at ${time}`;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Interviews</h2>
                    <p className="text-muted-foreground">Manage interview schedules and feedback</p>
                </div>
                <Button onClick={() => onShowInterviewDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Interview
                </Button>
            </div>

            {/* Upcoming Interviews */}
            {getUpcomingInterviews().length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Upcoming Interviews ({getUpcomingInterviews().length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {getUpcomingInterviews().map((interview) => (
                            <Card key={interview.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-sm">{interview.candidateName}</h4>
                                                <p className="text-xs text-muted-foreground">{interview.position}</p>
                                            </div>
                                            {getStatusBadge(interview.status)}
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span>{interview.interviewer}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span>{formatDateTime(interview.date, interview.time)}</span>
                                            </div>
                                            {interview.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-xs">{interview.location}</span>
                                                </div>
                                            )}
                                            {interview.meetingLink && (
                                                <div className="flex items-center gap-2">
                                                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                                    <a
                                                        href={interview.meetingLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline text-xs"
                                                    >
                                                        Join Meeting
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-xs"
                                                onClick={() => onUpdateInterviewStatus(interview.id, 'completed')}
                                            >
                                                Complete
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={() => onUpdateInterviewStatus(interview.id, 'cancelled')}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* All Interviews Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Interviewer</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Location/Link</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {interviews.map((interview) => (
                                <TableRow key={interview.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            {interview.candidateName}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{interview.position}</TableCell>
                                    <TableCell>{interview.interviewer}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{interview.date}</span>
                                            <span className="text-sm text-muted-foreground">{interview.time}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{interview.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm max-w-[200px]">
                                            {interview.location && (
                                                <div className="flex items-center gap-1 truncate">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{interview.location}</span>
                                                </div>
                                            )}
                                            {interview.meetingLink && (
                                                <div className="flex items-center gap-1 truncate">
                                                    <LinkIcon className="w-3 h-3 flex-shrink-0" />
                                                    <a
                                                        href={interview.meetingLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline truncate"
                                                    >
                                                        Meeting Link
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(interview.status)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {interview.status === 'scheduled' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onUpdateInterviewStatus(interview.id, 'completed')}
                                                    >
                                                        Complete
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onUpdateInterviewStatus(interview.id, 'cancelled')}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            {interview.status === 'completed' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const feedback = prompt('Enter feedback for this interview:');
                                                        if (feedback) {
                                                            onSubmitInterviewFeedback(interview.id, feedback);
                                                        }
                                                    }}
                                                >
                                                    Add Feedback
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const candidate = candidates.find(c => c.id === interview.candidateId);
                                                    if (candidate?.email) {
                                                        // You would implement email functionality here
                                                        console.log('Send email to:', candidate.email);
                                                    }
                                                }}
                                            >
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {interviews.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Calendar className="w-12 h-12 text-muted-foreground/50" />
                                            <div>
                                                <p className="font-medium">No interviews scheduled</p>
                                                <p className="text-sm">Schedule your first interview to get started</p>
                                            </div>
                                            <Button
                                                onClick={() => onShowInterviewDialog(true)}
                                                className="mt-2"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Schedule Interview
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecruitmentInterviews;