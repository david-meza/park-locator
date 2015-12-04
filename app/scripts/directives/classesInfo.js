'use strict';

angular.module('parkLocator').directive('classesInfo', function(){
  
  return { 
    controller: 'classesCtrl',
    restrict: 'E',
    templateUrl: 'views/directives/classes.html',
    scope: {
    	currentPark: '='
    }
  };

});