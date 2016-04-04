(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('locationSelection', function () {
    
    return { 
      restrict: 'E',
      // Set an isolate scope so we don't mistakenly inherit anything from the parent's scope
      scope: {},
      templateUrl: 'views/directives/location-selection.html',
      controller: ['$scope', 'Esri', 'mapService', function ($scope, Esri, mapService) {

        Esri.modulesReady().then(function(modules) {
          console.log(modules);
        });

        $scope.geolocate = mapService.geoLocate;

      }]
    };

  });

})(window.angular);