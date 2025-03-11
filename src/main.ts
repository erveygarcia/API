import './styles/jass.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// * Selección de elementos del DOM
const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const searchHistoryContainer = document.getElementById('history') as HTMLDivElement | null;
const heading = document.getElementById('search-title') as HTMLHeadingElement;
const weatherIcon = document.getElementById('weather-img') as HTMLImageElement;
const tempEl = document.getElementById('temp') as HTMLParagraphElement;
const windEl = document.getElementById('wind') as HTMLParagraphElement;
const humidityEl = document.getElementById('humidity') as HTMLParagraphElement;
const forecastContainer = document.getElementById('forecast') as HTMLDivElement | null;

const API_KEY = "87e00899d72806c24428b5e3e8d1069d"; // Tu API Key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/*
API Calls
*/
const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      throw new Error(`Error fetching weather: ${response.statusText}`);
    }
    const weatherData = await response.json();
    console.log('weatherData:', weatherData);
    renderCurrentWeather(weatherData);
    fetchForecast(cityName);
  } catch (error) {
    console.error("Error al obtener el clima:", error);
  }
};

const fetchForecast = async (cityName: string) => {
  try {
    const response = await fetch(`${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      throw new Error(`Error fetching forecast: ${response.statusText}`);
    }
    const forecastData = await response.json();
    console.log('forecastData:', forecastData);
    renderForecast(forecastData.list);
  } catch (error) {
    console.error("Error al obtener el pronóstico:", error);
  }
};

const fetchSearchHistory = async (): Promise<string[]> => {
  try {
    console.log("📥 Fetching search history from localStorage...");
    const storedHistory = localStorage.getItem("searchHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error("Error fetching search history:", error);
    return [];
  }
};

const updateSearchHistory = (cityName: string) => {
  let history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
  if (!history.includes(cityName)) {
    history.push(cityName);
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }
};

/*
Render Functions
*/
const renderCurrentWeather = (currentWeather: any): void => {
  console.log("Rendering current weather:", currentWeather);
  const { name, weather, main, wind } = currentWeather;
  heading.innerHTML = `<strong>${name}</strong>`;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`);
  weatherIcon.setAttribute('alt', weather[0].description);
  weatherIcon.setAttribute('class', 'weather-img');
  tempEl.textContent = `Temp: ${main.temp}°C`;
  windEl.textContent = `Wind: ${wind.speed} MPH`;
  humidityEl.textContent = `Humidity: ${main.humidity} %`;
};

const renderForecast = (forecast: any[]): void => {
  if (!forecastContainer) return;
  forecastContainer.innerHTML = '<h3 class="forecast-title">5-Day Forecast</h3>';
  
  const forecastWrapper = document.createElement("div");
  forecastWrapper.classList.add("forecast-wrapper");
  
  forecast.forEach((day, index) => {
    if (index % 8 === 0) {
      const forecastCard = document.createElement("div");
      forecastCard.classList.add("forecast-card");
      forecastCard.innerHTML = `
        <h5>${new Date(day.dt_txt).toLocaleDateString()}</h5>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" class="weather-icon">
        <p>Temp: ${day.main.temp}°C</p>
        <p>Wind: ${day.wind.speed} MPH</p>
        <p>Humidity: ${day.main.humidity} %</p>
      `;
      forecastWrapper.appendChild(forecastCard);
    }
  });
  forecastContainer.appendChild(forecastWrapper);
};

const renderSearchHistory = async () => {
  if (!searchHistoryContainer) return;
  searchHistoryContainer.innerHTML = '';
  const historyList = await fetchSearchHistory();
  historyList.forEach(name => {
    const historyItem = document.createElement('button');
    historyItem.textContent = name;
    historyItem.classList.add('history-btn');
    historyItem.addEventListener('click', () => fetchWeather(name));
    searchHistoryContainer.appendChild(historyItem);
  });
};

const getAndRenderHistory = async () => {
  await renderSearchHistory();
};

const handleSearchFormSubmit = async (event: Event) => {
  event.preventDefault();
  if (!searchInput.value.trim()) return;
  await fetchWeather(searchInput.value.trim());
  updateSearchHistory(searchInput.value.trim());
  await getAndRenderHistory();
  searchInput.value = '';
};

document.addEventListener("DOMContentLoaded", getAndRenderHistory);
searchForm.addEventListener('submit', handleSearchFormSubmit);
