'use strict';

angular.module('parkLocator').controller('MainCtrl', [ '$scope', 'mapService', 'accordionService', 'uiGmapGoogleMapApi',
	function ($scope, mapService, accordionService, gMapsAPI) {
    
    $scope.settings = accordionService.settings;

    $scope.getCoords = mapService.getCoords;

    var autocomplete;

    gMapsAPI.then(function(maps) {
    	$scope.gMaps = maps;
    	autocomplete = new maps.places.Autocomplete( (document.getElementById('autocomplete')), { types: ['geocode'] } );
    	autocomplete.addListener('place_changed', updateUserMarker);
    });

    var updateUserMarker = function() {
	    console.log(autocomplete.getPlace());
	    var loc = autocomplete.getPlace().geometry.location;
	    console.log(loc.lat() + ' | ' + loc.lng());
	    mapService.updateUserCoords(loc.lat(), loc.lng());
	  };

  }]);
