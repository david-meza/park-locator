(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('directionsMap', function(){

    return {
      restrict: 'E',
      scope: false, // Inherit parkCtrl scope
      template: '<div id="directions-map" class="flex-100"></div>',
      
      controller: ['$scope', 'Esri', function($scope, Esri) {
        $scope.Esri = Esri;
      }],

      link: function postLink($scope, $element) {

        var mapOptions = {
          zoom: 16,
          scrollwheel: false,
          center: undefined,
          mapTypeControlOptions: {
            mapTypeIds: [$scope.maps.MapTypeId.ROADMAP, 'light_dream']
          }
        };

        var mapStyle = [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#b5cbe4'}]},{'featureType':'landscape','stylers':[{'color':'#efefef'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#83a5b0'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#bdcdd3'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#ffffff'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#e3eed3'}]},{'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'road'},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{},{'featureType':'road','stylers':[{'lightness':20}]}];

        var directionsService, directionsDisplay, icons, map;
        var startEndMarkers = [];

         // Functions that triggers the drawing of a route on the map
        function calcRoute(origin, destination) {
          var travelMode = getBestTravelMode(origin, destination);

          var request = {
              origin: new $scope.maps.LatLng(origin.y, origin.x),
              destination: new $scope.maps.LatLng(destination.latitude, destination.longitude),
              travelMode: travelMode,
          };
          directionsService.route(request, displayDirections);
        }

        function getBestTravelMode(origin, destination) {
          // We could calculate the distance as below, but we already have this information so we will use it (dependency - parkSelection.js)
          // var a = Math.abs(origin.y - destination.latitude);
          // var b = Math.abs(origin.x - destination.longitude);
          // var dist = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
          // Walk directions if our destination is about 0.8 miles away (aprox a 15 min walk)
          $scope.$parent.travelMode = destination.distance > 0.011 ? 'fa-car' : 'fa-male';
          return (destination.distance <= 0.011) ? $scope.maps.TravelMode.WALKING : $scope.maps.TravelMode.DRIVING;
        }

        function generateMarkerIcons() {
          icons = {
            start: new $scope.maps.MarkerImage('img/icons/user-marker.svg',
                                        new $scope.maps.Size( 52, 52 ), // (width,height)
                                        new $scope.maps.Point( 0, 0 ), // The origin point (x,y)
                                        new $scope.maps.Point( 24, 46 ) ), // The anchor point (x,y)
            end: new $scope.maps.MarkerImage('img/icons/park-marker.svg',
                                        new $scope.maps.Size( 48, 48 ),
                                        new $scope.maps.Point( 0, 0 ),
                                        new $scope.maps.Point( 25, 46 ) )
          };
          return icons;
        }

        function displayDirections(response, status) {
          if (status === $scope.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            placeCustomMarkers(response);
            extractDirectionsInfo(response);
          } else {
            console.error('Error', status, response);
          }
        }

        function placeCustomMarkers(response) {
          var leg = response.routes[0].legs[0];
          makeMarker( leg.start_location, icons.start, 'You' );
          makeMarker( leg.end_location, icons.end, 'Park' );
        }

        function makeMarker( position, icon, title ) {
          if (startEndMarkers[startEndMarkers.length - 2]) { startEndMarkers[startEndMarkers.length - 2].setMap(null); }
          var marker = new $scope.maps.Marker({
            position: position,
            map: map,
            icon: icon,
            title: title,
            animation: $scope.maps.Animation.DROP
          });
          startEndMarkers.push(marker);
        }

        function extractDirectionsInfo(response) {
          var r = response.routes[0].legs[0];
          var dt = r.distance.text;
          var dur = r.duration.text;
          // Other valuable information may include waypoints, steps, coordinates, etc.
          $scope.$parent.routeData = {
            distance: dt,
            duration: dur
          };

          // Color code the dist / dur text
          var a = parseInt(dt);
          var b = parseInt(dur);
          $scope.$parent.distanceColoring = { 'text-success': a <= 3 || dt.substring(dt.length - 2, dt.length) === 'ft', 'text-warn': a > 3 && a <= 10 && dt.substring(dt.length - 2, dt.length) !== 'ft', 'text-danger': a > 10 && dt.substring(dt.length - 2, dt.length) !== 'ft' };
          $scope.$parent.durationColoring = { 'text-success': b <= 10, 'text-warn': b > 10 && b <= 20, 'text-danger': b > 20 };

        }

        function refreshMapTiles(){
          var center = map.getCenter();
          $scope.maps.event.trigger(map, 'resize');
          map.setCenter(center);
        }

        $scope.Esri.modulesReady().then(function(modules) {

          function getUserMarker() {
            return modules.getCurrentPosition();
          }

          function userMarkerChanged(newOrigin) {
            calcRoute(newOrigin, $scope.currentPark);
          }

          (function initializeDirectionsMap() { // Run once when directive is instantiated
            directionsService = new $scope.maps.DirectionsService();
            directionsDisplay = new $scope.maps.DirectionsRenderer({ suppressMarkers: true });
            generateMarkerIcons();
            mapOptions.center = new $scope.maps.LatLng(modules.getCurrentPosition().y, modules.getCurrentPosition().x);
            
            map = new $scope.maps.Map($element.children()[0], mapOptions);
            // Watch for changes on the element's size
            $scope.maps.event.addListenerOnce(map, 'idle', refreshMapTiles);
            
            // Show the directions on this map
            directionsDisplay.setMap( map );
            map.mapTypes.set('light_dream', new $scope.maps.StyledMapType(mapStyle, {name: 'Light'}) );
            map.setMapTypeId('light_dream');
          })();

          $scope.$watch(getUserMarker, userMarkerChanged);
          
        });
        
      }
    };

  });

})(angular || window.angular);