'use strict';

angular.module('appControllers').controller('parkCtrl', [ '$scope', '$state', 'currentPark', 'mapService', 'maps', 'amenitiesService',
	function ($scope, $state, currentPark, mapService, maps, amenitiesService) {

		// Assign to scope so we can inherit from child directions map scope.
		$scope.maps = maps;

		// Objects in md-tabs
		$scope.currentPark = currentPark;
    $scope.activities = amenitiesService.activities;
    $scope.map = mapService.map;



  }]);
