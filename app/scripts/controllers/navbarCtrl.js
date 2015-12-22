'use strict';

angular.module('parkLocator').controller('navbarCtrl', ['$scope', '$rootScope', 'parkService', 'Flash', 'deviceService',
	function ($scope, $rootScope, parkService, flash, deviceService) {
    
    $scope.title = "City of Raleigh Park Locator";
    
    // Start the circular progress icon
    $scope.progress = 'indeterminate';

    $scope.activeTab = deviceService.activeTab;
    $scope.isMobile = deviceService.isMobile;
    
    // $scope.parks = parkService.markers;
 
    // var informUser = function() {
    //   if ($scope.parks.content.length > 0) {
    //     flash.create('success', '<i class="fa fa-lg fa-check"></i> There are ' + $scope.parks.content.length + ' parks that meet your criteria.');
    //   } else {
    //     flash.create('danger', '<i class="fa fa-lg fa-meh-o"></i> <strong>Oops!</strong> No parks matched your search.');
    //   }
    // };

    $rootScope.$on('loading:progress', function(){
      $scope.progress = 'indeterminate';
    });

    $rootScope.$on('loading:finish', function(){
    	$scope.progress = undefined;
      // informUser();
    });

}]);