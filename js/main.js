// Setting up the map view.

var mymap = L.map('map').setView([41.257160, -95.995102], 5);

// Addint a tile layer.
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYWJkdWxsYWgxOTc2IiwiYSI6ImNqc2F4Z2s1ajA0YWczem9hb2YwMjUyMDUifQ.MpY_iK6tSYYtLijir8Je9g'
}).addTo(mymap);

// Creating Lat Lon Popup.
var popup = L.popup();
function onMapClick(e) {
    popup
    .setLatLng(e.latlng)
    .setContent("The Coordinate for this point is: " + e.latlng.toString())
    .openOn(mymap);
};
mymap.on('click', onMapClick);

//Creating Proportional Symbole Map.
function onEachFeature(feature, layer){
   var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI)/600;

    return radius;
};

function createPropSymbols(data, map){
	var attribute = "Pop_2010";
	
    //create marker options
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "maroon",
        color: "white",
        weight: 2,
        opacity: 5,
        fillOpacity: 0.8
    };

    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);
			console.log(attValue);
            //Step 6: Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
		onEachFeature: onEachFeature
    }).addTo(mymap);
};

//Addint the States Population Data (GeoJSON).
function getMap(){
		// AJAX request.
	$.ajax("data/StatesPopulation.geojson", {
	  dataType: "json",
	  success: function(response) {
		  console.log(response);
		  createPropSymbols(response, mymap);
	  }
	});
};

$(document).ready(getMap);

