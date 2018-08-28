mapboxgl.accessToken = 'pk.eyJ1Ijoia2F2YWJvbmdhIiwiYSI6ImNqaDN1bmZ5azByM2IyeW53YzVidno4eHEifQ.x0Zh-x88HFgwyIGMu1b20g';
google_APIkey = 'AIzaSyDaKut9f7TXR7wNxaXX7BLrmz5Kyey_nn0'
var bounds = new mapboxgl.LngLatBounds(
    new mapboxgl.LngLat(35.995341714419766, 43.34614531556505),
    new mapboxgl.LngLat(42.55785469571015, 47.16257905342911)
);
var mapbox = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [38.987895, 45.049097],
    zoom:10.5,
    minZoom:6.4,
    maxZoom:14.6,
    maxBounds: bounds
});
geo_data = JSON.parse(get('Krasnodar/other/Farms.geojson'));
selected = Object.assign({}, geo_data);
selected.features = [];
selected.name = 'Selected_features'
for (i = 0; i < geo_data.features.length; i++)
    geo_data.features[i].properties.index = i;
mapbox.on('load', function(){
    mapbox.addSource('Krasnodar', {
        type: 'geojson',
        data: geo_data
    });
    mapbox.addLayer({
    'id': 'Krasnodar',
    'type': 'fill',
    'source': 'Krasnodar',
    'layout': {},
    'paint': {
        'fill-color': '#FFFF00',
        'fill-outline-color': '#000000',
        'fill-opacity': 0.8
    }}
    );
    mapbox.addSource('selected', {
        type:'geojson',
        data:selected
    });
    mapbox.addLayer({
    'id': 'selected',
    'type': 'fill',
    'source': 'selected',
    'layout': {},
    'paint': {
        'fill-color': '#00FF00',
        'fill-outline-color': '#000000',
        'fill-opacity': 0.8
    }})
});
function displayField(parameters) {
    coordinates.innerHTML = '{0}, {1}'.format(parameters.lat, parameters.lng);
    num = Math.round(parameters.percent * 100) / 100;
    percent.innerHTML =  num + '%';
    percent.style.width = num + '%';
    recommended.innerHTML = '';
    unrecommended.innerHTML = '';
    toadd.innerHTML = '';
    for (i = 0; i < parameters.recommended.length; i++) {
        leave = document.createElement('li');
        leave.innerHTML = parameters.recommended[i];
        if (parameters.recommended[i] == parameters.best)
            leave.classList.add('special');
        recommended.appendChild(leave);
    }
    for (i = 0; i < parameters.unrecommended.length; i++) {
        leave = document.createElement('li');
        leave.innerHTML = parameters.unrecommended[i];
        unrecommended.appendChild(leave);
    }
    if (parameters.recommended.length == 0) {
        toadd.innerHTML = 'Непригодно для коммерческого использования';
    }
    //landuse.innerHTML = parameters.e.features[0].properties.LANDUSE;
}
function getAddress(lat, lng) {
    ans = get('https://maps.googleapis.com/maps/api/geocode/json?latlng={0},{1}&key={2}'.format(lat, lng, google_APIkey));
    return ans.results[0].formatted_address;
}
//function polyMid()
mapbox.on('click', 'Krasnodar', function(e) {
    check = globalCulturesCheck(e.lngLat.lat, e.lngLat.lng)
    setTimeout(
        function(){
            displayField({
                percent:check.max_val,
                recommended:check.good_cultures,
                unrecommended:check.bad_cultures,
                lat:e.lngLat.lat,
                lng:e.lngLat.lng,
                best:check.max_name,
                e:e
            })
        },
    0);
    selected.features = [];
    for (i = 0; i < e.features.length; i++) {
        selected.features.push(geo_data.features[e.features[i].properties.index]);
    }
    mapbox.getSource('selected').setData(selected);

})