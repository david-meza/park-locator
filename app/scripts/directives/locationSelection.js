(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('locationSelection', function () {
    
    return { 
      restrict: 'E',
      // Set an isolate scope so we don't mistakenly inherit anything from the parent's scope
      scope: {},
      templateUrl: 'views/directives/location-selection.html',
      controller: ['$scope', 'Esri', function ($scope, Esri) {

        Esri.modulesReady().then(function(modules) {
          console.log(modules);
        });

      }]
    };

  });

})(window.angular);