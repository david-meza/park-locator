'use strict';

angular.module('parkLocator').factory('parkService', ['$http', function($http){
	
	var currentMarker = { obj: {} };
	var markers = { content: [] };

	var _generateMarkers = function (response) {
		console.log(response.data);
		response.data.features.forEach(function(park, idx){
      var marker = {
        id: idx,
        name: park.attributes['NAME'],
        icon: 'https://s3.amazonaws.com/davidmeza/Park_Locator/tree-small.png',
        latitude: park.geometry.y,
        longitude: park.geometry.x,
        showWindow: false,
        onMarkerClicked: _onMarkerClicked,
        options: {
          title: park.attributes['NAME'],
          labelAnchor: '22 0'
        },
      };

      markers.content.push(marker);
    });
	};

	var _onMarkerClicked = function () {
		// If currentMarker is not null, meaning another marker window is shown,
    // then set showWindow of that marker window to false.
    currentMarker.obj.showWindow = false;
    currentMarker.obj = this;
    this.showWindow = true;
	};

	var _logAjaxError = function (error) {
		console.log(error);
	};

	$http({
		method: 'GET',
		url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson'
	}).then(_generateMarkers, _logAjaxError);

	return {
		markers: markers
	};

}]);