'use strict';

angular.module('parkLocator').controller('mapCtrl', ['$scope', 'mapService', 'parkService', 'amenitiesService', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$q',
	function($scope, mapService, parkService, amenitiesService, gMapsAPI, uiGmapIsReady, $q){

	// Map settings
  $scope.map = mapService.map;
  $scope.map.parkMarkers = parkService.markers;
  $scope.activities = amenitiesService.list.activitiesPos;
  $scope.activityWindow = amenitiesService.activityWindow;
  $scope.selectedActivities = amenitiesService.selectedActivities;
  $scope.noActivities = [];

  // Make a new query when the activities filter changes
  $scope.$watchCollection('selectedActivities.current', parkService.updateParkMarkers );

  // Overwrite the func definition with an event that in watched in angular digest cycle
  // var c = $scope.activityWindow.closeClick;
  // $scope.activityWindow.closeClick = function() {
  //   $scope.$apply( c );
  // };

  // var overwriteParkClicked = function () {
  //   for (var i = 0; i < $scope.activities.markers.length; i++) {
  //     var c = $scope.activities.markers[i].onMarkerClicked;
  //     $scope.activities.markers[i].onMarkerClicked = function () {
  //       $scope.$apply( c );
  //     };
  //   }
  //   console.log('been here');
  // };

  var _onMarkerClicked = function () {
    var self = this;
    $scope.$apply(amenitiesService.updateActivityWindow(self));
  };

  var generateParkData = function (response) {

    if (typeof response.data === 'object') {
      var activsPos = response.data.features;
      activsPos.forEach( function(activity) {
        var processed = {
          id: activity.attributes.OBJECTID,
          name: activity.attributes.LOCATION,
          park: activity.attributes.PARK_NAME,
          subcategory: amenitiesService.list[activity.attributes.SUBCATEGORY] || activity.attributes.SUBCATEGORY,
          latitude: activity.geometry.y,
          longitude: activity.geometry.x,
          icon: amenitiesService.list[activity.attributes.SUBCATEGORY] ? ('data:image/png;base64,' + (amenitiesService.list[activity.attributes.SUBCATEGORY].imageDataSm ? amenitiesService.list[activity.attributes.SUBCATEGORY].imageDataSm : amenitiesService.list[activity.attributes.SUBCATEGORY].imageData)) : 'https://maxcdn.icons8.com/Color/PNG/24/Very_Basic/info-24.png',
          onMarkerClicked: _onMarkerClicked
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
                              .then(amenitiesService.generateParkData, amenitiesService.logAjaxError)
                              .then(amenitiesService.getJoinParkData2, amenitiesService.logAjaxError)
                              .then(generateParkData, amenitiesService.logAjaxError);


  $scope.showMarkers = function () {
    return ($scope.map.zoom >= 16) ? $scope.activities.markers : $scope.noActivities;
  };

  var mapInstance,
      mapsApi;

  gMapsAPI.then( function (maps) {
  	mapsApi = maps;
  });

  uiGmapIsReady.promise(1).then(function(instances) {
    mapInstance = instances[0].map;
    applyMapStyles();
  });

  var applyMapStyles = function () {
  	var styledMap = new mapsApi.StyledMapType( $scope.map.options.styles, {name: 'Nature'});
	  mapInstance.setMapTypeId('nature');
    mapInstance.mapTypes.set('nature', styledMap);
  };

}]);