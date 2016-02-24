'use strict';

angular.module('appControllers').controller('mapCtrl', ['$scope', 'mapService', 'parkService', 'amenitiesService',
  function($scope, mapService, parkService, amenitiesService){

	// Map settings
  $scope.map = mapService.map;
  
  // Park Markers
  $scope.parks = parkService.parks;
  
  // Activities Markers
  $scope.activities = amenitiesService.activities;
    
  // Park Info Window
  $scope.parkWindow = parkService.parkWindow;

  $scope.map.events.zoom_changed = function (map) {
    var z = map.getZoom();
    if ( angular.isUndefined($scope.activities.markersConfig.control.getPlurals) || angular.isUndefined($scope.parks.markersConfig.control.getPlurals) ) { return; }
    // Get all the activities markers, then only show them if we are zoomed in close to any particular park
    var activityMarkers = $scope.activities.markersConfig.control.getPlurals().values();
    angular.forEach(activityMarkers, function (marker) {
      marker.gObject.setVisible(z >= 15);
    });

    var parkMarkers = $scope.parks.markersConfig.control.getPlurals().values();
    angular.forEach(parkMarkers, function (marker) {
      marker.gObject.setVisible(z <= 16);
    });
    // Close info windows
    $scope.parkWindow.show = false;
  };

}]);