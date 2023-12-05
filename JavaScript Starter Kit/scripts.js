const getLocationButton = document.getElementById("getLocationButton");
const searchButton = document.getElementById('search-button');
const forecastButton = document.getElementById('forecast-button');

/**
 * Adds functionality to location button.
 * Retrieves current lat/long positions using geolocation.
 */
getLocationButton.addEventListener("click", () => {
  loader.style.display = 'block';
  document.getElementById("for-weather").innerHTML = '';
  navigator.geolocation.getCurrentPosition(async(position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    await getWeatherData(lat, long);
    await getForecastWeatherData(lat, long);
  });
});

searchButton.addEventListener('click', () => {
  loader.style.display = 'block';

  const cityName = document.getElementById('cityName').value;

  getCityWeatherData(cityName);
})

// forecastButton.addEventListener('click', () => {
//   loader.style.display = 'block';

//   navigator.geolocation.getCurrentPosition((position) => {
//     let lat = position.coords.latitude;
//     let long = position.coords.longitude;

//     getForecastWeatherData(lat, long);
//   });
// })

var requestOptions = {
  method: "GET",
  redirect: "follow",
};

var appid = "299b37daa69d866809ba3b3976229506";

/**
 * Fetches Open Weather Data API.
 * @param {string} latitude - Current latitude.
 * @param {string} longitude - Current longitude.
 */
async function getWeatherData(latitude, longitude) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appid}`,
    requestOptions
  );
  var data = await response.json();
  console.log(data); // Use this to explore the API response

  displayData(data, true);

  loader.style.display = 'none';
}

/**
 * Fetches Open Weather Data API.
 * @param {string} latitude - Current latitude.
 * @param {string} longitude - Current longitude.
 */
async function getForecastWeatherData(latitude, longitude) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=8&appid=${appid}`,
    requestOptions
  );
  var data = await response.json();
  console.log(data); // Use this to explore the API response

  displayFor(data);

  loader.style.display = 'none';
}

/**
 * Fetches Open Weather Data API.
 * @param {string} cityName - Search weather for city.
 */
async function getCityWeatherData(cityName) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appid}`,
    requestOptions
  );
  var data = await response.json();
  console.log(data); // Use this to explore the API response

  if (String(data.cod) === '200') {
    displayData(data);
  } else if (String(data.cod) === '404') {
    alert(data.message);
  }

  loader.style.display = 'none';
}

/**
 * Displays the weather data via HTML.
 * @param {object} data - Open Weather Data API JSON response.
 */
function displayData(data, current = false) {
  
  let weatherBlocks;
  const newWeather = createWeatherBlock(data);
  if (current){
    weatherBlocks = document.getElementById("for-weather");
  } 
  else{
    weatherBlocks = document.getElementById("city-weather");
  }
  weatherBlocks.appendChild(newWeather);
}

function createWeatherBlock(data) {
  const cityName = data.name;
  const icon = data.weather[0].icon;
  const temp = convertToFahrenheit(data.main.temp);
  const disc = data.weather[0].description;

  const newDiv = document.createElement('div');
  newDiv.className = 'weather';
  const cityEle = document.createElement('div');
  cityEle.className = 'city';
  cityEle.innerHTML = cityName;
  const tempEle = document.createElement('div');
  tempEle.className = 'temp';
  tempEle.innerHTML = temp;
  const imgEle = document.createElement('img');
  imgEle.className = 'icon';
  imgEle.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  const discEle = document.createElement('div');
  discEle.className = 'disc';
  discEle.innerHTML = disc;

  newDiv.appendChild(cityEle);
  newDiv.appendChild(tempEle);
  newDiv.appendChild(imgEle);
  newDiv.appendChild(discEle);
  return newDiv;
}

function displayFor(data) {
  
  const ForBlocks = document.getElementById("for-weather");
  for(let i=0; i<8; i++){
    const newFor = createForcastBlock(data, i);
    ForBlocks.appendChild(newFor);
  }
}

function createForcastBlock(data, i) {
  const cityName = data.city.name;
  const icon = data.list[i].weather[0].icon;
  const temp = convertToFahrenheit(data.list[i].main.temp);
  const disc = data.list[i].weather[0].description;
  const time = data.list[i].dt_txt;

  const newDiv = document.createElement('div');
  newDiv.className = 'weather';
  const cityEle = document.createElement('div');
  cityEle.className = 'city';
  cityEle.innerHTML = cityName;
  const tempEle = document.createElement('div');
  tempEle.className = 'temp';
  tempEle.innerHTML = temp;
  const imgEle = document.createElement('img');
  imgEle.className = 'icon';
  imgEle.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  const discEle = document.createElement('div');
  discEle.className = 'disc';
  discEle.innerHTML = disc;
  const timeEle = document.createElement('div');
  timeEle.className = 'time';
  timeEle.innerHTML = time;

  newDiv.appendChild(cityEle);
  newDiv.appendChild(tempEle);
  newDiv.appendChild(imgEle);
  newDiv.appendChild(discEle);
  newDiv.appendChild(timeEle);
  return newDiv;
}

/**
 * Converts Kelvin to Fahrenheit temperature scale.
 * @param {string} temp - The title of the book.
 * @returns {string} Current temperature in Fahrenheit.
 */
function convertToFahrenheit(temp) {
  return Math.trunc((temp - 273.15) * 1.8 + 32) + "&deg; F";
}
