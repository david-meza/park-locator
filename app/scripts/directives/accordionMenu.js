'use strict';

angular.module('appDirectives').directive('accordionMenu', function(){
  
  return { 
    controller: 'accordionCtrl',
    restrict: 'E',
    templateUrl: 'views/directives/accordion-menu.html',
  };

});