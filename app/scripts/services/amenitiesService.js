'use strict';

angular.module('parkLocator').factory('amenitiesService', ['$http', function($http){
	
	// http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2?f=pjson

	var list = [];

	var _logAjaxError = function (error) {
		console.log(error);
	};

	var _generateList = function (response) {
		console.log(response.data);
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