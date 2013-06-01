
function placeMarker(map, location, title, markerColor) {
  console.log(location);

  var lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 3,
    strokeColor: markerColor ? markerColor : '#F00'
  };

  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: title,
    icon: lineSymbol
  });
}

function initialize() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(foundLocation, noLocation);
  else
    noLocation();
}

function foundLocation(position) {
  setupMap(position.coords.latitude, position.coords.longitude);
}

function noLocation() {
  setupMap(40.0195625603, -105.279270661);
}

function setupMap(centerLat, centerLng) {
  var mapOptions = {
    center: new google.maps.LatLng(centerLat, centerLng),
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  placeMarker(map, mapOptions.center, 'You are here', '#00F')

  var dataLength = data.length > 100 ? 100 : data.length;
  for (var i = 0; i < dataLength; i++)
    placeMarker(map, new google.maps.LatLng(data[i].lat, data[i].lng), data[i].description);
}

google.maps.event.addDomListener(window, 'load', initialize);