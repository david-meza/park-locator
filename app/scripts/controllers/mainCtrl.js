'use strict';

angular.module('parkLocator').controller('MainCtrl', [ '$scope', 'mapService', 'accordionService', 'parkService',
	function ($scope, mapService, accordionService, parkService) {
    
    $scope.settings = accordionService.settings;

    $scope.getCoords = mapService.getCoords;

    $scope.parks = parkService.markers;
    console.log($scope.parks);

    $scope.centerToPark = function (park) {
    	park.onMarkerClicked();
    	mapService.map.location.coords.latitude = park.latitude;
    	mapService.map.location.coords.longitude = park.longitude;
    };

  }]);
