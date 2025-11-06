import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import RecentPermitsTable from "@/components/RecentPermitsTable";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">대시보드</h1>
          <p className="text-muted-foreground mt-1">안전작업허가서 현황을 확인하세요</p>
        </div>
        <Link href="/create">
          <Button data-testid="button-create-new">
            <Plus className="w-4 h-4 mr-2" />
            새 허가서 작성
          </Button>
        </Link>
      </div>

      <DashboardStats />

      <RecentPermitsTable />
    </div>
  );
}
