'use strict';

angular.module('parkLocator').controller('mapCtrl', ['$scope', 'mapService', function($scope, mapService){

	// Maps settings
  $scope.map = mapService.map;

  // Get our map instance when it loads
  $scope.map.events = {
    tilesloaded: function () {
      $scope.mapInstance = $scope.map.control.getGMap();
    }
  };

  // Search box
  var events = {
    places_changed: function (searchBox) {
    	console.log('changed places');
      var loc = searchBox.getPlaces()[0].geometry.location;
      var latitude = loc.A;
      var longitude = loc.F;
      mapService.updateCoords(latitude, longitude);
    }
  };
  $scope.searchbox = {
    template: 'views/partials/search-box.html',
    events: events
  };

}]);