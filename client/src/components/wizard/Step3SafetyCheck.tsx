import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SafetyChecks {
  requirements1: string[];
  requirements2: string[];
  equipment: string[];
  protective: string[];
}

interface Step3Props {
  data: SafetyChecks;
  onToggle: (category: keyof SafetyChecks, item: string) => void;
  step3DetailData: any;
}

const requirements1 = [
  "밸브차단/차단표시부착",
  "용기/배관 물질제거 및 세정",
  "산소/유해/가연성 가스 측정",
  "송배풍기 설치",
  "전기차단/표시부착",
  "불티비산방지포 설치",
  "작업구역 표시",
];

const requirements2 = [
  "조명장비",
  "추락방지 시설",
  "장비, 크레인 등의 출입",
  "작업내용 안전교육 확인",
  "작업감독자 확인",
  "작업감시자 배치(화기/밀폐)",
  "화재감시자 대피용 방연장비",
];

const equipment = [
  "방독면",
  "에어라인 마스크",
  "내산복",
  "안전슈트",
  "공기호흡기",
  "안전보호구",
  "안전블럭",
];

const protective = [
  "안전모/안전화",
  "보안경",
  "안전벨트",
  "방진마스크",
  "절연장화",
  "절연장갑",
  "안전대",
];

const riskAssessments = [
  {
    id: 1,
    procedure: "작업 전 위험성 평가 및 밀폐공간 허가서 작성",
    hazard: "위험요인 미파악, 신입자 이해 부족",
    accident: "부적절한 안전조치로 인한 사고",
    f: 3,
    c: 3,
    r: 9,
    mitigation: "신입자 대상 밀폐작업 안전교육 실시",
  },
  {
    id: 2,
    procedure: "작업장 환기 및 가스농도 측정",
    hazard: "산소결핍, 유해가스(O₂<18%)",
    accident: "질식, 의식소실",
    f: 2,
    c: 5,
    r: 10,
    mitigation: "불티팬 설치, 산소농도 측정기 사용, 농도기록 유지, 30분 간격 재측정",
  },
  {
    id: 3,
    procedure: "전원차단 및 Lock-Out / Tag-Out 실시",
    hazard: "전원차단 미이행, 타회선 감전",
    accident: "감전사고, 화상",
    f: 3,
    c: 3,
    r: 9,
    mitigation: "MCC 전원차단 후 LOTO 부착, 감전방지장갑·절연장구 사용, 담당자 확인서명",
  },
  {
    id: 4,
    procedure: "Sensor 탈거 작업",
    hazard: "오염 누유, 바닥 미끄러움",
    accident: "골절, 안전, 타박상",
    f: 3,
    c: 2,
    r: 6,
    mitigation: "흡유포 설치, 안전화 착용, 발판 고정, 바닥청소 철저",
  },
  {
    id: 5,
    procedure: "Sensor 결선 및 전선 접속",
    hazard: "전열발열, 절연불량, 접속공간 자세",
    accident: "감전, 근골격계 질환",
    f: 3,
    c: 3,
    r: 9,
    mitigation: "절연테이프 보강, 전원 차단확인, 스트레칭/휴식 병행",
  },
  {
    id: 6,
    procedure: "고열환경에서의 작업 지속",
    hazard: "더위, 체온상승, 탈수",
    accident: "열사병, 실신",
    f: 2,
    c: 3,
    r: 6,
    mitigation: "휴식 및 수분섭취 1시간 1회, 송풍기 가동, 냉타올 비치, 폭염 시 작업중지",
  },
  {
    id: 7,
    procedure: "협소공간 내 이동 및 작업자 교대",
    hazard: "시야제한, 케이블 걸림",
    accident: "낙상, 전도",
    f: 3,
    c: 3,
    r: 9,
    mitigation: "케이블 정리, 조명 확보기, 2인 1조 작업, 접근로 확보",
  },
  {
    id: 8,
    procedure: "교체 후 전원 투입 전 점검",
    hazard: "전원 조기투입, 접지불량",
    accident: "감전, 장비손상",
    f: 3,
    c: 3,
    r: 9,
    mitigation: "접선, 절연저항계, 계측기 사용",
  },
  {
    id: 9,
    procedure: "작업후 청소 및 장비 원위치",
    hazard: "바닥 오염잔류, 도구 방치",
    accident: "전도, 낙상",
    f: 2,
    c: 3,
    r: 6,
    mitigation: "청소장소 및 도구 정리 후 확인서명, 정리정돈 점검",
  },
  {
    id: 10,
    procedure: "작업종료 보고 및 허가서 회수",
    hazard: "보고 누락, 허가서 미회수",
    accident: "관리 부실, 재발 방지 실패",
    f: 1,
    c: 3,
    r: 3,
    mitigation: "작업종료 보고서 작성, 허가서 회수 후 보관",
  },
];

