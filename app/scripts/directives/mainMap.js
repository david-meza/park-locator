'use strict';

angular.module('appDirectives').directive('mainMap', function(){
	return {
		
		controller: 'mapCtrl',
		restrict: 'E',
    template: '<div id="map-canvas"><div id="geolocate-button"></div></div>',
		replace: true,

	};
});