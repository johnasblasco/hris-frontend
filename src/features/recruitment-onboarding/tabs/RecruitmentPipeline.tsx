import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
    Eye,
    MessageSquare,
    Phone,
    ArrowRight,
    XCircle,
    RefreshCw,
    Mail
} from 'lucide-react';
import { recruitmentStages, getStageColor, getStageLabel, getInitials } from '../utils/constant';

interface RecruitmentPipelineProps {
    applicants: any[];
    loading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onRefresh: () => void;
    onOpenCandidateDetail: (candidate: any) => void;
    onMoveCandidateStage: (candidateId: string, stage: string) => void;
    onHireCandidate: (candidateId: string) => void;
}

const RecruitmentPipeline = ({
    applicants,
    loading,
    searchTerm,
    onSearchChange,
    onRefresh,
    onOpenCandidateDetail,
    onMoveCandidateStage,
    onHireCandidate
}: RecruitmentPipelineProps) => {
    const [pipelineView, setPipelineView] = useState<'pipeline' | 'table'>('pipeline');
    const [filterStage, setFilterStage] = useState<string>('all');

    const getCandidatesByStage = (stageId: string) => {
        return applicants.filter(app => app.stage === stageId && !app.is_archived);
    };

    const filteredCandidates = applicants.filter(applicant => {
        const name = applicant.name?.toLowerCase() || '';
        const position = applicant.position?.toLowerCase() || '';
        const email = applicant.email?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            name.includes(search) ||
            position.includes(search) ||
            email.includes(search);

        const matchesStage = filterStage === 'all' || applicant.stage === filterStage;

        return matchesSearch && matchesStage && !applicant.is_archived;
    });

    const renderPipelineView = () => (
        <ScrollArea className="w-full overflow-x-auto">
            <div className="flex gap-4 pb-4 flex-nowrap">
                {recruitmentStages.filter(stage => stage.id !== 'rejected').map((stage) => {
                    const stageApplicants = getCandidatesByStage(stage.id);
                    const StageIcon = stage.icon;

                    return (
                        <Card key={stage.id} className="min-w-[320px] flex-shrink-0">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <StageIcon className="w-4 h-4" />
                                        <CardTitle className="text-sm">{stage.label}</CardTitle>
                                    </div>
                                    <Badge variant="secondary">{stageApplicants.length}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[600px] pr-4">
                                    <div className="space-y-3">
                                        {stageApplicants.map((applicant) => (
                                            <Card key={applicant.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                                <CardContent className="p-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback>{getInitials(applicant.name)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium text-sm">{applicant.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{applicant.position}</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => onOpenCandidateDetail(applicant)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Mail className="w-3 h-3" />
                                                            <span className="truncate">{applicant.email}</span>
                                                        </div>

                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-muted-foreground">{applicant.experience} exp</span>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-medium">{applicant.rating}</span>
                                                                <span className="text-muted-foreground">/ 5.0</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1 h-7 text-xs"
                                                                onClick={() => {
                                                                    const currentIndex = recruitmentStages.findIndex(s => s.id === stage.id);
                                                                    if (currentIndex < recruitmentStages.length - 2) {
                                                                        onMoveCandidateStage(applicant.id, recruitmentStages[currentIndex + 1].id);
                                                                    } else if (currentIndex === recruitmentStages.length - 2) {
                                                                        onHireCandidate(applicant.id);
                                                                    }
                                                                }}
                                                                disabled={loading}
                                                            >
                                                                <ArrowRight className="w-3 h-3 mr-1" />
                                                                {stage.id === 'offer' ? 'Hire' : 'Advance'}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 text-xs"
                                                                onClick={() => onMoveCandidateStage(applicant.id, 'rejected')}
                                                                disabled={loading}
                                                            >
                                                                <XCircle className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        {stageApplicants.length === 0 && (
                                            <div className="text-center py-8 text-muted-foreground text-sm">
                                                No candidates in this stage
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </ScrollArea>
    );

    const renderTableView = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                {/* Table view controls */}
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Stage</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Applied</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCandidates.filter(c => c.stage !== 'rejected').map((candidate) => (
                                <TableRow key={candidate.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{candidate.name}</div>
                                                <div className="text-sm text-muted-foreground">{candidate.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{candidate.position}</TableCell>
                                    <TableCell>
                                        <Badge className={getStageColor(candidate.stage)}>
                                            {getStageLabel(candidate.stage)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{candidate.source}</TableCell>
                                    <TableCell>{candidate.appliedDate}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <span className="mr-2">{candidate.rating}</span>
                                            <Progress value={candidate.rating * 20} className="w-16" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => onOpenCandidateDetail(candidate)}>
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => {/* send email */ }}>
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => {/* call */ }}>
                                                <Phone className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Recruitment Pipeline</h2>
                    <p className="text-muted-foreground">Move candidates through hiring stages</p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-64"
                    />
                    <Button
                        variant="outline"
                        onClick={onRefresh}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <Tabs value={pipelineView} onValueChange={(value) => setPipelineView(value as 'pipeline' | 'table')} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
                    <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
                    <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>

                <TabsContent value="pipeline" className="mt-6">
                    {loading ? (
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div>Loading applicants...</div>
                            </CardContent>
                        </Card>
                    ) : (
                        renderPipelineView()
                    )}
                </TabsContent>

                <TabsContent value="table" className="mt-6">
                    {renderTableView()}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RecruitmentPipeline;