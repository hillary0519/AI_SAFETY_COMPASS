interface DailyForecast {
  date: string;
  dayOfWeek: string;
  temp: number;
  weather: string;
  humidity: number;
  wind_speed: number;
  rainfall: number;
}

interface WeatherResponse {
  location: string;
  forecasts: DailyForecast[];
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
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${englishCity},KR&appid=${apiKey}&units=metric&lang=kr`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City not found: ${city}`);
      }
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    // Group forecast data by date and get daily averages
    // Use KST (UTC+9) for Korean cities
    const dailyData: Record<string, any[]> = {};
    const KST_OFFSET = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
    
    data.list.forEach((item: any) => {
      const utcDate = new Date(item.dt * 1000);
      const kstDate = new Date(utcDate.getTime() + KST_OFFSET);
      const dateKey = kstDate.toISOString().split('T')[0];
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = [];
      }
      dailyData[dateKey].push(item);
    });

    // Get the next 3 days
    const dates = Object.keys(dailyData).slice(0, 3);
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    
    const forecasts: DailyForecast[] = dates.map(dateKey => {
      const dayData = dailyData[dateKey];
      // Parse date as KST
      const date = new Date(dateKey + 'T00:00:00+09:00');
      const dayOfWeek = dayNames[date.getDay()];
      
      // Calculate averages
      const avgTemp = dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length;
      const avgHumidity = dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length;
      const avgWindSpeed = dayData.reduce((sum, item) => sum + item.wind.speed, 0) / dayData.length;
      
      // Get most common weather condition
      const weatherCounts: Record<string, number> = {};
      dayData.forEach((item: any) => {
        const weather = item.weather?.[0]?.main || "Unknown";
        weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
      });
      const mostCommonWeather = Object.keys(weatherCounts).reduce((a, b) => 
        weatherCounts[a] > weatherCounts[b] ? a : b
      );
      const weatherKorean = weatherMapping[mostCommonWeather] || "알 수 없음";
      
      // Calculate total rainfall
      const totalRainfall = dayData.reduce((sum, item) => {
        const rain = item.rain?.["3h"] || 0;
        return sum + rain;
      }, 0);

      return {
        date: `${date.getMonth() + 1}월${date.getDate()}일`,
        dayOfWeek,
        temp: Math.round(avgTemp),
        weather: weatherKorean,
        humidity: Math.round(avgHumidity),
        wind_speed: Math.round(avgWindSpeed * 10) / 10,
        rainfall: Math.round(totalRainfall * 10) / 10,
      };
    });

    return {
      location: city,
      forecasts,
    };
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
}
