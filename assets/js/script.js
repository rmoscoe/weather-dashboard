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

// Function to populate weather data
function populateWeatherData(response) {
    console.log(response);
}

// Function to populate history buttons
function populateHist() {
    $(historyDiv).empty();
    history = JSON.parse(localStorage.getItem("history"));
    if (history) {
        for (let i = 0; i < history.length; i++) {
            let newButton = document.createElement("button");
            newButton.setAttribute("class", "btn btn-secondary btn-block");
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
    geocodingURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
}

// Function to parse coordinates from geocoding response
function getCoordinates(response) {
    return [response[0].lat, response[0].lon];
}

// Function to create weather URL
function buildWeatherURL(coordinates) {
    weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&units=imperial&appid=" + apiKey;
}

// Function to geocode city with an AJAX call to the geocoding API
function geocodeCity() {
    $.ajax({
        url: geocodingURL,
        method: "GET"
        // .then callback function getWeather()
    }).then(getWeather(response));
}

// Function to get weather data
function getWeather(response) {
    // Function call to parse coordinates from geocoding response
    let coordinates = getCoordinates(response);

    // Iterate through history. If the current city is not in history, add it. If the length of history > 10, remove the oldest element.
    let cityInHist = false;
    for (let i = 0; i < history.length; i++) {
        if (history[0].name === response.city.name) {
            cityInHist = true;
            break;
        }
    }
    if (!cityInHist) {
        let newCity = {
            name: response.city.name,
            lat: coordinates[0],
            lon: coordinates[1]
        };

        if (history.length > 10) {
            history.pop();
        }
        history.reverse();
        history.pushState(newCity);
        history.reverse();
    }

    // Stringify history and save it to local storage
    localStorage.setItem("history", JSON.stringify(history));

    // Function call to populate history buttons
    populateHist();

    // Function call to build weather URL
    buildWeatherURL(coordinates);

    // AJAX call to the weather API
    $.ajax({
        url: weatherURL,
        method: "GET"
        //.then callback function to populate weather data
    }).then(populateWeatherData(response));

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
        $(".close-modal").on("click", function(){$(modal).modal("hide")});
        return;
    } else {
        // Function call to build geocoding URL
        buildGeoURL(city);

        // Function call to geocode the city
        geocodeCity();
    }
}

// Function to handle click of history button

// Event listeners for form submission and history buttons
$("form").on("submit", handleSubmit);

/*Code Drill
$.ajax({
  url: geocodingUrl,
  method: "GET"
}).then(function(response) {

  var coordinates = response;
  $(".city").text("City: " + coordinates[0]["name"]);
  lat = coordinates[0].lat;
  lon = coordinates[0].lon;
  apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

  $.ajax({
    url: apiUrl,
    method: "GET"
  }).then(function(response) {
    var weather = response;
    console.log(weather);

    //Log the data in HTML
    $(".wind").append("<p>");
    $(".wind").children().eq(0).text("Wind Direction: " + weather.wind.deg + " degrees");
    $(".wind").append("<p>");
    $(".wind").children().eq(1).text("Gust: " + weather.wind.gust);
    $(".wind").append("<p>");
    $(".wind").children().eq(2).text("Speed: " + weather.wind.speed);
    
    $(".humidity").text("Humidity: " + weather.main.humidity);

    $(".temp").text("Temperature: " + weather.main.temp + " degrees Farenheit");
    $(".temp").append("<p>");
  })
});
*/