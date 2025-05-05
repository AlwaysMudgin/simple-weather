const apiKey = "?key=G3UKSWKT2F7MSLNWMNR7B86KA";

const apiRequestBaseUrl =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
// 15-day forecast:  /[location]
// specific dates:   /[location]/[date1]/[date2]
//

// location = address, partial address, lat/long, zip code
// date format = yyyy-mm-dd

const searchForm = document.getElementById("city-search");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("get-data");
const currWeatherDiv = document.getElementById("current-weather");

let city = "Sarasota";
async function getWeather() {
  try {
    const response = await fetch(apiRequestBaseUrl + city + apiKey, {
      mode: "cors",
    });
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  } catch (error) {
    console.log(error);
  }
}

const cityDisplay = document.getElementById("city-name");
const currentTempDisplay = document.getElementById("current-temp");
const currentConditionsIcon = document.getElementById(
  "current-conditions-icon"
);
const highTodayDisplay = document.getElementById("high-today");
const lowTodayDisplay = document.getElementById("low-today");
const sunriseTodayDisplay = document.getElementById("sunrise-today");
const sunsetTodayDisplay = document.getElementById("sunset-today");
const searchErrorDisplay = document.getElementById("search-error");
const background = document.getElementById("background");

async function showWeather() {
  const weather = await getWeather();
  cityDisplay.innerText = weather.address;
  currentTempDisplay.innerText =
    `${weather.currentConditions.temp}` + "\u00B0" + "F";
  const icon = weather.currentConditions.icon;
  const iconSVG = icon + ".svg";
  const backgroundJpg = icon + ".jpg";
  currentConditionsIcon.src = iconSVG;
  background.style.backgroundImage = `url("${backgroundJpg}")`;
  if (
    icon == "clear-night" ||
    icon == "partly-cloudy-night" ||
    icon == "rain"
  ) {
    document.querySelector("#search").setAttribute("data-theme", "dark");
  } else {
    document.querySelector("#search").setAttribute("data-theme", "");
  }
  highTodayDisplay.innerText = `${weather.days[0].tempmax}` + "\u00B0" + "F";
  lowTodayDisplay.innerText = `${weather.days[0].tempmin}` + "\u00B0" + "F";
  sunriseTodayDisplay.innerText = `Sunrise ${weather.days[0].sunrise.slice(
    0,
    5
  )}`;
  sunsetTodayDisplay.innerText = `Sunset ${weather.days[0].sunset.slice(0, 5)}`;
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newCity = searchInput.value;
  console.log("New City " + newCity);
  const constraint = new RegExp("^[a-z '-]+$", "i");
  console.log("Contraint test " + constraint.test(newCity));
  if (constraint.test(newCity)) {
    city = newCity;
    showWeather();
  } else {
    searchErrorDisplay.innertext = "Invalid characters";
    return;
  }
});

showWeather();
