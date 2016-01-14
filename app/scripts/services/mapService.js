'use strict';

angular.module('parkLocator').factory('mapService', ['Flash', 'uiGmapGoogleMapApi',
  function (Flash, gMapsApi) {


  var mapsObj;

  gMapsApi.then( function (maps) {
    mapsObj = maps;
    map.searchbox.options.bounds = new mapsObj.LatLngBounds(new mapsObj.LatLng(35.437814,-78.984583), new mapsObj.LatLng(36.113561,-78.336890));
  });

  // Temporary coordinates while Geoloc gets us the user's coords
  var location = {
  	coords: {
	    latitude: 35.79741992502266, 
	    longitude: -78.64118938203126
  	}
  };

  var map = {
  	// 1 to 20 - 20 being closely zoomed in
    zoom: 12,
    // turns to true when the map is being dragged
    dragging: false,
    // set to true to trigger a map refresh when necessary
    refresh: false,
    pan: false,
    location: location,
    control: {},
    bounds: {
      northeast: {
        longitude: -78.336890,
        latitude: 36.113561
      },
      southwest: {
        latitude: 35.437814,
        longitude: -78.984583
      }
    },
    options: {
      // backgroundColor: '#2c3e50',
      draggable: true, //$window.innerWidth >= 992,
      scrollwheel: false,
      // mapTypeControl: true,
      // mapTypeId: 'HYBRID',
      // mapTypeControlOptions: {
        // mapTypeIds: ['park_theme', 'ROADMAP'],
      // },
      minZoom: 8,
      tilt: 45,
      panControl: false //$window.innerWidth < 992
    },
  };

  map.markersConfig = {
    type: 'cluster',
    typeOptions: {
      title: 'Zoom in to find more parks!',
      gridSize: 60,
      minimumClusterSize: 3
    },
    typeEvents: {}
  };

  map.markersConfig.typeOptions.styles = [
    {
      textColor: '#FFF',
      textSize: 19,
      fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',
      anchor: [20, 20],
      anchorIcon: [10,25],
      url: 'https://s3.amazonaws.com/davidmeza/Park_Locator/park-icon-small.png',
      height: 50,
      width: 50
    },
    {
      textColor: '#FFF',
      textSize: 15,
      fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',
      anchor: [20, 20],
      anchorIcon: [10,25],
      url: 'https://s3.amazonaws.com/davidmeza/Park_Locator/park-icon-small.png',
      height: 50,
      width: 50
    },
    {
      textColor: '#FFF',
      textSize: 12,
      fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',
      anchor: [20, 20],
      anchorIcon: [10,25],
      url: 'https://s3.amazonaws.com/davidmeza/Park_Locator/park-icon-small.png',
      height: 50,
      width: 50
    },
    {
      textColor: '#FFF',
      textSize: 12,
      fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',
      anchor: [20, 20],
      anchorIcon: [10,25],
      url: 'https://s3.amazonaws.com/davidmeza/Park_Locator/park-icon-small.png',
      height: 50,
      width: 50
    },
    {
      textColor: '#FFF',
      textSize: 12,
      fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',
      anchor: [20, 20],
      anchorIcon: [10,25],
      url: 'https://s3.amazonaws.com/davidmeza/Park_Locator/park-icon-small.png',
      height: 50,
      width: 50
    },

  ];

  // Optional map themes
  // Light browns and greens (nature)
  map.options.styles = [{'featureType':'poi.park','elementType':'geometry.fill','stylers':[{'color':'#519c2f'},{'gamma':'1.27'}]},{'featureType':'poi.park','elementType':'labels.text.stroke','stylers':[{'visibility':'on'},{'color':'#e4bd2e'},{'weight':'3.14'},{'gamma':'1.58'}]},{'featureType':'poi.school','elementType':'labels','stylers':[{'visibility': 'off'}]},{'featureType':'poi.business','elementType':'labels','stylers':[{'visibility': 'off'}]},{'featureType':'poi.place_of_worship','elementType':'labels','stylers':[{'visibility': 'off'}]},{'featureType':'road.local','elementType':'labels','stylers':[{'visibility': 'off'}]},{'featureType':'landscape','stylers':[{'hue':'#FFBB00'},{'saturation':43.400000000000006},{'lightness':37.599999999999994},{'gamma':1}]},{'featureType':'road.highway','stylers':[{'hue':'#FFC200'},{'saturation':-61.8},{'lightness':45.599999999999994},{'gamma':1}]},{'featureType':'road.arterial','stylers':[{'hue':'#FF0300'},{'saturation':-100},{'lightness':51.19999999999999},{'gamma':1}]},{'featureType':'road.local','stylers':[{'hue':'#FF0300'},{'saturation':-100},{'lightness':52},{'gamma':1}]},{'featureType':'water','stylers':[{'hue':'#0078FF'},{'saturation':-13.200000000000003},{'lightness':2.4000000000000057},{'gamma':1}]}];
  // Removed: {'featureType':'poi','stylers':[{'hue':'#00FF6A'},{'saturation':-1.0989010989011234},{'lightness':11.200000000000017},{'gamma':1}]}

  // Light blues and greys 
  map.options.secondaryStyles = [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#b5cbe4'}]},{'featureType':'landscape','stylers':[{'color':'#efefef'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#83a5b0'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#bdcdd3'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#ffffff'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#e3eed3'}]},{'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'road'},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{},{'featureType':'road','stylers':[{'lightness':20}]}];

  // Marker for current location (Geolocation or default)
  map.myLocationMarker = {
    id: 0,
    coords: { latitude: location.coords.latitude, longitude: location.coords.longitude },
    options: {
      draggable: false,
      clickable: false,
      icon: 'https://s3.amazonaws.com/davidmeza/Park_Locator/user.png',
    },
  };

  // Get our map instance when it loads
  map.events = {
    tilesloaded: function () {
      map.mapInstance = map.control.getGMap();
    }
  };

  // Search box
  map.searchbox = {
    template: 'views/partials/search-box.html',
    position: 'TOP_RIGHT',
    options: {
      // bounds: {
      //   east: -78.336890,
      //   north: 36.113561,
      //   south: 35.437814,
      //   west: -78.984583
      // }
    },
    events: {
      places_changed: function (searchBox) {
        var loc = searchBox.getPlaces()[0].geometry.location;
        moveToPos(loc.lat(), loc.lng());
	    }
	  }
  };

	var _isInRaleigh = function (lat, lon) {
    // Test Raleigh address: 35.7776464, -78.63844279999999
    return lat < 36.113561 && lat > 35.437814 && lon < -78.336890 && lon > -78.984583;
  };

  var updateUserCoords = function (lat, lon) {
    // Update the location obj with the accurate user coords
    map.location.coords.latitude = lat;
    map.location.coords.longitude = lon;
    map.myLocationMarker.coords.latitude = lat;
    map.myLocationMarker.coords.longitude = lon;
    map.zoom = 14;
    if (!_isInRaleigh(lat, lon)) {
      // Otherwise, keep using default coordinates
      var message = '<strong><i class = "fa fa-fw fa-exclamation-circle"></i> </strong>  It seems this location is not in Raleigh.';
      Flash.create('warning', message);
    }
  };

  var moveToPos = function (lat, lon) {
    // if (!_isInRaleigh(lat,lon)) { return updateUserCoords(lat,lon); }
    map.location.coords.latitude = lat;
    map.location.coords.longitude = lon;
    map.zoom = 16;
  };

  return {
    map: map,
    updateUserCoords: updateUserCoords,
  };

}]);