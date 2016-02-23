'use strict';

angular.module('appDirectives').directive('ngNavbar', function(){
  
  return { 
    restrict: 'E',
    replace: true,
    templateUrl: 'views/directives/navbar.html',
    controller: 'navbarCtrl'
  };

});