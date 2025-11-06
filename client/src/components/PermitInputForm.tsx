import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workPermitInputSchema, type WorkPermitInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

interface PermitInputFormProps {
  onSubmit: (data: WorkPermitInput) => void;
  isLoading?: boolean;
}

export default function PermitInputForm({ onSubmit, isLoading = false }: PermitInputFormProps) {
  const form = useForm<WorkPermitInput>({
    resolver: zodResolver(workPermitInputSchema),
    defaultValues: {
      workType: "",
      workArea: "",
      workLocation: "",
      equipmentName: "",
      workerName: "",
      workPeriodStart: "",
      workPeriodEnd: "",
      workDescription: "",
    },
  });

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ClipboardList className="w-5 h-5" />
          작업 정보 입력
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workType">
              작업유형 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.watch("workType")}
              onValueChange={(value) => form.setValue("workType", value)}
            >
              <SelectTrigger id="workType" data-testid="select-work-type">
                <SelectValue placeholder="작업유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전기작업">전기작업</SelectItem>
                <SelectItem value="용접작업">용접작업</SelectItem>
                <SelectItem value="고소작업">고소작업</SelectItem>
                <SelectItem value="밀폐공간작업">밀폐공간작업</SelectItem>
                <SelectItem value="중장비작업">중장비작업</SelectItem>
                <SelectItem value="화기작업">화기작업</SelectItem>
                <SelectItem value="정비보수작업">정비보수작업</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.workType && (
              <p className="text-sm text-destructive">
                {form.formState.errors.workType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="workArea">
              작업지역 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="workArea"
              data-testid="input-work-area"
              placeholder="예: 생산동 A동"
              {...form.register("workArea")}
            />
            {form.formState.errors.workArea && (
              <p className="text-sm text-destructive">
                {form.formState.errors.workArea.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="workLocation">
              작업장소 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="workLocation"
              data-testid="input-work-location"
              placeholder="예: 2층 생산라인"
              {...form.register("workLocation")}
            />
            {form.formState.errors.workLocation && (
              <p className="text-sm text-destructive">
                {form.formState.errors.workLocation.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipmentName">
              설비명 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="equipmentName"
              data-testid="input-equipment-name"
              placeholder="예: 프레스 설비 #3"
              {...form.register("equipmentName")}
            />
            {form.formState.errors.equipmentName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.equipmentName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="workerName">
              작업자명 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="workerName"
              data-testid="input-worker-name"
              placeholder="예: 홍길동"
              {...form.register("workerName")}
            />
            {form.formState.errors.workerName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.workerName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workPeriodStart">
                작업시작일 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="workPeriodStart"
                data-testid="input-work-period-start"
                type="date"
                {...form.register("workPeriodStart")}
              />
              {form.formState.errors.workPeriodStart && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.workPeriodStart.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workPeriodEnd">
                작업종료일 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="workPeriodEnd"
                data-testid="input-work-period-end"
                type="date"
                {...form.register("workPeriodEnd")}
              />
              {form.formState.errors.workPeriodEnd && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.workPeriodEnd.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workDescription">
              작업내용 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="workDescription"
              data-testid="textarea-work-description"
              placeholder="작업내용을 상세히 입력해주세요"
              className="min-h-32 resize-none"
              {...form.register("workDescription")}
            />
            {form.formState.errors.workDescription && (
              <p className="text-sm text-destructive">
                {form.formState.errors.workDescription.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
            data-testid="button-generate"
          >
            {isLoading ? "생성 중..." : "안전작업허가서 생성"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
