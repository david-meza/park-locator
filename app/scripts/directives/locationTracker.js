(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('locationTracker', ['$mdToast', function($mdToast){
    return {
      
      restrict: 'E',
      templateUrl: 'views/directives/location-tracker.html',
      replace: true,
      controller: ['$scope', 'Esri', function($scope, Esri) {
        
        var options, watchId, mapEvent;

        options = {
          enableHighAccuracy: true,
          timeout: 60000,
          maximumAge: 30000
        };

        Esri.modulesReady().then( function(modules) {

          function updatePosition(pos) {
            var lat, lon;
            // Wrap the variable change on a $scope.$apply function to notify Angular of the variable change 
            // because this event happens outside of the Angular framework (geolocation API)
            $scope.$apply(function() {
              $scope.watching = true;
            });

            lat = pos.coords.latitude;
            lon = pos.coords.longitude;

            modules.trackerGraphic.setGeometry(new modules.Point([lon, lat]));
            modules.userMarker.hide();
            // Set a map event to cancel the watch if we start panning on the map (does not cancel when zooming)
            modules.map.centerAt([lon, lat]).then(function() {
              mapEvent = modules.map.on('mouse-drag-start', stopTracking);
            });
          }

          function stopTracking() {
            // Wrap the variable change on a $scope.$apply function to notify Angular of the variable change 
            // because this event happens outside of the Angular framework (Esri/window event)
            $scope.$apply(function() {
              $scope.watching = false;
            });
            
            navigator.geolocation.clearWatch(watchId);
            modules.userMarker.show();
            watchId = null;
            mapEvent.remove();
          }

          function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
            $mdToast.showSimple('Please enable Geolocation.')
          }

          $scope.trackUser = function() {
            setTimeout(function() {
              if (watchId) {
                stopTracking();
              } else {
                watchId = navigator.geolocation.watchPosition(updatePosition, error, options);
              }
            }, 0);
          };

        });

      }]

    };
  }]);

})(window.angular);