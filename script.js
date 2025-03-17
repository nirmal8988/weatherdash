const apiKey = "8bdabd2dce266bdffd2af75db620d812";
const weatherIcons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Mist: "🌫️",
};

let isCelsius = true;
let isDarkMode = false;

async function fetchWeather(lat, lon) {
    try {
        document.getElementById("loading-spinner").style.display = "block";
        document.getElementById("loading-message").style.display = "block";

        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const weatherData = await weatherResponse.json();

        const temp = isCelsius ? weatherData.main.temp : (weatherData.main.temp * 9/5 + 32).toFixed(2);

        document.getElementById("location").innerHTML = `<div class="weather-icon">${weatherIcons[weatherData.weather[0].main] || "🌍"}</div><i class="fas fa-map-marker-alt"></i> ${weatherData.name}`;
        document.getElementById("temperature").innerHTML = `<div class="weather-icon">🌡️</div><i class="fas fa-thermometer-half"></i> ${temp}°${isCelsius ? 'C' : 'F'}`;
        document.getElementById("humidity").innerHTML = `<div class="weather-icon">💧</div><i class="fas fa-tint"></i> ${weatherData.main.humidity}%`;

        const windSpeedKmh = (weatherData.wind.speed * 3.6).toFixed(2);
        updateSpeedometer(windSpeedKmh);
        document.getElementById("wind-speed-text").textContent = `Wind Speed: ${windSpeedKmh} km/h`;
        await fetchAQI(lat, lon);
        await fetchForecast(lat, lon);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to fetch weather data. Please try again.");
    } finally {
        document.getElementById("loading-spinner").style.display = "none";
        document.getElementById("loading-message").style.display = "none";
    }
}

async function fetchAQI(lat, lon) {
    try {
        const aqiResponse = await fetch(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const aqiData = await aqiResponse.json();
        const aqiValue = aqiData.list[0].main.aqi;
        const aqiStatus = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqiValue - 1];
        document.getElementById("aqi").innerHTML = `<div class="weather-icon">🌫️</div><i class="fas fa-smog"></i> ${aqiStatus} (${aqiValue})`;
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        document.getElementById("aqi").innerHTML = `<div class="weather-icon">🌫️</div><i class="fas fa-smog"></i> AQI Unavailable`;
    }
}

