'use strict';

angular.module('appControllers').controller('DialogCtrl', ['$scope', '$mdDialog', 'amenitiesService',
  function DialogCtrl($scope, $mdDialog, amenitiesService) {
    $scope.activities = amenitiesService.activities.categoriesArr;

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }]);