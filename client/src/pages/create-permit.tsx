import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import Step1WorkTypeSelection from "@/components/wizard/Step1WorkTypeSelection";
import Step2BasicInfo from "@/components/wizard/Step2BasicInfo";
import Step3SafetyCheck from "@/components/wizard/Step3SafetyCheck";
import Step4Review from "@/components/wizard/Step5Review";
import SignatureDialog from "@/components/SignatureDialog";
import VOCDialog from "@/components/VOCDialog";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { queryClient } from "@/lib/queryClient";

const steps = [
  { number: 1, title: "작업 유형 선택" },
  { number: 2, title: "기본 정보" },
  { number: 3, title: "안전 점검" },
  { number: 4, title: "검토 및 제출" },
];

const DRAFT_STORAGE_KEY = "permit_draft";

export default function CreatePermit() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasDraft, setHasDraft] = useState(false);
  const [casesViewedAll, setCasesViewedAll] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [vocDialogOpen, setVocDialogOpen] = useState(false);
  const [signatureData, setSignatureData] = useState<string>("");

  const [workTypes, setWorkTypes] = useState<string[]>([]);
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
    equipment: [] as string[],
    protective: [] as string[],
  });
  const [step3DetailData, setStep3DetailData] = useState<any>(null);

  // 임시저장 불러오기
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      setHasDraft(true);
    }
  }, []);

  // 각 단계의 유효성 변경 시 completedSteps 업데이트
  useEffect(() => {
    if (workTypes.length === 0 && completedSteps.includes(1)) {
      setCompletedSteps(prev => prev.filter(s => s !== 1));
    }
  }, [workTypes, completedSteps]);

  useEffect(() => {
    if (!casesViewedAll && completedSteps.includes(4)) {
      setCompletedSteps(prev => prev.filter(s => s !== 4));
    }
  }, [casesViewedAll, completedSteps]);

  // 자동 임시저장 (변경사항이 있을 때마다)
  useEffect(() => {
    const draftData = {
      currentStep,
      completedSteps,
      workTypes,
      basicInfo,
      safetyChecks,
      step3DetailData,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
  }, [currentStep, completedSteps, workTypes, basicInfo, safetyChecks, step3DetailData]);

  const loadDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setCurrentStep(draft.currentStep || 1);
      setCompletedSteps(draft.completedSteps || []);
      setWorkTypes(draft.workTypes || []);
      setBasicInfo(draft.basicInfo || {
        workName: "",
        workArea: "",
        equipmentName: "",
        workerName: "",
        department: "",
        workStartDate: "",
        workEndDate: "",
        workDescription: "",
      });
      setSafetyChecks(draft.safetyChecks || {
        requirements1: [],
        requirements2: [],
        equipment: [],
        protective: [],
      });
      setStep3DetailData(draft.step3DetailData || null);
      setHasDraft(false);
      toast({
        title: "임시저장본 불러오기",
        description: "저장된 작업을 불러왔습니다.",
      });
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
    toast({
      title: "새로 작성",
      description: "새로운 허가서를 작성합니다.",
    });
  };

  const handleWorkTypeToggle = (type: string) => {
    setWorkTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

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

  const isStepValid = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return workTypes.length > 0;
      case 2:
        return completedSteps.includes(2);
      case 3:
        return step3DetailData !== null;
      case 4:
        return casesViewedAll;
      default:
        return false;
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      return;
    }

    if (stepNumber === currentStep) {
      return;
    }

    if (stepNumber > currentStep + 1) {
      toast({
        title: "순서대로 진행해주세요",
        description: "이전 단계를 먼저 완료해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!isStepValid(currentStep)) {
      switch (currentStep) {
        case 1:
          toast({
            title: "작업 유형을 선택해주세요",
            variant: "destructive",
          });
          break;
        case 2:
          toast({
            title: "Safety Compass를 완료해주세요",
            description: "2단계에서 Safety Compass를 완료해야 다음 단계로 진행할 수 있습니다.",
            variant: "destructive",
          });
          break;
        case 3:
          toast({
            title: "안전 점검을 완료해주세요",
            variant: "destructive",
          });
          break;
        case 4:
          toast({
            title: "안전사고 사례를 모두 확인해주세요",
            variant: "destructive",
          });
          break;
      }
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    setCurrentStep(stepNumber);
  };

  const handleCompassNext = (result: { addConfinedSpace: boolean; step3Data: any }) => {
    if (result.addConfinedSpace && !workTypes.includes("밀폐공간작업")) {
      setWorkTypes((prev) => [...prev, "밀폐공간작업"]);
      toast({
        title: "작업유형에 '밀폐공간작업'을 추가했습니다.",
        className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
      });
    }
    
    setStep3DetailData(result.step3Data);
    
    setSafetyChecks({
      requirements1: result.step3Data.requirements1,
      requirements2: result.step3Data.requirements2,
      equipment: result.step3Data.equipment,
      protective: result.step3Data.protective,
    });
    
    if (!completedSteps.includes(2)) {
      setCompletedSteps((prev) => [...prev, 2]);
    }
    if (!completedSteps.includes(3)) {
      setCompletedSteps((prev) => [...prev, 3]);
    }
    setCurrentStep(3);
  };

  const handleNext = () => {
    if (currentStep === 1 && workTypes.length === 0) {
      toast({
        title: "작업 유형을 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 1) {
      if (!completedSteps.includes(1)) {
        setCompletedSteps((prev) => [...prev, 1]);
      }
    }

    if (currentStep === 3) {
      if (!completedSteps.includes(3)) {
        setCompletedSteps((prev) => [...prev, 3]);
      }
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Step 4: Check if all cases have been viewed
      if (!casesViewedAll) {
        toast({
          title: "안전사고 사례를 모두 확인해주세요",
          description: "두 개의 안전사고 사례를 모두 클릭하여 확인해야 제출할 수 있습니다.",
          variant: "destructive",
        });
        return;
      }
      // Open signature dialog first
      setSignatureDialogOpen(true);
    }
  };

  const handleSignatureSubmit = (signature: string) => {
    setSignatureData(signature);
    // After signature, open VOC dialog
    setVocDialogOpen(true);
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (vocComment: string) => {
    try {
      // Submit permit to backend
      const response = await fetch("/api/permits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workType: workTypes.join(", "),
          workName: basicInfo.workName,
          workArea: basicInfo.workArea,
          equipmentName: basicInfo.equipmentName,
          workerName: basicInfo.workerName,
          department: basicInfo.department,
          workStartDate: basicInfo.workStartDate,
          workEndDate: basicInfo.workEndDate,
          workDescription: basicInfo.workDescription,
          safetyChecks,
          vocComment,
          status: "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit permit");
      }

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      
      // Invalidate permits query to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['/api/permits'] });
      
      toast({
        title: "제출 완료",
        description: "안전작업허가서가 성공적으로 생성되었습니다.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "제출 실패",
        description: "허가서 제출 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1WorkTypeSelection selectedTypes={workTypes} onToggle={handleWorkTypeToggle} />
        );
      case 2:
        return (
          <Step2BasicInfo
            data={basicInfo}
            onChange={handleBasicInfoChange}
            onCompassNext={handleCompassNext}
          />
        );
      case 3:
        return <Step3SafetyCheck data={safetyChecks} onToggle={handleSafetyToggle} step3DetailData={step3DetailData} />;
      case 4:
        return (
          <Step4Review
            data={{
              workType: workTypes.join(", "),
              workTypes: workTypes,
              workName: basicInfo.workName,
              workArea: basicInfo.workArea,
              equipmentName: basicInfo.equipmentName,
              workerName: basicInfo.workerName,
              department: basicInfo.department,
              workStartDate: basicInfo.workStartDate,
              workEndDate: basicInfo.workEndDate,
              workDescription: basicInfo.workDescription,
              riskScore: `${
                safetyChecks.requirements1.length +
                safetyChecks.requirements2.length +
                safetyChecks.equipment.length +
                safetyChecks.protective.length
              }/28 항목`,
              alerts: [],
            }}
            onCasesViewed={setCasesViewedAll}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center py-4 bg-primary/5 rounded-lg">
        <p className="text-lg font-semibold text-primary" data-testid="text-safety-quote">
          "당신의 안전이 가족의 미소를 지킵니다."
        </p>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-create-title">
            새 안전작업허가서 작성
          </h1>
          <p className="text-muted-foreground mt-1">
            필수 정보를 입력하고 안전 점검 사항을 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled
            data-testid="button-auto-save"
          >
            <Save className="w-4 h-4" />
            자동 저장됨
          </Button>
        </div>
      </div>

      {hasDraft && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">작성 중인 임시저장본이 있습니다.</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearDraft}
                  data-testid="button-clear-draft"
                >
                  새로 작성
                </Button>
                <Button
                  size="sm"
                  onClick={loadDraft}
                  data-testid="button-load-draft"
                >
                  이어서 작성
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <StepIndicator 
        steps={steps} 
        currentStep={currentStep} 
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <div className="min-h-[500px]">{renderStep()}</div>

      <div className="pt-6 border-t space-y-4">
        <p className="text-xs text-center text-muted-foreground" data-testid="text-disclaimer">
          Safety Compass도 실수를 할 수 있습니다. 중요한 정보는 반드시 확인하세요.
        </p>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            data-testid="button-prev"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            이전
          </Button>

          {currentStep !== 2 && (
            <Button onClick={handleNext} data-testid="button-next">
              {currentStep === 4 ? "제출하기" : "다음"}
              {currentStep < 4 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>
      </div>

      <SignatureDialog
        open={signatureDialogOpen}
        onOpenChange={setSignatureDialogOpen}
        onSubmit={handleSignatureSubmit}
      />

      <VOCDialog
        open={vocDialogOpen}
        onOpenChange={setVocDialogOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
