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