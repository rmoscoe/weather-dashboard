// Global variables to hold element selectors, history array, and API URL segments
const searchForm = document.querySelector("form");
const searchField = document.getElementById("search");
const historyDiv = document.getElementById("history-container");
const weatherDisplay = document.getElementById("content-right");
const modal = document.getElementById("invalid-search");
let history = [];
const apiKey = "e92cd274e40c97a9b0115834d3205232";
let geocodingURL;
let weatherURL;
let forecastURL;

// Function to populate weather data
function populateWeatherData(response) {
    $(weatherDisplay).empty();
    let weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
    let weatherH2 = document.createElement("h2");
    weatherH2.textContent = "Current Weather for " + response.name + " ";
    let currentWeather = document.createElement("div");
    currentWeather.setAttribute("class", " mt-0 mb-3 border border-secondary rounded p-4");
    let dayH3 = document.createElement("h3");
    dayH3.textContent = dayjs(response.dt_txt).format("MMMM D, YYYY");
    weatherH2.append(weatherIcon);
    currentWeather.appendChild(weatherH2);
    currentWeather.appendChild(dayH3);
    weatherDisplay.appendChild(currentWeather);

    let temp = document.createElement("p");
    temp.textContent = "Current Temperature: " + response.main.temp + " F";
    let wind = document.createElement("p");
    wind.textContent = "Wind: " + response.wind.speed + " mph";
    let humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + response.main.humidity + "%";
    currentWeather.append(temp, wind, humidity);
}

// Function to populate forecast data
function populateForecastData(response) {
    let forecast = document.createElement("div");
    let forecastH3 = document.createElement("h3");
    forecastH3.textContent = "5-Day Forecast:"
    let forecastDetails = document.createElement("div");
    forecastDetails.setAttribute("class", "d-flex justify-content-between")
    forecast.appendChild(forecastH3);
    forecast.appendChild(forecastDetails);
    weatherDisplay.appendChild(forecast);

    for (let i = 0; i < 5; i++) {
        let day = document.createElement("div");
        day.setAttribute("class", "p-3 text-white");
        day.style.width = "16%";
        day.style.backgroundColor = "var(--bs-primary-text)";
        let dayH4 = document.createElement("h4");
        dayH4.setAttribute("class", "text-white");
        dayH4.textContent = dayjs(response.list[i * 8 + 1].dt_txt).format("MMMM D, YYYY");
        let weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + response.list[i * 8 + 1].weather[0].icon + "@2x.png")
        let temp = document.createElement("p");
        temp.style.color = "white";
        temp.textContent = "Temp: " + response.list[i * 8 + 1].main.temp + " F";
        let wind = document.createElement("p");
        wind.style.color = "white";
        wind.textContent = "Wind: " + response.list[i * 8 + 1].wind.speed + " mph";
        let humidity = document.createElement("p");
        humidity.style.color = "white";
        humidity.textContent = "Humidity: " + response.list[i * 8 + 1].main.humidity + "%";

        day.appendChild(dayH4);
        day.appendChild(weatherIcon);
        day.appendChild(temp);
        day.appendChild(wind);
        day.appendChild(humidity);
        forecastDetails.appendChild(day);
    }
}

// Function to populate history buttons
function populateHist() {
    $(historyDiv).empty();
    if (JSON.parse(localStorage.getItem("history"))) {
        history = JSON.parse(localStorage.getItem("history"));
    }
    if (history) {
        for (let i = 0; i < history.length; i++) {
            let newButton = document.createElement("button");
            newButton.setAttribute("class", "btn btn-secondary btn-block w-100 mb-2");
            newButton.setAttribute("type", "button");
            newButton.setAttribute("data-lat", history[i].lat);
            newButton.setAttribute("data-lon", history[i].lon);
            newButton.textContent = history[i].name;
            historyDiv.appendChild(newButton);
        }
    }
}

