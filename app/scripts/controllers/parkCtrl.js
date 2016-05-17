(function(angular, ga) {

	'use strict';

	angular.module('appControllers').controller('parkCtrl', [ '$scope', '$state', 'currentPark', 'maps', 'amenitiesService', '$filter', 'deviceService',
		function ($scope, $state, currentPark, maps, amenitiesService, $filter, deviceService) {

			// Assign to scope so we can inherit from child directions map scope.
			$scope.maps = maps;

			// Objects in md-tabs
			$scope.currentPark = currentPark;
	    $scope.activitiesInPark = $filter('parkAmenities')(amenitiesService.activities.categoriesArr, currentPark);

	    $scope.scrollTo = deviceService.scrollTo;

	    ga('send', 'event', 'Parks', 'selected', currentPark.name, currentPark.id);

	  }]);

})(angular || window.angular, ga);
