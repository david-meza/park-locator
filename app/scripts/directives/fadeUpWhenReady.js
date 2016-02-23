'use strict';

angular.module('appDirectives').directive('fadeUpWhenReady', ['$document', function ($document) {
  
  return { 
    restrict: 'A',
    compile: function (element, attr) {
      var hide = {
        "opacity": attr.opacity || 0,
        "-webkit-transform":  "translateY(" + (attr.offset || 100) + "px)",
        "-moz-transform":     "translateY(" + (attr.offset || 100) + "px)",
        "-o-transform":       "translateY(" + (attr.offset || 100) + "px)",
        "-ms-transform":      "translateY(" + (attr.offset || 100) + "px)",
        "transform":          "translateY(" + (attr.offset || 100) + "px)",
        "-webkit-transition": "all " + (attr.duration || 600) + "ms cubic-bezier(0.345, 0, 0.25, 1)",
        "-moz-transition":    "all " + (attr.duration || 600) + "ms cubic-bezier(0.345, 0, 0.25, 1)",
        "-o-transition":      "all " + (attr.duration || 600) + "ms cubic-bezier(0.345, 0, 0.25, 1)",
        "-ms-transition":     "all " + (attr.duration || 600) + "ms cubic-bezier(0.345, 0, 0.25, 1)",
        "transition":         "all " + (attr.duration || 600) + "ms cubic-bezier(0.345, 0, 0.25, 1)"
      };
      element.css(hide);

      $document.ready( function() {
        var fadeup = {
          "opacity": 1,
          "-webkit-transform":  "translateY(0)",
          "-moz-transform":     "translateY(0)",
          "-o-transform":       "translateY(0)",
          "-ms-transform":      "translateY(0)",
          "transform":          "translateY(0)"
        };
        element.css(fadeup);
      });
    
    }
  };

}]);