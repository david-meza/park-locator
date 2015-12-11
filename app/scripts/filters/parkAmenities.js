'use strict';

angular.module('parkLocator').filter('parkAmenities', function() {
  
  return function(amenities, park) {

  	if (!park) {return amenities;}

  	var filtered = [];

  	for (var i = 0; i < amenities.length; i++) {
  		var parkAttribute = amenities[i].parkAttr.toLowerCase();
  		if (park[parkAttribute]) {
  			filtered.push(amenities[i]);
  		}
  	}

    return filtered;
  };
});