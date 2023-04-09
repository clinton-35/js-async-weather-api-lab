const API_KEY = "b72d1d8b6c7fe9a44f73fcdeda90fe0d";

function handleFormSubmit(event) {
  event.preventDefault();
  const cityInput = document.getElementById("city").value;
  fetchCurrentWeather(cityInput);
  fetchFiveDayForecast(cityInput);
}

function fetchCurrentWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(json => displayCurrentWeather(json));
}

function displayCurrentWeather(json) {
  document.getElementById("temp").textContent = `${json.main.temp}°F`;
  document.getElementById("low").textContent = `${json.main.temp_min}°F`;
  document.getElementById("high").textContent = `${json.main.temp_max}°F`;
  document.getElementById("humidity").textContent = `${json.main.humidity}%`;
  document.getElementById("cloudCover").textContent = `${json.clouds.all}%`;
  document.getElementById("sunrise").textContent = `${new Date(json.sys.sunrise * 1000).toLocaleTimeString()}`;
  document.getElementById("sunset").textContent = `${new Date(json.sys.sunset * 1000).toLocaleTimeString()}`;
}

function fetchFiveDayForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(json => displayFiveDayForecast(json));
}

function displayFiveDayForecast(json) {
  const forecastSection = document.querySelector('aside');
  forecastSection.innerHTML = '';
  for (let i = 0; i < json.list.length; i+=8) {
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    forecastItem.innerHTML = `
      <h3>${new Date(json.list[i].dt_txt).toLocaleDateString()}</h3>
      <p>${json.list[i].weather[0].description}</p>
      <p>${json.list[i].main.temp}°F</p>
      <img src="http://openweathermap.org/img/w/${json.list[i].weather[0].icon}.png"/>
    `;
    forecastSection.appendChild(forecastItem);
  }
}

function createChart(json) {
  const tempData = json.list.map(item => item.main.temp);
  const dateLabels = json.list.map(item => new Date(item.dt_txt).toLocaleDateString());
  const ctx = document.getElementById('WeatherChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dateLabels,
      datasets: [{
        label: 'Temperature (°F)',
        data: tempData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const cityForm = document.getElementById('cityForm');
  cityForm.addEventListener('submit', handleFormSubmit);
});
