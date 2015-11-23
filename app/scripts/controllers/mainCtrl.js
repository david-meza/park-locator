'use strict';

angular.module('parkLocator').controller('MainCtrl', [ '$scope', 'accordionService',
	function ($scope, accordionService) {
    
    $scope.settings = accordionService.settings;

  }]);
