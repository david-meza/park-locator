'use strict';

angular.module('appControllers').controller('accordionCtrl', [ '$scope', 'mapService', 'accordionService', 'parkService', 'uiGmapGoogleMapApi', 'amenitiesService', '$timeout',
	function ($scope, mapService, accordionService, parkService, gMapsAPI, amenitiesService, $timeout) {
    
  // Basic accordion config
  $scope.settings = accordionService.settings;
  
  // Define some async objects from our services
  $scope.parks = parkService.markers;
  $scope.map = mapService.map;
  $scope.myLoc = mapService.map.myLocationMarker.coords;

  // Limit to number of parks initially shown
  $scope.parksLimit = undefined;
  $scope.$watch('parks.content.length', function (newVal) {
    $scope.parksLimit = Math.min(10, newVal);
  });
  
  // Expand the list of park results
  $scope.showAll = function () {
    $scope.parksLimit = $scope.parks.content.length;
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

  $scope.sortVar = 'name';

  // We calculate the distance between two points use Pythagorean theorem. It is not extremely accurate (unless you can walk through buildings), but it gives us a decent idea about the distance between the user and the park (better than alphabetically sorting).
  $scope.nearestPark = function (park) {
    var a = Math.abs(park.latitude - $scope.myLoc.latitude);
    var b = Math.abs(park.longitude - $scope.myLoc.longitude);
    park.distance = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
    return park.distance;
  };

}]);
