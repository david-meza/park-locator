'use strict';

angular.module('parkLocator').controller('sectionCtrl', ['$scope', 'classesService', '$stateParams',
	function ($scope, classesService, $stateParams) {

    $scope.sectionName = $stateParams.sectionName;

    $scope.classes = classesService.classes;

    // Start sorting by courses descending
    $scope.sortQuery = 'sDate';
    $scope.reverse = false;

    $scope.sortBy = function (query) {
    	$scope.reverse = ($scope.sortQuery === query) ? !$scope.reverse : false;
    	$scope.sortQuery = query;
    };

    // Show only 7 results initially in table
    $scope.coursesLimit = 7;
    
    // Expand the list of courses results
    $scope.showAll = function () {
      $scope.coursesLimit = $scope.classes[$scope.sectionName].length;
    };


}]);