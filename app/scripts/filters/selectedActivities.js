'use strict';

angular.module('parkLocator').filter('selectedActivities', function() {
  
  var filtered = [];
  
  return function(parkMarkers, activities) {
    console.log(parkMarkers);
    console.log(activities);

    if (activities.length <= 0) {return parkMarkers;}

    filtered.splice(0, filtered.length);

  	parkMarkers.forEach( function (marker) {

      for (var i = 0; i < activities.length; i++) {
        // If the attribute exists, display the park in the map (e.g. marker['gym'])
        if ( marker[ activities[i].name.replace(/\s+/g, '').toLowerCase() ] ) {
          filtered.push(marker);
        }
      }

    });

    return filtered;
  };
});