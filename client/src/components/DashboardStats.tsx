import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileText, CheckCircle, XCircle } from "lucide-react";

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
  // TODO: Remove mock data - Replace with actual data from API
  const stats = [
    {
      title: "승인대기",
      value: 0,
      icon: <Clock className="w-6 h-6 text-chart-3" />,
      bgColor: "bg-chart-3/10",
    },
    {
      title: "진행중인 작업",
      value: 0,
      icon: <FileText className="w-6 h-6 text-primary" />,
      bgColor: "bg-primary/10",
    },
    {
      title: "이번 달 완료",
      value: 0,
      icon: <CheckCircle className="w-6 h-6 text-chart-2" />,
      bgColor: "bg-chart-2/10",
    },
    {
      title: "반려됨",
      value: 0,
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
