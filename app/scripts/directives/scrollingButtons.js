'use strict';

angular.module('parkLocator').directive('scrollingButtons', function () {
  
  return { 
    restrict: 'A',
    transclude: true,
    templateUrl: 'views/directives/scrolling-buttons.html',
    
    link: function(scope, element) {

      // Cheatsheet for HTML element properties:
      // scrollHeight: Full element height including scrollable area
      // offsetHeight and clientHeight: Visible height.
      // scrollTop: Number of pixels from the top, changes with scrolling
      // offsetTop and clientTop: Number of pixels to the top border relative to parent element. OffsetTop seems to include pixels from padding


      var buttonTop = angular.element(element.children().children()[0]);
      var buttonBottom = angular.element(element.children().children()[2]);
      var panel = element.children().children()[1];
      var animationInProgress = false;

      
      scope.scrollup = function () {
        _autoScroll(panel.scrollTop, panel.scrollTop - panel.clientHeight);        
      };

      scope.scrolldown = function () {
        _autoScroll(panel.scrollTop, panel.scrollTop + panel.clientHeight);
      };

      function _autoScroll(startLocation, endLocation) {
        if (animationInProgress) { return; }
        
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
          currentLocation = panel.scrollTop;
          scrollHeight = panel.scrollHeight;
          internalHeight = panel.clientHeight + currentLocation;

          if ( position === endLocation || currentLocation === endLocation || internalHeight >= scrollHeight) {
            clearInterval(runAnimation);
            animationInProgress = false;
          }
        };

        var animateScroll = function () {
          timeLapsed += 16;
          percentage = ( timeLapsed / duration );
          percentage = ( percentage > 1 ) ? 1 : percentage;
          position = startLocation + ( distance * getEasingPattern(percentage) );

          // Move slightly following the easing pattern
          panel.scrollTop = position;
          
          // Check if we have reached our destination          
          stopAnimation();
        };

        var runAnimation = setInterval(animateScroll, 16);
        animationInProgress = true;
      }


      // Show and hide the buttons when we reach the top or bottom of the scrollable area
      angular.element(panel).bind('scroll', function() {
        
        // Can't do if/else because of cases when we have to remove both classes. Small performance change
        if (this.scrollTop <= 0) {
          buttonTop.removeClass('show-button');
        } 
        if (this.scrollTop >= this.scrollHeight - this.clientHeight) {
          buttonBottom.removeClass('show-button');
        } 
        if (this.scrollTop > 0 && this.scrollTop < this.scrollHeight - this.clientHeight) {
          buttonBottom.addClass('show-button');
          buttonTop.addClass('show-button');
        }

      });

    }
  };

});