import StepIndicator from "../StepIndicator";

export default function StepIndicatorExample() {
  const steps = [
    { number: 1, title: "작업 유형 선택" },
    { number: 2, title: "기본 정보" },
    { number: 3, title: "안전 점검" },
    { number: 4, title: "검토 및 제출" },
  ];

  return (
    <div className="p-6">
      <StepIndicator steps={steps} currentStep={2} />
    </div>
  );
}
