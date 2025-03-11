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

/*
API Calls
*/
const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch('/api/weather/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: cityName }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching weather: ${response.statusText}`);
    }

    const weatherData = await response.json();
    console.log('weatherData:', weatherData);

    if (!weatherData.current || !weatherData.forecast) {
      console.error("Error: Respuesta del servidor inválida", weatherData);
      throw new Error("Invalid weather data from server");
    }

    renderCurrentWeather(weatherData.current);
    renderForecast(weatherData.forecast);
    await getAndRenderHistory();
  } catch (error) {
    console.error("Error al obtener el clima:", error);
  }
};

const fetchSearchHistory = async (): Promise<{ name: string; id: string }[]> => {
  try {
    console.log("📥 Fetching search history...");

    const response = await fetch('/api/weather/history', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error fetching search history: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🔎 Search History Data received in frontend:", data);

    return data;
  } catch (error) {
    console.error("Error fetching search history:", error);
    return [];
  }
};

/*
Render Functions
*/
const renderCurrentWeather = (currentWeather: any): void => {
  console.log("Rendering current weather:", currentWeather);

  const { city, date, icon, description, temperature, windSpeed, humidity } = currentWeather;

  heading.innerHTML = `<strong>${city} (${date})</strong>`;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  console.log("Icon URL (current weather):", iconUrl);

  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', description);
  weatherIcon.setAttribute('class', 'weather-img');

  tempEl.textContent = `Temp: ${temperature}°C`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;
};

const renderForecast = (forecast: any[]): void => {
  console.log("Forecast data received:", forecast);

  const forecastContainer = document.getElementById('forecast') as HTMLDivElement | null;
  if (!forecastContainer) {
    console.error("❌ Error: #forecast container not found in DOM");
    return;
  }

  forecastContainer.innerHTML = '';

  const title = document.createElement("h3");
  title.textContent = "5-Day Forecast";
  title.classList.add("forecast-title");

  forecastContainer.appendChild(title);

  const forecastWrapper = document.createElement("div");
  forecastWrapper.classList.add("forecast-wrapper");

  forecast.forEach((day) => {
    const forecastCard = renderForecastCard(day);
    if (forecastCard) {
      forecastWrapper.appendChild(forecastCard);
    }
  });

  forecastContainer.appendChild(forecastWrapper);
};

const renderForecastCard = (forecast: any): HTMLDivElement => {
  console.log("Rendering forecast card:", forecast);

  if (!forecast || !forecast.date || !forecast.temperature || !forecast.icon) {
    console.error('Invalid forecast data:', forecast);
    return document.createElement("div");
  }

  const { date, icon, description, temperature, windSpeed, humidity } = forecast;

  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add('forecast-card', 'card', 'text-white', 'bg-primary', 'h-100');
  cardBody.classList.add('card-body', 'p-2', 'text-center');
  cardTitle.classList.add('card-title');
  weatherIcon.classList.add('weather-icon');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  cardTitle.innerHTML = `<strong>${date}</strong><br>${description}`;
  weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
  weatherIcon.setAttribute("alt", description);

  tempEl.textContent = `Temp: ${temperature} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  return col;
};

/*
Renderizar historial de búsqueda
*/
const renderSearchHistory = async () => {
  if (!searchHistoryContainer) {
    console.error("❌ Error: #history container not found in DOM");
    return;
  }

  searchHistoryContainer.style.display = "block"; // Asegurar que sea visible
  searchHistoryContainer.innerHTML = ''; // Limpia antes de agregar

  const historyList = await fetchSearchHistory();
  console.log("🔎 Search History Data received in frontend:", historyList);

  if (historyList.length === 0) {
    searchHistoryContainer.innerHTML = '<p class="text-center">No Previous Search History</p>';
    return;
  }

  historyList.forEach(({ name }) => {
    console.log(`✅ Adding to search history: ${name}`);

    const historyItem = document.createElement('button');
    historyItem.textContent = name;
    historyItem.classList.add('history-btn');

    historyItem.addEventListener('click', () => fetchWeather(name));
    searchHistoryContainer.appendChild(historyItem);
  });

  console.log("✅ Search history rendered successfully!");
};

/*
Función para renderizar historial
*/
const getAndRenderHistory = async () => {
  console.log("🔄 Ejecutando getAndRenderHistory...");
  await renderSearchHistory();
};

/*
Event Handlers
*/
const handleSearchFormSubmit = async (event: Event) => {
  event.preventDefault();
  if (!searchInput.value.trim()) return;

  await fetchWeather(searchInput.value.trim());
  await getAndRenderHistory();

  searchInput.value = '';
};

/*
Asegurar que el historial se renderiza al cargar la página
*/
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM cargado. Ejecutando getAndRenderHistory()");
  getAndRenderHistory();
});

searchForm.addEventListener('submit', handleSearchFormSubmit);
