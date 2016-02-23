'use strict';

angular.module('appFilters').filter('parkAmenities', function() {
  
  return function(activities, park) {

  	if (!park) {return activities;}

  	var filtered = [];

  	angular.forEach(activities, function (activity) {
  		var parkAttribute = activity.parkAttr.toLowerCase();
  		if (park[parkAttribute]) {
  			this.push(activity);
  		}
    }, filtered);

    return filtered;
  };
});