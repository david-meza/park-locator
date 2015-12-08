'use strict';

angular.module('parkLocator').controller('classesCtrl', ['$scope', 'classesService', '$state', '$window',
	function($scope, classesService, $state, $window){

    var parkIds = classesService.getParkIds($scope.currentPark.name);
    classesService.getParkClasses(parkIds);

    $scope.classesTabs = {
    	vertical: true,
    	justified: ($window.innerWidth <= 767),
    	type: 'pills'
    };

    var windowSize = function () {
      return $window.innerWidth;
    };

    var updateTabs = function (newValue) {
      $scope.classesTabs.justified = (newValue <= 767);
    };

    $scope.$watch(windowSize, updateTabs);

    $scope.classes = classesService.classes;

    $scope.goToSection = function (section) {
      $state.go('home.park.section', { sectionName: section });
    };

}]);