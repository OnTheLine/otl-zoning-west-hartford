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

// toggle baselayers; global variable with (null, null) allows indiv layers to be added inside functions below
var controlLayers = L.control.layers( null, null, {
  position: "topright",
  collapsed: false
}).addTo(map);

//baselayers
var presentBackground = new L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map); // adds layer by default
controlLayers.addBaseLayer(presentBackground, 'Present Background');

// https://esri.github.io/esri-leaflet/api-reference/layers/basemap-layer.html
var esriImagery = L.esri.basemapLayer('Imagery');
var esriTransportation = L.esri.basemapLayer('ImageryTransportation');
var esriLabels = L.esri.basemapLayer('ImageryLabels');
var presentAerial = L.layerGroup([esriImagery, esriTransportation, esriLabels]);
controlLayers.addBaseLayer(presentAerial, 'Present Aerial');

// UConn MAGIC WMS settings - see http://geoserver.lib.uconn.edu:8080/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage
var zoning1924 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1924',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1924 MAGIC UConn</a> and Town of West Hartford</a>'
});
controlLayers.addBaseLayer(zoning1924, '1924 zoning map');

var zoning1930 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1930',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1930 MAGIC UConn</a> and Town of West Hartford</a>'
});
controlLayers.addBaseLayer(zoning1930, '1930 zoning map');

var zoning1951 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1951',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1951 MAGIC UConn</a> and Town of West Hartford</a>'
});
controlLayers.addBaseLayer(zoning1951, '1951 zoning map');

var zoning1960 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1960',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1960 MAGIC UConn</a> and Town of West Hartford</a>'
});
controlLayers.addBaseLayer(zoning1951, '1951 zoning map');

var zoning1970 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1970',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1970 MAGIC UConn</a> and Town of West Hartford</a>'
});
controlLayers.addBaseLayer(zoning1970, '1970 zoning map');

var zoning1988 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1988',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1988 MAGIC UConn</a> and Town of West Hartford</a>'
});
controlLayers.addBaseLayer(zoning1988, '1988 zoning map');

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

// zoning points with colored numeric markers; see also style.css
$.getJSON("geojson/wh-area-markers-1924-whitten.geojson", function (data){
  L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var colors = {
        'A': 'silver', // dark green #006837
        'B': '#31a354', //
        'C': '#78c679', //
        'D': '#c2e699', //
        'E': '#ffffcc' // light yellow-green
      }
      var mIcon = L.ExtraMarkers.icon({
        icon: 'fa-number',
        number: feature.properties.area,
        markerColor: colors[feature.properties.area]
      });
      var marker = L.marker(latlng, {icon: mIcon});
      return marker;
    }
  }).addTo(map);
});

// Add Opacity control
var opacity = L.control({position: 'topright'});
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


/* Add a custom image legend */
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<img src="./1924-zoning-legend.png" alt="1924 Zoning Legend" width="110">';
  return div;
};

legend.addTo(map);
