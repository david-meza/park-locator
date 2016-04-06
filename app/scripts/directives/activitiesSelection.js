(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('activitiesSelection', function () {
    
    return { 
      restrict: 'E',
      // Set an isolate scope so we don't mistakenly inherit anything from the parent's scope
      scope: {},
      templateUrl: 'views/directives/activities-selection.html',
      controller: ['$scope', 'amenitiesService', 'parkService', function ($scope, amenitiesService, parkService) {

        // Internal controller functions
        function createFilterFor (query) {
          var lowercaseQuery = angular.lowercase(query);
          // Find the activities whose name starts with the searching text. If === 0 is used instead it only matches activities starting with search query
          return function filterFn(category) {
            return (category.searchable.indexOf(lowercaseQuery) > -1);
          };
        }

        function querySearch (searchText) {
          return searchText ? $scope.activities.categoriesArr.filter( createFilterFor(searchText) ) : $scope.activities.categoriesArr;
        }

        function filterSelected (activities) {
          return activities.filter(function(activity) {
            return activity.selected;
          });
        }


        // Function that queries parks that meet the categories criteria
        $scope.updateParks = parkService.updateParkMarkers;
        // The activities object
        $scope.activities = amenitiesService.activities;
        // Park markers array
        $scope.parks = parkService.parks.markers;

        // Toggle an activity and trigger a park search
        $scope.toggleSelected = function (activity) {
          if (angular.isUndefined(activity)) { return; }
          activity.selected = !activity.selected;
          $scope.updateParks( filterSelected($scope.activities.categoriesArr) );
        };

        // Should trigger an update when the switch is turned on or off
        $scope.toggleSwitch = function() {
          $scope.updateParks( filterSelected($scope.activities.categoriesArr) );
        };

        // md-autocomplete directive config
        $scope.search = {
          selectedItem: undefined,
          searchText: undefined,
          selectedItemChange: $scope.toggleSelected,
          querySearch: querySearch
        };

      }]
    };

  });

})(window.angular);