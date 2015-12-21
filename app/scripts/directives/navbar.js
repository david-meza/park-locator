'use strict';

angular.module('parkLocator').directive('ngNavbar', function(){
  
  return { 
    restrict: 'E',
    replace: true,
    templateUrl: 'views/directives/navbar.html',
    controller: function ($scope) {
    	$scope.title = "City of Raleigh Park Locator";
    }
  };

});