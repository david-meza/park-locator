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

        function calculateTargetHeight() {
          var targetHeight, currentHeight;
          currentHeight = $element.prop('clientHeight') + 'px';
          $element.addClass('no-transition');
          setHeight('auto');
          targetHeight = $element.prop('clientHeight') + 'px';
          setHeight(currentHeight);
          $element.removeClass('no-transition');
          return targetHeight;
          // return $element.prop('scrollHeight') + 'px';
        }

        function setHeight(targetHeight) {
          $element.css('height', targetHeight);
        }

        function setHeightnoAnimate(targetHeight) {
          $element.addClass('no-transition');
          setHeight(targetHeight);
          $timeout(function(){ $element.removeClass('no-transition'); }, 0, false); // Fix for Safari. It was removing the class before changing the height.
        }

        function updateOpen(openingList, closingList) {
          if (openingList === $attrs.listName) {
            $timeout(setHeight, 0, false, calculateTargetHeight());
            animating = $timeout(setHeightnoAnimate, 695, false, 'auto'); // For a smoother transition switch to auto in the last 5ms of the transition
          } else if (closingList === $attrs.listName) {
            if (animating) {
              $timeout.cancel(animating);
              animating = null;
            } else {
              setHeightnoAnimate(calculateTargetHeight()); // Set height back to the full container height
            }
            $timeout(setHeight, 0, false, 0);
          }
          if (animating) { animating.then(function(){ animating = null; }); }
        }

        setHeight(0); // Initially all lists are closed
        $scope.$watch(activeList, updateOpen);
        // $scope.$watch(function(){ return $element.css('height'); }, function(newVal, oldVal){ console.log('Old: ' + oldVal, 'New: ' + newVal); });
      }
    };

  }]);

})(angular || window.angular);