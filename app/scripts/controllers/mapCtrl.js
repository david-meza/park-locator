'use strict';

angular.module('parkLocator').controller('mapCtrl', ['$scope', 'mapService', 'parkService', 'amenitiesService', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$q', '$mdDialog',
	function($scope, mapService, parkService, amenitiesService, gMapsAPI, uiGmapIsReady, $q, $mdDialog){

	// Map settings
  $scope.map = mapService.map;
  
  // Park Markers
  $scope.parks = parkService.markers;
  
  // Activities Markers
  $scope.activities = amenitiesService.list.activitiesPos;
  
  // Non-duplicate activities model
  $scope.uniqueActivs = amenitiesService.list.uniques;
  
  // Non-duplicate filtering (selected) activities
  $scope.selectedActivities = amenitiesService.selectedActivities;
  
  // Park Info Window
  $scope.parkWindow = parkService.parkWindow;
  
  // Activity Info window
  $scope.activityWindow = amenitiesService.activityWindow;

  // Make a new query when the activities filter changes
  $scope.$watchCollection('selectedActivities.current', function (selected) {
    parkService.updateParkMarkers(selected);
  });

  // Opens the dialog showing the map icons key
  $scope.openKey = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/partials/key-dialog.html',
      targetEvent: ev,
      fullscreen: true,
      clickOutsideToClose:true,
      controller: 'DialogCtrl',
      locals: {
        activities: $scope.uniqueActivs
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
      marker.gObject.setVisible(z >= 16);
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