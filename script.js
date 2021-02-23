// set initial center point, zoom, and layers
var startCenter = [41.761, -72.741]; // West Hartford Center
var minLatLng = [41.71468781859272, -72.79833198522446];
var maxLatLng = [41.811104546836134, -72.71164299040684];
var bounds = L.latLngBounds(minLatLng, maxLatLng);
var startZoom = 15;
var minZoom = 12;
var layer1 = 'magic1924';
var layer2 = 'esriPresent';

// define baselayers and insert further below, and also in index.html
// UConn MAGIC WMS settings - see http://geoserver.lib.uconn.edu:8080/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage
var magic1924 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1924',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1924 MAGIC UConn</a> and Town of West Hartford</a>'
});

var magic1930 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1930',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1924 MAGIC UConn</a> and Town of West Hartford</a>'
});

var magic1951 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1951',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1924 MAGIC UConn</a> and Town of West Hartford</a>'
});

var magic1960 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1960',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1924 MAGIC UConn</a> and Town of West Hartford</a>'
});

var magic1970 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1970',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1924 MAGIC UConn</a> and Town of West Hartford</a>'
});

var magic1988 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:WestHartford_Zoning_1988',
  format: 'image/png',
  version: '1.3.0',
  transparent: true,
  attribution: '<a href="http://magic.library.uconn.edu" target="_blank">1924 MAGIC UConn</a> and Town of West Hartford</a>'
});

// https://esri.github.io/esri-leaflet/api-reference/layers/basemap-layer.html
var esriImagery = L.esri.basemapLayer('Imagery');
var esriTransportation = L.esri.basemapLayer('ImageryTransportation');
var esriLabels = L.esri.basemapLayer('ImageryLabels');
var esriPresent = [esriImagery, esriTransportation, esriLabels];

// Check for permalink: If address string contains '#', process parameters after the '#'
var addr = window.location.href;

if (addr.indexOf('#') !== -1) {
  var sep = (addr.indexOf('&amp;') !== -1) ? '&amp;' : '&';
  var params = window.location.href.split('#')[1].split(sep);

  params.forEach(function(k) {
    z = k.split('=');

    switch (z[0]) {
      case 'zoom':
        startZoom = z[1];
        break;
      case 'lat':
        startCenter[0] = z[1];
        break;
      case 'lng':
        startCenter[1] = z[1];
        break;
      case 'layer1':
        layer1 = z[1];
        $('#map1basemaps option[value="' + layer1 + '"]').prop('selected', true);
        $('#map2basemaps option').removeAttr('disabled');
        $('#map2basemaps option[value="' + layer1 + '"]').prop('disabled', true);
        break;
      case 'layer2':
        layer2 = z[1];
        $('#map2basemaps option[value="' + layer2 + '"]').prop('selected', true);
        $('#map1basemaps option').removeAttr('disabled');
        $('#map1basemaps option[value="' + layer2 + '"]').prop('disabled', true);
        break;
      default:
        break;
    }
  });
}

// Insert basemap variables; return layer named s
function pickLayer(s) {
  switch (s) {
    case 'magic1924':
      return magic1924;
    case 'magic1930':
      return magic1930;
    case 'magic1951':
      return magic1951;
    case 'magic1960':
      return magic1960;
    case 'magic1970':
      return magic1970;
    case 'magic1988':
      return magic1988;
    case 'esriPresent':
      return esriPresent;
    default:
      return magic1924;
  }
}

// Create two maps
var map1 = L.map('map1', {
    layers: pickLayer(layer1),
    center: startCenter,
    zoom: startZoom,
    zoomControl: false,
    minZoom: minZoom,
    scrollWheelZoom: false,
    tap: false,
    maxBounds: [minLatLng,maxLatLng]
});

var map2 = L.map('map2', {
    layers: pickLayer(layer2),
    center: startCenter,
    zoom: startZoom,
    minZoom: minZoom,
    zoomControl: false,
    scrollWheelZoom: false,
    tap: false,
    maxBounds: [minLatLng,maxLatLng]
});

// customize link to view source code; add your own GitHub repository
map1.attributionControl
  .setPrefix('View <a href="http://github.com/ontheline/otl-zoning-west-hartford" target="_blank">code on GitHub</a>');

// Reposition zoom control other than default topleft
L.control.zoom({position: "topright"}).addTo(map1);
L.control.zoom({position: "topright"}).addTo(map2);

L.control.scale().addTo(map2);

// create the geocoding control, add to map 2, display markers
var searchControl = L.esri.Geocoding.geosearch({
  position: 'topright',
  //useMapBounds: true,
  searchBounds: bounds,
}).addTo(map2);

// create an empty layer group to store the results and add it to the map
var results = L.layerGroup().addTo(map2);

// listen for the results event and add every result to the map
searchControl.on("results", function(data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(
      L.marker(data.results[i].latlng).bindPopup( data.results[i].text )
    );
  }
  // Open popups
  results.eachLayer(function(l) { l.openPopup() })
});

// sync maps using Leaflet.Sync code
map1.sync(map2);
map2.sync(map1);

function changeBasemap(map, basemap) {
  var other_map = (map === 'map1') ? 'map2' : 'map1';
  var map = (map === 'map1') ? map1 : map2;

  // Disable selected layer on the neighbor map
  // (if two maps load the same layer, weird behavior observed)
  $('#' + other_map + 'basemaps option').removeAttr('disabled');
  $('#' + other_map + 'basemaps option[value="' + basemap + '"]').attr('disabled', 'disabled');

  // Remove the old layer(s) -- insert all basemap variables
  [esriImagery,
   esriTransportation,
   esriLabels,
   magic1924,
   magic1930,
   magic1951,
   magic1960,
   magic1970,
   magic1988
 ].forEach(function(v) {
    map.removeLayer(v);
  });

  // Add appropriate new layer -- insert all basemap variables
  switch (basemap) {
    case 'esriPresent':
      map.addLayer(esriImagery);
      map.addLayer(esriTransportation);
      map.addLayer(esriLabels);
      break;
    case 'magic1924':
      map.addLayer(magic1924);
      break;
    case 'magic1930':
      map.addLayer(magic1930);
      break;
    case 'magic1951':
      map.addLayer(magic1951);
      break;
    case 'magic1960':
      map.addLayer(magic1960);
      break;
    case 'magic1970':
      map.addLayer(magic1970);
      break;
    case 'magic1988':
      map.addLayer(magic1988);
      break;
    default:
      break;
  }
}

// Set up to create permalink
$(document).ready(function() {
  $('#map1basemaps select').change(function() {
    changeBasemap('map1', $(this).val());
  });

  $('#map2basemaps select').change(function() {
    changeBasemap('map2', $(this).val());
  });

  // Generate permalink on click
  $('#permalink').click(function() {
    var zoom = map1._zoom;
    var lat = map1.getCenter().lat;
    var lng = map1.getCenter().lng;
    var layer1 = $('#map1basemaps select').val();
    var layer2 = $('#map2basemaps select').val();
    var href = '#zoom=' + zoom + '&lat=' + lat + '&lng=' +
                  lng + '&layer1=' + layer1 + '&layer2=' + layer2;
    // Update URL in browser
    window.location.hash = href;
    window.prompt("Copy with Cmd+C (Mac) or Ctrl+C", window.location.href);
  });

});
