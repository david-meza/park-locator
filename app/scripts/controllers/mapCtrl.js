'use strict';

angular.module('parkLocator').controller('mapCtrl', ['$scope', 'mapService', function($scope, mapService){

	// Maps settings
  $scope.map = mapService.map;

}]);