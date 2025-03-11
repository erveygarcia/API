import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
console.log("API Key:", process.env.OPENWEATHER_API_KEY);

// Interfaz para coordenadas
interface Coordinates {
  lat: number;
  lon: number;
}

// Clase para la estructura del clima
class Weather {
  constructor(
      public city: string,
      public temperature: number,
      public windSpeed: number,
      public humidity: number,
      public description: string,
      public icon: string, // Solo el código del ícono (ej. "01d", "02n")
      public date: string
  ) {}
}

// Clase de servicio para obtener el clima
class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
  private geoBaseURL = 'http://api.openweathermap.org/geo/1.0/direct';
  private apiKey = process.env.OPENWEATHER_API_KEY as string;

  // Obtener coordenadas de la ciudad
  private async fetchLocationData(city: string): Promise<Coordinates> {
    try {
      const geoResponse = await axios.get(
        `${this.geoBaseURL}?q=${city}&limit=1&appid=${this.apiKey}`
      );

      if (geoResponse.data.length === 0) {
        throw new Error('City not found');
      }

      return { lat: geoResponse.data[0].lat, lon: geoResponse.data[0].lon };
    } catch (error) {
      console.error(error);
      throw new Error('Error while retrieving city location');
    }
  }

  // Construcción de la URL de consulta del clima
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Obtener datos de clima de OpenWeather
  private async fetchWeatherData(city: string): Promise<any> {
    const coordinates = await this.fetchLocationData(city);
    const weatherResponse = await axios.get(this.buildWeatherQuery(coordinates));
    return weatherResponse.data;
  }

  // Parsear el clima actual
  private parseCurrentWeather(weatherData: any, city: string): Weather {
    const current = weatherData.list[0];
    const date = new Date(current.dt * 1000).toLocaleDateString(); 

    return new Weather(
        city,
        Math.round(current.main.temp), // Redondear temperatura
        current.wind.speed,
        current.main.humidity,
        current.weather[0].description,
        current.weather[0].icon, // Solo el código del ícono (ej. "01d", "02n")
        date
    );
  }

  // Construcción del array de pronósticos
  private buildForecastArray(weatherData: any): Weather[] {
    return weatherData.list.slice(0, 5).map((day: any, index: number) => {
        const date = new Date(day.dt * 1000).toLocaleDateString();

        console.log(`🔎 Forecast Day ${index + 1}:`, {
            date,
            temp: Math.round(day.main.temp),
            wind: day.wind.speed,
            humidity: day.main.humidity,
        });

        return new Weather(
            weatherData.city.name,
            Math.round(day.main.temp),
            day.wind.speed,
            day.main.humidity,
            day.weather[0].description,
            day.weather[0].icon, // Solo el código del ícono
            date
        );
    });
  }

  // Obtener datos del clima para una ciudad
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    const weatherData = await this.fetchWeatherData(city);
    
    console.log("Weather API response:", weatherData); 
    console.log("City name:", city);

    const currentWeather = this.parseCurrentWeather(weatherData, city);
    console.log("Parsed Current Weather:", currentWeather);

    const forecast = this.buildForecastArray(weatherData);
    console.log("Parsed Forecast:", forecast);

    return { current: currentWeather, forecast };
  }
}

export default new WeatherService();
