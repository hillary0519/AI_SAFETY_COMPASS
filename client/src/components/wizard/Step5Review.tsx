import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import AccidentCaseDialog from "@/components/AccidentCaseDialog";
import { useQuery } from "@tanstack/react-query";

interface AccidentCase {
  id: number;
  작업유형: string;
  기인물: string;
  설비명: string;
  재해발생일: string;
  시간: string;
  재해유형: string;
  사고명: string;
  나이: string;
  근속: string;
  재해정도: string;
  발생상황: string;
  발생원인: string;
  시사점: string;
}

interface ReviewData {
  workType: string;
  workTypes: string[];
  workName: string;
  workArea: string;
  equipmentName: string;
  workerName: string;
  department: string;
  workStartDate: string;
  workEndDate: string;
  workDescription: string;
  riskScore: string;
  alerts: string[];
}

interface Step5Props {
  data: ReviewData;
  onCasesViewed: (viewedAll: boolean) => void;
}

export default function Step5Review({ data, onCasesViewed }: Step5Props) {
  const [selectedCase, setSelectedCase] = useState<AccidentCase | null>(null);
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const [viewedCases, setViewedCases] = useState<Set<number>>(new Set());

  // Fetch similar accident cases using RAG
  const { data: similarCases = [], isLoading, isError } = useQuery<AccidentCase[]>({
    queryKey: ['/api/accident-cases/similar', data.workTypes, data.workName],
    queryFn: async () => {
      const response = await fetch('/api/accident-cases/similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workTypes: data.workTypes || [],
          workName: data.workName || '',
          workDescription: data.workDescription || '',
          equipmentName: data.equipmentName || '',
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch similar cases');
      }
      return response.json();
    },
    enabled: data.workTypes && data.workTypes.length > 0,
  });

  // Auto-mark as viewed when no cases are found or error occurs
  useEffect(() => {
    if (!isLoading && (similarCases.length === 0 || isError)) {
      onCasesViewed(true);
    }
  }, [isLoading, similarCases.length, isError, onCasesViewed]);

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

  const handleCaseClick = (accidentCase: AccidentCase) => {
    setSelectedCase(accidentCase);
    setCaseDialogOpen(true);
    
    const newViewedCases = new Set(viewedCases);
    newViewedCases.add(accidentCase.id);
    setViewedCases(newViewedCases);
    
    // Check if all cases have been viewed
    onCasesViewed(newViewedCases.size === similarCases.length);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">검토 및 제출</h2>
        <p className="text-muted-foreground">입력한 정보를 최종 확인하세요</p>
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
          <p className="font-semibold" data-testid="review-equipment">{data.equipmentName || "○ ○ ○"}</p>
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

      {/* Similar Accident Cases */}
      <Card className="border-destructive/50 bg-destructive/5 max-w-3xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="space-y-3 w-full">
              <p className="font-semibold text-destructive">추천 안전사고 사례</p>
              
              {isLoading ? (
                <div className="text-sm text-muted-foreground">유사 사고 사례를 검색 중입니다...</div>
              ) : isError ? (
                <div className="text-sm text-destructive">
                  사고 사례를 불러오는 중 오류가 발생했습니다. 계속 진행하실 수 있습니다.
                </div>
              ) : similarCases.length > 0 ? (
                <div className="space-y-2">
                  {similarCases.map((accidentCase) => (
                    <div 
                      key={accidentCase.id} 
                      className="border border-destructive/30 rounded-md p-3 bg-background hover-elevate"
                      data-testid={`accident-case-${accidentCase.id}`}
                    >
                      <button
                        onClick={() => handleCaseClick(accidentCase)}
                        className="text-left w-full"
                        data-testid={`link-accident-case-${accidentCase.id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-destructive hover:underline">
                              {accidentCase.사고명}
                              {viewedCases.has(accidentCase.id) && (
                                <span className="ml-2 text-green-600">✓</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {accidentCase.재해유형} • {accidentCase.재해정도} • {accidentCase.재해발생일}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  이 작업과 유사한 사고 사례를 찾을 수 없습니다. 계속 진행하실 수 있습니다.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AccidentCaseDialog
        open={caseDialogOpen}
        onOpenChange={setCaseDialogOpen}
        accidentCase={selectedCase}
      />
    </div>
  );
}
