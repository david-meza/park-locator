'use strict';

angular.module('parkLocator').controller('MainCtrl', [ '$scope', 'mapService', 'accordionService', 'parkService', 'uiGmapGoogleMapApi',
	function ($scope, mapService, accordionService, parkService, gMapsAPI) {
    
    $scope.settings = accordionService.settings;

    $scope.getCoords = mapService.getCoords;

    $scope.parks = parkService.markers;

    $scope.centerToPark = function (park) {
    	park.onMarkerClicked();
    	mapService.map.location.coords.latitude = park.latitude;
    	mapService.map.location.coords.longitude = park.longitude;
    };

    // Search box inside accordion
	  var autocomplete;
	  gMapsAPI.then(function(maps) {
	    var input = document.getElementById('autocomplete');
	    var options = {
	      componentRestrictions: {country: 'us'}
	    };
	    autocomplete = new maps.places.Autocomplete( input, options );
	    autocomplete.addListener('place_changed', updateUserMarker);
	    var circle = new maps.Circle({
        center: {lat: 35.79741992502266, lng: -78.64118938203126 },
        // Radius is in meters - 15km
        radius: 15000
      });
      // Bias autocomplete results to locations in Raleigh
      autocomplete.setBounds(circle.getBounds());
	  });

	  var updateUserMarker = function() {
	    var loc = autocomplete.getPlace().geometry.location;
	    console.log(loc.lat() + ' | ' + loc.lng());
	    $scope.$apply(mapService.updateUserCoords(loc.lat(), loc.lng()));
	  };

  }]);
