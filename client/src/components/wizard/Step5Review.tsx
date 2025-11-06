import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, FileText } from "lucide-react";
import { useState } from "react";
import AccidentCaseDialog from "@/components/AccidentCaseDialog";

interface ReviewData {
  workType: string;
  workName: string;
  workArea: string;
  workerName: string;
  department: string;
  workStartDate: string;
  workEndDate: string;
  riskScore: string;
  alerts: string[];
}

interface Step5Props {
  data: ReviewData;
}

const accidentCases = [
  {
    id: 1,
    title: "센서 교체시 감전사고",
    fileName: "파일명 #1: 센서 교체시 감전사고",
  },
  {
    id: 2,
    title: "센서 교체시 밀폐공간 질식사고",
    fileName: "파일명 #2: 센서 교체시 밀폐공간 질식사고",
  },
];

export default function Step5Review({ data }: Step5Props) {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);

  const formatDateTime = (datetime: string) => {
    if (!datetime) return "○ ○ ○";
    const date = new Date(datetime);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleCaseClick = (caseTitle: string) => {
    setSelectedCase(caseTitle);
    setCaseDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">📋 검토 및 제출</h2>
        <p className="text-muted-foreground">✅ 입력한 정보를 최종 확인하세요</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">작업 유형</p>
          <p className="font-semibold" data-testid="review-work-type">{data.workType || "○ ○ ○"}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">작업명</p>
          <p className="font-semibold" data-testid="review-work-name">{data.workName || "○ ○ ○"}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">작업 위치</p>
          <p className="font-semibold" data-testid="review-work-area">{data.workArea || "○ ○ ○"}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">설비명</p>
          <p className="font-semibold" data-testid="review-equipment">○ ○ ○</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">작업자</p>
          <p className="font-semibold" data-testid="review-worker">{data.workerName || "○ ○ ○"}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">부서</p>
          <p className="font-semibold" data-testid="review-department">{data.department || "○ ○ ○"}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">작업 시작</p>
          <p className="font-semibold" data-testid="review-start-date">{formatDateTime(data.workStartDate)}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">작업 종료</p>
          <p className="font-semibold" data-testid="review-end-date">{formatDateTime(data.workEndDate)}</p>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg max-w-3xl">
        <p className="text-sm font-medium">안전 점검 항목: {data.riskScore}</p>
      </div>

      {data.alerts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5 max-w-3xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-semibold text-destructive">추천 안전사고 사례</p>
                {data.alerts.map((alert, index) => (
                  <p key={index} className="text-sm">
                    #{index + 1} {alert}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="max-w-3xl">
        <CardContent className="p-4">
          <div className="space-y-3">
            <p className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              🔹 안전사고 사례
            </p>
            <div className="space-y-2 pl-6">
              {accidentCases.map((accidentCase) => (
                <div key={accidentCase.id}>
                  <button
                    onClick={() => handleCaseClick(accidentCase.title)}
                    className="text-sm text-primary hover:underline cursor-pointer text-left"
                    data-testid={`link-accident-case-${accidentCase.id}`}
                  >
                    • {accidentCase.fileName}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AccidentCaseDialog
        open={caseDialogOpen}
        onOpenChange={setCaseDialogOpen}
        caseTitle={selectedCase || ""}
      />
    </div>
  );
}
