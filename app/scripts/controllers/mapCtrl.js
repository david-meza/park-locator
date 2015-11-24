'use strict';

angular.module('parkLocator').controller('mapCtrl', ['$scope', 'mapService', function($scope, mapService){
	$scope.map = mapService.map;
}]);