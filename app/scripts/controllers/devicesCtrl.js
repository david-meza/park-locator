'use strict';

angular.module('appControllers').controller('devicesCtrl', ['$scope', 'deviceService', '$mdToast',
	function($scope, deviceService, $mdToast){

    $scope.isMobile = deviceService.isMobile;

    $scope.activeTab = deviceService.activeTab;

    if (deviceService.isIE() ) {
      $mdToast.show({
        hideDelay   : 20000,
        position    : 'top right',
        controller  : 'ToastCtrl',
        templateUrl : 'views/partials/ie-warning-toast.html'
      });
    }

    $scope.showTab = function (tab) {
      return $scope.isMobile() && $scope.activeTab.name !== tab;
    };

  }])
  
  .controller('ToastCtrl', ['$scope', '$mdToast', function($scope, $mdToast) {

    $scope.closeToast = function() {
      $mdToast.hide();
    };
    
  }]);