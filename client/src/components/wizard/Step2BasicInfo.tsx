import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { useState } from "react";
import SafetyCompassDialog from "@/components/SafetyCompassDialog";

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

interface Step2Props {
  data: BasicInfo;
  onChange: (field: keyof BasicInfo, value: string) => void;
  onCompassNext: (addConfinedSpace: boolean) => void;
}

export default function Step2BasicInfo({ data, onChange, onCompassNext }: Step2Props) {
  const [compassOpen, setCompassOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">기본 정보 입력</h2>
        <p className="text-muted-foreground">작업에 대한 상세 정보를 입력하세요</p>
      </div>

      <div className="space-y-4 max-w-3xl">
        <div className="space-y-2">
          <Label htmlFor="workName">작업명</Label>
          <Input
            id="workName"
            placeholder="예: 냉각탑 점검 작업"
            value={data.workName}
            onChange={(e) => onChange("workName", e.target.value)}
            data-testid="input-work-name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workArea">작업 위치</Label>
            <Input
              id="workArea"
              placeholder="예: 3공장 옥상"
              value={data.workArea}
              onChange={(e) => onChange("workArea", e.target.value)}
              data-testid="input-work-area"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipmentName">설비명</Label>
            <Input
              id="equipmentName"
              placeholder="예: Conveyor PX-007"
              value={data.equipmentName}
              onChange={(e) => onChange("equipmentName", e.target.value)}
              data-testid="input-equipment-name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workerName">작업자명</Label>
            <Input
              id="workerName"
              placeholder="예: 김철수"
              value={data.workerName}
              onChange={(e) => onChange("workerName", e.target.value)}
              data-testid="input-worker-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">부서</Label>
            <Input
              id="department"
              placeholder="예: 시설팀"
              value={data.department}
              onChange={(e) => onChange("department", e.target.value)}
              data-testid="input-department"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workStartDate">작업 시작 일시</Label>
            <Input
              id="workStartDate"
              type="datetime-local"
              value={data.workStartDate}
              onChange={(e) => onChange("workStartDate", e.target.value)}
              data-testid="input-work-start-date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workEndDate">작업 종료 일시</Label>
            <Input
              id="workEndDate"
              type="datetime-local"
              value={data.workEndDate}
              onChange={(e) => onChange("workEndDate", e.target.value)}
              data-testid="input-work-end-date"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workDescription">작업 내용</Label>
          <Textarea
            id="workDescription"
            placeholder="작업 내용을 상세히 설명해주세요"
            className="min-h-32 resize-none"
            value={data.workDescription}
            onChange={(e) => onChange("workDescription", e.target.value)}
            data-testid="textarea-work-description"
          />
        </div>

        <div className="pt-4">
          <Button
            className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setCompassOpen(true)}
            data-testid="button-safety-compass"
          >
            <Compass className="w-8 h-8 mr-3 text-yellow-300" />
            Safety Compass
          </Button>
        </div>
      </div>

      <SafetyCompassDialog
        open={compassOpen}
        onOpenChange={setCompassOpen}
        onNext={onCompassNext}
      />
    </div>
  );
}
