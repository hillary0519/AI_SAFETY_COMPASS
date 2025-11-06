import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface AccidentCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseTitle: string;
}

export default function AccidentCaseDialog({
  open,
  onOpenChange,
  caseTitle,
}: AccidentCaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col" data-testid="dialog-accident-case">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{caseTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-2">
            <h3 className="font-bold text-base">발생 일시</h3>
            <div className="border-b pb-4"></div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base">발생 장소</h3>
            <div className="border-b pb-4"></div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base">사고 유형</h3>
            <div className="border-b pb-4"></div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base">사고 개요</h3>
            <div className="border-b pb-12"></div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base">원인 분석</h3>
            <div className="border-b pb-12"></div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base">재발 방지 대책</h3>
            <div className="border-b pb-12"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
