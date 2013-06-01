var FruitDrop = function() {

};

FruitDrop.prototype = {
  initialize: function() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition($.proxy(this.foundLocation, this), $.proxy(this.noLocation, this));
    else
      this.noLocation();
  },

  foundLocation: function(position) {
    this.setupMap(position.coords.latitude, position.coords.longitude);
  },

  noLocation: function() {
    this.setupMap(40.0195625603, -105.279270661);    
  },

  setupMap: function(centerLat, centerLng) {
    var mapOptions = {
      center: new google.maps.LatLng(centerLat, centerLng),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    this._map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    this.placeMarker(mapOptions.center, 'You are here', '#00F');
    google.maps.event.addListener(this._map, 'bounds_changed', $.proxy(this.getData, this));    
  },

  getData: function() {
    var bounds = this._map.getBounds();

    $.ajax({
      type: 'GET',
      url: 'http://fallingfruit.org/locations/cluster.json',
      data: { 
        method: 'grid',
        grid: this._map.getZoom(),
        nelat: bounds.getNorthEast().lat(),
        nelng: bounds.getNorthEast().lng(),
        swlat: bounds.getSouthWest().lat(),
        swlng: bounds.getSouthWest().lng()
      },
      dataType: 'jsonp',
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
    var lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 3,
      strokeColor: markerColor ? markerColor : '#F00'
    };

    var marker = new google.maps.Marker({
      position: location,
      map: this._map,
      title: title,
      icon: lineSymbol
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

var fruitDrop = new FruitDrop();
google.maps.event.addDomListener(window, 'load', $.proxy(fruitDrop.initialize, fruitDrop));