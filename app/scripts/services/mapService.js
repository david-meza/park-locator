(function(angular, ga) {

  'use strict';

  angular.module('appServices').factory('mapService', ['uiGmapGoogleMapApi', '$mdToast', 'Esri', 'deviceService',
    function (gMapsApi, $mdToast, Esri, deviceService) {

    var esriModules, location;
    
    Esri.modulesReady().then( function (modules) {
      esriModules = modules;
      geoLocate(); // Get user's coordinates.
    });

    // Temporary coordinates while Geoloc gets us accurate user's coords or as fallback for denied permissions
    location = {
      coords: {
        latitude: 35.779590,
        longitude: -78.638179
      }
    };


    var informUser = function (message, hide) {
      var toast = $mdToast.simple()
        .textContent(message)
        .action('ok')
        .highlightAction(false)
        .hideDelay(hide || 3000)
        .position('bottom right');
      
      deviceService.toastIsClosed().then( function() {
        $mdToast.show(toast);
      });
    };

    var _isInRaleigh = function (lat, lon) {
      // Test Raleigh address: 35.7776464, -78.63844279999999
      return lat < 36.413561 && lat > 35.437814 && lon < -77.936890 && lon > -78.984583;
    };

    var updateUserCoords = function (lat, lon) {
      if (!_isInRaleigh(lat, lon)) {
        return informUser('Oops! It seems this location is not in Raleigh.');
      }
      // Update the location obj with the accurate user coords
      esriModules.userMarker.setGeometry(new esriModules.Point([lon, lat]));
      centerAndZoom(lat, lon);
      
    };

    var geoLocate = function () {
      informUser('Attempting to find you.', 1500);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( 
          function (position) {
            updateUserCoords(position.coords.latitude, position.coords.longitude);
            ga('send', 'event', 'Location', 'geoLocated', position.coords.latitude + ',' + position.coords.longitude);
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


    return {
      updateUserCoords: updateUserCoords,
      geoLocate: geoLocate,
      centerAndZoom: centerAndZoom
    };

  }]);

})(angular || window.angular, ga);