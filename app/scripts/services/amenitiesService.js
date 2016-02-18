'use strict';

angular.module('parkLocator').factory('amenitiesService', ['$http', 
	function($http){
	
	var list = { content: [], uniques: [], activitiesPos: { markers: [] } };
	var selectedActivities = { current: [] };

	list.activitiesPos.markersConfig = {
    control: {},
    options: 'options',
    icon: 'icon'
  };

  var activityWindow = {
  	show: false,
    coords: {},
    templateUrl: 'views/partials/activity-window.html',
    templateParameter: {},
    control: {},
    options: {
    	visible: true,
    	isHidden: true,
    	maxWidth: 150,
    	pixelOffset: { width: 0, height: -25 }
    },
    closeclick: function (windowScope) { windowScope.show = false; }
  };

	var logAjaxError = function (error) {
		console.log(error);
	};

	var generateList = function (response) {

		if (typeof response.data === 'object') {
			var allAmenities = response.data.drawingInfo.renderer.uniqueValueInfos;
			allAmenities.forEach( function(amenity) {
				var processed = {
					id: amenity.value,
					name: amenity.label
				};

				list.content.push(processed);
			});
			
		} else {
			console.log('error', response);
		}

	};

	var _processUniques = function () {
		for (var i = 0; i < list.content.length; i++) {
			// Shorthand for current array element (current amenity)
			var c = list.content[i];

			// Name overrides
			if (c.name === 'Tennis') { c.parkAttr = 'TENNISCOURTS'; c.imageDataLg = 'tennis-courts-lg'; c.imageDataSm = 'tennis-courts-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/tennis-24.png'; }
			if (c.name === 'Theatre') { c.name = 'Theater'; c.imageDataLg = 'theater-lg'; c.imageDataSm = 'theater-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Cinema/theatre_mask-24.png'; }
			if (c.name === 'Tennis Center') { c.imageDataLg = 'tennis-center-lg'; c.imageDataSm = 'tennis-center-sm'; c.imageData = 'tennis-center-fallback'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Household/front_desk-24.png'; }
			if (c.name === 'Aquatic Center') { c.id = 1302; c.name = 'Swimming'; c.parkAttr = 'POOL'; c.imageDataLg = 'swimming-lg'; c.imageDataSm = 'swimming-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/swimming-24.png'; }
			if (c.name === 'Bocceball') { c.name = 'Bocce'; c.imageDataLg = 'bocce-lg'; c.imageDataSm = 'bocce-sm'; c.imageUrlSm = 'https://s3.amazonaws.com/davidmeza/Park_Locator/bocce-sm.png'; c.imageUrlLg = 'https://s3.amazonaws.com/davidmeza/Park_Locator/bocce-lg.png'; }
			if (c.name === 'Off Leash Dog Area') { c.name = 'Dog Park'; c.imageDataLg = 'dog-park-lg'; c.imageDataSm = 'dog-park-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/City/dog_park-24.png'; }
			if (c.name === 'Informal Playfield' || c.name === 'Multipurpose') { c.name = 'Multipurpose Field'; c.imageDataLg = 'multipurpose-field-lg'; c.imageDataSm = 'multipurpose-field-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/City/stadium-24.png'; }

			// Mapping the amenity by id so we can get the name later when we have foreign keys
			list[c.id] = c;

			if (list[c.name]) {continue;}

			// Mapping the amenity by name so we know we've processed it
			list[c.name] = c;
			list.uniques.push(c);
		}
	};

	// Unfortunately we pre-process these data so heavily that it defeats the purpose of requesting the database for the activities information.
	// TODO: Extract all activities to a JSON file and load them async instead of using ARCGIS database
	var _addMissingAmenities = function () {
		var missing = [
			{ name: 'Active Adult Center', parkAttr: 'ACTIVE_ADULT', imageDataLg: 'active-adult-center-lg', imageDataSm: 'active-adult-center-sm', imageData: 'active-adult-center-fallback', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/Sports/exercise-24.png'},
			{ name: 'BMX Track', imageDataLg: 'bmx-track-lg', imageDataSm: 'bmx-track-sm', imageData: 'bmx-track-fallback', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/Sports/BMX-24.png' },
			{ name: 'Boat Rentals', imageDataLg: 'boat-rentals-lg', imageDataSm: 'boat-rentals-sm', imageData: 'boat-rentals-fallback', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/Transport/yacht-24.png' },
			{ name: 'Environmental Education', id: 1307, imageData: 'environmental-education-fallback', parkAttr: 'ENVCTR', imageDataLg: 'environmental-education-lg', imageDataSm: 'environmental-education-sm', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/Industry/greentech-24.png' },
			{ name: 'Greenway Trail', imageData: 'greenway-trail-fallback', parkAttr: 'GREENWAYACCESS', imageDataLg: 'greenway-trail-lg', imageDataSm: 'greenway-trail-sm', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/Travel/forest-24.png' },
			{ name: 'Gym', imageDataLg: 'gym-lg', imageDataSm: 'gym-sm', imageData: 'gym-fallback', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/Sports/dumbbell-24.png' },
			{ name: 'Kiddie Boats', parkAttr: 'BOATRIDE', imageDataLg: 'kiddie-boats-lg', imageDataSm: 'kiddie-boats-sm', imageData: 'kiddie-boats-fallback', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/Transport/sail_boat-24.png' },
			{ name: 'Museum', imageDataLg: 'museum-lg', imageDataSm: 'museum-sm', imageData: 'museum-fallback', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/Travel/museum-24.png' },
			{ name: 'Teen Center', parkAttr: 'TEEN', imageDataLg: 'teen-center-lg', imageDataSm: 'teen-center-sm', imageData: 'teen-center-fallback', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/City/students-24.png' },
			{ name: 'Walking', parkAttr: 'WALKINGTRAILS', imageDataLg: 'walking-trails-lg', imageDataSm: 'walking-trails-sm', imageData: 'walking-trails-fallback', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/Sports/trekking-24.png' },
		];
		
		for (var i = 0; i < missing.length; i++) {
			list.uniques.push(missing[i]);
			list[missing[i].name] = missing[i];
		}
		
		list[1307] = missing[3];
		list[2113] = { id: 2113, name: 'Youth Baseball', imageDataSm: 'baseball-sm', imageDataLg: 'baseball-lg', imageData: 'baseball-fallback', imageUrlSm: 'https://maxcdn.icons8.com/Color/PNG/24/Sports/baseball-24.png' };
	};

	var _addParkAttributesName = function () {
		var rridx;
		for (var mm = 0; mm < list.uniques.length; mm++) {

			var c = list.uniques[mm];
			
			if (c.name === 'Amusement Train') { c.imageDataLg = 'amusement-train-lg'; c.imageDataSm = 'amusement-train-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Transport/train-24.png'; }
			if (c.name === 'Art Center') { c.parkAttr = 'ARTSCENTER'; c.imageDataLg = 'art-center-lg'; c.imageDataSm = 'art-center-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Editing/paint_palette-24.png'; }
			if (c.name === 'Boat Ramp') { c.parkAttr = 'BOATRENTALS'; c.imageDataLg = 'boat-ramp-lg'; c.imageDataSm = 'boat-ramp-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/City/wharf-24.png'; }
			if (c.name === 'Baseball' || c.name === 'Softball' ) { c.name = 'Ball Fields'; c.parkAttr = 'BALLFIELDS'; c.imageDataLg = 'baseball-lg'; c.imageDataSm = 'baseball-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/baseball-24.png'; }
			if (c.name === 'Canoe Launch') { c.parkAttr = 'CANOE'; c.imageDataSm = 'canoe-launch-sm'; c.imageDataLg = 'canoe-launch-lg'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Transport/dinghy-24.png'; }
			if (c.name === 'Fishing Area') { c.name = 'Fishing'; c.parkAttr = 'FISHING'; c.imageDataLg = 'fishing-area-lg'; c.imageDataSm = 'fishing-area-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/fishing-24.png'; }
			if (c.name === 'Horseshoe Pit') { c.parkAttr = 'HORSESHOE'; c.imageDataLg = 'horseshoe-pit-lg'; c.imageDataSm = 'horseshoe-pit-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Gaming/horseshoe-24.png'; }
			if (c.name === 'In Line Hockey') { c.parkAttr = 'INLINESKATING'; c.imageDataLg = 'in-line-hockey-lg'; c.imageDataSm = 'in-line-hockey-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/hockey-24.png'; }

			// Add better icons in base 64
			if (c.name === 'Carousel') { c.imageDataLg = 'carousel-lg'; c.imageDataSm = 'carousel-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/City/carousel-24.png'; }
			if (c.name === 'Community Center') { c.imageDataLg = 'community-center-lg'; c.imageDataSm = 'community-center-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Business/conference_call-24.png'; }
			if (c.name === 'Disc Golf') { c.imageDataLg = 'disc-golf-lg'; c.imageDataSm = 'disc-golf-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/frisbee-24.png'; }
			if (c.name === 'Handball') { c.imageDataLg = 'handball-lg'; c.imageDataSm = 'handball-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/handball-24.png'; }
			if (c.name === 'Neighborhood Center') { c.imageDataLg = 'neighborhood-center-lg'; c.imageDataSm = 'neighborhood-center-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/City/city_bench-24.png'; }
			if (c.name === 'Outdoor Basketball') { c.imageDataLg = 'outdoor-basketball-lg'; c.imageDataSm = 'outdoor-basketball-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/basketball-24.png'; }
			if (c.name === 'Picnic Shelter') { c.imageDataLg = 'picnic-shelter-lg'; c.imageDataSm = 'picnic-shelter-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Ecommerce/shopping_basket-24.png'; }
			if (c.name === 'Playground') { c.imageDataLg = 'playground-lg'; c.imageDataSm = 'playground-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/City/playground-24.png'; }
			if (c.name === 'Sand Volleyball') { c.imageDataLg = 'sand-volleyball-lg'; c.imageDataSm = 'sand-volleyball-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/volleyball-24.png'; }
			if (c.name === 'Skate Park') { c.imageDataLg = 'skate-park-lg'; c.imageDataSm = 'skate-park-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/skateboarding-24.png'; }
			if (c.name === 'Track') { c.name = "Running"; c.parkAttr = 'TRACK'; c.imageDataLg = 'track-lg'; c.imageDataSm = 'track-sm'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Sports/running-24.png'; }


			// No parks can be searched by restroom
			if (c.name === 'Restroom') { rridx = mm; c.imageDataSm = 'restroom-sm'; c.imageDataLg = 'restroom-lg'; c.imageUrlSm = 'https://maxcdn.icons8.com/Color/PNG/24/Household/toilet_bowl-24.png'; }

      c.parkAttr = c.parkAttr || c.name.replace( /\s+/g, '').toUpperCase();
      c.imageUrlLg = c.imageUrlLg || c.imageUrlSm.replace( /24/g, '96');
			
		}

		list[1301] = list.Swimming;
		list[1311] = list['Neighborhood Center'];
		list[2203] = list['Canoe Launch'];
		list[2302] = list['Outdoor Basketball'];
		list[2307] = list['Sand Volleyball'];
		list.uniques.splice(rridx, 1);

	};

	var updateActivityWindow = function (activityMarker) {
    activityWindow.coords = { latitude: activityMarker.latitude, longitude: activityMarker.longitude };
    activityWindow.templateParameter = { name: activityMarker.name, park: activityMarker.park, subcategoryName: activityMarker.subcategory.name };
    activityWindow.show = true;
	};


	var getAmenitiesData = function () {
		// First set of amenities (buildings)
		return $http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2?f=pjson'
		});
	};

	var getAmenitiesData2 = function () {
		// Second set of amenities (outdoors)
		return $http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3?f=pjson'
		});
	};

	var completeData = function () {
		_processUniques();
		_addMissingAmenities();
		_addParkAttributesName();
	};

	var getJoinParkData = function () {
		// Building amenities join table with parks
		return $http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson'
		});
	};

	var getJoinParkData2 = function () {
		// Outdoor amenities join table with parks
		return $http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson'
		});
	};


	return {
		list: list,
		selectedActivities: selectedActivities,
		activityWindow: activityWindow,
		getAmenitiesData: getAmenitiesData,
		getAmenitiesData2: getAmenitiesData2,
		completeData: completeData,
		logAjaxError: logAjaxError,
		generateList: generateList,
		getJoinParkData: getJoinParkData,
		getJoinParkData2: getJoinParkData2,
		updateActivityWindow: updateActivityWindow
	};
}]);