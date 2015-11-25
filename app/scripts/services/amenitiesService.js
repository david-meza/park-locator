'use strict';

angular.module('parkLocator').factory('amenitiesService', ['$http', function($http){
	
	// http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2?f=pjson

	var list = { content: [], uniques: [] };

	var _logAjaxError = function (error) {
		console.log(error);
	};

	var _generateList = function (response) {
		var allAmenities = response.data.drawingInfo.renderer.uniqueValueInfos;
		allAmenities.forEach( function(amenity) {
			var filtered = {
				id: amenity.value,
				name: amenity.label,
				url: amenity.symbol.url,
				imageData: amenity.symbol.imageData
			};

			list.content.push(filtered);
		});

		processUniques();
	};

	var processUniques = function () {
		for (var i = 0; i < list.content.length; i++) {
			// Shorthand for current array element (current amenity)
			var c = list.content[i];
			if (list[c.name]) {continue;}
			list.uniques.push(c);
			// Mapping the amenity by name so we know we've processed it
			list[c.name] = true;
			// Mapping the amenity by id so we can get the name later when we have foreign keys
			list[c.id] = { name: c.name };
		}
	};

	var _generateParkData = function (response) {
		
	};

	(function getAmenitiesData () {

		// First set of amenities (buildings)
		$http({
			method: 'GET',
			url: 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2?f=pjson'
		}).then(_generateList, _logAjaxError);

		// Second set of amenities (outdoors)
		$http({
			method: 'GET',
			url: 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3?f=pjson'
		}).then(_generateList, _logAjaxError);

		// // Building amenities join table with parks
		// $http({
		// 	method: 'GET',
		// 	url: 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson'
		// }).then(_generateParkData, _logAjaxError);

		// // Outdoor amenities join table with parks
		// $http({
		// 	method: 'GET',
		// 	url: 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson'
		// }).then(_generateParkData, _logAjaxError);
		
	})();


	return {
		list: list
	};
}]);