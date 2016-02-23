(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('activitiesSelection', function () {
    
    return { 
      restrict: 'E',
      // Set an isolate scope so we don't mistakenly inherit anything from the parent's scope
      scope: {},
      templateUrl: 'views/directives/activities-selection.html',
      controller: ['$scope', 'amenitiesService', 'parkService', function ($scope, amenitiesService, parkService) {

        // Function that queries parks that meet the categories criteria
        $scope.updateParks = parkService.updateParkMarkers;
        // The activities object
        $scope.activities = amenitiesService.activities;
        // Park markers array
        $scope.parks = parkService.markers.content;

        // Toggle an activity and trigger a park search
        $scope.toggleSelected = function (activity) {
          activity.selected = !activity.selected;
          $scope.updateParks($scope.activities.categories);
        };

        $scope.search = {
          selectedItem: undefined,
          searchText: undefined,
          searchTextChange: function(newText) { console.log(newText); },
          selectedItemChange: function(activity) { console.log(activity); },
          querySearch: function(searchText) { console.log(searchText); }
        };


      }]
    };

  });

})(window.angular);