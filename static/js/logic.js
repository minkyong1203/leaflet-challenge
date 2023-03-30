// Create map object
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 5
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

function getColor(depth) {
    if (depth >= -10 && depth < 10) return "green";
    else if (depth >= 10 && depth <30) return "lightgreen";
    else if (depth >= 30 && depth <50) return "yellow";
    else if (depth >= 50 && depth <70) return "orange";
    else if (depth >= 70 && depth <90) return "red";
    else return "darkred";
}

// data["features"][0]["properties"]["mag"]

// Get our GeoJSON data
d3.json(link).then(function(data) {
    
    L.geoJson(data, {

        style: function(feature) {
            return {
                color: "green",
                fillColor: getColor(feature.geometry.coordinates[2]),
                weight: 1.0,
            };
        },

        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + 
            "<br />Place: " + feature.properties.place +
            "<br />Time: " + feature.properties.time);
        },

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {radius: feature.properties.mag})
        }
    }).addTo(myMap);

    console.log(data["features"][1]["geometry"]["coordinates"][2])


    var legend = L.control({position: "bottomright"});
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "Legend");
        var depths = [-10, 10, 30, 50, 70, 90];
        // var labels = ['<b>Legend</b>'];
        
        div.innerHTML='<div><b>Legend</b></div>';
        for (var i=0; i < depths.length; i++) {
            div.innerHTML += 
            '<i class ="circle" style="background:' + getColor(depths[i]) + '"></i>'  + 
            depths[i] + (depths[i+1] ? '&ndash;' + depths[i + 1] + '<br>': '+');
        } 
        return div;
    };

    legend.addTo(myMap);
});