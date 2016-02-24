'use strict';

angular.module('appDirectives').directive('backToTop', function () {
  
  return { 
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div id = "back-to-top" ng-transclude></div>',
    link: function(scope, element) {

      var container = element.parent();
      var footer = angular.element(document.getElementById('footer'));
      
      container.on('scroll', function() {
        if (footer.hasClass('collapsed')) {
          element.addClass('lower');
        } else {
          element.removeClass('lower');
        }

        if (this.scrollTop >= 50) {
          element.addClass('bring-to-screen');
        } else {
          element.removeClass('bring-to-screen');
        }
      });


      scope.scroll = function () {
        container.scrollTopAnimated(0, 800);
      };

    }
  };

});