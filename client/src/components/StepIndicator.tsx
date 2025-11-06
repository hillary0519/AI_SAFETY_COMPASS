import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <button
              onClick={() => onStepClick?.(step.number)}
              disabled={!onStepClick}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                step.number < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : step.number === currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background border-border text-muted-foreground"
              } ${onStepClick ? 'cursor-pointer hover-elevate active-elevate-2' : ''}`}
              data-testid={`step-${step.number}`}
            >
              {step.number < currentStep ? (
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
                step.number < currentStep ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
