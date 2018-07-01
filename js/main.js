console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'
import weatherServise from './services/weather-service.js'

var currUrl


locService.getLocs()
    .then(locs => console.log('locs', locs))
window.onload = () => {
    if (window.location.search) {
        let urlPos = getAllUrlParams()
        getLocationByUrl(urlPos)
    } else {
        return locService.getPosition()
            .then((pos) => {
                return mapService.initMap(pos.coords.latitude, pos.coords.longitude)
            })
            .then(() => {
                toMyLocation()
            });
    }
    addEventListeners()

}

function addEventListeners(){
    document.querySelector('input').addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13){ 
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
    
    document.querySelector('footer .copy').addEventListener('click', (ev) => {
        let elUrl = document.querySelector(".urlInput")
        elUrl.value = currUrl
        elUrl.select()
        document.execCommand('copy')
    })
}




function toMyLocation() {
    return locService.getPosition()
        .then((pos) => {
            mapService.addMarker({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
            renderWeather(pos.coords.lat, pos.coords.lng)
            getUrlByLocation(pos.coords)
        })
        .catch(err => {
            console.log('err!!!', err);
        })

}




function getAllUrlParams() {
    let pos = {}
    var urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('lat') && urlParams.has('lng')) {
        pos.lat = parseInt(urlParams.get('lat'))
        pos.lng = parseInt(urlParams.get('lng'))
    }
    return pos
}

function getLocationByUrl(pos) {
    console.log(window.location);

    console.log('User position is:', pos.coords);
    return mapService.initMap(pos.lat, pos.lng)
        .then(() => {
            return mapService.addMarker(pos);
        })
        .then(() => {
            renderWeather(pos.lat, pos.lng)
        })
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


function getUrlByLocation(pos) {
    let urlParams = new URLSearchParams(window.location.search)
    urlParams.set('lat', pos.latitude)
    urlParams.set('lng', pos.longitude)
    currUrl = window.location.href+'&'+ urlParams
}