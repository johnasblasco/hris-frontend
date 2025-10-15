import React from 'react';
import { CheckCircle } from 'lucide-react';
import { setupSteps } from './constants';

interface StepIndicatorProps {
    currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
    return (
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
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                                    ? 'bg-green-100 text-green-600'
                                    : isCurrent
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-slate-100 text-slate-400'
                                }`}
                        >
                            {isCompleted ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <StepIcon className="w-5 h-5" />
                            )}
                        </div>
                        <span
                            className={`text-xs text-center ${isCurrent ? 'font-medium' : 'text-muted-foreground'
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};