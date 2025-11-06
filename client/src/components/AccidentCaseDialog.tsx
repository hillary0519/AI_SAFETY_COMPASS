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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{caseTitle}</DialogTitle>
        </DialogHeader>

        <Card className="bg-muted/30">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center text-muted-foreground py-12">
                <p className="text-lg">안전사고 사례 문서</p>
                <p className="text-sm mt-2">(상세 내용은 준비 중입니다)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
