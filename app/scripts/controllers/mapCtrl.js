'use strict';

angular.module('parkLocator').controller('mapCtrl', ['$scope', 'mapService', 'parkService', function($scope, mapService, parkService){

	// Map settings
  $scope.map = mapService.map;

  $scope.map.parkMarkers = parkService.markers;

}]);