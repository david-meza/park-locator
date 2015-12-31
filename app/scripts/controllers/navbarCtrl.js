'use strict';

angular.module('parkLocator').controller('navbarCtrl', ['$scope', '$rootScope', 'parkService', 'Flash', 'deviceService',
	function ($scope, $rootScope, parkService, flash, deviceService) {
    
    var markers = parkService.markers;
    
    $scope.title = "City of Raleigh Park Locator";
    
    // Start the circular progress icon
    $scope.progress = 'indeterminate';

    $scope.activeTab = deviceService.activeTab;
    $scope.isMobile = deviceService.isMobile;

    $scope.selectPark = function () {
      $scope.activeTab.name = 'park';
      if (!markers.currentPark) { 
        flash.create('warning', '<i class="fa fa-lg fa-meh-o"></i> <strong>Oops!</strong> Please select a park first.');
      }
    };

    $rootScope.$on('loading:progress', function(){
      $scope.progress = 'indeterminate';
    });

    $rootScope.$on('loading:finish', function(){
    	$scope.progress = undefined;
      // informUser();
    });

}]);