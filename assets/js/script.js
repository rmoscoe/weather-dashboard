// Global variables to hold element selectors, history array, and API URL segments
const searchForm = document.querySelector("form");
const searchField = document.querySelector("input");
const historyDiv = document.getElementById("history-container");
const weatherDisplay = document.getElementById("content-right");
let history = [];
const apiKey = "e92cd274e40c97a9b0115834d3205232";
let geocodingURL;
let weatherURL;

// Function to populate weather data

// Function to populate history buttons
function populateHist () {
    $(historyDiv).empty();
    history = localStorage.getItem("history");
    for (let i = 0; i < history.length; i++) {
        let newButton = document.createElement("button");
        newButton.setAttribute("class", "btn btn-secondary btn-block");
        newButton.setAttribute("type", "button");
        newButton.textContent = history[i];
        historyDiv.appendChild(newButton);
    }
}

// Function call to populate history buttons when the page loads
populateHist();

// Function to assemble geocoding URL

// Function to parse coordinates from geocoding response

// Function to create weather URL

// Function to handle submit event with an AJAX call to the geocoding API

// Function to handle click of history button

// Event listeners for form submission and history buttons

/*Code Drill
// Create an AJAX call to retrieve data Log the data in console
var geocodingUrl = "http://api.openweathermap.org/geo/1.0/direct?q=Bujumbura,108&limit=1&appid=" + apiKey;
var lat;
var lon;

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