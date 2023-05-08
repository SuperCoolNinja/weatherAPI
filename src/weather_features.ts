import { API_KEY_WEATHER, API_KEY_CITY } from "./config.local.ts"; // --> to be : config.js
import { fetchData } from "./cache.js";

// Change the background color depending on the time from city :
const changeBackgroundFromTime = async (lat: number, lon: number) => {
  const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
  const response = await fetch(url);
  const data = await response.json();

  const sunrise = new Date(data.results.sunrise);
  const sunset = new Date(data.results.sunset);
  const now = new Date();

  if (now > sunrise && now < sunset) {
    document.body.style.background = `linear-gradient(
        90deg,
        rgb(12, 44, 112) 0%,
        rgb(19, 86, 163) 0%,
        rgb(128, 174, 227) 100%
      )`;
  } else {
    document.body.style.background = `linear-gradient(
        90deg,
        rgb(16, 7, 134) 0%,
        rgb(34, 59, 108) 0%,
        rgb(16, 18, 19) 100%
      )`;
  }
};

// target the list and the div from the dom :
let list = document.getElementById("wrapper_item") as HTMLElement;
const div = document.createElement("div") as HTMLElement;
div.id = "wrapper_weather";
document.body.append(div);

// create a list/replace the list to show the cards :
const createNewListItem = (): void => {
  if (list) {
    list.remove();
  }

  list = document.createElement("ul");
  list.id = "wrapper_item";
  div.appendChild(list);
};

// Find the first forecast for this day
const findWeather = (date: Date, forecasts: any) => {
  const forecast = forecasts.find((f: any) => {
    const fdate = new Date(f.dt_txt);
    fdate.setHours(0, 0, 0, 0);
    return fdate.getTime() === date.getTime();
  });

  return forecast;
};

// Find the actual time from today :
const getTheActualTime = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// used to assign an icon to represent the actual weather :
const assignWeatherIcon = (
  weatherDescription: any,
  cloudsPercentage: number
) => {
  if (weatherDescription.includes("clear")) {
    return "./assets/sun.svg";
  } else if (weatherDescription.includes("snow")) {
    return "./assets/snow.svg";
  } else if (weatherDescription.includes("cloud")) {
    return "./assets/cloudy.svg";
  } else if (cloudsPercentage > 50) {
    return "./assets/clouds.svg";
  }
  return "./assets/rain.svg";
};

// Show all the Cards Weather :
const showCardsWeather = (dayOfWeek: string, forecast: any) => {
  const temperature = forecast.main.temp;
  const d_description = forecast.weather[0].description;
  const d_cloudsPercentage = forecast.clouds.all;
  const d_item = document.createElement("li");
  const d_day = document.createElement("h2");
  const d_temp = document.createElement("h2");
  const d_img = document.createElement("img");

  d_item.classList.add("card");
  d_day.textContent = dayOfWeek;
  d_day.classList.add("day");

  d_temp.textContent = Math.ceil(temperature - 273.15) + "°";
  d_temp.classList.add("temperature");

  d_img.src = assignWeatherIcon(
    d_description.toLowerCase(),
    d_cloudsPercentage
  );

  d_item.append(d_day);
  d_item.appendChild(d_img);
  d_item.append(d_temp);
  list.appendChild(d_item);
};

// Iterate into each days and show :
const iterateDays = (forecasts: any, today: Date, daysLenght: number) => {
  for (let i = 0; i < daysLenght; i++) {
    // calculate a day 24 hours :
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][date.getDay()];

    const forecast = findWeather(date, forecasts);

    if (forecast) {
      showCardsWeather(dayOfWeek, forecast);
    }
  }
};

// Init WeatherDom
const initWeatherDom = (forecasts: any) => {
  const daysLenght = document.getElementById("days") as HTMLSelectElement;
  const today = getTheActualTime();

  createNewListItem();
  iterateDays(forecasts, today, Number.parseInt(daysLenght.value));
};

// get the city from cache/api :
const loadCity = async (city: string) => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${API_KEY_CITY}&language=fr&pretty=1`;
  const data = await fetchData(url);
  const lat = data.results[0].geometry.lat;
  const lon = data.results[0].geometry.lng;
  return { lat, lon };
};

// get the weather from cache/api :
const loadWeather = async (lat: number, lon: number) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}`;
  const data = await fetchData(url);
  const forecasts = data.list;
  initWeatherDom(forecasts);
};

// on submit we load the weather and do some clean up  :
const requestWeatherFromValue = async (input: HTMLInputElement, e: Event) => {
  e.preventDefault();

  const city = input.value.toLowerCase();

  if (city === "" || city == undefined) {
    input.style.outline = "red 0.1rem solid";
    input.placeholder = "please type a valid city";
    throw Error("No city found !");
  }

  // load the weather :
  const { lat, lon } = await loadCity(city);
  loadWeather(lat, lon);

  changeBackgroundFromTime(lat, lon);

  // reset input :
  input.style.outline = "none";
  input.placeholder = "type your city";
  input.value = "";
};

export async function requestWeather(
  this: HTMLElement,
  e: KeyboardEvent | Event
) {
  if (this.tagName == "BUTTON") {
    const inputCity = document.getElementById("city") as HTMLInputElement;
    requestWeatherFromValue(inputCity, e);
  } else {
    if (e instanceof KeyboardEvent && e.key === "Enter") {
      const inputCity = this as HTMLInputElement;
      requestWeatherFromValue(inputCity, e);
    }
  }
}
