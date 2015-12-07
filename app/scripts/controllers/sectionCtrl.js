'use strict';

angular.module('parkLocator').controller('sectionCtrl', ['$scope', 'classesService', '$stateParams',
	function ($scope, classesService, $stateParams) {

    $scope.sectionName = $stateParams.sectionName;

    $scope.classes = classesService.classes;

    $scope.sortQuery = 'COURSE';
    $scope.reverse = false;

    $scope.sortBy = function (query) {
    	$scope.reverse = ($scope.sortQuery === query) ? !$scope.reverse : false;
    	$scope.sortQuery = query;
    };


}]);