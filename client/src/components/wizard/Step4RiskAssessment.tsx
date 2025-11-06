import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Step4RiskAssessment() {
  const [showAfter, setShowAfter] = useState(false);

  // TODO: Remove mock data - Replace with actual AI-generated data
  const assessmentsBefore = [
    {
      id: 1,
      procedure: "작업 전 위험성 평가 및 패급공간 허가서 작성",
      hazard: "위험요인 미파악, 식별자 이해 부족",
      accident: "부적절한 안전 조치로 인한 사고",
      risk: "3 / 3 / 9",
      mitigation: "신입자 대상 밀폐작업 안전교육 실시",
    },
    {
      id: 2,
      procedure: "작업장 환기 및 가스농도 측정",
      hazard: "산소결핍, 유해가스 (O2<18%)",
      accident: "질식, 의식상실",
      risk: "2 / 5 / 10",
      mitigation: "블티팬 설치, 산소농도 측정기 사용, 농도기록 유지, 30분 간격 재측정",
    },
    {
      id: 3,
      procedure: "전원차단 및 Lock-Out / Tag-Out 실시",
      hazard: "전원차단 미이행, 타회사 감전",
      accident: "감전사고, 화상",
      risk: "3 / 3 / 9",
      mitigation: "MCC 전원차단 후 LOTO 부착, 감전방지장갑·절연장구 사용, 담당자 확인시행",
    },
    {
      id: 4,
      procedure: "Sensor 탈거 작업",
      hazard: "오염 누유, 바닥 미끄러움",
      accident: "골절, 낙상, 타박상",
      risk: "3 / 2 / 6",
      mitigation: "흡유포 설치, 안전화 착용, 발판 고정, 비계청소 철저",
    },
  ];

  const assessmentsAfter = [
    {
      id: 1,
      procedure: "작업 전 위험성 평가 및 패급공간 허가서 작성",
      hazard: "위험요인 미파악, 식별자 이해 부족",
      accident: "부적절한 안전 조치로 인한 사고",
      risk: "2 / 2 / 4",
      mitigation: "신입자 대상 밀폐작업 안전교육 실시",
    },
    {
      id: 2,
      procedure: "작업장 환기 및 가스농도 측정",
      hazard: "산소결핍, 유해가스 (O2<18%)",
      accident: "질식, 의식상실",
      risk: "1 / 3 / 3",
      mitigation: "블티팬 설치, 산소농도 측정기 사용, 농도기록 유지, 30분 간격 재측정",
    },
    {
      id: 3,
      procedure: "전원차단 및 Lock-Out / Tag-Out 실시",
      hazard: "전원차단 미이행, 타회사 감전",
      accident: "감전사고, 화상",
      risk: "2 / 2 / 4",
      mitigation: "MCC 전원차단 후 LOTO 부착, 감전방지장갑·절연장구 사용, 담당자 확인시행",
    },
    {
      id: 4,
      procedure: "Sensor 탈거 작업",
      hazard: "오염 누유, 바닥 미끄러움",
      accident: "골절, 낙상, 타박상",
      risk: "2 / 2 / 4",
      mitigation: "흡유포 설치, 안전화 착용, 발판 고정, 비계청소 철저",
    },
  ];

  const assessments = showAfter ? assessmentsAfter : assessmentsBefore;

  // Find max R value
  const getRValue = (risk: string) => {
    const parts = risk.split('/').map(s => s.trim());
    return parseInt(parts[2]) || 0;
  };

  const maxR = Math.max(...assessments.map(item => getRValue(item.risk)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">작업절차 (위험성평가)</h2>
        <p className="text-muted-foreground">각 작업 단계별 위험요인과 감소대책을 확인하세요</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>작업절차 위험성평가표</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={!showAfter ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAfter(false)}
              data-testid="button-before"
            >
              Before
            </Button>
            <Button
              variant={showAfter ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAfter(true)}
              data-testid="button-after"
            >
              After
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">순서</TableHead>
                <TableHead className="min-w-[200px]">주요작업절차</TableHead>
                <TableHead className="min-w-[150px]">위험요인</TableHead>
                <TableHead className="min-w-[120px]">예상사고</TableHead>
                <TableHead className="w-24">위험등급 (F/C/R)</TableHead>
                <TableHead className="min-w-[250px]">감소대책</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((item) => {
                const rValue = getRValue(item.risk);
                const isMaxR = rValue === maxR;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.procedure}</TableCell>
                    <TableCell>{item.hazard}</TableCell>
                    <TableCell>{item.accident}</TableCell>
                    <TableCell 
                      className={`text-center font-semibold ${isMaxR ? 'text-destructive' : ''}`}
                      data-testid={`risk-${item.id}`}
                    >
                      {item.risk}
                    </TableCell>
                    <TableCell>{item.mitigation}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
