'use strict';

angular.module('parkLocator').directive('accordionMenu', function(){
  
  return { 
    controller: 'accordionCtrl',
    restrict: 'E',
    templateUrl: 'views/directives/accordion-menu.html',
  };

});