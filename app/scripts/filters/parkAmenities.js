'use strict';

angular.module('parkLocator').filter('parkAmenities', function() {
  
  return function(amenities, park) {

  	if (!park) {return amenities;}

  	var filtered = [];

  	for (var i = 0; i < amenities.length; i++) {
  		var normalized = amenities[i].name.replace(/\s+/g, '').toLowerCase();
  		if (park[normalized]) {
  			filtered.push(amenities[i]);
  		}
  	}

    return filtered;
  };
});