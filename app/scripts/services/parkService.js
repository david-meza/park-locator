'use strict';

angular.module('parkLocator').factory('parkService', ['$http', '$state',
	function ($http, $state) {
	
	var currentMarker = { obj: {} };
	var markers = { content: [], currentPark: undefined };

	var _generateMarkers = function (response) {

    markers.content = [];

		response.data.features.forEach(function(park){
			var p = park.attributes;
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
        activeadult: p.ACTIVEADULT === 'Yes',
        teen: p.TEEN === 'Yes',
        museum: p.MUSEUM === 'Yes',
        icon: 'https://s3.amazonaws.com/davidmeza/Park_Locator/tree-small.png',
        latitude: park.geometry.y,
        longitude: park.geometry.x,
        showWindow: false,
        onMarkerClicked: _onMarkerClicked,
        options: {
          title: p.NAME,
          labelAnchor: '0 0'
        },
      };

      // Storing parks both individually as key on markers object and as an array of parks
      markers[p.NAME.replace(/\s+/g, '').toLowerCase()] = marker;
      markers.content.push(marker);
    });

	};

	var _onMarkerClicked = function () {
		// If currentMarker is not null, meaning another marker window is shown,
    // then set showWindow of that marker window to false.
    currentMarker.obj.showWindow = false;
    currentMarker.obj = markers.currentPark = this;
    this.showWindow = !this.showWindow;
    $state.go('home.park', { 'name': markers.currentPark.name.replace(/\s+/g, '').toLowerCase() });
	};

	var _logAjaxError = function (error) {
		console.log(error);
	};

  var updateParkMarkers = function (selectedActivities) {
    var query = '';
    selectedActivities.forEach( function (activity, idx) {
      query += activity.parkAttr + '%3D' + '%27Yes%27';
      if (idx <= selectedActivities.length - 2) { query += '+AND+'; }
      
    });
    getParksInfo(query);
  };

  var getParksInfo = function (where) {
    var url = 'http://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=' + (where ? where : '1%3D1') + '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=OBJECTID&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson';
  	$http({
  		method: 'GET',
  		url: url
  	}).then(_generateMarkers, _logAjaxError);
  };

  // This gets automatically called because of the $watchCollection in MapCtrl
  // getParksInfo();


	return {
		markers: markers,
    updateParkMarkers: updateParkMarkers
	};

}]);