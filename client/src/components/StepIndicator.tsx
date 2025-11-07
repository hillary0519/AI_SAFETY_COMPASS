import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (stepNumber: number) => void;
}

export default function StepIndicator({ steps, currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  const isStepClickable = (stepNumber: number) => {
    if (!onStepClick) return false;
    if (stepNumber <= currentStep) return true;
    if (stepNumber === currentStep + 1 && completedSteps.includes(currentStep)) return true;
    return false;
  };

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isClickable = isStepClickable(step.number);
        const isCompleted = completedSteps.includes(step.number);
        
        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <button
                onClick={() => isClickable && onStepClick?.(step.number)}
                disabled={!isClickable}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : step.number === currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground"
                } ${isClickable ? 'cursor-pointer hover-elevate active-elevate-2' : 'cursor-not-allowed opacity-50'}`}
                data-testid={`step-${step.number}`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </button>
              <p
                className={`text-sm mt-2 ${
                  step.number === currentStep
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-0.5 mb-6 mx-2 ${
                  isCompleted ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
