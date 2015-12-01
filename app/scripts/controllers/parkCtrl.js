'use strict';

angular.module('parkLocator').controller('parkCtrl', [ '$scope', '$state', '$stateParams', 'mapService', 'parkService', 'uiGmapGoogleMapApi', 'amenitiesService',
	function ($scope, $state, $stateParams, mapService, parkService, gMapsAPI, amenitiesService) {

		console.log('park controller instantiated');

		var parkName = $stateParams.name,
				directionsService,
	  		directionsDisplay;

	  // Define some async objects from our services
    $scope.parks = parkService.markers;
    $scope.amenities = amenitiesService.list;
    $scope.myLoc = mapService.map.myLocationMarker.coords;

	  gMapsAPI.then( function (maps) {
	  	$scope.mapsApi = maps;
      // Directions Service
      initializeDirections();

	  });

	  var initializeDirections = function () {
	    directionsService = new $scope.mapsApi.DirectionsService();
	    directionsDisplay = new $scope.mapsApi.DirectionsRenderer();
	    var mapOptions = {
		    zoom: 16,
		    scrollwheel: false,
		    center: new $scope.mapsApi.LatLng(mapService.map.myLocationMarker.coords.latitude, mapService.map.myLocationMarker.coords.longitude)
		  };
		  var map = new $scope.mapsApi.Map(document.getElementById("mini-map"), mapOptions);
	  	directionsDisplay.setMap( map );
      // $scope.mapsApi.event.addListenerOnce(map, 'idle', function() {
      //    $scope.mapsApi.event.trigger(map, 'resize');
      // });
	  };

	  var calcRoute = function (park) {
	  	if ( !verifyPark() ) { return; }

		  var request = {
		      origin: new $scope.mapsApi.LatLng(mapService.map.myLocationMarker.coords.latitude, mapService.map.myLocationMarker.coords.longitude),
		      destination: new $scope.mapsApi.LatLng(park.latitude, park.longitude),
		      travelMode: $scope.mapsApi.TravelMode.DRIVING,
		  };
		  directionsService.route(request, displayDirections);
		};

		var verifyPark = function () {
			if ($scope.parks[parkName]) {
				$scope.parks.currentPark = $scope.parks[parkName];
				return true;
			} 
			$state.go('home');
		};

		var displayDirections = function (response, status) {
	    if (status === $scope.mapsApi.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(response);
	      extractDirectionsInfo(response);
	    } else {
	    	console.log("Error happened... Maybe over query limit?");
	    }
	  };

	  $scope.$watchGroup(['parks.currentPark', 'myLoc.latitude', 'myLoc.longitude'], function () {
	  	calcRoute($scope.parks.currentPark);
	  });

	  var extractDirectionsInfo = function (response) {
	  	var r = response.routes[0].legs[0];
	  	var dt = r.distance.text;
	  	var dur = r.duration.text;
	  	// Other valuable information may include waypoints, steps, coordinates, etc.
	  	$scope.routeData = {
	  		distance: dt,
	  		duration: dur
	  	};

	  	// Color code the dist / dur text
	  	var a = parseInt(dt);
	  	var b = parseInt(dur);
	  	$scope.distanceColoring = { 'text-green': a <= 2, 'text-warning': a > 2 && a <= 10, 'text-danger': a > 10 };
	  	$scope.durationColoring = { 'text-green': b <= 5, 'text-warning': b > 5 && b <= 20, 'text-danger': b > 20 };

	  };


  }]);
