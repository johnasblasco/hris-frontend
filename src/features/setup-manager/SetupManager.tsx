import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Settings } from 'lucide-react';
import { toast } from "sonner";
import type { SetupData } from './components/setupManagerTypes';
import { setupSteps } from './components/constants';
import { StepIndicator } from './components/StepIndicator';
import { NavigationButtons } from './components/NavigationButton';
import { CompanyInfoStep } from './components/steps/CompanyInfoStep';
import { DepartmentsStep } from './components/steps/DepartmentsStep';
import { PositionsStep } from './components/steps/PositionsStep';
import { LeaveTypesStep } from './components/steps/LeaveTypesStep';
import { BenefitTypesStep } from './components/steps/BenefitTypeStep';
import { EmploymentTypesStep } from './components/steps/EmploymentTypeStep';
import { WorkLocationsStep } from './components/steps/WorkLocationsStep';
import { HolidaysStep } from './components/steps/HolidayStep';
import { WorkShiftsStep } from './components/steps/WorkShiftStep';

const SetupManager = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [setupData, setSetupData] = useState<SetupData>({
        companyName: '',
        companyLogo: '',
        companyMission: '',
        companyVision: '',
        registrationNumber: '',
        taxId: '',
        foundedYear: '',
        industry: '',
        companySize: '',
        website: '',
        primaryEmail: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        departments: [],
        positions: [],
        leaveTypes: [],
        benefitTypes: [],
        employmentTypes: [],
        workLocations: [],
        holidays: [],
        workShifts: [],
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
        localStorage.setItem('hris_setup_data', JSON.stringify(setupData));
        localStorage.setItem('hris_setup_complete', 'true');
        toast.success('Setup completed successfully!');
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
            case 'holidays':
                return <HolidaysStep setupData={setupData} setSetupData={setSetupData} />;
            case 'shifts':
                return <WorkShiftsStep setupData={setupData} setSetupData={setSetupData} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 mx-auto space-y-6">
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
                        <StepIndicator currentStep={currentStep} />
                    </div>
                </CardContent>
            </Card>


            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation */}
            <Card>
                <CardContent className="pt-6">
                    <NavigationButtons
                        currentStep={currentStep}
                        onBack={handleBack}
                        onNext={handleNext}
                        onComplete={handleComplete}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default SetupManager;