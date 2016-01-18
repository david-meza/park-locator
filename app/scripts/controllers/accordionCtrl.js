'use strict';

angular.module('parkLocator').controller('accordionCtrl', [ '$scope', 'mapService', 'accordionService', 'parkService', 'uiGmapGoogleMapApi', 'Flash', 'amenitiesService', '$timeout',
	function ($scope, mapService, accordionService, parkService, gMapsAPI, Flash, amenitiesService, $timeout) {
    
    // Basic accordion config
    $scope.settings = accordionService.settings;
	  
    // Define some async objects from our services
    $scope.parks = parkService.markers;
    $scope.amenities = amenitiesService.list;
    $scope.map = mapService.map;
    $scope.myLoc = mapService.map.myLocationMarker.coords;
    
    // Filter by activity section
    $scope.selectedActivities = amenitiesService.selectedActivities;
    
    // Limit to number of parks initially shown
    $scope.parksLimit = undefined;
    $scope.$watch('parks.content.length', function (newVal) {
      $scope.parksLimit = Math.min(10, newVal);
    });
    
    // Expand the list of park results
    $scope.showAll = function () {
      $scope.parksLimit = $scope.parks.content.length;
    };

    $scope.goToPanel = function (from, to) {
      $scope.settings[from].status.open = false;
      $scope.settings[to].status.open = true;
    };

    // Set Location Section
    $scope.geoLocate = function() {

      Flash.create('info', '<i class="fa fa-lg fa-cog fa-spin"></i> Obtaining your location.');

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( function (position) {
          $scope.$apply(mapService.updateUserCoords(position.coords.latitude, position.coords.longitude));
        });
        $scope.goToPanel('first', 'third');
      } else {
        var message = '<i class="fa fa-lg fa-meh-o"></i> <strong> Oops!</strong>  Your browser does not support Geolocation.';
        Flash.create('warning', message);
        console.log('Geolocation not supported. Defaulting to backup location.');
      }
    };

    $scope.geoLocate();

    // Add an activity to filter array
    $scope.addToSelected = function (amenity) {
    	$scope.selectedActivities.current.push(amenity);
    	$scope.amenities.uniques.splice( $scope.amenities.uniques.indexOf(amenity), 1);
    };

    // Remove a selected activity
    $scope.removeSelected = function (amenity) {
    	$scope.amenities.uniques.push( amenity );
    	$scope.selectedActivities.current.splice($scope.selectedActivities.current.indexOf(amenity), 1);
    };

    // Select a park section
    $scope.centerToPark = function (park) {
    	$scope.map.zoom = 16;
      $scope.map.location.coords.latitude = park.latitude;
      $scope.map.location.coords.longitude = park.longitude;
      $timeout(function(){
        park.markerClick(null, 'click', park);
       }, 100); 
    };

    // We calculate the distance between two points use Pythagorean theorem. It is not extremely accurate (unless you can walk through buildings), but it gives us a decent idea about the distance between the user and the park (better than alphabetically sorting).
    $scope.nearestPark = function (park) {
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
      $scope.goToPanel('first', 'third');
	  };


  }]);
