import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, Flame, Building2, Zap, Truck } from "lucide-react";

interface WorkType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface Step1Props {
  selectedType: string;
  onSelect: (type: string) => void;
}

const workTypes: WorkType[] = [
  {
    id: "고소작업",
    name: "고소작업",
    icon: <ArrowUp className="w-12 h-12" />,
    color: "text-primary",
  },
  {
    id: "화기작업",
    name: "화기작업",
    icon: <Flame className="w-12 h-12" />,
    color: "text-destructive",
  },
  {
    id: "밀폐공간작업",
    name: "밀폐공간작업",
    icon: <Building2 className="w-12 h-12" />,
    color: "text-purple-600",
  },
  {
    id: "전기작업",
    name: "전기작업",
    icon: <Zap className="w-12 h-12" />,
    color: "text-chart-3",
  },
  {
    id: "중장비작업",
    name: "중장비작업",
    icon: <Truck className="w-12 h-12" />,
    color: "text-chart-2",
  },
];

export default function Step1WorkTypeSelection({ selectedType, onSelect }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">작업 유형을 선택하세요</h2>
        <p className="text-muted-foreground">작업의 위험성에 맞는 유형을 선택해주세요 (복수 선택 가능)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {workTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all hover-elevate ${
              selectedType === type.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelect(type.id)}
            data-testid={`card-work-type-${type.id}`}
          >
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className={type.color}>{type.icon}</div>
              <p className="mt-4 font-semibold text-center">{type.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
