import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

interface SafetyChecks {
  requirements1: string[];
  requirements2: string[];
}

interface Step3Props {
  data: SafetyChecks;
  onToggle: (category: keyof SafetyChecks, item: string) => void;
}

const requirements1 = [
  "밸브차단/차단표시부착",
  "용기/배관 물질제거 및 세정",
  "산소/유해가스 측정",
  "송배풍기 설치",
  "전기차단/표시부착",
  "불티비산방지조 설치",
  "작업구역 표시",
];

const requirements2 = [
  "조명장비",
  "추락방지 시설",
  "장비, 크레인 등의 충돌",
  "열등 등 안전고리 확인",
  "작업감독자 확인",
  "작업감시자 배치(화기/밀폐)",
  "화재감시자 대비용 방연장비",
];

export default function Step3SafetyCheck({ data, onToggle }: Step3Props) {
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
            <CardTitle className="text-base">안전조치 요구사항 ①</CardTitle>
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
            <CardTitle className="text-base">안전조치 요구사항 ②</CardTitle>
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
      </div>
    </div>
  );
}
