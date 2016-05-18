'use strict';

angular.module('appServices').factory('amenitiesService', ['$http', '$q',
	function($http, $q){
	
	var activities = { categories: {}, categoriesArr: [], markers: [], markersConfig: {} };

	function logError(response) {
	  console.error('Failed to get data from activities server', response);
	  return $q.reject(response);
	}

	function extractIndividualActivity(activity) {
  	var act = activity.attributes;
    var subCat = act.SUBCATEGORY;
    
    if (!activities[subCat]) { console.log( subCat ); }
    
    var processed = {
      id: act.OBJECTID,
      name: act.LOCATION,
      park: act.PARK_NAME,
      subcategory: activities[subCat] || subCat,
      latitude: activity.geometry.y,
      longitude: activity.geometry.x,
      icon: activities[subCat] ? activities[subCat].icon : '/img/icons/help.svg',
      options: {
      	visible: false,
        labelContent: activities[subCat] ? activities[subCat].name : act.LOCATION || 'activity',
        labelClass: 'activity-label',
        labelVisible: false,
      }
    };

    activities.markers.push(processed);
  }

	function generateActivityMarkers(response) {
	  if (response.status === 200) {
	    angular.forEach(response.data.features, extractIndividualActivity);
	    return activities.markers;
	  } else {
	    return logError();
	  }
	}

	function processParkActivities(responses) {
		generateActivityMarkers(responses[1]);
		generateActivityMarkers(responses[2]);
	}

	function generateCategories(response) {
		if (response.status === 200) {
			// Copy all category attributes to our local object
			angular.extend(activities.categories, response.data.categories);
			// Store each unique category by its multiple ids so we can get the right icon and reference when necessary
			angular.forEach(response.data.idReferences, function (categoryIds, categoryName) {
				angular.forEach(categoryIds, function (id) {
					activities[id] = activities.categories[categoryName];
				});
			});
			// Delete the unnecessary activities by PRCR request
			delete activities.categories.Library;
			delete activities.categories.Restroom;
			delete activities.categories.Softball;
			delete activities.categories['Youth Baseball'];
			delete activities.categories['Tennis Center'];
			storeAsArray(activities.categories);
			// Return the unique categories in case we chain the resolution of this promise
			return activities.categories;
		} else {
			// Reject the deferred and stop any further promise chaining
			return logError();
		}
	}

	function storeAsArray(categoriesObj) {
		angular.forEach(categoriesObj, function(categoryValue) {
      categoryValue.searchable = categoryValue.searchable || categoryValue.name.toLowerCase();
			this.push(categoryValue);
		}, activities.categoriesArr);

    // Instead of using angular's orderBy filter, just sort the array once
    activities.categoriesArr.sort(function(act1, act2) {
      return act1.searchable > act2.searchable ? 1 : -1;
    });
	}

	function getAmenitiesData() {
    // First set of amenities (buildings)
    return $http({
      method: 'GET',
      url: 'scripts/amenitycategories.json'
    });
  }

  function getAmenitiesIcons() {
		// First set of amenities (buildings)
		return $http({
			method: 'GET',
			url: 'scripts/uniqueValueInfos.json'
		});
	}

	function getJoinParkData() {
		// Building amenities join table with parks
		return $http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=8&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json'
		});
	}

	function getJoinParkData2() {
		// Outdoor amenities join table with parks
		return $http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=8&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json'
		});
	}

	var categoriesPromise = getAmenitiesData().then(generateCategories, logError);
	$q.all([categoriesPromise, getJoinParkData(), getJoinParkData2()]).then(processParkActivities, logError);

	return {
		activities: activities,
    getAmenitiesIcons: getAmenitiesIcons
	};

}]);