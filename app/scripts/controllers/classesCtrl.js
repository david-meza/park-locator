'use strict';

angular.module('appControllers').controller('classesCtrl', ['$scope', 'classesService', '$state', 'deviceService',
	function($scope, classesService, $state, deviceService){

    var parkIds = classesService.getParkIds($scope.currentPark.name);

    $scope.classes = { sections: [] };
    $scope.scrollTo = deviceService.scrollTo;

    $scope.goToSection = function (section) {
      $state.go('home.park.section', { sectionName: section });
    };

    function processClasses(response) {
      classesService.processClasses(response.data, $scope.classes);
    }

    classesService.getParkClasses(parkIds).then(processClasses, classesService.logError);


}]);