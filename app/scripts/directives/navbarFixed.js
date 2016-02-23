'use strict';

angular.module('appDirectives').directive('fixOnScroll', ['$window', function ($window) {
  
  return {
    restrict: 'A',
    // scope: {
    //   fixOnScroll: '=fixOnScroll'
    // },
    link: function(scope, element, attrs) {
      // Do not use this directive in desktop size as navigation is hidden
      if ($window.innerWidth >= 768) { return; }

      angular.element($window).bind("scroll", function() {
        if (this.pageYOffset >= attrs.fixOnScroll) {
           element
            .css({height: '41px'})
            .children().addClass('fixed');
        } else {
           element
           .css({height: 'auto'})
           .children().removeClass('fixed');
        }
      });

    }
  };
}]);