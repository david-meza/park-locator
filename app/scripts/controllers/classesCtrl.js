'use strict';

angular.module('parkLocator').controller('classesCtrl', ['$scope', 'classesService', '$state',
	function($scope, classesService, $state){

    var parkIds = classesService.getParkIds($scope.currentPark.name);

    classesService.getParkClasses(parkIds);

    $scope.classes = classesService.classes;

    $scope.goToSection = function (section) {
      $state.go('home.park.section', { sectionName: section });
    };

}]);