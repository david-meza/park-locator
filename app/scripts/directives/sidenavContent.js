(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('sidenavContent', function(){
    
    return { 
      restrict: 'E',
      replace: true,
      templateUrl: 'views/directives/sidenav-content.html',
      controller: ['$scope', '$mdSidenav', 'deviceService',
        function ($scope, $mdSidenav, deviceService) {

        $scope.currentList = '';

        $scope.toggleList = function (listName) {
          $scope.currentList = $scope.currentList === listName ? '' : listName;
        }

        // Close any sidenav
        $scope.closeSidenav = function (name) {
          $mdSidenav(name).close();
        };


      }]
    };

  });

})(window.angular);