export default function Step3SafetyCheck({ data, onToggle, step3DetailData }: Step3Props) {
  const [useAfter, setUseAfter] = useState(false);

  if (!step3DetailData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">안전 점검 사항</h2>
          <p className="text-muted-foreground">모든 안전 점검 항목을 확인하세요</p>
        </div>

        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Safety Compass 분석이 필요합니다</h3>
            <p className="text-muted-foreground">
              2단계 기본 정보 입력 후 Safety Compass를 실행하면 <br />
              안전 점검 항목이 자동으로 채워집니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayRiskAssessments = step3DetailData.riskAssessments || riskAssessments;

  // Calculate max R value for before and after
  const maxRBefore = Math.max(...displayRiskAssessments.map((item: any) => item.r));
  const maxRAfter = Math.max(...displayRiskAssessments.map((item: any) => Math.round(item.r * 1.2 * 10) / 10));
  
  // Calculate risk scores
  const baseScore = displayRiskAssessments.reduce((sum: number, item: any) => sum + item.r, 0);
  const aiScore = 15; // AI-based score from equipment/temp/health factors
  const totalScore = baseScore + aiScore;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">안전 점검 사항</h2>
        <p className="text-muted-foreground">모든 안전 점검 항목을 확인하세요</p>
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            위험포인트
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-semibold text-destructive">전도위험, 감전위험, 밀폐공간 질식 위험</p>
          <div className="space-y-1">
            <p className="font-semibold">일반작업</p>
            <p>{step3DetailData.hazardPoints?.general || "이동시 실내 주변 이동에 의한 전도 위험"}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">전기작업</p>
            <p>{step3DetailData.hazardPoints?.electrical || "전원 미차단(AC 110V)에 의한 감전 위험"}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">밀폐작업</p>
            <p>{step3DetailData.hazardPoints?.confined || "산소 농도 저하에 의한 질식 위험"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🔹 안전조치 요구사항 ①</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requirements1.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Checkbox
                  id={`req1-${item}`}
                  checked={data.requirements1.includes(item)}
                  onCheckedChange={() => onToggle("requirements1", item)}
                  data-testid={`checkbox-req1-${item}`}
                />
                <label
                  htmlFor={`req1-${item}`}
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  {item}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">🔹 안전조치 요구사항 ②</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requirements2.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Checkbox
                  id={`req2-${item}`}
                  checked={data.requirements2.includes(item)}
                  onCheckedChange={() => onToggle("requirements2", item)}
                  data-testid={`checkbox-req2-${item}`}
                />
                <label
                  htmlFor={`req2-${item}`}
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  {item}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">🔹 안전장비</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {equipment.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Checkbox
                  id={`equip-${item}`}
                  checked={data.equipment.includes(item)}
                  onCheckedChange={() => onToggle("equipment", item)}
                  data-testid={`checkbox-equipment-${item}`}
                />
                <label
                  htmlFor={`equip-${item}`}
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  {item}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">🔹 보호구</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {protective.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Checkbox
                  id={`protective-${item}`}
                  checked={data.protective.includes(item)}
                  onCheckedChange={() => onToggle("protective", item)}
                  data-testid={`checkbox-protective-${item}`}
                />
                <label
                  htmlFor={`protective-${item}`}
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  {item}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle>작업절차 (위험성평가)</CardTitle>
              <div className="text-sm space-y-1">
                <p className="font-semibold">※ 위험성 평가는 {totalScore}점 입니다. (중등급)</p>
                <p className="text-muted-foreground">- 기존 위험성 평가 결과는 {baseScore}점,</p>
                <p className="text-muted-foreground">- 과거 이력, 설비 상태, 작업자 건강상태 기반 위험성 평가 결과 : {aiScore}점</p>
                <p className="text-muted-foreground">- 설비 : 고위험 설비</p>
                <p className="text-muted-foreground">- 기온 : 고온상태</p>
                <p className="text-muted-foreground">- 건강상태 : 고혈압 가중치 반영</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="toggle-mode">BEFORE</Label>
              <Switch
                id="toggle-mode"
                checked={useAfter}
                onCheckedChange={setUseAfter}
                data-testid="switch-before-after"
              />
              <Label htmlFor="toggle-mode">AFTER</Label>
            </div>
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
                <TableHead className="w-16 text-center">F</TableHead>
                <TableHead className="w-16 text-center">C</TableHead>
                <TableHead className="w-16 text-center">R</TableHead>
                <TableHead className="min-w-[250px]">감소대책</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRiskAssessments.map((item: any) => {
                const rValue = useAfter ? Math.round(item.r * 1.2 * 10) / 10 : item.r;
                const maxR = useAfter ? maxRAfter : maxRBefore;
                const isMaxR = rValue === maxR;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.procedure}</TableCell>
                    <TableCell>{item.hazard}</TableCell>
                    <TableCell>{item.accident}</TableCell>
                    <TableCell className="text-center font-semibold">{item.f}</TableCell>
                    <TableCell className="text-center font-semibold">{item.c}</TableCell>
                    <TableCell className={`text-center font-semibold ${isMaxR ? 'text-destructive' : ''}`}>
                      {rValue}
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
