var map
var markers = []

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleMapsApi()
        .then(() => {
            console.log('google available');
            map = new google.maps.Map(
                document.querySelector('#map'), {
                    center: {
                        lat,
                        lng
                    },
                    zoom: 15
                })
            console.log('Map!', map);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
            position: loc,
            map: map,
            title: 'Hello World!'
        })
            console.log('hwllo map', loc);
            map.panTo(loc)
            markers.push(marker)
            setMapOnAll(map)
    return marker
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function deleteMarker(idx) {
    clearMarkers();
    markers.splice(idx, 1)
    setMapOnAll(map)
}

function _connectGoogleMapsApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDoi7G5B3YG0m2gZ_mxK_uTd7OmkRYvaWE';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
        elGoogleApi.onerror = reject.bind(null,'Google script failed to load')
    })
}


export default {
    initMap,
    addMarker,
    deleteMarker
}