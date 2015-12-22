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

    // Get all the park markers and close their window on a zoom event (if they are left open and they get clustered there's an annoying bug)
    // var parkMarkers = $scope.parks.control.getPlurals();
    // parkMarkers.allVals.forEach( function (marker) {
    //   marker.model.showWindow = false;
    //   marker.gObject.model.showWindow = false;
    // });
  };

  var _onMarkerClicked = function () {
    var self = this;
    $scope.$apply(amenitiesService.updateActivityWindow(self));
  };

  var generateParkData = function (response) {

    if (typeof response.data === 'object') {
      var activsPos = response.data.features;
      activsPos.forEach( function(activity) {
        if (!amenitiesService.list[activity.attributes.SUBCATEGORY]) { console.log( activity.attributes.SUBCATEGORY ); }
        var processed = {
          id: activity.attributes.OBJECTID,
          name: activity.attributes.LOCATION,
          park: activity.attributes.PARK_NAME,
          subcategory: amenitiesService.list[activity.attributes.SUBCATEGORY] || activity.attributes.SUBCATEGORY,
          latitude: activity.geometry.y,
          longitude: activity.geometry.x,
          icon: amenitiesService.list[activity.attributes.SUBCATEGORY] ? ('data:image/png;base64,' + (amenitiesService.list[activity.attributes.SUBCATEGORY].imageDataSm ? amenitiesService.list[activity.attributes.SUBCATEGORY].imageDataSm : amenitiesService.list[activity.attributes.SUBCATEGORY].imageData)) : 'https://maxcdn.icons8.com/Color/PNG/24/Very_Basic/info-24.png',
          onMarkerClicked: _onMarkerClicked,
          options: {
            visible: false,
            title: amenitiesService.list[activity.attributes.SUBCATEGORY] ? amenitiesService.list[activity.attributes.SUBCATEGORY].name : activity.attributes.LOCATION || activity.attributes.PARK_NAME || 'activity',
          }
        };

        amenitiesService.list.activitiesPos.markers.push(processed);
      });

    } else {
      console.log('error', response);
    }

  };

  var promise1 = amenitiesService.getAmenitiesData().then(amenitiesService.generateList, amenitiesService.logAjaxError);
  var promise2 = amenitiesService.getAmenitiesData2().then(amenitiesService.generateList, amenitiesService.logAjaxError);

  $q.all([promise1, promise2]).then(amenitiesService.completeData, amenitiesService.logAjaxError)
                              .then(amenitiesService.getJoinParkData, amenitiesService.logAjaxError)
                              .then(generateParkData, amenitiesService.logAjaxError)
                              .then(amenitiesService.getJoinParkData2, amenitiesService.logAjaxError)
                              .then(generateParkData, amenitiesService.logAjaxError);


  var mapInstance,
      mapsApi;

  gMapsAPI.then( function (maps) {
  	mapsApi = maps;
  });

  uiGmapIsReady.promise(1).then(function(instances) {
    mapInstance = instances[0].map;
    // console.log( mapInstance.getMapTypeId() );
    // applyMapStyles();
  });

  var applyMapStyles = function () {
  	var styledMap = new mapsApi.StyledMapType( $scope.map.options.styles, {name: 'Nature'});
	  mapInstance.setMapTypeId('nature');
    mapInstance.mapTypes.set('nature', styledMap);
    console.log( mapInstance.getMapTypeId() );
  };

}]);