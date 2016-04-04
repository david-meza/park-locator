'use strict';

angular.module('appControllers').controller('navbarCtrl', ['$scope', '$rootScope', 'parkService', '$mdToast', 'deviceService', '$mdSidenav',
	function ($scope, $rootScope, parkService, $mdToast, deviceService, $mdSidenav) {
    
    var markers = parkService.parks;

    var informUser = function (message, hide) {
      var toast = $mdToast.simple()
        .textContent(message)
        .action('ok')
        .highlightAction(false)
        .hideDelay(hide || 3000)
        .position('bottom right');
      $mdToast.show(toast);
    };
    
    $scope.title = "Park Locator";
    // Start the circular progress icon
    $scope.progress = 'indeterminate';

    $scope.activeTab = deviceService.activeTab;
    $scope.isMobile = deviceService.isMobile;

    $scope.toggleSidenav = function () {
      $mdSidenav('left').toggle();
    };

    $rootScope.$on('loading:progress', function(){
      $scope.progress = 'indeterminate';
    });

    $rootScope.$on('loading:finish', function(){
    	$scope.progress = undefined;
    });

}]);