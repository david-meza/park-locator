'use strict';

angular.module('parkLocator').directive('collapseFooter', ['$document', '$timeout', function ($document, $timeout) {
  
  return { 
    restrict: 'E',
    replace: true,
    templateUrl: 'views/directives/collapse-footer.html',
    link: function(scope, element) {
      $document.ready( function() {
        
        var footer = angular.element(document.getElementById('footer'));
        var animationInProgress = false;

        element.on('click', function() {
          if (animationInProgress) return;
          animationInProgress = true;
          
          footer.toggleClass('collapsed');
          element.children().toggleClass('rotated');
          
          $timeout(function(){
            animationInProgress = false;
          }, 500);
        });
      
      });
    }
  };

}]);