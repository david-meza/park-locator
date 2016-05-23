(function(angular) {

  'use strict';

  angular.module('appServices').factory('parkService', ['$http', '$q', '$state', '$timeout', 'Esri', '$mdToast', '$window',
  	function ($http, $q, $state, $timeout, Esri, $mdToast, $window) {
  	
    var esriModules, parks;
    
    Esri.modulesReady().then( function (modules) {
      esriModules = modules;
    });

    parks = { markers: [], currentPark: undefined, };
  	
    function _markerClick(park) { // Simulate clicking a map marker
      parks.currentPark = park;
      // Trigger a state change and show the park details
      $state.go('home.park', { 'name': park.urlFormat });
    }

    function logError(response) {
      console.error('Failed to get data from parks server', response);
      return $q.reject(response);
    }

    function extractIndividualMarker(park) {
      var p = park.attributes; //shorthand
      var marker = {
        id: p.OBJECTID,
        name: p.NAME,
        searchable: p.NAME.toLowerCase(),
        urlFormat: p.NAME.replace(/\W+/g, '').toLowerCase(),
        address: p.ADDRESS,
        url: p.URL,
        phone: p.PHONE,
        alias1: p.ALIAS1,
        alias2: p.ALIAS2,
        scale: p.SCALE,
        artscenter: p.ARTSCENTER === 'Yes',
        ballfields: p.BALLFIELDS === 'Yes',
        boatrentals: p.BOATRENTALS === 'Yes',
        bocce: p.BOCCE === 'Yes',
        bmxtrack: p.BMXTRACK === 'Yes',
        canoe: p.CANOE === 'Yes',
        canoelaunch: p.CANOE === 'Yes',
        carousel: p.CAROUSEL === 'Yes',
        discgolf: p.DISCGOLF === 'Yes',
        dogpark: p.DOGPARK === 'Yes',
        envctr: p.ENVCTR === 'Yes',
        fishing: p.FISHING === 'Yes',
        greenwayaccess: p.GREENWAYACCESS === 'Yes',
        gym: p.GYM === 'Yes',
        horseshoe: p.HORSESHOE === 'Yes',
        inlineskating: p.INLINESKATING === 'Yes',
        boatride: p.BOATRIDE === 'Yes',
        library: p.LIBRARY === 'Yes',
        amusementtrain: p.AMUSEMENTTRAIN === 'Yes',
        multipurposefield: p.MULTIPURPOSEFIELD === 'Yes',
        outdoorbasketball: p.OUTDOORBASKETBALL === 'Yes',
        picnicshelter: p.PICNICSHELTER === 'Yes',
        playground: p.PLAYGROUND === 'Yes',
        pool: p.POOL === 'Yes',
        communitycenter: p.COMMUNITYCENTER === 'Yes',
        neighborhoodcenter: p.NEIGHBORHOODCENTER === 'Yes',
        sandvolleyball: p.SANDVOLLEYBALL === 'Yes',
        skatepark: p.SKATEPARK === 'Yes',
        tenniscenter: p.TENNISCENTER === 'Yes',
        tenniscourts: p.TENNISCOURTS === 'Yes',
        theater: p.THEATER === 'Yes',
        track: p.TRACK === 'Yes',
        walkingtrails: p.WALKINGTRAILS === 'Yes',
        uniquesp: p.UNIQUESP === 'Yes',
        handball: p.HANDBALL === 'Yes',
        active_adult: p.ACTIVE_ADULT === 'Yes',
        teen: p.TEEN === 'Yes',
        museum: p.MUSEUM === 'Yes',
        
        icon: '/img/icons/park-marker.svg',
        latitude: park.geometry.y,
        longitude: park.geometry.x,

        markerClick: _markerClick
      };

      // Storing parks both individually as key on markers object and as an array of parks
      if (!parks[marker.urlFormat]) { parks[marker.urlFormat] = marker; }

      parks.markers.push(marker);
    }


    function _generateMarkers(response) {
      if (response.status === 200) {
        // Empty the existing parks array before adding the new results
        if (parks.markers.length > 0) {
          parks.markers.splice(0, parks.markers.length);
        }
        // Make markers from the response data
        angular.forEach(response.data.features, extractIndividualMarker);
        // Return an array of markers in case we chain the promise
        return parks.markers;
      } else {
        // Log and reject the promise
        return logError();
      }
  	}


    function updateParkMarkers(selectedActivities) {
      var query = '';

      if (selectedActivities.length === 0) { query += '1 = 1'; }

      angular.forEach(selectedActivities, function (activity, idx) {
        query += activity.parkAttr + ' = \'Yes\'';
        if (idx <= selectedActivities.length - 2) { query += ' AND '; }
      });

      esriModules.parks.setDefinitionExpression(query);

      esriModules.parks.queryExtent(query, function(response) {
        if (!isNaN(response.extent.xmin)) {
          esriModules.map.setExtent(response.extent.expand(1.3), true);
        }
      });
      getParksInfo(query).then(_generateMarkers, logError);

    }

    function informUser(message, hideDelay) {
      var toast = $mdToast.simple()
        .textContent(message)
        .action('ok')
        .highlightAction(true)
        .hideDelay(hideDelay || 3000)
        .position('bottom right');
      
      $mdToast.show(toast).then(function(){
        $window.location.reload(); // We refresh the page because esri doesn't look for the map-canvas again
      });
    }

    function resolveCurrentPark(deferred, urlFormat, retriesLeft) {
      var retries = retriesLeft || 40; // Times out after 20 seconds of waiting
      // Queue a call once every half second until it is resolved
      if (parks[urlFormat]) {
        parks.currentPark = parks[urlFormat];
        deferred.resolve(parks.currentPark);
      } else {
        if (retries > 1) { // Err... 0 is falsey in JS so it goes back to 20 :)
          $timeout(resolveCurrentPark, 500, false, deferred, urlFormat, --retries);
        } else {
          console.error('Timeout error: No Park with such name: ', urlFormat);
          deferred.reject(urlFormat);
          informUser('Oops! I searched everywhere but didn\'t find a park with that name. Please refresh the page.', 10000);
        }
      }
    }

    function getParksInfo(where) {
      var url = 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=' + (where ? where : '1%3D1') + '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=8&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=OBJECTID&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json';
    	
      // Returns a chainable promise object
      return $http({
    		method: 'GET',
    		url: url
    	});
    }

    // Initialize the map by filling it with all, unfiltered parks
    getParksInfo().then(_generateMarkers, logError);


  	return {
  		parks: parks,
      updateParkMarkers: updateParkMarkers,
      resolveCurrentPark: resolveCurrentPark
  	};

  }]);

})(angular || window.angular);
