(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('locationTracker', function(){
    return {
      
      restrict: 'E',
      templateUrl: 'views/directives/location-tracker.html',
      replace: true,
      controller: ['$scope', 'Esri', '$timeout', 'deviceService', function($scope, Esri, $timeout, deviceService) {
        
        var options, watchId, mapEvent;

        options = {
          enableHighAccuracy: true,
          timeout: 60000,
          maximumAge: 30000
        };

        Esri.modulesReady().then( function(modules) {

          function removeOldGraphic(newGraphic) {
            modules.userGraphics.remove(modules.trackerGraphic);
            modules.trackerGraphic = newGraphic;
          }

          function updateTrackerGraphic(lat, lon) {
            var g = modules.trackerGraphic.clone();
            g.geometry = new modules.Point([lon, lat]);
            modules.userGraphics.add(g);
            if ( deviceService.isMobile() ) {
              $timeout(removeOldGraphic, 250, true, g);
            } else {
              removeOldGraphic(g);
            }
          }

          function cancelTrackingIfInteracted() {
            if (!mapEvent) { // Do not create more than one event at a time
              // Set a map event to cancel the watch if we start panning on the map (should not cancel when zooming)
              mapEvent = modules.mapView.watch('interacting', stopTracking);
            }
          }

          function centerMapView(lat, lon) {
            modules.mapView
              .goTo({ center: [lon, lat], zoom: modules.mapView.zoom < 15 ? 17 : modules.mapView.zoom })
              .then(cancelTrackingIfInteracted);
          }

          function updatePosition(pos) {
            // Wrap the variable change on a $scope.$apply function to notify Angular of the variable change 
            // because this event happens outside of the Angular framework (geolocation API)
            $scope.$apply(function() {
              $scope.tracking = true;
            });

            updateTrackerGraphic(pos.coords.latitude, pos.coords.longitude);
            centerMapView(pos.coords.latitude, pos.coords.longitude);
          }

          function stopTracking() {
            // Wrap the variable change on a $scope.$apply function to notify Angular of the variable change 
            // because this event happens outside of the Angular framework (Esri/window event)
            $scope.$apply(function() {
              $scope.tracking = false;
            });
            
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            mapEvent.remove();
            mapEvent = null;
          }

          function logError(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
          }

          $scope.trackUser = function() {
            setTimeout(function() {
              if (watchId) {
                stopTracking();
              } else {
                watchId = navigator.geolocation.watchPosition(updatePosition, logError, options);
              }
            }, 0);
          };

        });


      }]
    };
  });

})(angular || window.angular);