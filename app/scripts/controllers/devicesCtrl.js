'use strict';

angular.module('appControllers').controller('devicesCtrl', ['$scope', 'deviceService', '$mdToast',
	function($scope, deviceService, $mdToast){

    $scope.isMobile = deviceService.isMobile;

    if (deviceService.isIE() ) {
      $mdToast.show({
        hideDelay   : 0,
        position    : 'top right',
        controller  : 'ToastCtrl',
        templateUrl : 'views/partials/ie-warning-toast.html'
      }).then( function(response) {
        deviceService.activeToast.resolve(response);
      });
    } else {
      deviceService.activeToast.resolve('Good to go!');
    }

    $scope.showTab = function (tab) {
      return $scope.isMobile() && $scope.activeTab.name !== tab;
    };

  }])
  
  .controller('ToastCtrl', ['$scope', '$mdToast', function($scope, $mdToast) {

    $scope.closeToast = function() {
      $mdToast.hide('Ok');
    };
    
  }]);