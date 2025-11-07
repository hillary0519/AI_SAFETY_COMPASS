import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface BasicInfo {
  workName: string;
  workArea: string;
  equipmentName: string;
  workerName: string;
  department: string;
  workStartDate: string;
  workEndDate: string;
  workDescription: string;
}

interface SafetyCompassResult {
  addConfinedSpace: boolean;
  step3Data: any;
}

interface SafetyCompassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: (result: SafetyCompassResult) => void;
  workInfo: BasicInfo;
}

export default function SafetyCompassDialog({
  open,
  onOpenChange,
  onNext,
  workInfo,
}: SafetyCompassDialogProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [addConfinedSpace, setAddConfinedSpace] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setAcknowledged(false);
      setAddConfinedSpace(false);
      setIsLoading(true);
      setError(null);
      setAnalysisResult(null);

      const query = `작업명: ${workInfo.workName}\n설비명: ${workInfo.equipmentName}\n작업자: ${workInfo.workerName}\n작업 내용: ${workInfo.workDescription}`;
      const city = workInfo.workArea;

      fetch('https://taeng.app.n8n.cloud/webhook/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, city }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch analysis');
          }
          return response.json();
        })
        .then((data) => {
          setAnalysisResult(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Safety Compass API error:', err);
          setError('분석 결과를 가져오는데 실패했습니다.');
          setIsLoading(false);
        });
    }
  }, [open, workInfo]);

  const handleNext = () => {
    const step3Data = {
      hazardPoints: {
        general: "이동시 실내 주변 이동에 의한 전도 위험",
        electrical: "전원 미차단(AC 110V)에 의한 감전 위험",
        confined: "산소 농도 저하에 의한 질식 위험"
      },
      requirements1: ["산소/유해/가연성 가스 측정", "송배풍기 설치", "전기차단/표시부착", "작업구역 표시"],
      requirements2: ["작업감시자 배치(화기/밀폐)"],
      equipment: ["안전보호구"],
      protective: ["안전모/안전화", "보안경"],
      riskAssessments: [
        {
          id: 1,
          procedure: "작업 전 위험성 평가 및 밀폐공간 허가서 작성",
          hazard: "위험요인 미파악, 신입자 이해 부족",
          accident: "부적절한 안전조치로 인한 사고",
          f: 3,
          c: 3,
          r: 9,
          mitigation: "신입자 대상 밀폐작업 안전교육 실시"
        },
        {
          id: 2,
          procedure: "작업장 환기 및 가스농도 측정",
          hazard: "산소결핍, 유해가스(O₂<18%)",
          accident: "질식, 의식소실",
          f: 2,
          c: 5,
          r: 10,
          mitigation: "불티팬 설치, 산소농도 측정기 사용, 농도기록 유지, 30분 간격 재측정"
        },
        {
          id: 3,
          procedure: "전원차단 및 Lock-Out / Tag-Out 실시",
          hazard: "전원차단 미이행, 타회선 감전",
          accident: "감전사고, 화상",
          f: 3,
          c: 3,
          r: 9,
          mitigation: "MCC 전원차단 후 LOTO 부착, 감전방지장갑·절연장구 사용, 담당자 확인서명"
        },
        {
          id: 4,
          procedure: "Sensor 탈거 작업",
          hazard: "오염 누유, 바닥 미끄러움",
          accident: "골절, 안전, 타박상",
          f: 3,
          c: 2,
          r: 6,
          mitigation: "흡유포 설치, 안전화 착용, 발판 고정, 바닥청소 철저"
        },
        {
          id: 5,
          procedure: "Sensor 결선 및 전선 접속",
          hazard: "전열발열, 절연불량, 접속공간 자세",
          accident: "감전, 근골격계 질환",
          f: 3,
          c: 3,
          r: 9,
          mitigation: "절연테이프 보강, 전원 차단확인, 스트레칭/휴식 병행"
        },
        {
          id: 6,
          procedure: "고열환경에서의 작업 지속",
          hazard: "더위, 체온상승, 탈수",
          accident: "열사병, 실신",
          f: 2,
          c: 3,
          r: 6,
          mitigation: "휴식 및 수분섭취 1시간 1회, 송풍기 가동, 냉타올 비치, 폭염 시 작업중지"
        },
        {
          id: 7,
          procedure: "협소공간 내 이동 및 작업자 교대",
          hazard: "시야제한, 케이블 걸림",
          accident: "낙상, 전도",
          f: 3,
          c: 3,
          r: 9,
          mitigation: "케이블 정리, 조명 확보기, 2인 1조 작업, 접근로 확보"
        },
        {
          id: 8,
          procedure: "교체 후 전원 투입 전 점검",
          hazard: "전원 조기투입, 접지불량",
          accident: "감전, 장비손상",
          f: 3,
          c: 3,
          r: 9,
          mitigation: "접선, 절연저항계, 계측기 사용"
        },
        {
          id: 9,
          procedure: "작업후 청소 및 장비 원위치",
          hazard: "바닥 오염잔류, 도구 방치",
          accident: "전도, 낙상",
          f: 2,
          c: 3,
          r: 6,
          mitigation: "청소장소 및 도구 정리 후 확인서명, 정리정돈 점검"
        },
        {
          id: 10,
          procedure: "작업종료 보고 및 허가서 회수",
          hazard: "보고 누락, 허가서 미회수",
          accident: "관리 부실, 재발 방지 실패",
          f: 1,
          c: 3,
          r: 3,
          mitigation: "작업종료 보고서 작성, 허가서 회수 후 보관"
        }
      ]
    };

    onOpenChange(false);
    onNext({
      addConfinedSpace,
      step3Data
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">AI COMPASS 분석 결과</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">AI 분석 중...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                기본 분석 결과를 사용합니다.
              </p>
            </div>
          )}

          {!isLoading && (
            <>
              <div>
                <p className="font-semibold mb-1">ㅇ 과거 작업 이력</p>
                <p className="text-sm text-muted-foreground pl-4">
                  {analysisResult?.workHistory || '동일 작업(#2 Conveyor PX-007 Sensor 교체) 7건 검색됨'}
                </p>
              </div>

              <div>
                <p className="font-semibold mb-1">ㅇ 설비 특성</p>
                <p className="text-sm text-muted-foreground pl-4">
                  {analysisResult?.equipmentFeatures || '해당 설비는 Cellar실에 위치 → 밀폐공간 작업 추가 필요'}
                </p>
              </div>

              <div>
                <p className="font-semibold mb-1">ㅇ 작업자 특성</p>
                <p className="text-sm text-muted-foreground pl-4">
                  {analysisResult?.workerFeatures || `작업자 '${workInfo.workerName}'은 고혈압 기저질환 보유 → 온열질환 예방 조치 강화 필요`}
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg mt-6 space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Checkbox 
                    id="compass-acknowledge" 
                    checked={acknowledged}
                    onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
                    data-testid="checkbox-compass-acknowledge"
                  />
                  <label 
                    htmlFor="compass-acknowledge" 
                    className="text-sm cursor-pointer select-none"
                  >
                    과거이력·설비·건강상태를 기반으로 위험성평가를 수행합니다
                  </label>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Checkbox 
                    id="compass-add-confined-space" 
                    checked={addConfinedSpace}
                    onCheckedChange={(checked) => setAddConfinedSpace(checked as boolean)}
                    data-testid="checkbox-add-confined-space"
                  />
                  <label 
                    htmlFor="compass-add-confined-space" 
                    className="text-sm cursor-pointer select-none"
                  >
                    설비 특성 반영하여 작업 유형에 「밀폐공간작업」을 추가합니다.
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button 
            onClick={handleNext} 
            className="w-full" 
            disabled={!acknowledged || isLoading}
            data-testid="button-compass-next"
          >
            다음
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
