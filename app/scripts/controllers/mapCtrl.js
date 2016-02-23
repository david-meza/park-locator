'use strict';

angular.module('appControllers').controller('mapCtrl', ['$scope', 'mapService', 'parkService', 'amenitiesService', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$q', '$mdDialog',
	function($scope, mapService, parkService, amenitiesService, gMapsAPI, uiGmapIsReady, $q, $mdDialog){

	// Map settings
  $scope.map = mapService.map;
  
  // Park Markers
  $scope.parks = parkService.markers;
  
  // Activities Markers
  $scope.activities = amenitiesService.list.activitiesPos;
  
  // Non-duplicate filtering (selected) activities
  $scope.selectedActivities = amenitiesService.selectedActivities;
  
  // Park Info Window
  $scope.parkWindow = parkService.parkWindow;
  
  // Activity Info window
  $scope.activityWindow = amenitiesService.activityWindow;

  // Opens the dialog showing the map icons key
  $scope.openKey = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/partials/key-dialog.html',
      targetEvent: ev,
      fullscreen: true,
      clickOutsideToClose: true,
      controller: 'DialogCtrl',
      locals: {
        activities: amenitiesService.list.categories
      },
      bindToController: true
    });
  };

  $scope.map.events.zoom_changed = function (map) {
    var z = map.getZoom();
    if (!$scope.activities.markersConfig.control.getPlurals) { return; }
    
    // Get all the activities markers, then only show them if we are zoomed in >= 16
    var activsMarkers = $scope.activities.markersConfig.control.getPlurals();
    activsMarkers.allVals.forEach( function (marker) {
      marker.gObject.setVisible(z >= 15);
    });

    // Close info windows
    $scope.parkWindow.show = false;
    $scope.activityWindow.show = false;
  };

  var mapInstance,
      mapsApi;

  gMapsAPI.then( function (maps) {
  	mapsApi = maps;
  });

}]);