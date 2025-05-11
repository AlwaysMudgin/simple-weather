const apiKey = "?key=G3UKSWKT2F7MSLNWMNR7B86KA";

const apiRequestBaseUrl =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
// 15-day forecast:  /[location]
// specific dates:   /[location]/[date1]/[date2]
//

// location = address, partial address, lat/long, zip code
// date format = yyyy-mm-dd

const searchForm = document.getElementById("search");
const searchInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-btn");

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
const currentHighDisplay = document.getElementById("high-today");
const currentLowDisplay = document.getElementById("low-today");
const sunriseDisplay = document.getElementById("sunrise-time");
const sunsetDisplay = document.getElementById("sunset-time");
const backgroundElement = document.getElementById("today");

const dayDisplays = document.querySelectorAll(".day");
console.log(dayDisplays);

async function showWeather() {
  const weather = await getWeather();
  cityDisplay.innerText = weather.address;
  currentTempDisplay.innerText = Math.round(weather.currentConditions.temp);
  const backgroundJpg = weather.currentConditions.icon + ".jpg";
  console.log(weather.currentConditions.icon);
  console.log(backgroundJpg);
  backgroundElement.style.backgroundImage = `url("${backgroundJpg}")`;
  currentHighDisplay.innerText = Math.round(weather.days[0].tempmax);
  currentLowDisplay.innerText = Math.round(weather.days[0].tempmin);
  sunriseDisplay.innerText = weather.days[0].sunrise.slice(0, 5);
  sunsetDisplay.innerText = weather.days[0].sunset.slice(0, 5);

  let dayIndex = new Date().getDay() + 1;
  for (let i = 0; i < 7; i++) {
    if (dayIndex >= 7) {
      dayIndex = 0;
    }
    console.log(dayIndex);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayDisplays[i].querySelector(".weekday").textContent = dayNames[dayIndex];
    dayDisplays[i].querySelector(".high-temp").textContent = Math.round(
      weather.days[i + 1].tempmax
    );
    dayDisplays[i].querySelector(".low-temp").textContent = Math.round(
      weather.days[i + 1].tempmin
    );
    let svg = weather.days[i + 1].icon + ".svg";
    dayDisplays[i].querySelector("img").src = svg;
    dayIndex++;
  }
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
  }
});

showWeather();
