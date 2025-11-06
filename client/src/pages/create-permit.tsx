import { useState } from "react";
import type { WorkPermitInput, GeneratedPermit } from "@shared/schema";
import PermitInputForm from "@/components/PermitInputForm";
import PermitOutput from "@/components/PermitOutput";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useToast } from "@/hooks/use-toast";

export default function CreatePermit() {
  const [generatedPermit, setGeneratedPermit] = useState<GeneratedPermit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: WorkPermitInput) => {
    setIsLoading(true);
    console.log("Generating permit for:", data);

    // TODO: Remove mock functionality - Replace with actual API call
    setTimeout(() => {
      const mockPermit: GeneratedPermit = {
        procedures: [
          "전원 차단 및 잠금장치(LOTO) 설치",
          "작업구역 안전 펜스 설치 및 출입통제",
          "보호장비 착용 확인 (안전모, 절연장갑, 안전화)",
          "안전 감시자 배치 및 비상연락망 확인",
          `${data.equipmentName} 접근 및 작업 수행`,
          "작업 완료 후 청소 및 정리정돈",
          "테스트 시운전 실시 및 이상 유무 확인",
        ],
        hazards: [
          "전원 미차단 상태에서 접근 시 감전 위험",
          "작업장 바닥 미끄럼으로 인한 낙상 위험",
          "공구 낙하로 인한 상해 위험",
          "작업 중 협착 및 끼임 위험",
          "화재 발생 가능성",
        ],
        accidentTypes: ["감전", "낙상", "협착", "화재", "물체 낙하"],
        safetyMeasures: [
          "전원 차단 및 확인",
          "미끄럼 방지 매트 설치",
          "안전모 착용",
          "절연장갑 착용",
          "안전화 착용",
          "작업구역 출입통제",
          "소화기 비치",
          "안전 감시자 배치",
        ],
        riskAssessment: {
          complexity: 4,
          scope: 3,
          frequency: 2,
          overall: 3,
          reason: `${data.workType} 작업 특성상 감전 및 낙상 위험이 있으나, 적절한 안전조치 시 위험도 중간 수준으로 관리 가능`,
        },
        mitigationMeasures: [
          "작업 전 안전교육 실시 및 작업절차 숙지",
          "전원 차단 확인 절차 이중 점검",
          "작업구역 미끄럼방지 매트 설치 및 정리정돈",
          "안전 감시자 상시 배치 및 비상연락망 유지",
          "작업 전후 안전점검 체크리스트 작성",
        ],
      };

      setGeneratedPermit(mockPermit);
      setIsLoading(false);
      toast({
        title: "생성 완료",
        description: "안전작업허가서가 성공적으로 생성되었습니다.",
      });
    }, 2000);
  };

  const handleReset = () => {
    setGeneratedPermit(null);
    toast({
      title: "초기화 완료",
      description: "새로운 허가서를 작성할 수 있습니다.",
    });
  };

  const handleDownload = () => {
    // TODO: Remove mock functionality - Implement actual PDF generation
    toast({
      title: "다운로드 준비",
      description: "PDF 다운로드 기능은 곧 제공될 예정입니다.",
    });
    console.log("Download PDF");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-create-title">새 허가서 작성</h1>
        <p className="text-muted-foreground mt-1">작업 정보를 입력하고 안전작업허가서를 생성하세요</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <PermitInputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <div>
          {isLoading ? (
            <LoadingSkeleton />
          ) : generatedPermit ? (
            <PermitOutput
              permit={generatedPermit}
              onReset={handleReset}
              onDownload={handleDownload}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
