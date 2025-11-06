import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Clock, HardHat, MapPin } from "lucide-react";

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

interface AccidentCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accidentCase: AccidentCase | null;
}

export default function AccidentCaseDialog({
  open,
  onOpenChange,
  accidentCase,
}: AccidentCaseDialogProps) {
  if (!accidentCase) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    if (severity === "중대재해") return "destructive";
    if (severity === "업무상 재해") return "default";
    return "secondary";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col" data-testid="dialog-accident-case">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">{accidentCase.사고명}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4 overflow-y-auto flex-1 min-h-0">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">발생일:</span>
              <span className="text-sm font-medium">{accidentCase.재해발생일}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">발생시간:</span>
              <span className="text-sm font-medium">{accidentCase.시간 || "미상"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">설비명:</span>
              <span className="text-sm font-medium">{accidentCase.설비명}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardHat className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">작업유형:</span>
              <Badge variant="outline" className="text-xs">{accidentCase.작업유형}</Badge>
            </div>
          </div>

          {/* 재해 유형 및 정도 */}
          <div className="flex gap-2 items-center">
            <Badge variant={getSeverityColor(accidentCase.재해정도)}>
              {accidentCase.재해정도}
            </Badge>
            <Badge variant="secondary">{accidentCase.재해유형}</Badge>
            <Badge variant="outline">{accidentCase.기인물}</Badge>
          </div>

          {/* 피해자 정보 */}
          <div className="grid grid-cols-2 gap-4 p-3 border rounded-lg">
            <div>
              <span className="text-sm text-muted-foreground">나이: </span>
              <span className="text-sm font-medium">{accidentCase.나이}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">근속: </span>
              <span className="text-sm font-medium">{accidentCase.근속}</span>
            </div>
          </div>

          {/* 발생 상황 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              발생 상황
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{accidentCase.발생상황}</p>
            </div>
          </div>

          {/* 발생 원인 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base">발생 원인</h3>
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-destructive">
                {accidentCase.발생원인}
              </p>
            </div>
          </div>

          {/* 시사점 (재발 방지 대책) */}
          <div className="space-y-2">
            <h3 className="font-bold text-base">시사점 및 재발 방지 대책</h3>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-primary">
                {accidentCase.시사점}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
