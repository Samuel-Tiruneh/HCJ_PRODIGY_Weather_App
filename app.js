document.addEventListener('DOMContentLoaded', () => {
    const weatherApiKey = '95ecf574da591b4eb2db6c7fc99165b6'; 
    const unsplashApiKey = '8pgbjrRMgRmkMcenGVGDFzgv-Uj-TlTk1TsU0S6n3jA';
    const locationInput = document.getElementById('locationInput');
    const getWeatherButton = document.getElementById('getWeatherButton');
    const getLocationButton = document.getElementById('getLocationButton');
    const weatherInfo = document.getElementById('weatherInfo');
    const commonCitiesWeather = document.getElementById('commonCitiesWeather');
  
    getWeatherButton.addEventListener('click', () => {
      const location = locationInput.value;
      fetchWeather(location);
    });
  
    getLocationButton.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        });
      } else {
        weatherInfo.textContent = "Geolocation is not supported by this browser.";
      }
    });
  
    function fetchWeather(location) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
          displayWeather(data);
          fetchCityImage(location);
        })
        .catch(error => weatherInfo.textContent = "Error fetching weather data.");
    }
  
    function fetchWeatherByCoords(lat, lon) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
          displayWeather(data);
          fetchCityImage(data.name);
        })
        .catch(error => weatherInfo.textContent = "Error fetching weather data.");
    }
  
    function fetchCityImage(city) {
      fetch(`https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.full;
            document.body.style.backgroundImage = `url(${imageUrl})`;
          }
        })
        .catch(error => console.log("Error fetching city image:", error));
    }
  
    function displayWeather(data) {
      if (data.cod === 200) {
        weatherInfo.innerHTML = `
          <h2>Weather in ${data.name}</h2>
          <p><span class="weather-title">Temperature:</span> ${data.main.temp}°C</p>
          <p><span class="weather-title">Conditions:</span> ${data.weather[0].description}</p>
          <p><span class="weather-title">Humidity:</span> ${data.main.humidity}%</p>
          <p><span class="weather-title">Wind Speed:</span> ${data.wind.speed} m/s</p>
        `;
        fetchCommonCitiesWeather();
      } else {
        weatherInfo.textContent = "Location not found.";
      }
    }
    
    
  
    function fetchCommonCitiesWeather() {
      const commonCities = ['New York', 'Tokyo', 'London', 'Paris', 'Sydney'];
      commonCitiesWeather.innerHTML = '';
      commonCities.forEach(city => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`)
          .then(response => response.json())
          .then(data => {
            if (data.cod === 200) {
              commonCitiesWeather.innerHTML += `${data.name}: ${data.main.temp}°C, ${data.weather[0].description} | `;
            }
          });
      });
    }
  });
  