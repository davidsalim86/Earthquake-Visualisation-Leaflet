// create tilelayers
var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

// create map
var myMap = L.map("map", {
    center: [39.419220, -111.950684],
    zoom: 4,
    layers: [light]
});

// create earthquake layer
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function markerSize(Magnitude) { return Magnitude * 20000 };

var earthquake = new L.LayerGroup();
d3.json(url).then(function (data) {
    var features = data.features;
    console.log(features)
    for (var i = 0; i < features.length; i++) {
        var fillcolor = "";
        switch (true) {
            case (features[i].properties.mag > 5):
                fillcolor = "#ff0000";
                break;
            case (features[i].properties.mag > 4):
                fillcolor = "#e67300";
                break;
            case (features[i].properties.mag > 3):
                fillcolor = "#ffa64d";
                break;
            case (features[i].properties.mag > 2):
                fillcolor = "#ffcc00";
                break;
            case (features[i].properties.mag > 1):
                fillcolor = "#ffff66";
                break;
            default:
                fillcolor = "#99ff33";
        }
        L.circle([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
            fillOpacity: 1,
            color: fillcolor,
            weight: 0.75,
            opacity: 0.75,
            fillColor: fillcolor,
            radius: markerSize(features[i].properties.mag)
        }).bindPopup("Location: " + features[i].properties.place + "<br> Magnitude: " + features[i].properties.mag + "<br> Time: " + new Date(features[i].properties.time)).addTo(earthquake);
    }
});

// create plate layer
var platesInfo = "data/PB2002_plates.json";

var plates = new L.LayerGroup();
d3.json(platesInfo).then(function (data2) {
    console.log(data2);
    plates = L.geoJSON(data2, {
        style:{
            color: "orange",
            fillOpacity: 0
            },
        onEachFeature: function (features, layer) {
            layer.bindPopup("Plate: " + features.properties.PlateName);
        }
    }).addTo(plates);
});

// create legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Magnitude</h4>";
    div.innerHTML += "<p style=\"background-color: #99ff33\">Mag. 0-1</p>";
    div.innerHTML += "<p style=\"background-color: #ffff66\">Mag. 1-2</p>";
    div.innerHTML += "<p style=\"background-color: #ffcc00\">Mag. 2-3</p>";
    div.innerHTML += "<p style=\"background-color: #ffa64d\">Mag. 3-4</p>";
    div.innerHTML += "<p style=\"background-color: #e67300\">Mag. 4-5</p>";
    div.innerHTML += "<p style=\"background-color: #ff0000\">Mag. 5-6</p>"
    return div;
};
legend.addTo(myMap);
document.querySelector(".legend").style.background = "#f2f2f2";
document.querySelector(".legend").style.padding = "0px 10px 0px 10px";

// create layer control
var baseMaps = {
    Light: light,
    Dark: dark,
    Satellite: satellite
};

var overlayMaps = {
    Earthquake: earthquake,
    Plates: plates
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);
earthquake.addTo(myMap);
plates.addTo(myMap);