import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useDragScroll } from '../hooks/useDragScroll';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
    Eye,
    MessageSquare,
    Phone,
    ArrowRight,
    XCircle,
    RefreshCw,
    Mail,
    Calendar,
    MapPin,
    User
} from 'lucide-react';
import { recruitmentStages, getStageColor, getStageLabel, getInitials } from '../utils/constant';

interface RecruitmentPipelineProps {
    applicants: any[];
    loading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onRefresh: () => void;
    onOpenCandidateDetail: (candidate: any) => void;
    onMoveCandidateStage: (candidateId: string, stage: string) => Promise<boolean>;
    onHireCandidate: (candidateId: string) => Promise<boolean>;
}

const RecruitmentPipeline = ({
    applicants: externalApplicants,
    loading: externalLoading,
    searchTerm,
    onSearchChange,
    onRefresh,
    onOpenCandidateDetail,
    onMoveCandidateStage,
    onHireCandidate
}: RecruitmentPipelineProps) => {
    const scrollContainerRef = useDragScroll();
    const [pipelineView, setPipelineView] = useState<'pipeline' | 'table'>('pipeline');
    const [filterStage] = useState<string>('all');

    // Internal state to manage applicants
    const [internalApplicants, setInternalApplicants] = useState<any[]>([]);
    const [internalLoading, setInternalLoading] = useState(false);
    const [actionStates, setActionStates] = useState<{ [key: string]: boolean }>({});

    // Sync with external props
    useEffect(() => {
        setInternalApplicants(externalApplicants);
    }, [externalApplicants]);

    useEffect(() => {
        setInternalLoading(externalLoading);
    }, [externalLoading]);

    const getCandidatesByStage = (stageId: string) => {
        return internalApplicants.filter(app => app.stage === stageId && !app.is_archived);
    };

    const filteredCandidates = internalApplicants.filter(applicant => {
        const name = applicant.name?.toLowerCase() || '';
        const position = applicant.position?.toLowerCase() || '';
        const email = applicant.email?.toLowerCase() || '';
        const phone = applicant.phone?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            name.includes(search) ||
            position.includes(search) ||
            email.includes(search) ||
            phone.includes(search);

        const matchesStage = filterStage === 'all' || applicant.stage === filterStage;

        return matchesSearch && matchesStage && !applicant.is_archived;
    });

    // Enhanced move candidate with immediate UI update
    const handleMoveCandidateStage = async (candidateId: string, stage: string) => {
        setActionStates(prev => ({ ...prev, [candidateId]: true }));

        // ✅ Immediate UI update for optimistic rendering
        setInternalApplicants(prev =>
            prev.map(applicant =>
                applicant.id === candidateId
                    ? { ...applicant, stage }
                    : applicant
            )
        );

        try {
            const success = await onMoveCandidateStage(candidateId, stage);
            if (!success) {
                // Revert the optimistic update if the API call failed
                setInternalApplicants(externalApplicants);
            }
        } catch (error) {
            console.error('Failed to move candidate:', error);
            // Revert to original state
            setInternalApplicants(externalApplicants);
        } finally {
            setActionStates(prev => ({ ...prev, [candidateId]: false }));
        }
    };

    // Enhanced hire candidate with immediate UI update
    const handleHireCandidate = async (candidateId: string) => {
        setActionStates(prev => ({ ...prev, [candidateId]: true }));

        // ✅ Immediate UI update - remove from list optimistically
        setInternalApplicants(prev =>
            prev.filter(applicant => applicant.id !== candidateId)
        );

        try {
            const success = await onHireCandidate(candidateId);
            if (!success) {
                // Revert if the API call failed
                setInternalApplicants(externalApplicants);
            }
        } catch (error) {
            console.error('Failed to hire candidate:', error);
            // Revert to original state
            setInternalApplicants(externalApplicants);
        } finally {
            setActionStates(prev => ({ ...prev, [candidateId]: false }));
        }
    };

    // Enhanced refresh
    const handleRefresh = async () => {
        setInternalLoading(true);
        await onRefresh();
        setInternalLoading(false);
    };

    const isCandidateLoading = (candidateId: string) => {
        return actionStates[candidateId] || false;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderPipelineView = () => {
        return (
            <div
                ref={scrollContainerRef}
                className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 cursor-grab active:cursor-grabbing"
                style={{ userSelect: 'none' }}
            >
                <div className="flex gap-4 pb-4 min-w-max">
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
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="font-medium">
                                                {stageApplicants.length}
                                            </Badge>
                                            {stageApplicants.some(app => isCandidateLoading(app.id)) && (
                                                <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                        <div className="space-y-3">
                                            {stageApplicants.map((applicant) => {
                                                const isLoading = isCandidateLoading(applicant.id);
                                                return (
                                                    <Card
                                                        key={applicant.id}
                                                        className={`cursor-pointer hover:shadow-md transition-shadow ${isLoading ? 'opacity-60' : ''
                                                            }`}
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="space-y-3">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarFallback className="text-xs">
                                                                                {getInitials(applicant.name)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="font-medium text-sm truncate">{applicant.name}</p>
                                                                            <p className="text-xs text-muted-foreground truncate">{applicant.position}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => onOpenCandidateDetail(applicant)}
                                                                        disabled={isLoading}
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </Button>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                        <Mail className="w-3 h-3" />
                                                                        <span className="truncate">{applicant.email}</span>
                                                                    </div>

                                                                    {applicant.phone && (
                                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                            <Phone className="w-3 h-3" />
                                                                            <span>{applicant.phone}</span>
                                                                        </div>
                                                                    )}

                                                                    {applicant.appliedDate && (
                                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                            <Calendar className="w-3 h-3" />
                                                                            <span>{formatDate(applicant.appliedDate)}</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center justify-between text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                        {applicant.experience && (
                                                                            <span className="text-muted-foreground">
                                                                                {applicant.experience} exp
                                                                            </span>
                                                                        )}
                                                                        {applicant.location && (
                                                                            <div className="flex items-center gap-1">
                                                                                <MapPin className="w-3 h-3" />
                                                                                <span className="text-muted-foreground">{applicant.location}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {applicant.rating && (
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="font-medium">{applicant.rating}</span>
                                                                            <span className="text-muted-foreground">/ 5.0</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex gap-1">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex-1 h-7 text-xs"
                                                                        onClick={() => {
                                                                            const currentIndex = recruitmentStages.findIndex(s => s.id === stage.id);
                                                                            if (currentIndex < recruitmentStages.length - 2) {
                                                                                handleMoveCandidateStage(applicant.id, recruitmentStages[currentIndex + 1].id);
                                                                            } else if (currentIndex === recruitmentStages.length - 2) {
                                                                                handleHireCandidate(applicant.id);
                                                                            }
                                                                        }}
                                                                        disabled={isLoading || internalLoading}
                                                                    >
                                                                        {isLoading ? (
                                                                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                                                        ) : (
                                                                            <ArrowRight className="w-3 h-3 mr-1" />
                                                                        )}
                                                                        {stage.id === 'offer' ? 'Hire' : 'Advance'}
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-7 text-xs"
                                                                        onClick={() => handleMoveCandidateStage(applicant.id, 'rejected')}
                                                                        disabled={isLoading || internalLoading}
                                                                    >
                                                                        {isLoading ? (
                                                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                                                        ) : (
                                                                            <XCircle className="w-3 h-3" />
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}

                                            {stageApplicants.length === 0 && (
                                                <div className="text-center py-8 text-muted-foreground text-sm">
                                                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                    <p>No candidates in this stage</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderTableView = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Showing {filteredCandidates.filter(c => c.stage !== 'rejected').length} of {internalApplicants.length} candidates
                </div>
                <div className="flex items-center gap-2">
                    {Object.values(actionStates).some(state => state) && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Processing actions...</span>
                        </div>
                    )}
                </div>
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
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCandidates.filter(c => c.stage !== 'rejected').length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium mb-2">No candidates found</p>
                                        <p className="text-sm">
                                            {searchTerm ? 'Try adjusting your search terms' : 'No candidates in the pipeline'}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCandidates.filter(c => c.stage !== 'rejected').map((candidate) => {
                                    const isLoading = isCandidateLoading(candidate.id);
                                    return (
                                        <TableRow key={candidate.id} className={isLoading ? 'opacity-60' : ''}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-medium truncate">{candidate.name}</div>
                                                        <div className="text-sm text-muted-foreground truncate">{candidate.email}</div>
                                                        {candidate.phone && (
                                                            <div className="text-xs text-muted-foreground">{candidate.phone}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{candidate.position}</div>
                                                {candidate.location && (
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {candidate.location}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStageColor(candidate.stage)}>
                                                    {getStageLabel(candidate.stage)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{candidate.source || 'N/A'}</div>
                                                {candidate.referral && (
                                                    <div className="text-xs text-muted-foreground">Referred by {candidate.referral}</div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{formatDate(candidate.appliedDate)}</div>
                                                {candidate.experience && (
                                                    <div className="text-xs text-muted-foreground">{candidate.experience} experience</div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{candidate.rating || 'N/A'}</span>
                                                    {candidate.rating && (
                                                        <Progress value={(candidate.rating / 5) * 100} className="w-16" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onOpenCandidateDetail(candidate)}
                                                        disabled={isLoading}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={isLoading}
                                                    >
                                                        <MessageSquare className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={isLoading}
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
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
                    <p className="text-muted-foreground">Manage and track candidates through hiring stages</p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search candidates by name, email, position..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-80"
                    />
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={internalLoading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${internalLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <Tabs value={pipelineView} onValueChange={(value) => setPipelineView(value as 'pipeline' | 'table')} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
                    <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>

                <TabsContent value="pipeline" className="mt-6">
                    {internalLoading && internalApplicants.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <div className="flex items-center justify-center gap-3">
                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                    <span className="text-lg">Loading candidates...</span>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        renderPipelineView()
                    )}
                </TabsContent>

                <TabsContent value="table" className="mt-6">
                    {internalLoading && internalApplicants.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <div className="flex items-center justify-center gap-3">
                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                    <span className="text-lg">Loading candidates...</span>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        renderTableView()
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RecruitmentPipeline;