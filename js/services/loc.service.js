var locs = [{
    lat: 11.22,
    lng: 22.11
}]

function getLocsByInput(strLoctaion) {
    const API_KEY = 'AIzaSyDoi7G5B3YG0m2gZ_mxK_uTd7OmkRYvaWE';
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${strLoctaion}&key=${API_KEY}`)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            console.log(myJson);
            return myJson.results
        })
        .then((results) => {
            return results[0]
        });

}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });

}


function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}




export default {
    getLocs: getLocs,
    getPosition: getPosition,
    getLocsByInput: getLocsByInput
}