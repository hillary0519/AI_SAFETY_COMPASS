import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { WorkPermit } from "@shared/schema";

const statusColors: Record<string, string> = {
  pending: "승인 대기",
  approved: "승인됨",
  rejected: "반려됨",
};

export default function RecentPermitsTable() {
  const { data: permits, isLoading } = useQuery<WorkPermit[]>({
    queryKey: ['/api/permits'],
    queryFn: async () => {
      const response = await fetch('/api/permits');
      if (!response.ok) throw new Error('Failed to fetch permits');
      return response.json();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 작업 허가서</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>허가번호</TableHead>
                <TableHead>작업유형</TableHead>
                <TableHead>작업명</TableHead>
                <TableHead>위치</TableHead>
                <TableHead>작업자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>작업일시</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!permits || permits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <p className="text-muted-foreground" data-testid="text-no-permits">
                      등록된 허가서가 없습니다.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                permits.map((permit) => (
                  <TableRow key={permit.id} data-testid={`row-permit-${permit.id}`}>
                    <TableCell className="font-medium" data-testid={`text-permit-number-${permit.id}`}>
                      {permit.id.substring(0, 8)}
                    </TableCell>
                    <TableCell data-testid={`text-work-types-${permit.id}`}>
                      {permit.workType}
                    </TableCell>
                    <TableCell data-testid={`text-work-name-${permit.id}`}>
                      {permit.workName}
                    </TableCell>
                    <TableCell data-testid={`text-work-area-${permit.id}`}>
                      {permit.workArea}
                    </TableCell>
                    <TableCell data-testid={`text-worker-name-${permit.id}`}>
                      {permit.workerName}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={permit.status === "pending" ? "secondary" : "default"}
                        data-testid={`badge-status-${permit.id}`}
                      >
                        {statusColors[permit.status] || permit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm" data-testid={`text-created-at-${permit.id}`}>
                      -
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          data-testid={`button-view-${permit.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          data-testid={`button-download-${permit.id}`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
