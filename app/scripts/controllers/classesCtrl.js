'use strict';

angular.module('parkLocator').controller('classesCtrl', ['$scope', 'classesService',
	function($scope, classesService){

    var parkIds = classesService.getParkIds($scope.currentPark.name);

    classesService.getParkClasses(parkIds);

    $scope.classes = classesService.classes;

}]);