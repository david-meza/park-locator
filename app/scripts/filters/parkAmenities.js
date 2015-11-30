angular.module('parkLocator').filter('parkAmenities', ['parkService' function(parkService) {
  
	

  return function(amenities) {

    return input ? '\u2713' : '\u2718';
  };
}]);