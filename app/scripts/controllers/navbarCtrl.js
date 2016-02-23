'use strict';

angular.module('appControllers').controller('navbarCtrl', ['$scope', '$rootScope', 'parkService', 'Flash', 'deviceService',
	function ($scope, $rootScope, parkService, flash, deviceService) {
    
    var markers = parkService.markers;
    
    $scope.title = "Raleigh Park Locator";
    
    // Start the circular progress icon
    $scope.progress = 'indeterminate';

    $scope.activeTab = deviceService.activeTab;
    $scope.isMobile = deviceService.isMobile;


    $scope.scrollTo = function (target) {
      if (target === 'panels-section' && !markers.currentPark) { return flash.create('warning', '<i class="fa fa-lg fa-meh-o"></i> <strong>Oops!</strong> Please select a park first.'); }
      var contentArea = angular.element(document.getElementById('main-scrollable'));
      var ngTarget = angular.element(document.getElementById(target));
      contentArea.scrollTo(ngTarget, 0, 600);
    };

    $rootScope.$on('loading:progress', function(){
      $scope.progress = 'indeterminate';
    });

    $rootScope.$on('loading:finish', function(){
    	$scope.progress = undefined;
      // informUser();
    });

}]);