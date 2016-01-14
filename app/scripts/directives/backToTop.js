'use strict';

angular.module('parkLocator').directive('backToTop', function () {
  
  return { 
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div id = "back-to-top" ng-transclude></div>',
    link: function(scope, element) {

      element.parent().on('scroll', function() {
        if (this.scrollTop >= 50) {
          element.addClass('bring-to-screen');
        } else {
          element.removeClass('bring-to-screen');
        }
      });

      var target = angular.element(document.getElementById('anchor-top'));
      var container = element.parent();

      scope.scroll = function () {
        console.log('scrolling', target);
        container.scrollTo(target, 0, 800, function (t) { return t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 });
      };

    }
  };

});