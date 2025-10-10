import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    CheckCircle,
    Circle,
    Building2,
    Users,
    Briefcase,
    Calendar,
    Gift,
    MapPin,
    Award,
    GraduationCap,
    Plus,
    Trash2,
    ArrowRight,
    ArrowLeft,
    Settings,
    Save
} from 'lucide-react';
import { toast } from "sonner";

interface SetupData {
    // Company Info
    companyName: string;
    industry: string;
    companySize: string;
    timezone: string;
    currency: string;

    // Departments
    departments: Array<{
        id: string;
        name: string;
        description: string;
    }>;

    // Job Positions
    positions: Array<{
        id: string;
        title: string;
        department: string;
        level: string;
    }>;

    // Leave Types
    leaveTypes: Array<{
        id: string;
        name: string;
        defaultDays: number;
        requiresApproval: boolean;
    }>;

    // Benefit Types
    benefitTypes: Array<{
        id: string;
        name: string;
        category: string;
        description: string;
    }>;

    // Employment Types
    employmentTypes: Array<{
        id: string;
        name: string;
        description: string;
    }>;

    // Work Locations
    workLocations: Array<{
        id: string;
        name: string;
        address: string;
        isRemote: boolean;
    }>;

    // Skills
    skills: Array<{
        id: string;
        name: string;
        category: string;
    }>;

    // Performance Ratings
    performanceRatings: Array<{
        id: string;
        label: string;
        value: number;
        description: string;
    }>;
}

const setupSteps = [
    { id: 'company', label: 'Company Info', icon: Building2 },
    { id: 'departments', label: 'Departments', icon: Users },
    { id: 'positions', label: 'Job Positions', icon: Briefcase },
    { id: 'leave', label: 'Leave Types', icon: Calendar },
    { id: 'benefits', label: 'Benefits', icon: Gift },
    { id: 'employment', label: 'Employment Types', icon: Users },
    { id: 'locations', label: 'Work Locations', icon: MapPin },
    { id: 'skills', label: 'Skills', icon: GraduationCap },
    { id: 'performance', label: 'Performance Ratings', icon: Award },
];

