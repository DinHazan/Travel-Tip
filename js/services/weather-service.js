function connectToWeather(lat, lon) {
    let W_KEY = 'd9557a7272c2a45321851f1d2034b437'
    return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${W_KEY}`)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            console.log(myJson);
            return myJson
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}


export default {
    connectToWeather
}