'use strict';

angular.module('parkLocator').directive('backToTop', function () {
  
  return { 
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div id = "back-to-top" ng-transclude></div>',
    link: function(scope, element) {

      var container = element.parent();
      
      container.on('scroll', function() {
        (this.scrollTop >= 50) ? element.addClass('bring-to-screen') : element.removeClass('bring-to-screen')
      });


      scope.scroll = function () {
        container.scrollTopAnimated(0, 800);
      };

    }
  };

});