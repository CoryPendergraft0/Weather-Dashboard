var key = "9f0ae0cdf7c18fc91720d7f062d45b91"
var weatherApi = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=" + key;
var geoCoding = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=" + key;

// looks to see if city exists in Local
var storageCheck = function (searchItems, newCity) {
    var notMatch = 0
    Object.values(searchItems).forEach(val => {
      if (val === newCity) {
        return;
      } else {
        return notMatch++;
      }
    })
    if (notMatch >= searchItems.length) {
      searchItems.push(newCity);
      localStorage.setItem("cities", JSON.stringify(searchItems));
    }
  };

//   if not, this function adds city to local
var storageAdd = function (lat, lon) {
    var getSearches = localStorage.getItem("cities") || '[]';
    var searchItems = JSON.parse(getSearches);
    var newCity = (lat + " " + lon);
    if (searchItems.length > 0) {
      storageCheck(searchItems, newCity);
    } else {
      searchItems.push(newCity);
      localStorage.setItem("cities", JSON.stringify(searchItems));
    }
  }

//   this is the forcast card
  var displayWeather = function (data, location) {
    $('#weather-card').empty();
    var icon = (data.weather[0].icon);
    var city = (data.name + ', ' + location);
    var temp = (data.main.temp);
    var humidity = (data.main.humidity);
    var feelsLike = (data.main.feels_like);
    var description = (data.weather[0].description);
    var wind = (data.wind.speed);
  
    var weatherDiv = $('<div>').addClass('row');
    var weatherCard = $('<div>').addClass('card');
    var weatherCity = $('<h5>').addClass('card-title p-2');
    var weatherInfo = $('<div>').addClass('col');
    var weatherDescription = $('<p>').addClass('card-text p-3');
    var weatherImage = $('<img>').addClass('col card-img-top border-end');
    var weatherWind = $('<li>').addClass('list-group-item');
    var weatherList = $('<ul>').addClass('list-group list-group-flush');
    var weatherHumidity = $('<li>').addClass('list-group-item');
  
    weatherCity.text(city);
    weatherImage.attr('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
    weatherDescription.text('Currently: ' + temp + '\u00B0 with ' + description + '. (feels like ' + feelsLike + '\u00B0)');
    weatherHumidity.text('Humidity: ' + humidity + '%');
    weatherWind.text('Wind Speed: ' + wind + 'mph');
  
    weatherList
      .append(weatherHumidity)
      .append(weatherWind);
  
    weatherInfo
      .append(weatherCity)
      .append(weatherDescription)
      .append(weatherList);
  
    weatherDiv
      .append(weatherImage)
      .append(weatherInfo);
  
    weatherCard
      .append(weatherDiv);
  
    $('#weather-card').append(weatherCard);
  }

//   displays the forecast
  var displayForecast = function (data) {
    $('#forecast-card').empty();
    var forecastDiv = $('<div>').addClass('row');
    for (let i = 0; i < data.list.length - 34; i++) {
      console.log(data);
      var unix = (data.list[i].dt);
      var icon = (data.list[i].weather[0].icon);
      var temp = (data.list[i].main.temp)
      var forecastTime = $('<h5>').addClass('card-title p-2');
      var forecastCard = $('<div>').addClass('card col-lg-2 col-xs-auto p-2');
      var forecastImage = $('<img>').addClass('col card-img-top');
      var forecastDescription = $('<p>').addClass('card-text p-3');
      var time = new Date((unix) * 1000)
      forecastTime.text(time.toLocaleString());
      forecastImage.attr('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
      forecastDescription.text(temp + '\u00B0');
  
      forecastCard
        .append(forecastTime)
        .append(forecastImage)
        .append(forecastDescription);
  
      forecastDiv.append(forecastCard);
    }
    $('#forecast-card').append(forecastDiv);
  }

//   gets the current weather
  var getWeather = function (data) {
    var lat = (data[0].lat);
    var lon = (data[0].lon);
    var loc = (data[0].state);
    var weather = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";
    fetch(weather)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayWeather(data, loc);
        storageAdd(lat, lon);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

// this gets the 5day forecast
  var getForecast = function (data) {
    var lat = (data[0].lat);
    var lon = (data[0].lon);
    var forecast = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";
    fetch(forecast)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayForecast(data);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

//   converts search to coords
  var getCoordinates = function (q) {
    var locationUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + q + "&appid=" + key;
    fetch(locationUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        getWeather(data);
        getForecast(data);
      })
      .catch(function (err) {
        console.log(err);
      })
  }
  
// this is the search button
  $(document).on('click', '.btn-primary', function (event) {
    event.preventDefault();
    if ($(this).attr('id')) {
      var q = $(this).attr('id');
    } else {
      var q = $("#searchInput").val();
    }
    getCoordinates(q);
  });
  
  fetchSearch();