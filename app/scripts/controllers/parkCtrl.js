'use strict';

angular.module('appControllers').controller('parkCtrl', [ '$scope', '$state', '$stateParams', 'mapService', 'parkService', 'maps', 'amenitiesService',
	function ($scope, $state, $stateParams, mapService, parkService, maps, amenitiesService) {

		var parkName = $stateParams.name,
				directionsService,
	  		directionsDisplay,
	  		icons,
	  		map;

	  // Define some async objects from our services
    $scope.parks = parkService.parks;
    $scope.activities = amenitiesService.activities;
    $scope.map = mapService.map;

	  var initializeDirectionsMap = function () {
	  	if ( !document.getElementById('mini-map') ) { return; }
	  	
	    directionsService = new maps.DirectionsService();
	    directionsDisplay = new maps.DirectionsRenderer({ suppressMarkers: true });
	    generateMarkerIcons();
	    var styledMap = new maps.StyledMapType($scope.map.options.secondaryStyles, {name: 'Styled Map'});
	    var mapOptions = {
		    zoom: 16,
		    scrollwheel: false,
		    center: new maps.LatLng($scope.map.myLocationMarker.coords.latitude, $scope.map.myLocationMarker.coords.longitude),
		    mapTypeControlOptions: {
		      mapTypeIds: [maps.MapTypeId.ROADMAP, 'light_dream']
		    }
		  };
		  map = new maps.Map(document.getElementById('mini-map'), mapOptions);
	  	directionsDisplay.setMap( map );
		  map.mapTypes.set('light_dream', styledMap);
		  map.setMapTypeId('light_dream');
	  };

	  var generateMarkerIcons = function () {
	  	icons = {
			  start: new maps.MarkerImage('https://s3.amazonaws.com/davidmeza/Park_Locator/user.png',
			    // (width,height)
			    new maps.Size( 45, 45 ),
			    // The origin point (x,y)
			    new maps.Point( 0, 0 ),
			    // The anchor point (x,y)
			    new maps.Point( 24, 39 ) ),
			  end: new maps.MarkerImage('https://s3.amazonaws.com/davidmeza/Park_Locator/tree-small.png',
			   // (width,height)
			   new maps.Size( 45, 50 ),
			   // The origin point (x,y)
			   new maps.Point( 0, 0 ),
			   // The anchor point (x,y)
			   new maps.Point( 25, 46 ) )
			};
	  };

	  var calcRoute = function (park) {
	  	var travelMode = getBestTravelMode(park);

		  var request = {
		      origin: new maps.LatLng($scope.map.myLocationMarker.coords.latitude, $scope.map.myLocationMarker.coords.longitude),
		      destination: new maps.LatLng(park.latitude, park.longitude),
		      travelMode: travelMode,
		  };
		  directionsService.route(request, displayDirections);
		};

		var getBestTravelMode = function (park) {
			console.log(park, $scope.map.myLocationMarker.coords);
			var a = Math.abs(park.latitude - $scope.map.myLocationMarker.coords.latitude);
      var b = Math.abs(park.longitude - $scope.map.myLocationMarker.coords.longitude);
      var dist = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
      $scope.travelMode = { 'fa-car': dist > 0.012, 'fa-male': dist <= 0.012 };
      return (dist <= 0.012) ? maps.TravelMode.WALKING : maps.TravelMode.DRIVING;
		};

		var displayDirections = function (response, status) {
	    if (status === maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(response);
	      placeCustomMarkers(response);
	      extractDirectionsInfo(response);
	    } else {
	    	console.log('Error', status, response);
	    }
	  };

	  // Directions Service
    initializeDirectionsMap();

	  $scope.$watchGroup(['parks.currentPark', 'myLoc.latitude', 'myLoc.longitude'], function () {
	  	calcRoute($scope.parks.currentPark);
	  });

	  var placeCustomMarkers = function (response) {
	  	var leg = response.routes[0].legs[0];
	  	makeMarker( leg.start_location, icons.start, 'You' );
  		makeMarker( leg.end_location, icons.end, 'Park' );
	  };

	  var startEndMarkers = [];

	  var makeMarker = function ( position, icon, title ) {
	  	if (startEndMarkers[startEndMarkers.length - 2]) { startEndMarkers[startEndMarkers.length - 2].setMap(null); }
	  	var marker = new maps.Marker({
	  		position: position,
	  		map: map,
	  		icon: icon,
	  		title: title,
	  		animation: maps.Animation.DROP
	  	});
	  	startEndMarkers.push(marker);
	  };

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
	  	$scope.distanceColoring = { 'text-green': a <= 3 || dt.substring(dt.length - 2, dt.length) === 'ft', 'text-warning': a > 3 && a <= 10 && dt.substring(dt.length - 2, dt.length) !== 'ft', 'text-danger': a > 10 && dt.substring(dt.length - 2, dt.length) !== 'ft' };
	  	$scope.durationColoring = { 'text-green': b <= 10, 'text-warning': b > 10 && b <= 20, 'text-danger': b > 20 };

	  };


  }]);
