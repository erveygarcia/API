# 🌤 Weather Dashboard

## 📌 Description
This application is a weather dashboard that allows users to search for the current weather and a 5-day forecast for any city worldwide. Users can view temperature, wind speed, and humidity for the selected location. A search history is stored for quick access to previously searched locations.

---

## 🚀 Technologies Used
- **HTML5**
- **CSS3**
- **TypeScript**
- **Bootstrap**
- **FontAwesome**
- **Vite** (for bundling)
- **OpenWeatherMap API** (to fetch weather data)
- **Node.js & Express** (for backend and search history storage)

---

## 📂 Project Structure
```
/weather-dashboard
│── client
│   ├── src
│   │   ├── main.ts  # Main application logic
│   │   ├── styles
│   │   │   ├── jass.css  # Application styles
│   ├── index.html  # Main page
│   ├── package.json  # Application dependencies
│── server
│   ├── server.ts  # Backend with Express
│   ├── routes
│   │   ├── weatherRoutes.ts  # API routes for weather data
│── README.md  # This document
```

---

## 📋 Installation & Execution
### 🔹 Prerequisites
1. Install **Node.js** and **npm**.

### 🔹 Installation
```sh
# Clone the repository
$ git clone https://github.com/erveygarcia/API.git


# Install client and server dependencies
$ npm install
```

### 🔹 Run the Application (Development Mode)
```sh
# Start the backend
$ npm run dev:server

# Start the frontend
$ npm run dev:client
```

### 🔹 Build for Production
```sh
$ npm run build
```

---

## 📌 Usage
1. Enter a city name in the search bar.
2. Click the "Search" button.
3. The current weather and 5-day forecast will be displayed.
4. The search history will be stored in the left sidebar.
5. To search for a previously searched city, simply click on it in the history list.

---

## 📌 API Used
- **[OpenWeatherMap](https://openweathermap.org/api)**: Provides real-time weather data.

---

## 🔧 Maintenance & Future Improvements
- ✅ Improve UI with more animations and custom styles.
- ✅ Add an option to manually delete search history from the interface.
- 🔜 Implement location search by geographic coordinates.
- 🔜 Support multiple temperature units (°C and °F).

---

## 📝 Author
Developed by **Ervey Garcia**.

📧 Contact: [email@example.com](mailto:erveygarcia@yahoo.com)

