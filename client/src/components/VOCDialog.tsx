import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface VOCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (comment: string) => void;
}

export default function VOCDialog({
  open,
  onOpenChange,
  onSubmit,
}: VOCDialogProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit(comment);
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">VOC (고객의 소리)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="voc-comment">
              AI가 생성한 결과물에 대한 피드백을 작성해주세요
            </Label>
            <Textarea
              id="voc-comment"
              placeholder="개선사항, 문제점, 의견 등을 자유롭게 작성해주세요..."
              className="min-h-32"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              data-testid="textarea-voc-comment"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            ※ 작성하신 피드백은 AI 모델 개선에 활용됩니다.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-voc-cancel"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            data-testid="button-voc-submit"
          >
            최종 제출
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
