import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
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
  "옆놈 등 안전고리 확인",
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
    risk: "3 / 3 / 9",
    mitigation: "신입자 대상 밀폐작업 안전교육 실시",
  },
  {
    id: 2,
    procedure: "작업장 환기 및 가스농도 측정",
    hazard: "산소결핍, 유해가스(O₂<18%)",
    accident: "질식, 의식소실",
    risk: "2 / 5 / 10",
    mitigation: "불티팬 설치, 산소농도 측정기 사용, 농도기록 유지, 30분 간격 재측정",
  },
  {
    id: 3,
    procedure: "전원차단 및 Lock-Out / Tag-Out 실시",
    hazard: "전원차단 미이행, 타회선 감전",
    accident: "감전사고, 화상",
    risk: "3 / 3 / 9",
    mitigation: "MCC 전원차단 후 LOTO 부착, 감전방지장갑·절연장구 사용, 담당자 확인서명",
  },
  {
    id: 4,
    procedure: "Sensor 탈거 작업",
    hazard: "오염 누유, 바닥 미끄러움",
    accident: "골절, 안전, 타박상",
    risk: "3 / 2 / 6",
    mitigation: "흡유포 설치, 안전화 착용, 발판 고정, 바닥청소 철저",
  },
  {
    id: 5,
    procedure: "Sensor 결선 및 전선 접속",
    hazard: "전열발열, 절연불량, 접속공간 자세",
    accident: "감전, 근골격계 질환",
    risk: "3 / 3 / 9",
    mitigation: "절연테이프 보강, 전원 차단확인, 스트레칭/휴식 병행",
  },
  {
    id: 6,
    procedure: "고열환경에서의 작업 지속",
    hazard: "더위, 체온상승, 탈수",
    accident: "열사병, 실신",
    risk: "2 / 3 / 6",
    mitigation: "휴식 및 수분섭취 1시간 1회, 송풍기 가동, 냉타올 비치, 폭염 시 작업중지",
  },
  {
    id: 7,
    procedure: "협소공간 내 이동 및 작업자 교대",
    hazard: "시야제한, 케이블 걸림",
    accident: "낙상, 전도",
    risk: "3 / 3 / 9",
    mitigation: "케이블 정리, 조명 확보기, 2인 1조 작업, 접근로 확보",
  },
  {
    id: 8,
    procedure: "교체 후 전원 투입 전 점검",
    hazard: "전원 조기투입, 접지불량",
    accident: "감전, 장비손상",
    risk: "3 / 3 / 9",
    mitigation: "접선, 절연저항계, 계측기 사용",
  },
  {
    id: 9,
    procedure: "작업후 청소 및 장비 원위치",
    hazard: "바닥 오염잔류, 도구 방치",
    accident: "전도, 낙상",
    risk: "2 / 3 / 6",
    mitigation: "청소장소 및 도구 정리 후 확인서명, 정리정돈 점검",
  },
  {
    id: 10,
    procedure: "작업종료 보고 및 허가서 회수",
    hazard: "보고 누락, 허가서 미회수",
    accident: "관리 부실, 재발 방지 실패",
    risk: "1 / 3 / 3",
    mitigation: "작업종료 보고서 작성, 허가서 회수 후 보관",
  },
];

export default function Step3SafetyCheck({ data, onToggle }: Step3Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">✅ 안전 점검 사항</h2>
        <p className="text-muted-foreground">🦺 모든 안전 점검 항목을 확인하세요</p>
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            ⚠️ 위험포인트
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-semibold text-destructive">전도위험, 감전위험, 밀폐공간 질식 위험</p>
          <div className="space-y-1">
            <p className="font-semibold">일반작업</p>
            <p>이동시 실내 주변 이동에 의한 전도 위험</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">전기작업</p>
            <p>전원 미차단(AC 110V)에 의한 감전 위험</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">밀폐작업</p>
            <p>산소 농도 저하에 의한 질식 위험</p>
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
          <CardTitle>📊 작업절차 (위험성평가)</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">순서</TableHead>
                <TableHead className="min-w-[200px]">주요작업절차</TableHead>
                <TableHead className="min-w-[150px]">위험요인</TableHead>
                <TableHead className="min-w-[120px]">예상사고</TableHead>
                <TableHead className="w-32">위험등급 (F/C/R)</TableHead>
                <TableHead className="min-w-[250px]">감소대책</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskAssessments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.procedure}</TableCell>
                  <TableCell>{item.hazard}</TableCell>
                  <TableCell>{item.accident}</TableCell>
                  <TableCell className="text-center font-semibold">{item.risk}</TableCell>
                  <TableCell>{item.mitigation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
