import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  ClipboardList,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Lightbulb,
  Download,
  RotateCcw,
  Copy,
} from "lucide-react";
import type { GeneratedPermit } from "@shared/schema";

interface PermitOutputProps {
  permit: GeneratedPermit;
  onReset: () => void;
  onDownload: () => void;
}

export default function PermitOutput({ permit, onReset, onDownload }: PermitOutputProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const handleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getRiskColor = (value: number) => {
    if (value <= 2) return "text-chart-2";
    if (value <= 3) return "text-chart-3";
    return "text-destructive";
  };

  const getRiskBgColor = (value: number) => {
    if (value <= 2) return "bg-chart-2/10";
    if (value <= 3) return "bg-chart-3/10";
    return "bg-destructive/10";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button
          variant="default"
          onClick={onDownload}
          data-testid="button-download"
        >
          <Download className="w-4 h-4 mr-2" />
          PDF 다운로드
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(permit, null, 2));
          }}
          data-testid="button-copy"
        >
          <Copy className="w-4 h-4 mr-2" />
          복사
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          data-testid="button-reset"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          초기화
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            주요 작업절차
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal list-inside">
            {permit.procedures.map((procedure, index) => (
              <li key={index} className="text-sm leading-relaxed" data-testid={`text-procedure-${index}`}>
                {procedure}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            예상 위험요인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            {permit.hazards.map((hazard, index) => (
              <li key={index} className="text-sm leading-relaxed" data-testid={`text-hazard-${index}`}>
                {hazard}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            예상 사고 유형
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {permit.accidentTypes.map((type, index) => (
              <Badge key={index} variant="secondary" data-testid={`badge-accident-${index}`}>
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            안전조치 및 안전장비
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {permit.safetyMeasures.map((measure, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-md hover-elevate">
                <Checkbox
                  id={`measure-${index}`}
                  checked={checkedItems[index] || false}
                  onCheckedChange={() => handleCheck(index)}
                  data-testid={`checkbox-measure-${index}`}
                />
                <label
                  htmlFor={`measure-${index}`}
                  className={`text-sm leading-relaxed cursor-pointer ${
                    checkedItems[index] ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {measure}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            위험성평가
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className={`p-4 rounded-lg ${getRiskBgColor(permit.riskAssessment.complexity)}`}>
              <div className="text-sm text-muted-foreground mb-1">복잡성</div>
              <div className={`text-2xl font-bold ${getRiskColor(permit.riskAssessment.complexity)}`} data-testid="text-risk-complexity">
                {permit.riskAssessment.complexity}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${getRiskBgColor(permit.riskAssessment.scope)}`}>
              <div className="text-sm text-muted-foreground mb-1">피해범위</div>
              <div className={`text-2xl font-bold ${getRiskColor(permit.riskAssessment.scope)}`} data-testid="text-risk-scope">
                {permit.riskAssessment.scope}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${getRiskBgColor(permit.riskAssessment.frequency)}`}>
              <div className="text-sm text-muted-foreground mb-1">발생빈도</div>
              <div className={`text-2xl font-bold ${getRiskColor(permit.riskAssessment.frequency)}`} data-testid="text-risk-frequency">
                {permit.riskAssessment.frequency}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${getRiskBgColor(permit.riskAssessment.overall)}`}>
              <div className="text-sm text-muted-foreground mb-1">종합위험도</div>
              <div className={`text-2xl font-bold ${getRiskColor(permit.riskAssessment.overall)}`} data-testid="text-risk-overall">
                {permit.riskAssessment.overall}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-risk-reason">
            {permit.riskAssessment.reason}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            감소대책
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            {permit.mitigationMeasures.map((measure, index) => (
              <li key={index} className="text-sm leading-relaxed" data-testid={`text-mitigation-${index}`}>
                {measure}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
