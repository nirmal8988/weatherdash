# Weather Dashboard

## What is a Weather Dashboard?

A **Weather Dashboard** is a **web application** that displays current weather information and possibly a forecast for a user’s location or a searched city. It uses **API data** (like OpenWeatherMap) to fetch live weather details and updates the UI dynamically.

---

## Why build it?

✅ Helps you practice **HTML structuring, CSS styling, and JavaScript DOM manipulation**.
✅ Teaches **API integration using fetch/AJAX**.
✅ Strengthens understanding of **JSON parsing** and **event handling**.
✅ Useful for portfolio to showcase frontend skills.

---

## Structure

### 1️⃣ HTML

* Builds the structure of your dashboard:

  * A **search bar** to enter city names.
  * A **search button**.
  * Containers to display:

    * City Name
    * Current temperature
    * Weather description
    * Humidity
    * Wind speed
    * Weather icon

### 2️⃣ CSS

* Styles the dashboard for a **clean, responsive look**.
* Uses flexbox or grid for alignment.
* Adds color themes based on weather (optional).

### 3️⃣ JavaScript

* Handles **fetching weather data from APIs**.
* Adds event listeners for button clicks or `Enter` key submission.
* Updates the DOM elements with the weather data dynamically.
* Handles errors (e.g., city not found).

---

## Basic Workflow

1️⃣ User enters a city and clicks "Search".
2️⃣ JavaScript captures the input and makes a **fetch request** to a weather API (e.g., `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}`).
3️⃣ API returns JSON containing weather data.
4️⃣ JavaScript extracts temperature, weather description, humidity, etc.
5️⃣ Updates the HTML elements with this data.
6️⃣ Displays weather icon and details cleanly for the user.

---

## Features you can add

* 5-day weather forecast section.
* Temperature unit toggle (Celsius/Fahrenheit).
* Geolocation to fetch weather based on user’s current location.
* Background change based on weather (sunny, rainy, cloudy).
* Local storage to save last searched city.

---

## Example File Structure

```
weather-dashboard/
│
├── index.html
├── styles.css
└── script.js
```

---

## Simple Example Snippets

### HTML

```html
<input type="text" id="cityInput" placeholder="Enter city">
<button id="searchBtn">Search</button>
<div id="weatherInfo"></div>
```

### JavaScript (simplified)

```javascript
const apiKey = "YOUR_API_KEY";
document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("weatherInfo").innerHTML = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Weather: ${data.weather[0].description}</p>
        `;
    })
    .catch(() => alert("City not found"));
});
```

---

## What you will learn by building it

✅ API usage and handling responses.
✅ Updating DOM dynamically with JavaScript.
✅ Error handling in JavaScript.
✅ Styling practical UIs with CSS.
✅ Modular project structuring.

---

<img width="630" alt="image" src="https://github.com/user-attachments/assets/ec9fa59e-0edd-4785-ad9f-83cc0f383e80" />

<img width="532" alt="image" src="https://github.com/user-attachments/assets/9ac49420-3794-4c8b-9f07-fc847239f800" />

![image](https://github.com/user-attachments/assets/636b9730-edf9-448a-94a5-bd152fdca37b)
