(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('directionsMap', function(){

    return {
      restrict: 'E',
      scope: true,
      template: '<div id="directions-map" class="flex-100"></div>',
      controller: ['$scope', 'Esri', function($scope, Esri) {
        $scope.Esri = Esri;
      }],
      link: function postLink($scope, $element) {
        var maps = $scope.$parent.maps;
        var currentPark = $scope.$parent.currentPark;

        var mapStyle = [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#b5cbe4'}]},{'featureType':'landscape','stylers':[{'color':'#efefef'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#83a5b0'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#bdcdd3'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#ffffff'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#e3eed3'}]},{'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'road'},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{},{'featureType':'road','stylers':[{'lightness':20}]}];

        var directionsService, directionsDisplay, icons, map;
        var startEndMarkers = [];

         // Functions that triggers the drawing of a route on the map
        function calcRoute(origin, destination) {
          var travelMode = getBestTravelMode(origin, destination);

          var request = {
              origin: new maps.LatLng(origin.y, origin.x),
              destination: new maps.LatLng(destination.latitude, destination.longitude),
              travelMode: travelMode,
          };
          directionsService.route(request, displayDirections);
        }

        function getBestTravelMode(origin, destination) {
          var a = Math.abs(origin.latitude - destination.y);
          var b = Math.abs(origin.longitude - destination.x);
          var dist = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
          // Walk directions if our destination is about 0.8 miles away (aprox a 15 min walk)
          $scope.$parent.travelMode = dist > 0.011 ? 'fa-car' : 'fa-male';
          return (dist <= 0.011) ? maps.TravelMode.WALKING : maps.TravelMode.DRIVING;
        }

        function generateMarkerIcons() {
          icons = {
            start: new maps.MarkerImage('/img/icons/user-marker.svg',
                                        new maps.Size( 52, 52 ), // (width,height)
                                        new maps.Point( 0, 0 ), // The origin point (x,y)
                                        new maps.Point( 24, 46 ) ), // The anchor point (x,y)
            end: new maps.MarkerImage('/img/icons/park-marker.svg',
                                        new maps.Size( 48, 48 ),
                                        new maps.Point( 0, 0 ),
                                        new maps.Point( 25, 46 ) )
          };
          return icons;
        }

        function displayDirections(response, status) {
          if (status === maps.DirectionsStatus.OK) {
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
          var marker = new maps.Marker({
            position: position,
            map: map,
            icon: icon,
            title: title,
            animation: maps.Animation.DROP
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

        $scope.Esri.modulesReady().then(function(modules) {

          (function initializeDirectionsMap() {
            directionsService = new maps.DirectionsService();
            directionsDisplay = new maps.DirectionsRenderer({ suppressMarkers: true });
            generateMarkerIcons();
            var styledMap = new maps.StyledMapType(mapStyle, {name: 'Light'});
            var mapOptions = {
              zoom: 16,
              scrollwheel: false,
              center: new maps.LatLng(modules.userMarker.geometry.y, modules.userMarker.geometry.x),
              mapTypeControlOptions: {
                mapTypeIds: [maps.MapTypeId.ROADMAP, 'light_dream']
              }
            };
            map = new maps.Map($element.children()[0], mapOptions);
            // Watch for changes on the element's size
            maps.event.addListenerOnce(map, 'idle', function(){
              var center = map.getCenter();
              maps.event.trigger(map, 'resize');
              map.setCenter(center);
            });
            // Show the directions on this map
            directionsDisplay.setMap( map );
            map.mapTypes.set('light_dream', styledMap);
            map.setMapTypeId('light_dream');
          })();

          $scope.$watch(function() {
            return modules.userMarker.geometry;
          }, function(newLocation) {
            calcRoute(newLocation, currentPark);
          });
          
        });
        
      }
    };

  });

})(angular || window.angular);