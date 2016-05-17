(function(angular, ga) {

  'use strict';

  angular.module('appServices').factory('mapService', ['$mdToast', 'Esri', 'deviceService',
    function ($mdToast, Esri, deviceService) {

    var esriModules, geoLocationOptions;

    geoLocationOptions = {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 30000
    };
    
    function informUser(message, hideDelay) {
      var toast = $mdToast.simple()
        .textContent(message)
        .action('ok')
        .highlightAction(false)
        .hideDelay(hideDelay || 3000)
        .position('bottom right');
      
      deviceService.toastIsClosed().then( function() { // In IE we wait until the user acknowledges the performance issues toast
        $mdToast.show(toast);
      });
    }

    function _isInRaleigh(lat, lon) {
      // Test Raleigh address: 35.7776464, -78.63844279999999
      return lat < 36.413561 && lat > 35.437814 && lon < -77.936890 && lon > -78.984583;
    }

    function _processPosition(position) {
      updateUserCoords(position.coords.latitude, position.coords.longitude);
      ga('send', 'event', 'Location', 'geoLocated', position.coords.latitude + ',' + position.coords.longitude);
    }

    function _logGeolocError(error) {
      informUser('Sorry, could not find you. Please try again.');
      console.warn('Error: ', error);
    }

    function updateUserCoords(lat, lon) {
      if (!_isInRaleigh(lat, lon)) {
        return informUser('Oops! It seems this location is not in Raleigh.');
      }
      // Update the location obj with the accurate user coords
      esriModules.userMarker.setGeometry(new esriModules.Point([lon, lat]));
      centerAndZoom(lat, lon);
    }

    function geoLocate() {
      informUser('Attempting to find you.', 1500);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( _processPosition, _logGeolocError, geoLocationOptions);
      } else {
        informUser('Oops! Your browser does not support Geolocation.');
        console.warn('Geolocation not supported. Defaulting to backup location.');
      }
    }

    function centerAndZoom(lat, lon) {
      esriModules.map.centerAndZoom( new esriModules.Point({
        y: lat, x: lon,
        spatialReference: { wkid: 4326 }
      }), 15);
    }

    Esri.modulesReady().then( function (modules) {
      esriModules = modules;
      geoLocate(); // Get user's coordinates.
    });


    return {
      updateUserCoords: updateUserCoords,
      geoLocate: geoLocate,
      centerAndZoom: centerAndZoom
    };

  }]);

})(angular || window.angular, ga);