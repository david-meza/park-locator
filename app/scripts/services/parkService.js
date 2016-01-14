'use strict';

angular.module('parkLocator').factory('parkService', ['$http', '$state', 'uiGmapGoogleMapApi', '$q',
	function ($http, $state, gMapsApi, $q) {
	
  var mapsApi;

	gMapsApi.then( function (maps) {
    mapsApi = maps;
  });

  var currentMarker = { obj: {} };
	
  var markers = { 
    content: [], 
    currentPark: undefined, 
    rebuild: false, 
    shallowWatch: false, 
    fitToMap: true, 
    control: {} 
  };

  var parkWindow = {
    show: false,
    coords: {},
    control: {},
    options: {
      pixelOffset: { width: 0, height: -48 }
    },
    closeclick: function (windowScope) { console.log(windowScope);windowScope.show = false; },
    templateUrl: 'views/partials/park-window.html',
    templateParameter: {},
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
    currentMarker.obj = markers.currentPark = model;
    
    // Place the info window above park marker and pass in the park info
    _positionParkWindow(model);
    
    // Trigger a state change and show the park details
    $state.go('home.park', { 'name': markers.currentPark.name.replace(/\W+/g, '').toLowerCase() });
  };


  var _generateMarkers = function (parks) {

    // Empty the existing parks array before adding the new results
    markers.content.splice(0, markers.content.length);

    angular.forEach(parks, function (park) {
      var p = park.attributes;
      var parkName = p.NAME.replace(/\W+/g, '').toLowerCase();
      var marker = {
        id: p.OBJECTID,
        name: p.NAME,
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
        
        icon: 'https://s3.amazonaws.com/davidmeza/Park_Locator/tree-small.png',
        latitude: park.geometry.y,
        longitude: park.geometry.x,

        markerClick: _markerClick,
        options: {
          title: p.NAME,
          labelAnchor: '0 0',
          animation: (mapsApi ? mapsApi.Animation.DROP : 2)
        },
      };

      // Storing parks both individually as key on markers object and as an array of parks
      if (!markers[parkName]) { markers[parkName] = marker; }
      markers.content.push(marker);
    });

	};

	var _logAjaxError = function (error) {
		console.log(error);
    return $q.reject(error);
	};

  var updateParkMarkers = function (selectedActivities) {
    var query = '';
    if (!selectedActivities) { return; }

    selectedActivities.forEach( function (activity, idx) {
      query += activity.parkAttr + '%3D' + '%27Yes%27';
      if (idx <= selectedActivities.length - 2) { query += '+AND+'; }
      
    });
    
    var promise = $q.all([ _getParksInfo(query), _getWakeParks(query) ]).then(_removeParkDupes, _logAjaxError);
  };

  var _getParksInfo = function (where) {
    var url = 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=' + (where || '1%3D1') + '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=OBJECTID&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson';
    
    return $http({
      method: 'GET',
      url: url
    });
  };

  var _removeParkDupes = function (responsesArr) { 
    var uniques = [],
        mapped = {};

    angular.forEach(responsesArr, function (response) {

      angular.forEach(response.data.features, function (park) {
        if (!mapped[park.attributes.NAME]) {
          mapped[park.attributes.NAME] = park;
          uniques.push(park);
        }
      });

    });

    // console.log(uniques);

    return $q.resolve(uniques, _generateMarkers);

  };

  var _getWakeParks = function (query) {
  	var url = 'http://maps.wakegov.com/arcgis/rest/services/Test/ParksinWake/MapServer/0/query?where=' + (query ? ('JURISDICTION+<>+%27City+of+Raleigh%27+AND+' + query) : 'JURISDICTION+<>+%27City+of+Raleigh%27') + '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson'

    return $http({
  		method: 'GET',
  		url: url
  	});
  };

  // This gets automatically called because of the $watchCollection in MapCtrl
  // _getParksInfo();


	return {
		markers: markers,
    updateParkMarkers: updateParkMarkers,
    parkWindow: parkWindow
	};

}]);