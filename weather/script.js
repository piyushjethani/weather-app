const apiKey = '65c01a1492f5456084571954251704';
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const resultDiv = document.getElementById('result');

    const toggleMode = () => {
      document.body.classList.toggle('dark');
    };

    const displayWeather = (data) => {
      const temp = data.current.temp_c;
      const condition = data.current.condition.text;
      const iconUrl = data.current.condition.icon;
      const tempClass = temp >= 20 ? 'hot' : 'cold';

      let html = `
        <p>Location: ${data.location.name}, ${data.location.country}</p>
        <div class="icon"><img src="https:${iconUrl}" alt="${condition}" /></div>
        <p class="temp ${tempClass}">${temp}&deg;C</p>
        <p>Condition: ${condition}</p>
        <div class="forecast">
          <h3>3-Day Forecast</h3>
      `;

      data.forecast.forecastday.slice(1, 4).forEach(day => {
        html += `
          <div class="forecast-day">
            <span><strong>${new Date(day.date).toDateString()}</strong></span>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
            <span>${day.day.avgtemp_c}&deg;C - ${day.day.condition.text}</span>
          </div>
        `;
      });

      html += `</div>`;
      resultDiv.innerHTML = html;
    };

    const fetchWeather = (query) => {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=4&aqi=no&alerts=no`;

      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('City not found');
          return response.json();
        })
        .then(displayWeather)
        .catch(err => {
          resultDiv.innerHTML = `<p class="error">Error: ${err.message}</p>`;
        });
    };

    getWeatherBtn.addEventListener('click', () => {
      const city = document.getElementById('cityInput').value.trim();
      if (!city) {
        resultDiv.innerHTML = '<p class="error">Please enter a city name.</p>';
        return;
      }
      fetchWeather(city);
    });

    // Auto-detect location on load
    window.onload = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
          fetchWeather(coords);
        });
      }
    };