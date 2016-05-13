(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('sidenavContent', function(){
    
    return { 
      restrict: 'E',
      templateUrl: 'views/directives/sidenav-content.html',
      controller: ['$scope', '$timeout', function ($scope, $timeout) {

        $scope.currentList = '';

        $timeout(function(){
          $scope.currentList = 'location';
        }, 1000);

        $scope.toggleList = function (listName, evt) {
          $scope.currentList = $scope.currentList === listName ? '' : listName;
        };

      }]
    };

  });

})(window.angular);