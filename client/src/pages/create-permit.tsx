import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import Step1WorkTypeSelection from "@/components/wizard/Step1WorkTypeSelection";
import Step2BasicInfo from "@/components/wizard/Step2BasicInfo";
import Step3SafetyCheck from "@/components/wizard/Step3SafetyCheck";
import Step5Review from "@/components/wizard/Step5Review";
import SignatureDialog from "@/components/SignatureDialog";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { number: 1, title: "🦺 작업 유형 선택" },
  { number: 2, title: "📝 기본 정보" },
  { number: 3, title: "✅ 안전 점검" },
  { number: 4, title: "📋 검토 및 제출" },
];

const DRAFT_STORAGE_KEY = "permit_draft";

export default function CreatePermit() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

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

  // 임시저장 불러오기
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      setHasDraft(true);
    }
  }, []);

  // 자동 임시저장 (변경사항이 있을 때마다)
  useEffect(() => {
    const draftData = {
      currentStep,
      workTypes,
      basicInfo,
      safetyChecks,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
  }, [currentStep, workTypes, basicInfo, safetyChecks]);

  const loadDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setCurrentStep(draft.currentStep || 1);
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

  const handleCompassNext = () => {
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

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setSignatureOpen(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    toast({
      title: "제출 완료",
      description: "안전작업허가서가 성공적으로 생성되었습니다.",
    });
    console.log("Submitting:", { workTypes, basicInfo, safetyChecks });
    setLocation("/");
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
        return <Step3SafetyCheck data={safetyChecks} onToggle={handleSafetyToggle} />;
      case 4:
        return (
          <Step5Review
            data={{
              workType: workTypes.join(", "),
              workName: basicInfo.workName,
              workArea: basicInfo.workArea,
              workerName: basicInfo.workerName,
              department: basicInfo.department,
              workStartDate: basicInfo.workStartDate,
              workEndDate: basicInfo.workEndDate,
              riskScore: `${
                safetyChecks.requirements1.length +
                safetyChecks.requirements2.length +
                safetyChecks.equipment.length +
                safetyChecks.protective.length
              }/28 항목`,
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-create-title">
            📝 새 안전작업허가서 작성
          </h1>
          <p className="text-muted-foreground mt-1">
            ✅ 필수 정보를 입력하고 안전 점검 사항을 확인하세요
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
              <p className="text-sm font-medium">💾 작성 중인 임시저장본이 있습니다.</p>
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

      <SignatureDialog
        open={signatureOpen}
        onOpenChange={setSignatureOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