async function fetchForecast(lat, lon) {
    try {
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const forecastData = await forecastResponse.json();
        const forecastContainer = document.getElementById("forecast");
        forecastContainer.innerHTML = "";

        for (let i = 0; i < 5; i++) {
            const forecast = forecastData.list[i * 8];
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            const icon = weatherIcons[forecast.weather[0].main] || "🌍";
            const temp = isCelsius ? forecast.main.temp : (forecast.main.temp * 9/5 + 32).toFixed(2);
            const description = forecast.weather[0].description;

            forecastContainer.innerHTML += `
                <div class="forecast-item">
                    <div class="weather-icon">${icon}</div>
                    <div>${date}</div>
                    <div>${temp}°${isCelsius ? 'C' : 'F'}</div>
                    <div>${description}</div>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

function updateSpeedometer(speed) {
    const maxSpeed = 120; // Max speed in km/h
    const rotation = (speed / maxSpeed) * 180 - 90;
    document.getElementById('wind-needle').style.transform = `rotate(${rotation}deg)`;
}

async function fetchWeatherByCity(cityName) {
    try {
        document.getElementById("loading-spinner").style.display = "block";
        document.getElementById("loading-message").style.display = "block";

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        if (data.cod === 200) {
            const { lat, lon } = data.coord;
            fetchWeather(lat, lon);

            const searchedCitiesContainer = document.getElementById("searched-cities");
            const icon = weatherIcons[data.weather[0].main] || "🌍";
            const temp = isCelsius ? data.main.temp : (data.main.temp * 9/5 + 32).toFixed(2);
            const cityHTML = `
                <div class="searched-city">
                    <div class="weather-icon">${icon}</div>
                    <div>
                        <strong>${data.name}</strong><br>
                        ${temp}°${isCelsius ? 'C' : 'F'}, ${data.weather[0].description}<br>
                        Wind: ${(data.wind.speed * 3.6).toFixed(2)} km/h
                    </div>
                </div>
            `;
            searchedCitiesContainer.insertAdjacentHTML("afterbegin", cityHTML);
        } else {
            alert("City not found. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching weather data by city:", error);
    } finally {
        document.getElementById("loading-spinner").style.display = "none";
        document.getElementById("loading-message").style.display = "none";
    }
}

document.getElementById("search-button").addEventListener("click", () => {
    const cityName = document.getElementById("city-search").value;
    if (cityName) {
        fetchWeatherByCity(cityName);
    }
});

document.getElementById("city-search").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const cityName = document.getElementById("city-search").value;
        if (cityName) {
            fetchWeatherByCity(cityName);
        }
    }
});

function shareViaWhatsApp() {
    const location = document.getElementById("location").textContent;
    const temperature = document.getElementById("temperature").textContent;
    const humidity = document.getElementById("humidity").textContent;
    const aqi = document.getElementById("aqi").textContent;
    const windSpeed = document.getElementById("wind-speed-text").textContent;

    const message = `Check out the current weather:\nLocation: ${location}\nTemperature: ${temperature}\nHumidity: ${humidity}\nAQI: ${aqi}\nWind Speed: ${windSpeed}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function shareViaFacebook() {
    const location = document.getElementById("location").textContent;
    const temperature = document.getElementById("temperature").textContent;
    const humidity = document.getElementById("humidity").textContent;
    const aqi = document.getElementById("aqi").textContent;
    const windSpeed = document.getElementById("wind-speed-text").textContent;

    const message = `Check out the current weather:\nLocation: ${location}\nTemperature: ${temperature}\nHumidity: ${humidity}\nAQI: ${aqi}\nWind Speed: ${windSpeed}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function shareViaInstagram() {
    const location = document.getElementById("location").textContent;
    const temperature = document.getElementById("temperature").textContent;
    const humidity = document.getElementById("humidity").textContent;
    const aqi = document.getElementById("aqi").textContent;
    const windSpeed = document.getElementById("wind-speed-text").textContent;

    const message = `Check out the current weather:\nLocation: ${location}\nTemperature: ${temperature}\nHumidity: ${humidity}\nAQI: ${aqi}\nWind Speed: ${windSpeed}`;
    const url = `https://www.instagram.com/?url=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function toggleTemperatureUnit() {
    isCelsius = !isCelsius;
    const unitButton = document.getElementById("unit-toggle");
    unitButton.textContent = `Switch to ${isCelsius ? 'Fahrenheit' : 'Celsius'}`;
    const lat = localStorage.getItem('lat');
    const lon = localStorage.getItem('lon');
    if (lat && lon) {
        fetchWeather(lat, lon);
    }
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.querySelector('.dashboard').classList.toggle('dark-mode', isDarkMode);
    document.querySelector('.right-container').classList.toggle('dark-mode', isDarkMode);
    document.querySelectorAll('.info-item').forEach(item => item.classList.toggle('dark-mode', isDarkMode));
    document.querySelectorAll('.searched-city').forEach(city => city.classList.toggle('dark-mode', isDarkMode));
    document.querySelectorAll('.forecast-item').forEach(item => item.classList.toggle('dark-mode', isDarkMode));
    const darkModeButton = document.getElementById("dark-mode-toggle");
    darkModeButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

document.getElementById("unit-toggle").addEventListener("click", toggleTemperatureUnit);
document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            localStorage.setItem('lat', lat);
            localStorage.setItem('lon', lon);
            fetchWeather(lat, lon);
        }, (error) => {
            console.error("Error getting location:", error);
            alert("Failed to get location. Please enable location services.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

document.getElementById("loading-spinner").style.display = "block";
document.getElementById("loading-message").style.display = "block";
getLocation();