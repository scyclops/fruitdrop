
$(document).on('click', 'a', function(){
    if (this.target === '_blank') {
        console.log('opening window..');
        window.open(this.href);
        return false;
    }
});

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
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this._map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    this._infoWindow = new google.maps.InfoWindow();
    this._geocoder = new google.maps.Geocoder();

    google.maps.event.addListener(this._map, 'idle', $.proxy(this.getData, this));

    this.setupSettings();

    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition($.proxy(this.geo_success, this), $.proxy(this.geo_fail, this), {enableHighAccuracy:true});
    else
      this.geo_fail();
  },

  loadScript: function(src) {
    var d=document,s=d.createElement('SCRIPT'),c=d.getElementsByTagName('script')[0];s.type='text/javascript';s.async=true;s.src=src;c.parentNode.insertBefore(s, c);
  },

  setupSettings: function() {
    this._locationInput = $('#location-text');
    this._filterInput = $('#filter-text');
    this._saveButton = $('#save-btn');

    this._locationInput.on('keypress', $.proxy(this.enableSaveButton, this));
    this._filterInput.on('keypress', $.proxy(this.enableSaveButton, this));
    this._saveButton.on('click', $.proxy(this.saveClick, this));
  },

  enableSaveButton: function(e) {
    this.toggleSaveButton(false);
  },

  toggleSaveButton: function(disabled) {
    if (disabled)
      this._saveButton.button('disable');
    else
      this._saveButton.button('enable');

    this._saveButton.button('refresh');
  },

  saveClick: function(e) {
    e.preventDefault();
    this._location = this._locationInput.val();
    this._filter = this._filterInput.val();
    this.toggleSaveButton(true);

    this.getNewCenter();
    this._lastLocation = this._location;

    $.mobile.changePage('#map-window');
  },

  geo_success: function(pos) {
    var lat = pos.coords.latitude,
        lng = pos.coords.longitude;
    this._map.setCenter(new google.maps.LatLng(lat, lng));
    this.setHomeMarker();
  },

  geo_fail: function() {
    this.setHomeMarker();
  },

  setHomeMarker: function() {
    if (this._homeMarker)
      this._homeMarker.setMap(null);

    this._lastCenter = this._map.getCenter();
    this._homeMarker = this.placeMarker(this._lastCenter, 'You are Here');
  },

  getData: function() {
    var bounds = this._map.getBounds(),
        self = this;

    get_markers(
        bounds.getNorthEast().lat(),
        bounds.getNorthEast().lng(),
        bounds.getSouthWest().lat(),
        bounds.getSouthWest().lng()
    ).then(
      $.proxy(this.addMarkers, this),
      $.proxy(this.error, this)
    );

    /* -- for clusters -- 
      get_clusters(
        bounds.getNorthEast().lat(),
        bounds.getNorthEast().lng(),
        bounds.getSouthWest().lat(),
        bounds.getSouthWest().lng(),
        this._map.getZoom(),
      )
    */
  },

  addMarkers: function(data) {
    this.removeMarkers();
    var dataLength = data.length;
    for (var i = 0; i < dataLength; i++)
      this._markers.push(this.placeMarker(new google.maps.LatLng(data[i].lat, data[i].lng),
                         data[i].title,
                         data[i].location_id));
  },

  removeMarkers: function() {
    if (!this._markers) {
      this._markers = [];
      return;
    }

    var markersLength = this._markers.length;
    for (var i = 0; i < markersLength; i++) {
      if (this._markers[i] !== this._infoWindowMarker)
        this._markers[i].setMap(null);
    }

    this._markers = [];
  },

  placeMarker: function(location, title, location_id) {
    if ((this._filter) && (title.search(new RegExp(this._filter,"i")) < 0) && (title !== 'You are Here'))
      return;

    var marker = new google.maps.Marker({
      position: location,
      map: this._map,
      title: title,
      icon: getIcon(title)
    });

    var self = this;
    google.maps.event.addListener(marker, 'click', function() {
      var that = this;

      get_info(location_id)
        .then(function(data){
            var html = ('<strong>' + title + '</strong><br /><em>by ' +
                        data.author + '</em><br /><br />' + data.description),
                t;

            for (var i = 0; i < data.types.length; ++i) {
                t = data.types[i];

                if (!t.wiki_url && !t.usda_url) continue;

                html += '<br /><br />' + title + ' (';
                if (t.wiki_url) {
                    html += '<a href="'+ t.wiki_url +'" target="_blank">wiki</a>';
                }
                if (t.usda_url) {
                    if (t.wiki_url) html += ' | ';
                    html += '<a href="'+ t.usda_url +'" target="_blank">usda</a>';
                }
                html += ')';
            }

            self._infoWindow.setContent(html);
            self._infoWindow.open(self._map, that);
            self._infoWindowMarker = that;

        }, function(){
          console.log("Unable to fetch location data.");
        });

    });

    return marker;
  },

  getNewCenter: function() {
    if (!this._location) {
      this.changeCenter(this._lastCenter);
      return;
    }

    this._geocoder.geocode({ 'address': this._location }, $.proxy(this.geocodeSuccess, this));
  },

  geocodeSuccess: function(results, status) {
    if (status == google.maps.GeocoderStatus.OK)
      this.changeCenter(results[0].geometry.location);
    else
      this.changeCenter(this._lastCenter);
  },

  changeCenter: function(latlng) {
    this._map.panTo(latlng);
    this.setHomeMarker();
  },

  error: function() {
    console.log("error");
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