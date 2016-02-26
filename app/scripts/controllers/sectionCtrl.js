'use strict';

angular.module('appControllers').controller('sectionCtrl', ['$scope', 'classesService', '$stateParams',
	function ($scope, classesService, $stateParams) {

  $scope.sectionName = $stateParams.sectionName;
  
  // Yeah... quite brittle, but it doesn't make sense to create a service if we need to wipe out the classes obj every time we change parks.
  $scope.classes = $scope.$parent.$parent.classes;

  $scope.sortOptions = [
    { model: 'sDate', view: 'the earliest'},
    { model: '-sDate', view: 'the latest'},
    { model: 'COURSE', view: 'course title (A-Z)'},
    { model: '-COURSE', view: 'course title (Z-A)'},
    { model: 'ACTIVITY', view: 'activity title (A-Z)'},
    { model: '-ACTIVITY', view: 'activity title (Z-A)'}
  ];

  // Start sorting by courses descending
  $scope.sortQuery = $scope.sortOptions[0];

}]);