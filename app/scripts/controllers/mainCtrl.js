'use strict';

angular.module('parkLocator').controller('MainCtrl', [ '$scope', 'mapService', 'accordionService', 'parkService',
	function ($scope, mapService, accordionService, parkService) {
    
    $scope.settings = accordionService.settings;

    $scope.getCoords = mapService.getCoords;

    $scope.parks = parkService.markers;
    console.log($scope.parks);

  }]);
