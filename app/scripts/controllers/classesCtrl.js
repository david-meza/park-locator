'use strict';

angular.module('parkLocator').controller('classesCtrl', ['$scope', 'classesService', '$state', '$window',
	function($scope, classesService, $state, $window){

    var parkIds = classesService.getParkIds($scope.currentPark.name);

    $scope.classes = classesService.classes;

    $scope.goToSection = function (section) {
      $state.go('home.park.section', { sectionName: section });
    };

    var goToFirst = function () {
      if ($scope.classes.sections.length > 0) {
        $scope.classes.sections[0].active = true;
        $scope.goToSection($scope.classes.sections[0].name);
      }
    };

    classesService.getParkClasses(parkIds).then(goToFirst);

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

}]);