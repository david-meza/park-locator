'use strict';

angular.module('appControllers').controller('accordionCtrl', [ '$scope', 'accordionService',
	function ($scope, accordionService) {
    
  // Basic accordion config
  $scope.settings = accordionService.settings;

}]);
