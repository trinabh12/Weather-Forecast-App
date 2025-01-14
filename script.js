// OpenWeatherMap API Key
const API_KEY = "d92894d2ac0f5199e8c9c7b2dc387e41";

// DOM Elements
const searchBtn = document.getElementById("search");
const cityInput = document.getElementById("city");
const currentLocationBtn = document.getElementById("current-location");
const currentWeatherDiv = document.getElementById("current-weather");
const forecastDiv = document.getElementById("forecast");
const locationEl = document.getElementById("location");
const descriptionEl = document.getElementById("description");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const weatherIconEl = document.getElementById("weather-icon");

// fetch weather icon URL
function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// fetch current weather by city name
async function fetchCurrentWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.cod !== 200) {
            alert(data.message);
            return;
        }

        displayCurrentWeather(data);
    } catch (error) {
        alert("Unable to fetch current weather. Please try again.");
    }
}

// fetch current weather by coordinates
async function fetchCurrentWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.cod !== 200) {
            alert(data.message);
            return;
        }

        displayCurrentWeather(data);
    } catch (error) {
        alert("Unable to fetch current weather. Please try again.");
    }
}

// fetch 5-day forecast by city name
async function fetchForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.cod !== "200") {
            alert(data.message);
            return;
        }

        displayForecast(data);
    } catch (error) {
        alert("Unable to fetch forecast. Please try again.");
    }
}

// fetch 5-day forecast by coordinates
async function fetchForecastByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.cod !== "200") {
            alert(data.message);
            return;
        }

        displayForecast(data);
    } catch (error) {
        alert("Unable to fetch forecast. Please try again.");
    }
}

// display current weather
function displayCurrentWeather(data) {
    currentWeatherDiv.style.display = "block";
    locationEl.textContent = `${data.name}, ${data.sys.country}`;
    descriptionEl.textContent = `Weather: ${data.weather[0].description}`;
    temperatureEl.querySelector("span").textContent = `${data.main.temp}°C`;
    weatherIconEl.src = getWeatherIcon(data.weather[0].icon);
    humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
}

// display 5-day forecast
function displayForecast(data) {
    forecastDiv.innerHTML = ""; 

    const dailyData = data.list.filter((entry) =>
        entry.dt_txt.includes("12:00:00")
    );

    dailyData.forEach((day) => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        const temp = day.main.temp;
        const description = day.weather[0].description;
        const iconUrl = getWeatherIcon(day.weather[0].icon);

        const forecastDay = document.createElement("div");
        forecastDay.className =
            "bg-gray-800 p-4 rounded-lg shadow-md text-center w-1/5"; 
        forecastDay.innerHTML = `
            <h3 class="text-lg font-bold">${date}</h3>
            <img src="${iconUrl}" alt="Weather Icon" class="w-12 h-12 mx-auto my-2" />
            <p class="capitalize">${description}</p>
            <p>${temp}°C</p>
        `;
        forecastDiv.appendChild(forecastDay);
    });
}

// Event listeners
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }
    fetchCurrentWeather(city);
    fetchForecast(city);
});

currentLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchCurrentWeatherByCoords(latitude, longitude);
                fetchForecastByCoords(latitude, longitude);
            },
            () => {
                alert("Unable to fetch your location. Please enable location services.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
