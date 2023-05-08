import { requestWeather } from "./weather_features.js";

// Target dom element :
const button = document.getElementById("requestWeather") as HTMLElement;
const cityInput = document.getElementById("city") as HTMLInputElement;

// event :
cityInput.addEventListener("keydown", requestWeather);
button.addEventListener("click", requestWeather);
