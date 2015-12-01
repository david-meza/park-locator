'use strict';

angular.module('parkLocator').controller('MainCtrl', [ '$scope', 'mapService', 'accordionService', 'parkService', 'uiGmapGoogleMapApi', 'Flash', 'amenitiesService',
	function ($scope, mapService, accordionService, parkService, gMapsAPI, Flash, amenitiesService) {
    
    // Basic accordion config
    $scope.settings = accordionService.settings;
	  // Define some async objects from our services
    $scope.parks = parkService.markers;
    $scope.amenities = amenitiesService.list;
    $scope.myLoc = mapService.map.location.coords;
    // Filter by activity section
    $scope.selectedActivities = [];

    $scope.goToPanel = function (from, to) {
      $scope.settings[from].status.open = false;
      $scope.settings[to].status.open = true;
    };

    // Set Location Section
    $scope.geoLocate = function() {

      Flash.create('info', 'We are attempting to obtain your location. Please wait a few seconds.');

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( function (position) {
          $scope.$apply(mapService.updateUserCoords(position.coords.latitude, position.coords.longitude));
        });
        $scope.goToPanel('first', 'second');
      } else {
        var message = '<strong> Oops!</strong>  Your browser does not support Geolocation.';
        Flash.create('warning', message);
        console.log('Geolocation not supported');
      }
    };

    $scope.geoLocate();

    $scope.addToSelected = function (amenity) {
    	$scope.selectedActivities.push(amenity);
    	$scope.amenities.uniques.splice( $scope.amenities.uniques.indexOf(amenity), 1);
    	console.log($scope.amenities.uniques);
    };

    $scope.removeSelected = function (amenity) {
    	$scope.amenities.uniques.push( amenity );
    	$scope.selectedActivities.splice($scope.selectedActivities.indexOf(amenity), 1);
    	console.log($scope.selectedActivities);
    };

    // Select a park section
    $scope.centerToPark = function (park) {
    	park.onMarkerClicked();
    	$scope.myLoc.latitude = park.latitude;
    	$scope.myLoc.longitude = park.longitude;
    	mapService.map.zoom = 15;
    };

    $scope.nearestPark = function (park) {
      // We calculate the distance between two points use Pythagorea theorem. It is not extremely accurate (unless you can walk through buildings), but it gives us a decent idea about the distance between the user and the park (better than alphabetically sorting).
      var a = Math.abs(park.latitude - $scope.myLoc.latitude);
      var b = Math.abs(park.longitude - $scope.myLoc.longitude);
      return Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
    };

    // Search box inside set my location panel
	  var autocomplete;

	  gMapsAPI.then(function(maps) {
	  	$scope.mapsApi = maps;
	  	// Address typeahead
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

	  // Function used by address typeahead on a place selected
	  var updateUserMarker = function() {
	    var loc = autocomplete.getPlace().geometry.location;
	    $scope.$apply(mapService.updateUserCoords(loc.lat(), loc.lng()));
      $scope.goToPanel('first', 'second');
	  };


  }]);
