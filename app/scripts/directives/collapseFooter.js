'use strict';

angular.module('parkLocator').directive('collapseFooter', ['$window', function ($window) {
  
  return { 
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div id = "collapse-footer" ng-transclude></div>',
    link: function(scope, element) {

      element.on('click', function() {
        console.log('parent', this.parent());
        if (this.pageYOffset >= 100) {
          element.addClass('bring-to-screen');
        } else {
          element.removeClass('bring-to-screen');
        }
      });

    }
  };

}]);