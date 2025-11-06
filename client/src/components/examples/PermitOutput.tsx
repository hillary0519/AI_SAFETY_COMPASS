import PermitOutput from "../PermitOutput";

export default function PermitOutputExample() {
  const mockPermit = {
    procedures: [
      "전원 차단 후 센서 접근",
      "보호장비 착용 및 안전 감시자 배치",
      "센서 교체 후 테스트 시운전 실시",
    ],
    hazards: [
      "전원 미차단 상태 접근 시 감전 위험",
      "작업 중 미끄럼 및 추락 가능성",
    ],
    accidentTypes: ["감전", "넘어짐", "협착"],
    safetyMeasures: [
      "전원차단",
      "미끄럼주의 표지 설치",
      "안전모 착용",
      "절연장갑 착용",
      "안전화 착용",
    ],
    riskAssessment: {
      complexity: 4,
      scope: 3,
      frequency: 2,
      overall: 3,
      reason: "감전사고 및 추락 가능성 중간 수준",
    },
    mitigationMeasures: [
      "작업 전 전원 확인 절차 강화",
      "작업구역 미끄럼방지 매트 설치",
      "감시자 배치 후 작업진행",
    ],
  };

  return (
    <div className="p-6 max-w-4xl">
      <PermitOutput
        permit={mockPermit}
        onReset={() => console.log("Reset clicked")}
        onDownload={() => console.log("Download clicked")}
      />
    </div>
  );
}
