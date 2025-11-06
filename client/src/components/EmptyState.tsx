import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function EmptyState() {
  return (
    <Card className="h-[600px] flex items-center justify-center">
      <CardContent className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">안전작업허가서 미리보기</h3>
          <p className="text-sm text-muted-foreground">
            작업 정보를 입력하고 생성 버튼을 눌러주세요
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
