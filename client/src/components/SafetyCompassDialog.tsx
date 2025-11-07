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

interface SafetyCompassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: (addConfinedSpace: boolean) => void;
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

      fetch('https://taeng.app.n8n.cloud/webhook-test/rag', {
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
    onOpenChange(false);
    onNext(addConfinedSpace);
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
