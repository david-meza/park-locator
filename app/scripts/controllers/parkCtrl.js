(function(angular) {

	'use strict';

	angular.module('appControllers').controller('parkCtrl', [ '$scope', '$state', 'currentPark', 'mapService', 'maps', 'amenitiesService', '$filter', 'deviceService',
		function ($scope, $state, currentPark, mapService, maps, amenitiesService, $filter, deviceService) {

			// Assign to scope so we can inherit from child directions map scope.
			$scope.maps = maps;

			// Objects in md-tabs
			$scope.currentPark = currentPark;
	    $scope.activitiesInPark = $filter('parkAmenities')(amenitiesService.activities.categoriesArr, currentPark);
	    $scope.map = mapService.map;

	    $scope.scrollTo = deviceService.scrollTo;

	  }]);

})(window.angular);
