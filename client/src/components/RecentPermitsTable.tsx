import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RecentPermitsTable() {
  // TODO: Remove mock data - Replace with actual data from API
  const permits: any[] = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 작업 허가서</CardTitle>
      </CardHeader>
      <CardContent>
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
            {permits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <p className="text-muted-foreground" data-testid="text-no-permits">
                    등록된 허가서가 없습니다.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              permits.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell>{permit.id}</TableCell>
                  <TableCell>{permit.type}</TableCell>
                  <TableCell>{permit.name}</TableCell>
                  <TableCell>{permit.location}</TableCell>
                  <TableCell>{permit.worker}</TableCell>
                  <TableCell>{permit.status}</TableCell>
                  <TableCell>{permit.date}</TableCell>
                  <TableCell>{permit.action}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
