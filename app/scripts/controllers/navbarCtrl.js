'use strict';

angular.module('appControllers').controller('navbarCtrl', ['$scope', '$rootScope', 'parkService', '$mdToast', 'deviceService',
	function ($scope, $rootScope, parkService, $mdToast, deviceService) {
    
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


    $scope.scrollTo = function (target) {
      if (target === 'panels-section' && !markers.currentPark) { return informUser('Oops! Please select a park first.'); }
      var contentArea = angular.element(document.getElementById('main-scrollable'));
      var ngTarget = angular.element(document.getElementById(target));
      contentArea.scrollTo(ngTarget, 0, 600);
    };

    $rootScope.$on('loading:progress', function(){
      $scope.progress = 'indeterminate';
    });

    $rootScope.$on('loading:finish', function(){
    	$scope.progress = undefined;
    });

}]);