import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { WorkPermit } from "@shared/schema";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}

function StatCard({ title, value, icon, bgColor }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <p className="text-3xl font-bold" data-testid={`stat-${title}`}>{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardStats() {
  const { data: permits } = useQuery<WorkPermit[]>({
    queryKey: ['/api/permits'],
    queryFn: async () => {
      const response = await fetch('/api/permits');
      if (!response.ok) throw new Error('Failed to fetch permits');
      return response.json();
    },
  });

  const pendingCount = permits?.filter(p => p.status === 'pending').length || 0;
  const totalCount = permits?.length || 0;
  const approvedCount = permits?.filter(p => p.status === 'approved').length || 0;
  const rejectedCount = permits?.filter(p => p.status === 'rejected').length || 0;

  const stats = [
    {
      title: "승인대기",
      value: pendingCount,
      icon: <Clock className="w-6 h-6 text-chart-3" />,
      bgColor: "bg-chart-3/10",
    },
    {
      title: "총 허가서",
      value: totalCount,
      icon: <FileText className="w-6 h-6 text-primary" />,
      bgColor: "bg-primary/10",
    },
    {
      title: "승인됨",
      value: approvedCount,
      icon: <CheckCircle className="w-6 h-6 text-chart-2" />,
      bgColor: "bg-chart-2/10",
    },
    {
      title: "반려됨",
      value: rejectedCount,
      icon: <XCircle className="w-6 h-6 text-destructive" />,
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
