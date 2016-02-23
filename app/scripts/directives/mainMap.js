'use strict';

angular.module('appDirectives').directive('mainMap', function(){
	return {
		
		controller: 'mapCtrl',
		restrict: 'E',
		templateUrl: 'views/directives/map.html',
		replace: true,

	};
});