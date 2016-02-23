'use strict';

angular.module('appDirectives').directive('classesInfo', function(){
  
  return { 
    controller: 'classesCtrl',
    restrict: 'E',
    templateUrl: 'views/directives/classes.html',
    scope: {
    	currentPark: '='
    }
  };

});