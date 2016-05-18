(function(angular) {
  
  'use strict';

  angular.module('appControllers').controller('mapCtrl', ['$scope', '$state', 'amenitiesService', 'Esri', '$mdDialog', 'deviceService',
    function($scope, $state, amenitiesService, Esri, $mdDialog, deviceService){

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

      Esri.modulesReady().then(function(modules) {

        // Change all the icons for the amenities
        amenitiesService.getAmenitiesIcons().then(function(response) {
          var uniqueValueInfos = response.data;
          
          var amenities1Symbols = new modules.UniqueValueRenderer({
            field: 'SUBCATEGORY',
            type: 'uniqueValue',
            uniqueValueInfos: uniqueValueInfos
          });
          var amenities2Symbols = new modules.UniqueValueRenderer({
            field: 'SUBCATEGORY',
            type: 'uniqueValue',
            uniqueValueInfos: uniqueValueInfos
          });

          modules.amenities1.renderer = amenities1Symbols;
          modules.amenities2.renderer = amenities2Symbols;

          modules.map.addMany([modules.amenities1, modules.amenities2]);
        });
        
        // Park on click event
        function transitionToParkDetails(graphic) {
          var parkName = graphic.attributes.NAME.toLowerCase().replace(/\W+/g, '');
          $state.go('home.park', {name: parkName});
        }

        // Get the screen point from the view's click event
        modules.mapView.on('click', function(evt){
          // Search for graphics at the clicked location
          modules.mapView.hitTest(evt.screenPoint).then(function(response){
            for (var i = 0; i < response.results.length; i++) {
              // Get the first occurrence of a graphic that has a layer attr.
              if (response.results[i].graphic.hasOwnProperty('layer')) {
                // Also if it is a park graphic, navigate to the park details page.
                if (response.results[i].graphic.layer.id === 'parks-layer') { transitionToParkDetails(response.results[i].graphic) }
                return; 
              }
            }
          });
        });

        if (deviceService.isMobile()) {
          modules.mapView.ui.destroy();
        }

      });

  }]);

})(window.angular);
