(function(angular, ga) {

	'use strict';

	angular.module('appControllers').controller('parkCtrl', [ '$scope', 'currentPark', 'maps', 'amenitiesService', '$filter', 'deviceService', 'Esri',
		function ($scope, currentPark, maps, amenitiesService, $filter, deviceService, Esri) {

			Esri.modulesReady().then(function(modules) {
				$scope.myLocation = function() {
					return modules.userMarker.geometry;
				}
			});

			// Assign to scope so we can inherit from child directions map scope.
			$scope.maps = maps;

			// Objects in md-tabs
			$scope.currentPark = currentPark;
	    $scope.activitiesInPark = $filter('parkAmenities')(amenitiesService.activities.categoriesArr, currentPark);

	    $scope.scrollTo = deviceService.scrollTo;

	    ga('send', 'event', 'Parks', 'selected', currentPark.name, currentPark.id);

	  }]);

})(angular || window.angular, ga);
