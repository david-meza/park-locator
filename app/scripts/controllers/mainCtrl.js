'use strict';

angular.module('parkLocator').controller('MainCtrl', [ '$scope', 'mapService', 'accordionService',
	function ($scope, mapService, accordionService) {
    
    $scope.settings = accordionService.settings;

    $scope.getCoords = mapService.getCoords;

  }]);
