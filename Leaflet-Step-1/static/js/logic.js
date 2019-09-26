// Earthquake URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Grab the data with d3
d3.json(url, function(response) {
  createFeatures(response.features);
  console.log(response);

});

//Change color of circle using magnitude
function createFeatures(earthquakeData) {

  function chooseColor(magnitude){
    switch (true){
    case magnitude > 8.0:
      return "#7B241C";
    case magnitude > 7.0:
      return "#E74C3C";
    case magnitude > 6.0:
      return "#F39C12";
    case magnitude > 5.0:
      return "#F4D03F";
    case magnitude > 4.0:
      return "#28B463";
    case magnitude > 3.0:
      return "#48C9B0";
    case magnitude > 2.0:
      return "#AA48C9";
    case magnitude > 1.0:
      return "#5448C9";
    default:
      return "#3498DB";

    }
  }
  //define circle style
  function style(feature) {
    return {
      color: "#fff",
      fillColor: chooseColor(feature.properties.mag),
      fillOpacity: 0.5,
      radius: feature.properties.mag * 4

    }
  }
  //add popup to circles
  function addPopup(feature,circle) {
    circle.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) +
        "</p> Magnitude of " + (feature.properties.mag));
  }


  //Create circle markers using geoJson points
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: addPopup,
    pointToLayer: function(feature, latlng) {
     return L.circleMarker(latlng);
   },
    style: style
  });

  createMap(earthquakes);
}

//create the Maps
function createMap(earthquakes) {
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 3,
  layers: [streetmap, earthquakes]
});

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

//create a legend to display information about our mapbox
var info = L.control({
  position: "bottomleft"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");

  var mags=[0, 1, 2, 3, 4, 5, 6, 7, 8];
  var magColor=["#3498DB","#5448C9", "#AA48C9", "#48C9B0", "#28B463", "#F4D03F", "#F39C12", "#E74C3C", "#7B241C"];
  // var mags=[8, 7, 6, 5, 4, 3, 2, 1, 0];
  // var magColor=["#7B241C", "#E74C3C", "#F39C12", "#F4D03F", "#28B463", "#48C9B0","#AA48C9", "#5448C9", "#3498DB"];
  div.innerHTML += "<h1>Magnitude</h1>";
  for (var i=0; i < mags.length; i++) {
    div.innerHTML += "<i style='background: " +magColor[i] + "'></i> " +
       mags[i] + (mags[i + 1] ? "&ndash;" + mags[i + 1] + "<br>" : "+");
  }
  return div;
};
// Add the info legend to the map
info.addTo(myMap);


}
