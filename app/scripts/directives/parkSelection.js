(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('parkSelection', function () {
    
    return { 
      restrict: 'E',
      // Set an isolate scope so we don't mistakenly inherit anything from the parent's scope
      scope: {},
      templateUrl: 'views/directives/park-selection.html',
      controller: ['$scope', 'parkService', 'mapService', '$timeout', '$mdSidenav', 'Esri', function ($scope, parkService, mapService, $timeout, $mdSidenav, Esri) {

        // Internal controller functions
        function createFilterFor (query) {
          var lowercaseQuery = angular.lowercase(query);
          // Find the parks whose name starts with the searching text. If === 0 is used instead it only matches parks starting with search query
          return function filterFn(park) {
            return (park.searchable.indexOf(lowercaseQuery) > -1);
          };
        }

        function querySearch (searchText) {
          return searchText ? $scope.parks.markers.filter( createFilterFor(searchText) ) : $scope.parks.markers;
        }

        // Park markers object
        $scope.parks = parkService.parks;
        // Map object
        $scope.map = mapService.map;

        // md-autocomplete directive config
        $scope.search = {
          selectedItem: undefined,
          searchText: undefined,
          selectedItemChange: function(park) { 
            // Ignore results when the input is cleared
            if (angular.isUndefined(park)) { return; }
            $scope.selectPark(park);
          },
          querySearch: querySearch
        };

        var esriModules;

        Esri.modulesReady().then(function(modules) {
          esriModules = modules;
        });

        // Select a park section
        $scope.selectPark = function (park) {
          // Update our map service variables
          $scope.map.zoom = 16;
          $scope.map.location.coords.latitude = park.latitude;
          $scope.map.location.coords.longitude = park.longitude;
          
          // Trigger a state change
          $timeout(function(){
            park.markerClick(null, 'click', park);
           }, 100);
          
          // Close the sidenav if not locked open
          $mdSidenav('left').close();
          
          // Center and zoom to the park marker on the map
          mapService.centerAndZoom(park.latitude, park.longitude);
          
        };

        // We calculate the distance between two points use Pythagorean theorem. It is not extremely accurate (unless you can walk through buildings), but it gives us a decent idea about the distance between the user and the park (better than alphabetically sorting).
        $scope.nearestPark = function (park) {
          var a = Math.abs(park.latitude - $scope.map.myLocationMarker.coords.latitude);
          var b = Math.abs(park.longitude - $scope.map.myLocationMarker.coords.longitude);
          park.distance = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
          return park.distance;
        };
        
        $scope.sortOptions = [
          { view: 'name (A-Z)', model: 'name', reverse: false },
          { view: 'name (Z-A)', model: 'name', reverse: true },
          { view: 'distance (nearest)', model: $scope.nearestPark, reverse: false },
          { view: 'distance (furthest)', model: $scope.nearestPark, reverse: true },
        ];

        $scope.selectedSort = $scope.sortOptions[2];

      }]
    };

  });

})(window.angular);