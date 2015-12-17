'use strict';

angular.module('parkLocator').directive('fixOnScroll', ['$window', function ($window) {
  
  return {
    restrict: 'A',
    // scope: {
    //   fixOnScroll: '=fixOnScroll'
    // },
    link: function(scope, element, attrs) {
      // debugger;
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