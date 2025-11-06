import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, Flame, Building2, Zap, Wrench } from "lucide-react";
import { Check } from "lucide-react";

interface WorkType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface Step1Props {
  selectedTypes: string[];
  onToggle: (type: string) => void;
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
    id: "일반작업",
    name: "일반작업",
    icon: <Wrench className="w-12 h-12" />,
    color: "text-chart-2",
  },
];

export default function Step1WorkTypeSelection({ selectedTypes, onToggle }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">작업 유형을 선택하세요</h2>
        <p className="text-muted-foreground">작업의 위험성에 맞는 유형을 선택해주세요 (복수 선택 가능)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {workTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover-elevate relative ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onToggle(type.id)}
              data-testid={`card-work-type-${type.id}`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className={type.color}>{type.icon}</div>
                <p className="mt-4 font-semibold text-center">{type.name}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
