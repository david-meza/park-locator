'use strict';

angular.module('parkLocator').controller('classesCtrl', ['$scope', 'classesService',
	function($scope, classesService){

	// Map settings
  $scope.parksList = classesService.parkIds;


}]);