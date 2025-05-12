const apiKey = "?key=G3UKSWKT2F7MSLNWMNR7B86KA";

const apiRequestBaseUrl =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

const searchForm = document.getElementById("search");
const searchInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-btn");

let city = "Sarasota";
let tempMode = "f";
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

const tempModeBtn = document.getElementById("temp-mode-btn");
tempModeBtn.addEventListener("click", () => {
  changeTempMode();
  showWeather();
});

const dayDisplays = document.querySelectorAll(".day");
console.log(dayDisplays);

async function showWeather() {
  const weather = await getWeather();
  cityDisplay.innerText = weather.address;
  currentTempDisplay.innerText = Math.round(
    convertTemp(weather.currentConditions.temp, tempMode)
  );
  const backgroundJpg = weather.currentConditions.icon + ".jpg";
  console.log(weather.currentConditions.icon);
  console.log(backgroundJpg);
  backgroundElement.style.backgroundImage = `url("${backgroundJpg}")`;
  currentHighDisplay.innerText = Math.round(
    convertTemp(weather.days[0].tempmax, tempMode)
  );
  currentLowDisplay.innerText = Math.round(weather.days[0].tempmin);
  sunriseDisplay.innerText = convertTime(weather.days[0].sunrise);
  sunsetDisplay.innerText = convertTime(weather.days[0].sunset);

  let dayIndex = new Date().getDay() + 1;
  for (let i = 0; i < 7; i++) {
    if (dayIndex >= 7) {
      dayIndex = 0;
    }
    console.log(dayIndex);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayDisplays[i].querySelector(".weekday").textContent = dayNames[dayIndex];
    dayDisplays[i].querySelector(".high-temp").textContent = Math.round(
      convertTemp(weather.days[i + 1].tempmax, tempMode)
    );
    dayDisplays[i].querySelector(".low-temp").textContent = Math.round(
      convertTemp(weather.days[i + 1].tempmin, tempMode)
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

function convertTemp(value, units) {
  if (units === "f") {
    return value;
  } else {
    return ((value - 32) * 5) / 9;
  }
}

function convertTime(time) {
  const [h, m] = time.split(":");
  const meridian = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m} ${meridian}`;
}

function changeTempMode() {
  if (tempMode === "f") {
    tempMode = "c";
  } else {
    tempMode = "f";
  }
  document.getElementById("temp-mode").innerText = tempMode.toUpperCase();
}

showWeather();
