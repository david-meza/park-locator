'use strict';

angular.module('appDirectives').directive('scrollingButtons', function () {
  
  return { 
    restrict: 'A',
    transclude: true,
    templateUrl: 'views/directives/scrolling-buttons.html',
    
    link: function(scope, element) {

      var buttonTop = angular.element(element.children().children()[0]);
      var buttonBottom = angular.element(element.children().children()[2]);
      var panel = element.children().children()[1];
      var animationInProgress = false;

      var toggleButtons = function() {
        // Can't do if/else because of cases when we have to remove both classes. Small performance change
        if (panel.scrollTop <= 0) {
          buttonTop.removeClass('show-button');
        } 
        if (panel.scrollTop >= panel.scrollHeight - panel.clientHeight) {
          buttonBottom.removeClass('show-button');
        } 
        if (panel.scrollTop > 0 && panel.scrollTop < panel.scrollHeight - panel.clientHeight) {
          buttonBottom.addClass('show-button');
          buttonTop.addClass('show-button');
        }
      };

      // Show and hide the buttons when we reach the top or bottom of the scrollable area
      angular.element(panel).on('scroll', toggleButtons);

      // var searchBox = document.getElementById('searchParkName');
      // angular.element(searchBox).on('keyup', toggleButtons);
      
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
          // easeInOutCubic: acceleration until halfway, then deceleration
          return (time < 0.5) ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1;
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

        animationInProgress = true;
        var runAnimation = setInterval(animateScroll, 16);
      }

    }
  };

});