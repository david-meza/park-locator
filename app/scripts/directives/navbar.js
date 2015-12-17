'use strict';

angular.module('parkLocator').directive('ngNavbar', function(){
  
  return { 
    // controller: 'navbarCtrl',
    restrict: 'E',
    replace: true,
    templateUrl: 'views/directives/navbar.html',
  };

});