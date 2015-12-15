'use strict';

angular.module('parkLocator').controller('accordionCtrl', [ '$scope', 'mapService', 'accordionService', 'parkService', 'uiGmapGoogleMapApi', 'Flash', 'amenitiesService', '$rootScope', '$timeout',
	function ($scope, mapService, accordionService, parkService, gMapsAPI, Flash, amenitiesService, $rootScope, $timeout) {
    
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

    var parkResults = $scope.parks.content.length;

    var informUser = function() {
      if ($scope.parks.content.length > 0) {
        Flash.create('success', '<i class="fa fa-lg fa-check"></i> There are ' + $scope.parks.content.length + ' parks that meet your criteria.');
      } else {
        Flash.create('danger', '<i class="fa fa-lg fa-meh-o"></i> <strong>Oops!</strong> No parks matched your search.');
      }
    };

    $scope.goToPanel = function (from, to) {
      $scope.settings[from].status.open = false;
      $scope.settings[to].status.open = true;
    };

    // Set Location Section
    $scope.geoLocate = function() {

      Flash.create('info', '<i class="fa fa-lg fa-cog fa-spin"></i> We are attempting to obtain your location. Please wait a few seconds.');

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( function (position) {
          $scope.$apply(mapService.updateUserCoords(position.coords.latitude, position.coords.longitude));
        });
        $scope.goToPanel('first', 'third');
      } else {
        var message = '<i class="fa fa-lg fa-meh-o"></i> <strong> Oops!</strong>  Your browser does not support Geolocation.';
        Flash.create('warning', message);
        console.log('Geolocation not supported');
      }
    };

    $scope.geoLocate();

    $rootScope.$on('loading:progress', function(){
      Flash.create('info', '<i class="fa fa-lg fa-spinner fa-pulse"></i> Processing park results.');
    });

    $rootScope.$on('loading:finish', function(){
      $timeout(function(){
        Flash.dismiss();
        if ($scope.parks.content.length !== parkResults) {
          informUser();
          parkResults = $scope.parks.content.length;
        }
      }, 0);
      $timeout(function(){
        Flash.dismiss();
      }, 3000);
    });

    $scope.addToSelected = function (amenity) {
    	$scope.selectedActivities.current.push(amenity);
    	$scope.amenities.uniques.splice( $scope.amenities.uniques.indexOf(amenity), 1);
    };

    $scope.removeSelected = function (amenity) {
    	$scope.amenities.uniques.push( amenity );
    	$scope.selectedActivities.current.splice($scope.selectedActivities.current.indexOf(amenity), 1);
    };

    // Select a park section
    $scope.centerToPark = function (park) {
    	park.onMarkerClicked();
    	$scope.map.location.coords.latitude = park.latitude;
    	$scope.map.location.coords.longitude = park.longitude;
    	$scope.map.zoom = 16;
    };

    $scope.nearestPark = function (park) {
      // We calculate the distance between two points use Pythagorean theorem. It is not extremely accurate (unless you can walk through buildings), but it gives us a decent idea about the distance between the user and the park (better than alphabetically sorting).
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
