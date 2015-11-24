'use strict';

angular.module('parkLocator').factory('mapService', function(){

	var map = {
		center: { latitude: 51.219053, longitude: 4.404418 },
		zoom: 14,
    options: { scrollwheel: false }

	};

	return {
		map: map
	};

});