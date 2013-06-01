
var map,
    native_app = (window.location.href.indexOf('/Users/') !== -1 &&
                  window.location.href.indexOf('/workspace/') !== -1);

function load_script(src){
    var d=document,s=d.createElement('SCRIPT'),c=d.getElementsByTagName('script')[0];s.type='text/javascript';s.async=true;s.src=src;c.parentNode.insertBefore(s, c);
}

function geo_success(pos) {
    var lat = pos.coords.latitude,
        lng = pos.coords.longitude;

    map.setCenter(new google.maps.LatLng(lat, lng));
    placeMarker(map, map.getCenter(), 'You are here', '#00F');
    placeDataMarkers();
}

function geo_fail() {
    //alert('Unable to find your location!');
    placeMarker(map, map.getCenter(), 'You are here', '#00F');
    placeDataMarkers();
}

function placeMarker(map, location, title, markerColor) {
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

function placeDataMarkers() {
  var dataLength = data.length > 100 ? 100 : data.length;
  for (var i = 0; i < dataLength; i++)
    placeMarker(map, new google.maps.LatLng(data[i].lat, data[i].lng), data[i].description);
}

function initialize2() {
  var mapOptions = {
    center: new google.maps.LatLng(40.0195625603, -105.279270661),
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geo_success, geo_fail, {enableHighAccuracy:true});
  } else {
    geo_fail();
  }
}

function initialize() {
  load_script('https://maps.googleapis.com/maps/api/js?v=3.12&key=AIzaSyDPq9h3wwq3U6xzBeVQPPA7h2CJamlU82s&sensor=true&callback=initialize2');
}

// phonegap specific deviceready event
// can't use phonegap API's (eg. geolocation) until this fires
if (native_app) {
  document.addEventListener('deviceready', initialize, false);
} else {
  initialize();
}



