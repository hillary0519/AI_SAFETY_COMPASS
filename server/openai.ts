import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

// Mock accident case database
const accidentCases = `
# 안전사고 사례 데이터베이스

## 사례 #1: 센서 교체시 감전사고
- 작업유형: 전기작업
- 발생장소: 3공장 컨베이어 라인
- 사고내용: 작업자가 컨베이어 센서 교체 중 전원차단 없이 작업하다 감전
- 원인분석: Lock-Out/Tag-Out 절차 미이행, 전기작업 허가서 미작성
- 안전대책: 
  1. 작업 전 반드시 전원차단 및 LOTO 실시
  2. 전기작업 허가서 작성 및 승인
  3. 절연장갑, 절연화 착용 필수
  4. 작업감시자 배치

## 사례 #2: 센서 교체시 밀폐공간 질식사고
- 작업유형: 밀폐공간작업
- 발생장소: 저장탱크 내부
- 사고내용: 탱크 내부 센서 점검 중 산소농도 부족으로 의식 소실
- 원인분석: 산소농도 측정 미실시, 환기장치 미설치
- 안전대책:
  1. 작업 전 산소농도 측정 (18% 이상 확인)
  2. 송배풍기 설치 및 지속적 환기
  3. 공기호흡기 또는 에어라인 마스크 착용
  4. 작업감시자 배치 (탱크 외부)
  5. 30분 간격 산소농도 재측정

## 사례 #3: 광양 4열연공장 개구부 추락사고
- 작업유형: 고소작업
- 발생장소: 광양 4열연공장 옥상
- 사고내용: 작업자가 옥상 개구부 덮개 없이 작업 중 추락
- 원인분석: 개구부 안전난간 미설치, 안전대 미착용
- 안전대책:
  1. 개구부 주변 안전난간 설치
  2. 덮개 설치 또는 안전망 설치
  3. 안전대(안전벨트) 착용 및 고리 확인
  4. 작업구역 표시 및 출입통제

## 사례 #4: 압연실비나부 관3열연공장 차단기 아크 화상
- 작업유형: 전기작업
- 발생장소: 3열연공장 전기실
- 사고내용: 차단기 인출 후 단독 작업 중 아크 발생으로 화상
- 원인분석: 전원차단 미확인, 단독작업, 보호구 미착용
- 안전대책:
  1. 전원차단 및 잔류전압 확인
  2. 절연장갑, 절연화, 보안경 착용
  3. 2인 1조 작업 실시
  4. 작업감독자 배치

## 사례 #5: 화기작업 중 인화성 물질 화재
- 작업유형: 화기작업
- 발생장소: 도장공장
- 사고내용: 용접작업 중 인근 시너통에 불티가 튀어 화재 발생
- 원인분석: 인화성 물질 제거 미실시, 불티비산방지포 미설치
- 안전대책:
  1. 작업반경 10m 이내 인화성 물질 제거
  2. 불티비산방지포 설치
  3. 소화기 비치
  4. 화재감시자 배치
  5. 작업 후 30분간 감시

## 사례 #6: 중장비 협착사고
- 작업유형: 중장비작업
- 발생장소: 야적장
- 사고내용: 지게차 후진 중 작업자 미확인으로 협착
- 원인분석: 유도자 미배치, 후방 확인 소홀
- 안전대책:
  1. 중장비 작업 시 유도자 배치
  2. 후방카메라 및 경보음 작동 확인
  3. 작업구역 내 보행자 출입통제
  4. 안전모, 안전화 착용

## 사례 #7: 밀폐공간 황화수소 중독
- 작업유형: 밀폐공간작업
- 발생장소: 폐수처리장 맨홀
- 사고내용: 맨홀 내부 점검 중 황화수소 중독
- 원인분석: 유해가스 측정 미실시, 환기 불충분
- 안전대책:
  1. 작업 전 유해가스 농도 측정
  2. 강제환기 30분 이상 실시
  3. 공기호흡기 착용
  4. 작업감시자 및 비상구조 장비 준비
`;

export async function getChatResponse(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `당신은 제조업 안전 전문가입니다. 아래의 사고사례 데이터베이스를 참고하여 사용자의 질문에 답변하세요.

${accidentCases}

답변 시 다음 사항을 고려하세요:
1. 사용자가 언급한 작업 유형과 관련된 사고사례를 찾아 제시
2. 구체적인 안전대책을 제공
3. 한국어로 친절하고 전문적으로 답변
4. 가능한 경우 여러 관련 사례를 함께 제시
5. 사례 번호를 명시하여 참조 가능하도록 함`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "응답을 생성할 수 없습니다.";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("AI 응답 생성 중 오류가 발생했습니다.");
  }
}
