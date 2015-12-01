'use strict';

angular.module('parkLocator').directive('ngError', ['$parse', function($parse){

  return {
    restrict: 'A',
    compile: function($element, attr) {
      // Converts contents of angular expression into a function
      var fn = $parse(attr['ngError']);

      return function(scope, element, attr) {
        element.on('error', function(event) {
          scope.$apply(function() {
            fn(scope, {$event:event});
          });
        });
      };

    }
  };

}]);