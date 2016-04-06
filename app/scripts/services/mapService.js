(function(angular) {

  'use strict';

  angular.module('appServices').factory('mapService', ['uiGmapGoogleMapApi', '$mdToast', '$timeout', 'Esri',
    function (gMapsApi, $mdToast, $timeout, Esri) {

    var esriModules;
    
    Esri.modulesReady().then( function (modules) {
      esriModules = modules;
      // Get user's coordinates
      geoLocate();
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
      zoom: 13,
      // turns to true when the map is being dragged
      dragging: false,
      // set to true to trigger a map refresh when necessary
      refresh: false,
      pan: false,
      location: location,
      control: {},
      events: {},
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
        disableDefaultUI: true,
        draggable: true,
        scrollwheel: false,
        minZoom: 9,
        tilt: 0,
        zoomControl: true,
        zoomControlOptions: {
          position: undefined,
          style: undefined,
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: undefined
        },
        scaleControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
          position: undefined
        },
        rotateControl: false,
        panControl: false
      },
    };

    // Map Theme: Pale Dawn
    map.options.styles = [{'featureType':'administrative','elementType':'all','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2e5d4'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#c5dac6'}]},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{'featureType':'road','elementType':'all','stylers':[{'lightness':20}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#c5c6c6'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#e4d7c6'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#fbfaf7'}]},{'featureType':'water','elementType':'all','stylers':[{'visibility':'on'},{'color':'#acbcc9'}]}];

    // Light blues and greys 
    map.options.secondaryStyles = [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#b5cbe4'}]},{'featureType':'landscape','stylers':[{'color':'#efefef'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#83a5b0'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#bdcdd3'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#ffffff'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#e3eed3'}]},{'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'road'},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{},{'featureType':'road','stylers':[{'lightness':20}]}];

    // Marker for current location (Geolocation or default)
    map.myLocationMarker = {
      id: 0,
      coords: { latitude: location.coords.latitude, longitude: location.coords.longitude },
      options: {
        draggable: true,
        clickable: false,
        icon: '/img/icons/user-marker.svg',
        zIndex: 999
      },
    };

    var informUser = function (message, hide) {
      var toast = $mdToast.simple()
        .textContent(message)
        .action('ok')
        .highlightAction(false)
        .hideDelay(hide || 3000)
        .position('bottom right');
      $mdToast.show(toast);
    };

    var _isInRaleigh = function (lat, lon) {
      // Test Raleigh address: 35.7776464, -78.63844279999999
      return lat < 36.113561 && lat > 35.437814 && lon < -78.336890 && lon > -78.984583;
    };

    var updateUserCoords = function (lat, lon) {
      // Update the location obj with the accurate user coords
      esriModules.userMarker.setGeometry(new esriModules.Point([lon, lat]));
      centerAndZoom(lat, lon);
      
      map.location.coords.latitude = lat;
      map.location.coords.longitude = lon;
      map.myLocationMarker.coords.latitude = lat;
      map.myLocationMarker.coords.longitude = lon;
      map.zoom = 14;
      if (!_isInRaleigh(lat, lon)) {
        informUser('Oops! It seems this location is not in Raleigh.');
      }
    };

    var geoLocate = function () {
      informUser('Attempting to find you.', 1500);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( 
          function (position) {
            updateUserCoords(position.coords.latitude, position.coords.longitude);
          },
          function (error) {
            informUser('Sorry, could not find you. Please try again.');
            console.log('Error: ', error);
          }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
      } else {
        informUser('Oops! Your browser does not support Geolocation.');
        console.log('Geolocation not supported. Defaulting to backup location.');
      }
    };

    function centerAndZoom(lat, lon) {
      esriModules.map.centerAndZoom( new esriModules.Point({
        y: lat, 
        x: lon,
        spatialReference: { wkid: 4326 }
      }), 15);
    }

    gMapsApi.then( function (maps) {
      map.options.zoomControlOptions.position = maps.ControlPosition.LEFT_BOTTOM;
      map.options.zoomControlOptions.style = maps.ZoomControlStyle.SMALL;
      map.options.streetViewControlOptions.position = maps.ControlPosition.LEFT_BOTTOM;
      map.options.mapTypeControlOptions.position = maps.ControlPosition.TOP_LEFT;
    });

    return {
      map: map,
      updateUserCoords: updateUserCoords,
      geoLocate: geoLocate,
      centerAndZoom: centerAndZoom
    };

  }]);

})(window.angular);