// Function call to populate history buttons when the page loads
populateHist();

// Function to assemble geocoding URL
function buildGeoURL(city) {
    geocodingURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
}

// Function to parse coordinates from geocoding response
function getCoordinates(response) {
    return [response[0].lat, response[0].lon];
}

// Function to create current weather URL
function buildWeatherURL(coordinates) {
    weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&units=imperial&appid=" + apiKey;
}

// Function to create forecast URL
function buildForecastURL(coordinates) {
    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&units=imperial&appid=" + apiKey;
}

// Function to geocode city with an AJAX call to the geocoding API
function geocodeCity() {
    $.ajax({
        url: geocodingURL,
        method: "GET"
        // .then callback function getWeather()
    }).then(function (response) {
        getWeather(response);
    })
}

// Function to get weather data
function getWeather(response) {
    // Function call to parse coordinates from geocoding response
    let coordinates = getCoordinates(response);

    // Iterate through history. If the current city is not in history, add it. If the length of history > 10, remove the oldest element.
    let cityInHist = false;
    if (history) {
        for (let i = 0; i < history.length; i++) {
            if (history[i].name === response[0].name) {
                cityInHist = true;
                break;
            }
        }
    }
    if (!cityInHist) {
        let newCity = {
            "name": response[0].name,
            "lat": coordinates[0],
            "lon": coordinates[1]
        };

        if (history) {
            if (history.length >= 10) {
                history.pop();
            }
            history.reverse();
        }
        history.push(newCity);
        history.reverse();
    }

    // Stringify history and save it to local storage
    localStorage.setItem("history", JSON.stringify(history));

    // Function call to populate history buttons
    populateHist();

    // Function call to build forecast URL
    buildForecastURL(coordinates);

    // Function call to build current weather URL
    buildWeatherURL(coordinates);

    // AJAX call to the current weather API
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        populateWeatherData(response);
    })

    // AJAX call to the forecast API
    $.ajax({
        url: forecastURL,
        method: "GET"
        //.then callback function to populate weather data
    }).then(function (response) {
        populateForecastData(response);
    })

}

// Function to handle submit event
function handleSubmit(event) {
    // Prevent default behavior
    event.preventDefault();

    // Store the city in a variable
    let city = searchField.value.trim();

    // Validate submission value
    if (city === "") {
        $(modal).modal("show");
        $(".close-modal").on("click", function () { $(modal).modal("hide") });
        return;
    } else {
        // Function call to build geocoding URL
        buildGeoURL(city);
        searchField.value = "";

        // Function call to geocode the city
        geocodeCity();
    }
}

// Function to handle click of history button
function handleHistoryClick(event) {
    // Prevent default behavior
    event.preventDefault();

    // Store button data in variables
    let city = event.target.textContent;
    let lat = event.target.getAttribute("data-lat");
    let lon = event.target.getAttribute("data-lon");

    // Update history
    let index;
    for (let i = 0; i < history.length; i++) {
        if (history[i].name === city) {
            index = i;
            break;
        }
    }
    history.splice(index, 1);
    let newCity = {
        "name": city,
        "lat": lat,
        "lon": lon
    };

    history.reverse();
    history.push(newCity);
    history.reverse();

    // Stringify history and save it to local storage
    localStorage.setItem("history", JSON.stringify(history));

    // Function call to populate history buttons
    populateHist();

    // Build weather and forecast URLs
    let coordinates = [lat, lon];
    buildWeatherURL(coordinates);
    buildForecastURL(coordinates);

    // AJAX call to the current weather API
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        populateWeatherData(response);
    })

    // AJAX call to the forecast API
    $.ajax({
        url: forecastURL,
        method: "GET"
        //.then callback function to populate weather data
    }).then(function (response) {
        populateForecastData(response);
    })
}

// Event listeners for form submission and history buttons
$("form").on("submit", handleSubmit);
$(historyDiv).on("click", handleHistoryClick);