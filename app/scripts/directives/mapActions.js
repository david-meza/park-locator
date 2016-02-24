(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('mapActions', function(){
    
    return { 
      restrict: 'E',
      replace: true,
      templateUrl: 'views/directives/map-actions.html',
      controller: ['$scope', 'mapService', '$mdDialog', 'amenitiesService', function ($scope, mapService, $mdDialog, amenitiesService) {
          
        // Reference to service geo-location
        $scope.geoLocate = mapService.geoLocate;

        // Opens the dialog showing address edit input field
        $scope.editLocation = function (ev) {
          $mdDialog.show({
            templateUrl: 'views/partials/edit-location-dialog.html',
            targetEvent: ev,
            fullscreen: true,
            clickOutsideToClose:true,
            controller: 'DialogCtrl',
            bindToController: true
          });
        };

        // Opens the dialog showing the map icons key
        $scope.openKey = function (ev) {
          $mdDialog.show({
            templateUrl: 'views/partials/key-dialog.html',
            targetEvent: ev,
            fullscreen: true,
            clickOutsideToClose: true,
            controller: 'DialogCtrl',
            locals: {
              activities: amenitiesService.activities.categoriesArr
            },
            bindToController: true
          });
        };

        $scope.speedDial = {
          hidden: false,
          isOpen: false,
          openDirection: 'left',
          items: [
            { tooltipVisible: false, name: 'Find Me!', tooltipDirection: 'top', icon: 'img/icons/find-me.svg', action: $scope.geoLocate, addIconClass: 'find-me' },
            { tooltipVisible: false, name: 'Change My Location', tooltipDirection: 'top', icon: 'img/icons/person-pin.svg', action: $scope.editLocation, addIconClass: 'person-pin' },
            { tooltipVisible: false, name: 'Key', tooltipDirection: 'top', icon: 'img/icons/help.svg', action: $scope.openKey }
          ]
        };
      }]
    };

  });

})(window.angular);