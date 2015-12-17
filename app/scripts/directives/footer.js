'use strict';

angular.module('parkLocator').directive('ngFooter', function(){
  
  return { 
    restrict: 'E',
    replace: true,
    templateUrl: 'views/directives/footer.html',
  };

});