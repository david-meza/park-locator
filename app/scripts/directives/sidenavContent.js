(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('sidenavContent', function(){
    
    return { 
      restrict: 'E',
      templateUrl: 'views/directives/sidenav-content.html',
      controller: ['$scope', function ($scope) {

        $scope.currentList = 'location';

        $scope.toggleList = function (listName) {
          $scope.currentList = $scope.currentList === listName ? '' : listName;
        };

      }]
    };

  });

})(window.angular);