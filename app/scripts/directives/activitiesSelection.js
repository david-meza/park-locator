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

        function transformChip ($chip) {
          return $chip;
        }

        function filterSelected (activities) {
          return activities.filter(function(activity) {
            return activity.selected;
          });
        }

        function updateChips (activity) {
          for (var i = 0; i < $scope.activityChips.length; i++) {
            if ($scope.activityChips[i].name === activity.name) {
              return $scope.activityChips.splice(i, 1);
            }
          }
          $scope.activityChips.push(activity);
        }

        // ng-model for chips
        $scope.activityChips = [];

        // Function that queries parks that meet the categories criteria
        $scope.updateParks = parkService.updateParkMarkers;
        // The activities object
        $scope.activities = amenitiesService.activities;
        // Park markers array
        $scope.parks = parkService.parks.markers;

        // Toggle an activity and trigger a park search
        $scope.toggleSelected = function (activity, source) {
          // Do not change the value if this function was triggered by the switch since that's the purpose of the switch and it's already been done
          activity.selected = (source === 'md-switch') ? activity.selected : !activity.selected;
          // Keep the chips list in sync with other components (list and switch)
          if (source !== 'md-chips') { updateChips(activity); }
          // The common part... These all trigger a query and map refresh
          $scope.updateParks( filterSelected($scope.activities.categoriesArr) );
        };

        // Should trigger an update when the switch is turned on or off
        $scope.toggleSwitch = function(activity) {
          updateChips(activity);
          $scope.updateParks( filterSelected($scope.activities.categoriesArr) );
        };

        // md-autocomplete directive config
        $scope.search = {
          selectedItem: undefined,
          searchText: undefined,
          querySearch: querySearch,
          transformChip: transformChip
        };

      }]
    };

  });

})(window.angular);