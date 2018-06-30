console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'
import weatherServise from './services/weather-service.js'




locService.getLocs()
    .then(locs => console.log('locs', locs))
let currPosition;
window.onload = () => {
    if (window.location.search) {
        return getAllUrlParams()
        .then((pos) =>{
            locationByUrl(pos)

        })
    } else {
        return locService.getPosition()
            .then((pos) => {
                currPosition = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }
                return mapService.initMap(pos.coords.latitude, pos.coords.longitude)
            })
            .then(() => {
                toMyLocation()
            });
    }

}

// document.querySelector('.btn1').onclick = () => {
//     console.log('Thanks!');
// }

document.querySelector('input').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
        // code for enter
        locService.getLocsByInput(this.value)
            .then((posData) => {
                mapService.addMarker(posData.geometry.location);
                document.querySelector('.location-input-title').innerText = `Result For : ${posData.formatted_address}`
                renderWeather(posData.geometry.location.lat, posData.geometry.location.lng)
            })
    }
});
document.querySelector('.my-location').addEventListener('click', function (e) {
    toMyLocation()
})



function toMyLocation() {
    return locService.getPosition()
        .then((pos) => {
            mapService.addMarker({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
            renderWeather(pos.coords.lat, pos.coords.lng)
        })
        .catch(err => {
            console.log('err!!!', err);
        })

}



document.querySelector('.btn1').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
})

function getAllUrlParams() {
    let pos = {}
    // 'https://github.io/travelTip/index.html?lat=3.14&lng=1.63'
    var urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('lat') && urlParams.has('lng')) {
        pos.lat = urlParams.get('lat')
        pos.lng = urlParams.get('lng')
    }
    return pos
}

function locationByUrl(pos) {
    console.log('User position is:', pos.coords);
    mapService.initMap(pos.lat, pos.lng)
        .then(() => {
            mapService.addMarker(pos);
            renderWeather(pos.lat, pos.lng)
        })
        .then
        .catch(err => {
            console.log('err!!!', err);
        })
}

function renderWeather(lat, lng) {
    var elWeather = document.querySelector('.weather')
    return weatherServise.connectToWeather(lat, lng)
        .then((weatherData) => {
            var strHTML = `
    <h2>Weather For Today :</h2>
    
    <div><h4>${weatherData.name}</h4> <h5>Description: ${weatherData.weather[0].description}</h5></div>
    <div><h6>The Tempture Now : ${Math.round(weatherData.main.temp)/10}C</h6> <p> Tempture From: ${Math.round(weatherData.main.temp_min)/10}C ,
    To: ${Math.round(weatherData.main.temp_max)/10}C Wind:${weatherData.wind.speed} m/s <p></div>
    `
            elWeather.innerHTML = strHTML
        }).catch(err => {
            console.log('err!!!', err);
            elWeather.innerText = 'Sorry we could not find any weather data for you ... ,please try later'
        })
}