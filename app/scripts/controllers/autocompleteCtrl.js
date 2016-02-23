(function(angular) {

  'use strict';

  angular.module('appControllers').controller('autocompleteCtrl', ['$scope', 'uiGmapGoogleMapApi', 'mapService', '$mdDialog',
    function($scope, gMapsApi, mapService, $mdDialog){

      // Search box inside set my location dialog
      var myLocation;

      gMapsApi.then(function(maps) {

        var input = document.getElementById($scope.inputId);
        var options = {
          componentRestrictions: {country: 'us'}
        };
        myLocation = new maps.places.Autocomplete( input, options );
        myLocation.addListener('place_changed', updateUserMarker);
        var circle = new maps.Circle({
          center: {lat: 35.79741992502266, lng: -78.64118938203126 },
          // Radius is in meters - 15km
          radius: 15000
        });
        // Bias autocomplete results to locations in Raleigh
        myLocation.setBounds(circle.getBounds());

      });

      // Function used by address typeahead on a place selected
      var updateUserMarker = function() {
        $mdDialog.hide().then(function () {
          var loc = myLocation.getPlace().geometry.location;
          mapService.updateUserCoords( loc.lat(), loc.lng() );
        });
      };

  }]);

})(window.angular);