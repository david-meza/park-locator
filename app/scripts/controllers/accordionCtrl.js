'use strict';

angular.module('parkLocator').controller('accordionCtrl', [ '$scope', 'mapService', 'accordionService', 'parkService', 'uiGmapGoogleMapApi', 'Flash', 'amenitiesService', '$timeout', '$mdToast',
	function ($scope, mapService, accordionService, parkService, gMapsAPI, Flash, amenitiesService, $timeout, $mdToast) {
    
    // Basic accordion config
    $scope.settings = accordionService.settings;
	  
    // Define some async objects from our services
    $scope.parks = parkService.markers;
    $scope.amenities = amenitiesService.list;
    $scope.map = mapService.map;
    $scope.myLoc = mapService.map.myLocationMarker.coords;

    $scope.sortCategories = function (a, b, c) {
      console.log(a, b, c);
    }

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

    var informUser = function (message) {
      var toast = $mdToast.simple()
        .textContent(message)
        .action('ok')
        .highlightAction(false)
        .position('top right');
      $mdToast.show(toast);
    };

    // Set Location Section
    $scope.geoLocate = function() {

      informUser('Obtaining your location...');

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( 
          function (position) {
            $scope.$apply(mapService.updateUserCoords(position.coords.latitude, position.coords.longitude));
          },
          function (error) {
            informUser('Could not locate you due to: ' + error.message);
          }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        $scope.goToPanel('first', 'third');
      } else {
        informUser('Oops! Your browser does not support Geolocation.');
        console.log('Geolocation not supported. Defaulting to backup location.');
      }
    };

    // Get user's coordinates async a few seconds after the app loaded
    $timeout(function(){
      $scope.geoLocate();
    }, 5000);

    // Toggle an activity and trigger a park search
    $scope.toggleSelected = function (amenity) {
      amenity.selected = !amenity.selected;
      console.log(amenity);
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
      park.distance = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
      return park.distance;
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
