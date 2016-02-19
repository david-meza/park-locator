'use strict';

angular.module('parkLocator').controller('DialogCtrl', ['$scope', '$mdDialog', 'amenitiesService',
  function DialogCtrl($scope, $mdDialog, amenitiesService) {
    $scope.activities = amenitiesService.list.categories;

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