import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Permit {
  id: number;
  workName: string;
  workArea: string;
  workerName: string;
  department: string;
  status: string;
  createdAt: string;
}

export default function PendingPermits() {
  const { data: permits, isLoading, error } = useQuery<Permit[]>({
    queryKey: ['/api/permits', 'pending'],
    queryFn: async () => {
      const response = await fetch('/api/permits?status=pending');
      if (!response.ok) throw new Error('Failed to fetch permits');
      return response.json();
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-pending-title">승인 대기</h1>
        <p className="text-muted-foreground mt-1">승인 대기 중인 안전작업허가서를 확인하세요</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96 border-2 border-dashed border-destructive/50 rounded-lg">
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">데이터를 불러오는 중 오류가 발생했습니다</p>
            <p className="text-sm text-muted-foreground">잠시 후 다시 시도해주세요</p>
          </div>
        </div>
      ) : permits && permits.length > 0 ? (
        <div className="grid gap-4">
          {permits.map((permit) => (
            <Card key={permit.id} className="hover-elevate" data-testid={`card-permit-${permit.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg" data-testid={`text-permit-name-${permit.id}`}>
                      {permit.workName}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span data-testid={`text-permit-area-${permit.id}`}>{permit.workArea}</span>
                      <span>•</span>
                      <span data-testid={`text-permit-worker-${permit.id}`}>{permit.workerName}</span>
                      <span>•</span>
                      <span data-testid={`text-permit-dept-${permit.id}`}>{permit.department}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1" data-testid={`badge-status-${permit.id}`}>
                    <Clock className="w-3 h-3" />
                    승인 대기
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {new Date(permit.createdAt).toLocaleString('ko-KR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
          <div className="text-center space-y-2">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">승인 대기 중인 허가서가 없습니다</p>
          </div>
        </div>
      )}
    </div>
  );
}
