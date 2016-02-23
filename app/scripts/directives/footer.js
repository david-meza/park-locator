'use strict';

angular.module('appDirectives').directive('ngFooter', function(){
  
  return { 
    restrict: 'E',
    replace: true,
    templateUrl: 'views/directives/footer.html',
  };

});