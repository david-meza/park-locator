'use strict';

angular.module('parkLocator').factory('amenitiesService', ['$http', '$q',
	function($http, $q){
	
	var list = { categories: { idReference: {} }, activitiesPos: { markers: [] } };
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

	var logError = function (response) {
	  console.log('Failed to get data from activities server', response);
	  return $q.reject(response);
	};

	var updateActivityWindow = function (activityMarker) {
    activityWindow.coords = { latitude: activityMarker.latitude, longitude: activityMarker.longitude };
    activityWindow.templateParameter = { name: activityMarker.name, park: activityMarker.park, subcategoryName: activityMarker.subcategory.name };
    activityWindow.show = true;
	};

	var markerclick = function () {
	  updateActivityWindow(this);
	};

	var generateActivityMarkers = function (responses) {

		angular.forEach([responses[1], responses[2]], function (response) {
		  if (response.status === 200) {
		    angular.forEach(response.data.features, function(activity) {
		      var subCat = activity.attributes.SUBCATEGORY;
		      if (!list[subCat]) { console.log( subCat ); }
		      var processed = {
		        id: activity.attributes.OBJECTID,
		        name: activity.attributes.LOCATION,
		        park: activity.attributes.PARK_NAME,
		        subcategory: list[subCat] || subCat,
		        latitude: activity.geometry.y,
		        longitude: activity.geometry.x,
		        icon: list[subCat] ? list[subCat].imageUrlSm : 'https://maxcdn.icons8.com/Color/PNG/24/Very_Basic/info-24.png',
		        onMarkerClicked: markerclick,
		        options: {
		          visible: false,
		          title: list[subCat] ? list[subCat].name : activity.attributes.LOCATION || activity.attributes.PARK_NAME || 'activity',
		        }
		      };

		      list.activitiesPos.markers.push(processed);
		    });

		  } else {
		    return logError();
		  }
		});

	};


	var generateCategories = function (response) {

		if (response.status === 200) {
			angular.extend(list.categories, response.data.categories);
			angular.forEach(response.data.idReferences, function (categoryIds, categoryName) {
				angular.forEach(categoryIds, function (id) {
					list[id] = list.categories[categoryName];
				});
			});
			// delete list.categories.Library;
			// delete list.categories.Softball;
			// delete list.categories['Tennis Center'];
			// delete list.categories['Youth Baseball'];
			console.log(list);
			return list.categories;
		} else {
			return logError();
		}
	};

	var addIds = function (responses) {
		// debugger;
		angular.forEach([responses[1], responses[2]], function(response) {
			angular.forEach(response.data.drawingInfo.renderer.uniqueValueInfos, function (cat) {
				if (cat.label === 'Aquatic Center') {cat.label = 'Swimming'}
				if (cat.label === 'Bocceball') {cat.label = 'Bocce'}
				if (cat.label === 'Informal Playfield' || cat.label === 'Multipurpose') {cat.label = 'Multipurpose Field'}
				if (cat.label === 'Off Leash Dog Area') {cat.label = 'Dog Park'}
				if (cat.label === 'Track') {cat.label = 'Running'}
				if (!list.categories[cat.label]) { return console.log(cat); }
				list.categories.idReference[cat.label] = list.categories.idReference[cat.label] || [];
				list.categories.idReference[cat.label].push(Number(cat.value));
			});
		});
		console.log(list.categories.idReference);
	}
	

	var getAmenitiesData = function () {
		// First set of amenities (buildings)
		return $http({
			method: 'GET',
			url: '/scripts/amenitycategories.json'
		});
	};

	var getJoinParkData = function () {
		// Building amenities join table with parks
		return $http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson'
		});
	};

	var getIds = function () {
		// First set of amenities (buildings)
		return $http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2?f=pjson'
		});
	};

	var getIds2 = function () {
		// Second set of amenities (outdoors)
		return $http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3?f=pjson'
		});
	};

	var getJoinParkData2 = function () {
		// Outdoor amenities join table with parks
		return $http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson'
		});
	};

	var categoriesPromise = getAmenitiesData().then(generateCategories, logError);
	$q.all([categoriesPromise, getJoinParkData(), getJoinParkData2()]).then(generateActivityMarkers, logError);
	$q.all([categoriesPromise, getIds(), getIds2()]).then(addIds, logError);

	return {
		list: list,
		selectedActivities: selectedActivities,
		activityWindow: activityWindow,
	};

}]);