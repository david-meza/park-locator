'use strict';

angular.module('parkLocator').controller('mapCtrl', ['$scope', 'mapService', 'parkService', 'uiGmapGoogleMapApi', 'uiGmapIsReady',
	function($scope, mapService, parkService, gMapsAPI, uiGmapIsReady){

	// Map settings
  $scope.map = mapService.map;
  $scope.map.parkMarkers = parkService.markers;

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