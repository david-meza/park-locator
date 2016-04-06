(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('locationTracker', function(){
    return {
      
      restrict: 'E',
      templateUrl: 'views/directives/location-tracker.html',
      replace: true,
      controller: ['$scope', 'Esri', function($scope, Esri) {
        
        var options, watchId, mapEvent;

        $scope.tracking = 'inactive';

        options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        Esri.modulesReady().then( function(modules) {

          $scope.trackUser = function() {
            if (watchId) {
              stopTracking();
            } else {
              watchId = navigator.geolocation.watchPosition(updatePosition, error, options);
            }
          };


          function updatePosition(pos) {
            console.log('tracking...');
            var lat, lon;
            
            $scope.tracking = 'active';
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;

            modules.trackerGraphic.setGeometry(new modules.Point([lon, lat]));
            modules.userMarker.hide();
            // Set a map event to cancel the watch if we start panning on the map (does not cancel when zooming)
            modules.map.centerAt([lon, lat]).then(function() {
              mapEvent = modules.map.on('pan-start', stopTracking);
            });
          }

          function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
          }

          function stopTracking() {
            console.log('stop track');
            navigator.geolocation.clearWatch(watchId);
            modules.userMarker.show();
            $scope.tracking = 'inactive';
            watchId = null;
            mapEvent.remove();
          }

        });

        
      }]

    };
  });

})(window.angular);