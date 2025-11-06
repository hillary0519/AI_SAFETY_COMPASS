import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SafetyCompassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: () => void;
}

export default function SafetyCompassDialog({
  open,
  onOpenChange,
  onNext,
}: SafetyCompassDialogProps) {
  const handleNext = () => {
    onOpenChange(false);
    onNext();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">AI COMPASS 분석 결과</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="font-semibold mb-1">ㅇ 과거 작업 이력</p>
            <p className="text-sm text-muted-foreground pl-4">
              동일 작업(#2 Conveyor PX-007 Sensor 교체) 7건 검색됨
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">ㅇ 설비 특성</p>
            <p className="text-sm text-muted-foreground pl-4">
              해당 설비는 Cellar실에 위치 → 밀폐공간 작업 추가 필요
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">ㅇ 기온 특성</p>
            <p className="text-sm text-muted-foreground pl-4">
              작업날짜 기준 기온 약 37°C, 온열질환 위험 존재
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">ㅇ 작업자 특성</p>
            <p className="text-sm text-muted-foreground pl-4">
              작업자 '홍길동'은 고혈압 기저질환 보유 → 온열질환 예방 조치 강화 필요
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg mt-6">
            <p className="text-sm text-center">
              □ 과거이력·설비·기온·건강상태를 기반으로 위험성평가를 수행합니다
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleNext} className="w-full" data-testid="button-compass-next">
            다음
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
