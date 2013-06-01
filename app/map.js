
function placeMarker(map, location, title) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: title
  });
}

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(40.0195625603, -105.279270661),
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  placeMarker(map, map.getCenter(), "center");
}

google.maps.event.addDomListener(window, 'load', initialize);