export function SetupManager() {
    const [currentStep, setCurrentStep] = useState(0);
    const [setupData, setSetupData] = useState<SetupData>({
        companyName: '',
        industry: '',
        companySize: '',
        timezone: 'UTC',
        currency: 'USD',
        departments: [],
        positions: [],
        leaveTypes: [],
        benefitTypes: [],
        employmentTypes: [],
        workLocations: [],
        skills: [],
        performanceRatings: [],
    });

    const progress = ((currentStep + 1) / setupSteps.length) * 100;

    const handleNext = () => {
        if (currentStep < setupSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        // Save setup data to localStorage or backend
        localStorage.setItem('hris_setup_data', JSON.stringify(setupData));
        localStorage.setItem('hris_setup_complete', 'true');
        toast.success('Setup completed successfully!');
    };

    const loadDefaultData = () => {
        setSetupData({
            companyName: 'Acme Corporation',
            industry: 'Technology',
            companySize: '100-500',
            timezone: 'America/New_York',
            currency: 'USD',
            departments: [
                { id: '1', name: 'Engineering', description: 'Software development and technical operations' },
                { id: '2', name: 'Marketing', description: 'Brand management and customer engagement' },
                { id: '3', name: 'Sales', description: 'Revenue generation and client relations' },
                { id: '4', name: 'Human Resources', description: 'Employee management and organizational development' },
                { id: '5', name: 'Finance', description: 'Financial planning and accounting' },
            ],
            positions: [
                { id: '1', title: 'Software Engineer', department: 'Engineering', level: 'Mid-Level' },
                { id: '2', title: 'Senior Software Engineer', department: 'Engineering', level: 'Senior' },
                { id: '3', title: 'Marketing Manager', department: 'Marketing', level: 'Manager' },
                { id: '4', title: 'Sales Representative', department: 'Sales', level: 'Entry' },
                { id: '5', title: 'HR Manager', department: 'Human Resources', level: 'Manager' },
            ],
            leaveTypes: [
                { id: '1', name: 'Annual Leave', defaultDays: 15, requiresApproval: true },
                { id: '2', name: 'Sick Leave', defaultDays: 10, requiresApproval: false },
                { id: '3', name: 'Personal Leave', defaultDays: 5, requiresApproval: true },
                { id: '4', name: 'Maternity Leave', defaultDays: 90, requiresApproval: true },
                { id: '5', name: 'Paternity Leave', defaultDays: 14, requiresApproval: true },
            ],
            benefitTypes: [
                { id: '1', name: 'Health Insurance', category: 'Health', description: 'Comprehensive health coverage' },
                { id: '2', name: 'Dental Insurance', category: 'Health', description: 'Dental care coverage' },
                { id: '3', name: '401(k) Match', category: 'Retirement', description: 'Company 401k matching' },
                { id: '4', name: 'Life Insurance', category: 'Insurance', description: 'Life insurance coverage' },
                { id: '5', name: 'Gym Membership', category: 'Wellness', description: 'Fitness center access' },
            ],
            employmentTypes: [
                { id: '1', name: 'Full-Time', description: 'Regular full-time employment' },
                { id: '2', name: 'Part-Time', description: 'Part-time employment' },
                { id: '3', name: 'Contract', description: 'Fixed-term contract' },
                { id: '4', name: 'Intern', description: 'Internship position' },
                { id: '5', name: 'Consultant', description: 'External consultant' },
            ],
            workLocations: [
                { id: '1', name: 'Headquarters', address: '123 Main St, New York, NY', isRemote: false },
                { id: '2', name: 'West Coast Office', address: '456 Tech Ave, San Francisco, CA', isRemote: false },
                { id: '3', name: 'Remote', address: 'Various Locations', isRemote: true },
            ],
            skills: [
                { id: '1', name: 'JavaScript', category: 'Technical' },
                { id: '2', name: 'React', category: 'Technical' },
                { id: '3', name: 'Project Management', category: 'Management' },
                { id: '4', name: 'Communication', category: 'Soft Skills' },
                { id: '5', name: 'Leadership', category: 'Soft Skills' },
            ],
            performanceRatings: [
                { id: '1', label: 'Exceptional', value: 5, description: 'Exceeds all expectations' },
                { id: '2', label: 'Exceeds Expectations', value: 4, description: 'Consistently exceeds goals' },
                { id: '3', label: 'Meets Expectations', value: 3, description: 'Meets all job requirements' },
                { id: '4', label: 'Needs Improvement', value: 2, description: 'Performance below expectations' },
                { id: '5', label: 'Unsatisfactory', value: 1, description: 'Significant performance issues' },
            ],
        });
        toast.success('Default data loaded successfully!');
    };

    const renderStepContent = () => {
        const step = setupSteps[currentStep].id;

        switch (step) {
            case 'company':
                return <CompanyInfoStep setupData={setupData} setSetupData={setSetupData} />;
            case 'departments':
                return <DepartmentsStep setupData={setupData} setSetupData={setSetupData} />;
            case 'positions':
                return <PositionsStep setupData={setupData} setSetupData={setSetupData} />;
            case 'leave':
                return <LeaveTypesStep setupData={setupData} setSetupData={setSetupData} />;
            case 'benefits':
                return <BenefitTypesStep setupData={setupData} setSetupData={setSetupData} />;
            case 'employment':
                return <EmploymentTypesStep setupData={setupData} setSetupData={setSetupData} />;
            case 'locations':
                return <WorkLocationsStep setupData={setupData} setSetupData={setSetupData} />;
            case 'skills':
                return <SkillsStep setupData={setupData} setSetupData={setSetupData} />;
            case 'performance':
                return <PerformanceRatingsStep setupData={setupData} setSetupData={setSetupData} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Settings className="w-8 h-8" />
                    Initial System Setup
                </h1>
                <p className="text-muted-foreground mt-2">
                    Configure all essential settings and data for your HRIS system
                </p>
            </div>

            {/* Progress Bar */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Step {currentStep + 1} of {setupSteps.length}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(progress)}% Complete
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />

                        {/* Step Indicators */}
                        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 mt-6">
                            {setupSteps.map((step, index) => {
                                const StepIcon = step.icon;
                                const isCompleted = index < currentStep;
                                const isCurrent = index === currentStep;

                                return (
                                    <div
                                        key={step.id}
                                        className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${isCurrent ? 'bg-primary/10' : ''
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-100 text-green-600' :
                                                isCurrent ? 'bg-primary text-primary-foreground' :
                                                    'bg-slate-100 text-slate-400'
                                            }`}>
                                            {isCompleted ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <StepIcon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span className={`text-xs text-center ${isCurrent ? 'font-medium' : 'text-muted-foreground'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Action */}
            <div className="flex justify-end">
                <Button variant="outline" onClick={loadDefaultData}>
                    <Settings className="w-4 h-4 mr-2" />
                    Load Default Setup
                </Button>
            </div>

            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        <div className="text-sm text-muted-foreground">
                            {setupSteps[currentStep].label}
                        </div>

                        {currentStep < setupSteps.length - 1 ? (
                            <Button onClick={handleNext}>
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                                <Save className="w-4 h-4 mr-2" />
                                Complete Setup
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Step Components
function CompanyInfoStep({ setupData, setSetupData }: { setupData: SetupData; setSetupData: (data: SetupData) => void }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Information
                </CardTitle>
                <CardDescription>
                    Set up your basic company information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                            id="companyName"
                            value={setupData.companyName}
                            onChange={(e) => setSetupData({ ...setupData, companyName: e.target.value })}
                            placeholder="Acme Corporation"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="industry">Industry *</Label>
                        <Select value={setupData.industry} onValueChange={(value) => setSetupData({ ...setupData, industry: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="Retail">Retail</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size *</Label>
                        <Select value={setupData.companySize} onValueChange={(value) => setSetupData({ ...setupData, companySize: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                <SelectItem value="201-500">201-500 employees</SelectItem>
                                <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                <SelectItem value="1000+">1000+ employees</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone *</Label>
                        <Select value={setupData.timezone} onValueChange={(value) => setSetupData({ ...setupData, timezone: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                <SelectItem value="UTC">UTC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency *</Label>
                        <Select value={setupData.currency} onValueChange={(value) => setSetupData({ ...setupData, currency: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD - US Dollar</SelectItem>
                                <SelectItem value="EUR">EUR - Euro</SelectItem>
                                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function DepartmentsStep({ setupData, setSetupData }: { setupData: SetupData; setSetupData: (data: SetupData) => void }) {
    const [newDept, setNewDept] = useState({ name: '', description: '' });

    const addDepartment = () => {
        if (newDept.name) {
            setSetupData({
                ...setupData,
                departments: [
                    ...setupData.departments,
                    { id: Date.now().toString(), ...newDept }
                ]
            });
            setNewDept({ name: '', description: '' });
        }
    };

    const removeDepartment = (id: string) => {
        setSetupData({
            ...setupData,
            departments: setupData.departments.filter(d => d.id !== id)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Departments
                </CardTitle>
                <CardDescription>
                    Define the departments in your organization
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add Department Form */}
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Department</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            placeholder="Department name (e.g., Engineering)"
                            value={newDept.name}
                            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                        />
                        <Input
                            placeholder="Description"
                            value={newDept.description}
                            onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                        />
                    </div>
                    <Button onClick={addDepartment} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Department
                    </Button>
                </div>

                {/* Departments List */}
                {setupData.departments.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {setupData.departments.map((dept) => (
                                <TableRow key={dept.id}>
                                    <TableCell className="font-medium">{dept.name}</TableCell>
                                    <TableCell>{dept.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeDepartment(dept.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {setupData.departments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No departments added yet. Add your first department above.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function PositionsStep({ setupData, setSetupData }: { setupData: SetupData; setSetupData: (data: SetupData) => void }) {
    const [newPos, setNewPos] = useState({ title: '', department: '', level: '' });

    const addPosition = () => {
        if (newPos.title && newPos.department && newPos.level) {
            setSetupData({
                ...setupData,
                positions: [
                    ...setupData.positions,
                    { id: Date.now().toString(), ...newPos }
                ]
            });
            setNewPos({ title: '', department: '', level: '' });
        }
    };

    const removePosition = (id: string) => {
        setSetupData({
            ...setupData,
            positions: setupData.positions.filter(p => p.id !== id)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Job Positions
                </CardTitle>
                <CardDescription>
                    Define job titles and positions across departments
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add Position Form */}
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Position</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            placeholder="Job title"
                            value={newPos.title}
                            onChange={(e) => setNewPos({ ...newPos, title: e.target.value })}
                        />
                        <Select value={newPos.department} onValueChange={(value) => setNewPos({ ...newPos, department: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                {setupData.departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={newPos.level} onValueChange={(value) => setNewPos({ ...newPos, level: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Entry">Entry Level</SelectItem>
                                <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                                <SelectItem value="Senior">Senior</SelectItem>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Director">Director</SelectItem>
                                <SelectItem value="Executive">Executive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={addPosition} size="sm" disabled={setupData.departments.length === 0}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Position
                    </Button>
                    {setupData.departments.length === 0 && (
                        <p className="text-xs text-muted-foreground">Please add departments first</p>
                    )}
                </div>

                {/* Positions List */}
                {setupData.positions.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {setupData.positions.map((pos) => (
                                <TableRow key={pos.id}>
                                    <TableCell className="font-medium">{pos.title}</TableCell>
                                    <TableCell>{pos.department}</TableCell>
                                    <TableCell><Badge variant="secondary">{pos.level}</Badge></TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removePosition(pos.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

function LeaveTypesStep({ setupData, setSetupData }: { setupData: SetupData; setSetupData: (data: SetupData) => void }) {
    const [newLeave, setNewLeave] = useState({ name: '', defaultDays: 0, requiresApproval: true });

    const addLeaveType = () => {
        if (newLeave.name && newLeave.defaultDays > 0) {
            setSetupData({
                ...setupData,
                leaveTypes: [
                    ...setupData.leaveTypes,
                    { id: Date.now().toString(), ...newLeave }
                ]
            });
            setNewLeave({ name: '', defaultDays: 0, requiresApproval: true });
        }
    };

    const removeLeaveType = (id: string) => {
        setSetupData({
            ...setupData,
            leaveTypes: setupData.leaveTypes.filter(l => l.id !== id)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Leave Types
                </CardTitle>
                <CardDescription>
                    Configure leave types and their default allocations
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add Leave Type Form */}
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Leave Type</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            placeholder="Leave type name"
                            value={newLeave.name}
                            onChange={(e) => setNewLeave({ ...newLeave, name: e.target.value })}
                        />
                        <Input
                            type="number"
                            placeholder="Default days"
                            value={newLeave.defaultDays || ''}
                            onChange={(e) => setNewLeave({ ...newLeave, defaultDays: Number(e.target.value) })}
                        />
                        <Select
                            value={newLeave.requiresApproval.toString()}
                            onValueChange={(value) => setNewLeave({ ...newLeave, requiresApproval: value === 'true' })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Requires Approval</SelectItem>
                                <SelectItem value="false">Auto-Approved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={addLeaveType} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Leave Type
                    </Button>
                </div>

                {/* Leave Types List */}
                {setupData.leaveTypes.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Leave Type</TableHead>
                                <TableHead>Default Days</TableHead>
                                <TableHead>Approval</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {setupData.leaveTypes.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell className="font-medium">{leave.name}</TableCell>
                                    <TableCell>{leave.defaultDays} days</TableCell>
                                    <TableCell>
                                        <Badge variant={leave.requiresApproval ? "default" : "secondary"}>
                                            {leave.requiresApproval ? 'Required' : 'Auto'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeLeaveType(leave.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

function BenefitTypesStep({ setupData, setSetupData }: { setupData: SetupData; setSetupData: (data: SetupData) => void }) {
    const [newBenefit, setNewBenefit] = useState({ name: '', category: '', description: '' });

    const addBenefitType = () => {
        if (newBenefit.name && newBenefit.category) {
            setSetupData({
                ...setupData,
                benefitTypes: [
                    ...setupData.benefitTypes,
                    { id: Date.now().toString(), ...newBenefit }
                ]
            });
            setNewBenefit({ name: '', category: '', description: '' });
        }
    };

    const removeBenefitType = (id: string) => {
        setSetupData({
            ...setupData,
            benefitTypes: setupData.benefitTypes.filter(b => b.id !== id)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Benefit Types
                </CardTitle>
                <CardDescription>
                    Define employee benefit packages and perks
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add Benefit Form */}
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Benefit Type</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            placeholder="Benefit name"
                            value={newBenefit.name}
                            onChange={(e) => setNewBenefit({ ...newBenefit, name: e.target.value })}
                        />
                        <Select value={newBenefit.category} onValueChange={(value) => setNewBenefit({ ...newBenefit, category: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Retirement">Retirement</SelectItem>
                                <SelectItem value="Insurance">Insurance</SelectItem>
                                <SelectItem value="Wellness">Wellness</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Description"
                            value={newBenefit.description}
                            onChange={(e) => setNewBenefit({ ...newBenefit, description: e.target.value })}
                        />
                    </div>
                    <Button onClick={addBenefitType} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Benefit Type
                    </Button>
                </div>

                {/* Benefits List */}
                {setupData.benefitTypes.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Benefit Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {setupData.benefitTypes.map((benefit) => (
                                <TableRow key={benefit.id}>
                                    <TableCell className="font-medium">{benefit.name}</TableCell>
                                    <TableCell><Badge>{benefit.category}</Badge></TableCell>
                                    <TableCell>{benefit.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeBenefitType(benefit.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

function EmploymentTypesStep({ setupData, setSetupData }: { setupData: SetupData; setSetupData: (data: SetupData) => void }) {
    const [newType, setNewType] = useState({ name: '', description: '' });

    const addEmploymentType = () => {
        if (newType.name) {
            setSetupData({
                ...setupData,
                employmentTypes: [
                    ...setupData.employmentTypes,
                    { id: Date.now().toString(), ...newType }
                ]
            });
            setNewType({ name: '', description: '' });
        }
    };

    const removeEmploymentType = (id: string) => {
        setSetupData({
            ...setupData,
            employmentTypes: setupData.employmentTypes.filter(t => t.id !== id)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Employment Types
                </CardTitle>
                <CardDescription>
                    Define employment types and contract categories
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Employment Type</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            placeholder="Type name (e.g., Full-Time)"
                            value={newType.name}
                            onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                        />
                        <Input
                            placeholder="Description"
                            value={newType.description}
                            onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                        />
                    </div>
                    <Button onClick={addEmploymentType} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employment Type
                    </Button>
                </div>

                {setupData.employmentTypes.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {setupData.employmentTypes.map((type) => (
                                <TableRow key={type.id}>
                                    <TableCell className="font-medium">{type.name}</TableCell>
                                    <TableCell>{type.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeEmploymentType(type.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

function WorkLocationsStep({ setupData, setSetupData }: { setupData: SetupData; setSetupData: (data: SetupData) => void }) {
    const [newLocation, setNewLocation] = useState({ name: '', address: '', isRemote: false });

    const addLocation = () => {
        if (newLocation.name) {
            setSetupData({
                ...setupData,
                workLocations: [
                    ...setupData.workLocations,
                    { id: Date.now().toString(), ...newLocation }
                ]
            });
            setNewLocation({ name: '', address: '', isRemote: false });
        }
    };

    const removeLocation = (id: string) => {
        setSetupData({
            ...setupData,
            workLocations: setupData.workLocations.filter(l => l.id !== id)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Work Locations
                </CardTitle>
                <CardDescription>
                    Set up office locations and remote work options
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Location</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            placeholder="Location name"
                            value={newLocation.name}
                            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                        />
                        <Input
                            placeholder="Address"
                            value={newLocation.address}
                            onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                        />
                        <Select
                            value={newLocation.isRemote.toString()}
                            onValueChange={(value) => setNewLocation({ ...newLocation, isRemote: value === 'true' })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="false">Physical Office</SelectItem>
                                <SelectItem value="true">Remote Location</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={addLocation} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Location
                    </Button>
                </div>

                {setupData.workLocations.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Location Name</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {setupData.workLocations.map((location) => (
                                <TableRow key={location.id}>
                                    <TableCell className="font-medium">{location.name}</TableCell>
                                    <TableCell>{location.address}</TableCell>
                                    <TableCell>
                                        <Badge variant={location.isRemote ? "secondary" : "default"}>
                                            {location.isRemote ? 'Remote' : 'Office'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeLocation(location.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

function SkillsStep({ setupData, setSetupData }: { setupData: SetupData; setSetupData: (data: SetupData) => void }) {
    const [newSkill, setNewSkill] = useState({ name: '', category: '' });

    const addSkill = () => {
        if (newSkill.name && newSkill.category) {
            setSetupData({
                ...setupData,
                skills: [
                    ...setupData.skills,
                    { id: Date.now().toString(), ...newSkill }
                ]
            });
            setNewSkill({ name: '', category: '' });
        }
    };

    const removeSkill = (id: string) => {
        setSetupData({
            ...setupData,
            skills: setupData.skills.filter(s => s.id !== id)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Skills & Competencies
                </CardTitle>
                <CardDescription>
                    Define skills for performance tracking and development
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Skill</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            placeholder="Skill name"
                            value={newSkill.name}
                            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        />
                        <Select value={newSkill.category} onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Technical">Technical</SelectItem>
                                <SelectItem value="Management">Management</SelectItem>
                                <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                                <SelectItem value="Leadership">Leadership</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={addSkill} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                    </Button>
                </div>

                {setupData.skills.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Skill Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {setupData.skills.map((skill) => (
                                <TableRow key={skill.id}>
                                    <TableCell className="font-medium">{skill.name}</TableCell>
                                    <TableCell><Badge>{skill.category}</Badge></TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSkill(skill.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

function PerformanceRatingsStep({ setupData, setSetupData }: { setupData: SetupData; setSetupData: (data: SetupData) => void }) {
    const [newRating, setNewRating] = useState({ label: '', value: 0, description: '' });

    const addRating = () => {
        if (newRating.label && newRating.value > 0) {
            setSetupData({
                ...setupData,
                performanceRatings: [
                    ...setupData.performanceRatings,
                    { id: Date.now().toString(), ...newRating }
                ]
            });
            setNewRating({ label: '', value: 0, description: '' });
        }
    };

    const removeRating = (id: string) => {
        setSetupData({
            ...setupData,
            performanceRatings: setupData.performanceRatings.filter(r => r.id !== id)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Performance Ratings
                </CardTitle>
                <CardDescription>
                    Define performance rating scales for employee evaluations
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Rating</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            placeholder="Rating label"
                            value={newRating.label}
                            onChange={(e) => setNewRating({ ...newRating, label: e.target.value })}
                        />
                        <Input
                            type="number"
                            placeholder="Value (1-5)"
                            value={newRating.value || ''}
                            onChange={(e) => setNewRating({ ...newRating, value: Number(e.target.value) })}
                            min="1"
                            max="5"
                        />
                        <Input
                            placeholder="Description"
                            value={newRating.description}
                            onChange={(e) => setNewRating({ ...newRating, description: e.target.value })}
                        />
                    </div>
                    <Button onClick={addRating} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Rating
                    </Button>
                </div>

                {setupData.performanceRatings.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {setupData.performanceRatings.map((rating) => (
                                <TableRow key={rating.id}>
                                    <TableCell className="font-medium">{rating.label}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{rating.value}</Badge>
                                    </TableCell>
                                    <TableCell>{rating.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeRating(rating.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
