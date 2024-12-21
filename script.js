function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoordinates(lat, lon);
        }, error => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

function getWeatherByCoordinates(lat, lon) {
    const apiKey = '84e97f3c9f56ca2db90d3ca06814b3dd';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            document.getElementById('city').value = data.name;
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function getWeather() {
    const apiKey = '84e97f3c9f56ca2db90d3ca06814b3dd';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching weather data. Please check the city name and try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    
    const temp = (data.main.temp - 273.15).toFixed(1);
    const feelsLike = (data.main.feels_like - 273.15).toFixed(1);
    const tempMin = (data.main.temp_min - 273.15).toFixed(1);
    const tempMax = (data.main.temp_max - 273.15).toFixed(1);

    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        
        <div class="weather-section">
            <h3>Temperature Data</h3>
            <p>Temperature: ${temp}°C</p>
            <p>Feels Like: ${feelsLike}°C</p>
            <p>Min Temperature: ${tempMin}°C</p>
            <p>Max Temperature: ${tempMax}°C</p>
            <p>Pressure: ${data.main.pressure} hPa</p>
            <p>Sea Level: ${data.main.sea_level || 'N/A'} hPa</p>
            <p>Ground Level: ${data.main.grnd_level || 'N/A'} hPa</p>
            <p>Humidity: ${data.main.humidity}%</p>
        </div>

        <div class="weather-section">
            <h3>Weather Conditions</h3>
            <p>Condition: ${data.weather[0].main}</p>
            <p>Description: ${data.weather[0].description}</p>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
        </div>

        <div class="weather-section">
            <h3>Cloud & Wind Information</h3>
            <p>Cloud Coverage: ${data.clouds.all}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <p>Wind Direction: ${data.wind.deg}°</p>
            <p>Wind Gust: ${data.wind.gust || 'N/A'} m/s</p>
        </div>

        <div class="weather-section">
            <h3>Additional Information</h3>
            <p>Visibility: ${data.visibility / 1000} km</p>
            <p>Timestamp: ${new Date(data.dt * 1000).toLocaleString()}</p>
        </div>
    `;
}

function displayHourlyForecast(forecastList) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    hourlyForecast.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        const forecast = forecastList[i];
        const temp = (forecast.main.temp - 273.15).toFixed(1);
        const time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <h4>${time}</h4>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon">
            <p>${temp}°C</p>
            <p>${forecast.weather[0].description}</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
            <p>Wind: ${forecast.wind.speed} m/s</p>
        `;
        hourlyForecast.appendChild(forecastItem);
    }
}
