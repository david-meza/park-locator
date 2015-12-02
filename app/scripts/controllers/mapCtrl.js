'use strict';

angular.module('parkLocator').controller('mapCtrl', ['$scope', 'mapService', 'parkService', 'amenitiesService', 'uiGmapGoogleMapApi', 'uiGmapIsReady',
	function($scope, mapService, parkService, amenitiesService, gMapsAPI, uiGmapIsReady){

	// Map settings
  $scope.map = mapService.map;
  $scope.map.parkMarkers = parkService.markers;
  $scope.activities = amenitiesService.list.activitiesPos;

  var noIndigestion = [];

  $scope.showMarkers = function () {
    if ($scope.map.zoom >= 17) { return $scope.activities.markers; }
    return noIndigestion;
  }

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
  	var styledMap = new mapsApi.StyledMapType( $scope.map.options.styles, {name: "Nature"});
		mapInstance.mapTypes.set('nature', styledMap);
	  mapInstance.setMapTypeId('nature');
  };

}]);