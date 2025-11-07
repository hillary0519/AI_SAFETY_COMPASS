interface WeatherResponse {
  location: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  weather: string;
  humidity: number;
  wind_speed: number;
  rainfall: number;
}

const cityMapping: Record<string, string> = {
  "포항": "Pohang",
  "광양": "Gwangyang",
  "서울": "Seoul",
  "부산": "Busan",
  "인천": "Incheon",
  "대구": "Daegu",
  "대전": "Daejeon",
  "광주": "Gwangju",
  "울산": "Ulsan",
  "창원": "Changwon",
};

const weatherMapping: Record<string, string> = {
  "Clear": "맑음",
  "Clouds": "구름",
  "Rain": "비",
  "Drizzle": "이슬비",
  "Thunderstorm": "천둥번개",
  "Snow": "눈",
  "Mist": "안개",
  "Smoke": "연기",
  "Haze": "실안개",
  "Dust": "먼지",
  "Fog": "안개",
  "Sand": "모래",
  "Ash": "화산재",
  "Squall": "돌풍",
  "Tornado": "토네이도",
};

export async function getWeatherInfo(city: string): Promise<WeatherResponse> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENWEATHERMAP_API_KEY is not configured");
  }

  const englishCity = cityMapping[city] || city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${englishCity},KR&appid=${apiKey}&units=metric&lang=kr`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City not found: ${city}`);
      }
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    const weatherMain = data.weather?.[0]?.main || "Unknown";
    const weatherKorean = weatherMapping[weatherMain] || data.weather?.[0]?.description || "알 수 없음";

    const rainfall = data.rain?.["1h"] || data.rain?.["3h"] || 0;

    return {
      location: city,
      temp: Math.round(data.main.temp * 10) / 10,
      temp_min: Math.round(data.main.temp_min * 10) / 10,
      temp_max: Math.round(data.main.temp_max * 10) / 10,
      weather: weatherKorean,
      humidity: data.main.humidity,
      wind_speed: Math.round(data.wind.speed * 10) / 10,
      rainfall: Math.round(rainfall * 10) / 10,
    };
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
}
