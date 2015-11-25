'use strict';

angular.module('parkLocator').factory('amenitiesService', ['$http', function($http){
	
	// http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2?f=pjson

	var list = [];

	var _logAjaxError = function (error) {
		console.log(error);
	};

	var _generateList = function (response) {
		var uniqueAmenities = response.data.drawingInfo.renderer.uniqueValueInfos;
		uniqueAmenities.forEach( function(amenity) {
			var filtered = {
				id: amenity.value,
				name: amenity.label,
				url: amenity.symbol.url,
				imageData: amenity.symbol.imageData
			};

			list.push(filtered);
		});
	};

	(function getAmenitiesData () {
		$http({
			method: 'GET',
			url: 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2?f=pjson'
		}).then(_generateList, _logAjaxError);

		$http({
			method: 'GET',
			url: 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3?f=pjson'
		}).then(_generateList, _logAjaxError);
		
	})();


	return {
		list: list
	};
}]);