// Edit the center point and zoom level
var map = L.map('map', {
  center: [41.761, -72.741], // West Hartford Center
  zoom: 15,
  scrollWheelZoom: false
});

// set bounds for geocoder
var minLatLng = [41.71468781859272, -72.79833198522446];
var maxLatLng = [41.811104546836134, -72.71164299040684];
var bounds = L.latLngBounds(minLatLng, maxLatLng);

var choroplethLayer;
var choroplethOpacity = 0.7;

new L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

var searchControl = L.esri.Geocoding.geosearch({
  placeholder: "Search the Hartford area...",
  searchBounds: bounds
}).addTo(map);

// Prepend attribution to "Powered by Esri"
map.attributionControl.setPrefix('View\
  <a href="https://github.com/ontheline/otl-zoning-west-hartford" target="_blank">sources and code on GitHub</a>,\
  created with ' + map.attributionControl.options.prefix);

 var results = L.layerGroup().addTo(map);

 searchControl.on('results', function (data) {
   results.clearLayers();
   for (var i = data.results.length - 1; i >= 0; i--) {
     results.addLayer(L.marker(data.results[i].latlng));
   }
 });

L.control.scale().addTo(map);

// https://colorbrewer2.org/#type=sequential&scheme=YlGn&n=5
var choroplethStyle = function(f) {
  var area2color = {
    'A': '#006837', // dark green
    'B': '#31a354', //
    'C': '#78c679', //
    'D': '#c2e699', //
    'E': '#ffffcc' // light yellow-green
  }

  return {
    'color': 'black',
    'weight': 1,
    'fillColor': area2color[ f.properties.area ] || 'gray', // gray if no data
    'fillOpacity': choroplethOpacity
  }
}

// zoning polygons with fillColor
$.getJSON("geojson/wh-area-districts-1924-whitten.geojson", function (data) {
  choroplethLayer = L.geoJson(data, {
    style: choroplethStyle
  }).addTo(map);

  map.fitBounds(choroplethLayer.getBounds())
});

// Add Opacity control
var opacity = L.control({position: 'bottomleft'});
opacity.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'control-custom range');
  div.innerHTML = '<h4>Opacity: 1924 zones</h4>';
  div.innerHTML += '<input id="rangeSlider" type="range" min="0" max="100" value="70">';

  // Make sure the map doesn't move with slider change
  L.DomEvent.disableClickPropagation(div);
  return div;
};
opacity.addTo(map);

$('#rangeSlider').on('input', function() {
  choroplethOpacity = $(this).val() / 100;

  if (choroplethLayer) {
    choroplethLayer.setStyle(choroplethStyle);
  }
})
