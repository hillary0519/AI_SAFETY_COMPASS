import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Trash2 } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import RecentPermitsTable from "@/components/RecentPermitsTable";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { toast } = useToast();

  const handleClearHistory = async () => {
    try {
      const response = await fetch("/api/permits/clear", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear permits");
      }

      queryClient.invalidateQueries({ queryKey: ['/api/permits'] });
      
      toast({
        title: "초기화 완료",
        description: "모든 허가서 히스토리가 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        title: "초기화 실패",
        description: "히스토리 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">대시보드</h1>
          <p className="text-muted-foreground mt-1">안전작업허가서 현황을 확인하세요</p>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" data-testid="button-clear-history">
                <Trash2 className="w-4 h-4 mr-2" />
                초기화
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>모든 히스토리를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 모든 작업허가서 히스토리가 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-testid="button-cancel-clear">취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory} data-testid="button-confirm-clear">
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Link href="/create">
            <Button data-testid="button-create-new">
              <Plus className="w-4 h-4 mr-2" />
              새 허가서 작성
            </Button>
          </Link>
        </div>
      </div>

      <DashboardStats />

      <RecentPermitsTable />
    </div>
  );
}
