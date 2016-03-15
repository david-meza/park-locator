(function(angular) {

  'use strict';

  angular.module('appServices').factory('parkService', ['$http', '$q', '$state', '$timeout', 'Esri',
  	function ($http, $q, $state, $timeout, Esri) {
  	
    var esriModules;
    
    Esri.modulesReady().then( function (modules) {
      esriModules = modules;
    });

    var parks = { markers: [], currentPark: undefined, };

    parks.markersConfig = {
      rebuild: false, 
      shallowWatch: false, 
      fitToMap: false, 
      control: {},
      type: 'cluster',
      typeOptions: {
        title: 'Click to zoom in and find more parks!',
        gridSize: 56,
        minimumClusterSize: 4
      },
      typeEvents: {},
      markerEvents: {
        mouseover: function (gMarker) {
          gMarker.labelVisible = true;
          gMarker.label.setVisible();
        },
        mouseout: function (gMarker) {
          gMarker.labelVisible = false;
          gMarker.label.setVisible();
        }
      }
    };

    parks.markersConfig.typeOptions.styles = [{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: '/img/icons/park-marker-cluster.svg',height: 40,width: 40},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: '/img/icons/park-marker-cluster.svg',height: 44,width: 44},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: '/img/icons/park-marker-cluster.svg',height: 48,width: 48},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: '/img/icons/park-marker-cluster.svg',height: 52,width: 52},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: '/img/icons/park-marker-cluster.svg',height: 56,width: 56}];

    var parkWindow = {
      show: false,
      coords: {},
      control: {},
      options: {
        pixelOffset: { width: 0, height: -48 }
      },
      closeclick: function (windowScope) { console.log(windowScope);windowScope.show = false; },
      templateUrl: 'views/partials/park-window.html',
      templateParameter: {}
    };


    var _positionParkWindow = function(parkModel) {
      parkWindow.coords.latitude = parkModel.latitude;
      parkWindow.coords.longitude = parkModel.longitude;
      parkWindow.templateParameter.name = parkModel.name;
      parkWindow.templateParameter.address = parkModel.address;
      parkWindow.templateParameter.phone = parkModel.phone;
      parkWindow.show = true;
    };
  	
    var _markerClick = function (gInstance, evnt, model) {
      parks.currentPark = model;
      
      // Place the info window above park marker and pass in the park info
      _positionParkWindow(model);
      
      // Trigger a state change and show the park details
      $state.go('home.park', { 'name': parks.currentPark.name.replace(/\W+/g, '').toLowerCase() });
    };

    var logError = function (response) {
      console.log('Failed to get data from activities server', response);
      return $q.reject(response);
    };

    var extractIndividualMarker = function (park) {
      var p = park.attributes;
      var marker = {
        id: p.OBJECTID,
        name: p.NAME,
        searchable: p.NAME.toLowerCase(),
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

        markerClick: _markerClick,
        options: {
          visible: true,
          labelContent: p.NAME,
          labelClass: 'park-label',
          labelVisible: false
        },
      };

      // Storing parks both individually as key on markers object and as an array of parks
      var parkName = p.NAME.replace(/\W+/g, '').toLowerCase();
      if (!this[parkName]) { this[parkName] = marker; }

      this.markers.push(marker);
    };


    var _generateMarkers = function (response) {
      if (response.status === 200) {
        // Empty the existing parks array before adding the new results
        if (parks.markers.length > 0) {
          parks.markers.splice(0, parks.markers.length);
        }
        // Make markers from the response data
        angular.forEach(response.data.features, extractIndividualMarker, parks);
        // Return an array of markers in case we chain the promise
        return parks.markers;
      } else {
        // Log and reject the promise
        return logError();
      }
  	};


    var updateParkMarkers = function (selectedActivities) {
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

    };

    function getCurrentPark(deferred, parkName) {
      // Queue a call once every half second until it is resolved
      if (parks[parkName]) {
        parks.currentPark = parks[parkName];
        deferred.resolve(parks.currentPark);
      } else {
        $timeout(function(){
          getCurrentPark(deferred, parkName);
        }, 500, false);
      }
    }

    var getParksInfo = function (where) {
      var url = 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=' + (where ? where : '1%3D1') + '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=OBJECTID&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson';
    	
      // Returns a chainable promise object
      return $http({
    		method: 'GET',
    		url: url
    	});
    };

    // Initialize the map by filling it with all, unfiltered parks
    getParksInfo().then(_generateMarkers, logError);


  	return {
  		parks: parks,
      updateParkMarkers: updateParkMarkers,
      parkWindow: parkWindow,
      getCurrentPark: getCurrentPark
  	};

  }]);

})(window.angular);
