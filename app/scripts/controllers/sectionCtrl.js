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

    $scope.coursesLimit = 7;
    // Expand the list of park results
    $scope.showAll = function () {
      $scope.coursesLimit = $scope.classes[$scope.sectionName].length;
    };


}]);