/* --------------- Weather Web App  --------------------- */
let show = document.getElementById("show");
let search = document.getElementById("search");
let locationBtn = document.getElementById("location");
let cityVal = document.getElementById("city");

// Make sure you have your own key.
let key = "e9b9eb816c7477affbeb8f4ffd47012e";

let getWeather = (cityName, latitude, longitude) => {
    let url;
    let forecastUrl;

    if (latitude && longitude) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;
    } else {
        let cityValue = cityVal.value;
        if (cityValue.length == 0) {
            show.innerHTML = `<h3 class="error">Please enter a city name</h3>`;
            return;
        }
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=${key}&units=metric`;
        cityVal.value = "";
    }

    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            let weatherCondition = data.weather[0].main.toLowerCase();
            console.log(weatherCondition);  // Log the weather condition
            updateBackground(weatherCondition);

            show.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <h4 class="weather">${data.weather[0].main}</h4>
                <h4 class="desc">${data.weather[0].description}</h4>
                <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
                <h1>${data.main.temp} &#176;</h1>
                <div class="temp_container">
                    <div>
                        <h4 class="title">feels like</h4>
                        <h4 class="temp">${data.main.feels_like}&#176;</h4>
                    </div>
                    <div>
                        <h4 class="title">humidity</h4>
                        <h4 class="temp">${data.main.humidity}%</h4>
                    </div>
                    <div>
                        <h4 class="title">min</h4>
                        <h4 class="temp">${data.main.temp_min}&#176;</h4>
                    </div>
                    <div>
                        <h4 class="title">max</h4>
                        <h4 class="temp">${data.main.temp_max}&#176;</h4>
                    </div>   
                </div>
            `;
            getForecastData(forecastUrl, data.name);
        })
        .catch(() => {
            show.innerHTML = `<h3 class="error">City not found</h3>`;
        });
};

let getForecastData = (forecastUrl, cityName) => {
    fetch(forecastUrl)
        .then((resp) => resp.json())
        .then((forecastData) => {
            const forecastContainer = document.getElementById("forecast");
            forecastContainer.innerHTML = "";

            const uniqueForecastDays = [];
            const fiveDaysForecast = forecastData.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            fiveDaysForecast.forEach((forecastItem) => {
                const date = new Date(forecastItem.dt_txt);
                const forecastItemHtml = `
                    <div class="forecast-item">
                        <h4>${date.toDateString()}</h4>
                        <img src="https://openweathermap.org/img/w/${forecastItem.weather[0].icon}.png">
                        <p>${forecastItem.main.temp}&#176;C</p>
                        <p>${forecastItem.weather[0].description}</p>
                    </div>
                `;
                forecastContainer.insertAdjacentHTML("beforeend", forecastItemHtml);
            });
        });
};

let updateBackground = (weather) => {
    let body = document.body;
    body.classList.remove("sunny", "cloudy", "stormy", "rainy", "night", "hazy", "snowy");

    switch (weather) {
        case 'clear':
            body.classList.add("sunny");
            break;
        case 'clouds':
            body.classList.add("cloudy");
            break;
        case 'thunderstorm':
        case 'storm':
            body.classList.add("stormy");
            break;
        case 'drizzle':
        case 'rain':
            body.classList.add("rainy");
            break;
        case 'snow':
            body.classList.add("snowy");
            break;
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            body.classList.add("hazy");
            break;
        default:
            body.classList.add("night");
            break;
    }
};

// Event listeners
search.addEventListener("click", () => getWeather(cityVal.value));
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            getWeather(null, position.coords.latitude, position.coords.longitude);
        });
    } else {
        show.innerHTML = `<h3 class="error">Geolocation is not supported by this browser</h3>`;
    }
});

// Initial load
getWeather("London");
