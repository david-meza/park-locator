'use strict';

angular.module('appControllers').controller('navbarCtrl', ['$scope', '$rootScope', 'deviceService', '$mdSidenav',
	function ($scope, $rootScope, deviceService, $mdSidenav) {
    
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