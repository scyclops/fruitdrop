var native_app = (window.location.href.indexOf('/Users/') !== -1 &&
                  window.location.href.indexOf('/workspace/') !== -1);

var FruitDrop = function() {

};

FruitDrop.prototype = {
  initialize: function() {
    this.loadScript('https://maps.googleapis.com/maps/api/js?v=3.12&key=AIzaSyDPq9h3wwq3U6xzBeVQPPA7h2CJamlU82s&sensor=true&callback=initialize2');
  },

  initialize2: function() {
    var mapOptions = {
      center: new google.maps.LatLng(40.0195625603, -105.279270661),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    this._map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    google.maps.event.addListener(this._map, 'bounds_changed', $.proxy(this.getData, this));

    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition($.proxy(this.geo_success, this), $.proxy(this.geo_fail, this), {enableHighAccuracy:true});
    else
      this.geo_fail();
  },

  loadScript: function(src) {
    var d=document,s=d.createElement('SCRIPT'),c=d.getElementsByTagName('script')[0];s.type='text/javascript';s.async=true;s.src=src;c.parentNode.insertBefore(s, c);
  },

  geo_success: function(pos) {
    var lat = pos.coords.latitude,
        lng = pos.coords.longitude;
    this._map.setCenter(new google.maps.LatLng(lat, lng));
    this.placeMarker(this._map.getCenter(), 'You are here', '#00F');
  },

  geo_fail: function() {
    this.placeMarker(this._map, this._map.getCenter(), 'You are here', '#00F');
  },

  getData: function() {
    var bounds = this._map.getBounds();

    $.ajax({
      type: 'GET',
      url: 'http://fallingfruit.org/locations/markers.json',
      data: {
        muni: 1,
        nelat: bounds.getNorthEast().lat(),
        nelng: bounds.getNorthEast().lng(),
        swlat: bounds.getSouthWest().lat(),
        swlng: bounds.getSouthWest().lng()
      },
      /* -- for clusters -- 
      url: 'http://fallingfruit.org/locations/cluster.json',
      data: { 
        method: 'grid',
        grid: this._map.getZoom(),
        nelat: bounds.getNorthEast().lat(),
        nelng: bounds.getNorthEast().lng(),
        swlat: bounds.getSouthWest().lat(),
        swlng: bounds.getSouthWest().lng()
      },
      */
      dataType: 'json',
      success: $.proxy(this.addMarkers, this),
      error: $.proxy(this.error, this)
    });
  },

  addMarkers: function(data) {
    var dataLength = data.length;
    for (var i = 0; i < dataLength; i++)
      this.placeMarker(new google.maps.LatLng(data[i].lat, data[i].lng), data[i].title);
  },

  placeMarker: function(location, title, markerColor) {
    var marker = new google.maps.Marker({
      position: location,
      map: this._map,
      title: title,
      icon: getIcon(title)
    });

    var infowindow = new google.maps.InfoWindow({
      content: '<div>' + title + '</div>'
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(this._map, marker);
    });  
  },

  error: function() {
    alert('error!');
  }
};

// phonegap specific deviceready event
// can't use phonegap API's (eg. geolocation) until this fires
var fruitDrop = new FruitDrop();

if (native_app) {
  document.addEventListener('deviceready', $.proxy(fruitDrop.initialize, fruitDrop), false);
} else {
  fruitDrop.initialize();
}

function initialize2() {
  fruitDrop.initialize2();
}