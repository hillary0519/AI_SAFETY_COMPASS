import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import Step1WorkTypeSelection from "@/components/wizard/Step1WorkTypeSelection";
import Step2BasicInfo from "@/components/wizard/Step2BasicInfo";
import Step3SafetyCheck from "@/components/wizard/Step3SafetyCheck";
import Step4RiskAssessment from "@/components/wizard/Step4RiskAssessment";
import Step5Review from "@/components/wizard/Step5Review";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const steps = [
  { number: 1, title: "작업 유형 선택" },
  { number: 2, title: "기본 정보" },
  { number: 3, title: "안전 점검" },
  { number: 4, title: "검토 및 제출" },
];

export default function CreatePermit() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [workType, setWorkType] = useState("");
  const [basicInfo, setBasicInfo] = useState({
    workName: "",
    workArea: "",
    equipmentName: "",
    workerName: "",
    department: "",
    workStartDate: "",
    workEndDate: "",
    workDescription: "",
  });
  const [safetyChecks, setSafetyChecks] = useState({
    requirements1: [] as string[],
    requirements2: [] as string[],
  });

  const handleBasicInfoChange = (field: keyof typeof basicInfo, value: string) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSafetyToggle = (category: keyof typeof safetyChecks, item: string) => {
    setSafetyChecks((prev) => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter((i) => i !== item)
        : [...prev[category], item],
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !workType) {
      toast({
        title: "작업 유형을 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // TODO: Remove mock functionality - Implement actual submission
      toast({
        title: "제출 완료",
        description: "안전작업허가서가 성공적으로 생성되었습니다.",
      });
      console.log("Submitting:", { workType, basicInfo, safetyChecks });
      setLocation("/");
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1WorkTypeSelection selectedType={workType} onSelect={setWorkType} />;
      case 2:
        return <Step2BasicInfo data={basicInfo} onChange={handleBasicInfoChange} />;
      case 3:
        return <Step3SafetyCheck data={safetyChecks} onToggle={handleSafetyToggle} />;
      case 4:
        return (
          <Step5Review
            data={{
              workType,
              workName: basicInfo.workName,
              workArea: basicInfo.workArea,
              workerName: basicInfo.workerName,
              department: basicInfo.department,
              workStartDate: basicInfo.workStartDate,
              workEndDate: basicInfo.workEndDate,
              riskScore: `${safetyChecks.requirements1.length + safetyChecks.requirements2.length}/28 항목`,
              alerts: [
                "광양 4열연공장 개구부 덮어짐",
                "광양 압연실비나부 관3열연공장 차단기 인출 후 단독으로 절차 작업 중 아크 화상",
              ],
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-create-title">
          새 안전작업허가서 작성
        </h1>
        <p className="text-muted-foreground mt-1">
          필수 정보를 입력하고 안전 점검 사항을 확인하세요
        </p>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="min-h-[500px]">{renderStep()}</div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 1}
          data-testid="button-prev"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          이전
        </Button>

        <Button onClick={handleNext} data-testid="button-next">
          {currentStep === 4 ? "제출하기" : "다음"}
          {currentStep < 4 && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
