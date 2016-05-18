'use strict';

angular.module('appDirectives').directive('collapseFooter', ['$document', '$timeout', 'deviceService', function ($document, $timeout, deviceService) {
  
  return { 
    restrict: 'E',
    replace: true,
    templateUrl: 'views/directives/collapse-footer.html',
    link: function(scope, element) {
      $document.ready( function() {
        
        var footer = angular.element(document.getElementById('footer'));
        var animationInProgress = false;

        function hideFooter() {
          footer.toggleClass('collapsed');
          element.children().toggleClass('rotated');
          angular.element(document.getElementById('back-to-top')).toggleClass('lower');
        }

        if ( deviceService.isMobile() ) { hideFooter(); }

        element.on('click', function() {
          if (animationInProgress) { return; }
          animationInProgress = true;
          
          hideFooter();
          
          $timeout(function(){
            animationInProgress = false;
          }, 500);
        });
      
      });
    }
  };

}]);