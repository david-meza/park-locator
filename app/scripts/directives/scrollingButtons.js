'use strict';

angular.module('parkLocator').directive('scrollingButtons', function () {
  
  return { 
    restrict: 'A',
    transclude: true,
    templateUrl: 'views/directives/scrolling-buttons.html',
    
    link: function(scope, element) {

      // Cheatsheet for HTML element properties:
      // scrollHeight: Full element height including scrollable area
      // offsetHeight and clientHeight: Visible height 
      // scrollTop: Number of pixels from the top, changes with scrolling
      // offsetTop and clientTop: Number of pixels to the top border relative to parent element 

      var panel = element.children().children()[1];

      var getScrollLocation = function () {
        return panel.scrollTop;
      };
      
      scope.scrollup = function () {
        // panel.scrollTop -= panel.clientHeight;
        autoScroll(panel.scrollTop, panel.scrollTop - panel.clientHeight);

        // if (panel.scrollTop < 0) { panel.scrollTop = 0; }

        
      };

      scope.scrolldown = function () {
        // var max = panel.scrollHeight - panel.clientHeight;

        // panel.scrollTop += panel.clientHeight;

        // if (panel.scrollTop > max) { panel.scrollTop = max; }

        autoScroll(panel.scrollTop, panel.scrollTop + panel.clientHeight);
      };

      function autoScroll(startLocation, endLocation) {
        
        var currentLocation = null,
            timeLapsed = 0,
            duration = 400,
            distance = endLocation - startLocation,
            percentage,
            position,
            scrollHeight,
            internalHeight;

        var getEasingPattern = function(time) {
          // easeInOutCubic  
          return (time < 0.5) ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
        };

        var stopAnimation = function () {
          currentLocation = getScrollLocation();
          scrollHeight = panel.scrollHeight;
          internalHeight = panel.clientHeight + currentLocation;

          if ( position == endLocation || currentLocation == endLocation || internalHeight >= scrollHeight) {
            clearInterval(runAnimation);
          }
        };

        var animateScroll = function () {
          timeLapsed += 16;
          percentage = ( timeLapsed / duration );
          percentage = ( percentage > 1 ) ? 1 : percentage;
          position = startLocation + ( distance * getEasingPattern(percentage) );

          panel.scrollTop = position;
          
          // Check if we have reached our destination          
          stopAnimation();
        };

        var runAnimation = setInterval(animateScroll, 16);
      }

    }
  };

});