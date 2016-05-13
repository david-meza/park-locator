(function(angular) {
  
  'use strict';

  angular.module('appDirectives').directive('toggleList', ['$timeout', function ($timeout) {
    
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {

        var animating;

        function activeList() {
          return $attrs.currentList;
        }

        function scrollableHeight() {
          return $element.prop('scrollHeight');
        }

        function setHeightToAuto() {
          $element.css('height', 'auto');
        }

        function updateHeight() {
          $element.css('height', scrollableHeight() + 'px');
        }

        function animateClosing() {
          $element.css('height', 0);
        }

        function updateOpen(openingList, closingList) {
          if (openingList === $attrs.listName) {
            $timeout(updateHeight, 0, false);
            animating = $timeout(setHeightToAuto, 700, false);
          } else if (closingList === $attrs.listName) {
            $timeout.cancel(animating);
            updateHeight();
            $timeout(animateClosing, 0, false);
          }
        }

        $element.css('height', 0);
        $scope.$watch(activeList, updateOpen);
      }
    };

  }]);

})(angular || window.angular);