(function(angular) {
  
  'use strict';

  angular.module('appControllers').controller('mapCtrl', ['$scope', '$state', 'amenitiesService', 'Esri', '$mdDialog',
    function($scope, $state, amenitiesService, Esri, $mdDialog){

      Esri.modulesReady().then(function(modules) {

        // // Geolocate button
        // var geoLocate = new modules.LocateButton({
        //   map: modules.map
        // }, 'geolocate-button');
        // geoLocate.startup();
        

        // Amenity Markers (outdoors)
        // var amenities1 = new modules.FeatureLayer({
        //   url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2',
        // });

        // // Amenity Markers (indoors)
        // var amenities2 = new modules.FeatureLayer({
        //   url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3',
        // });


        // // Change all the icons for the amenities
        // amenitiesService.getAmenitiesIcons().then(function(response) {
        //   var uniqueValueInfos = response.data;
          
        //   var amenities1Symbols = new modules.UniqueValueRenderer({
        //     type: 'uniqueValue',
        //     field1: 'SUBCATEGORY',
        //     uniqueValueInfos: uniqueValueInfos
        //   });
        //   var amenities2Symbols = new modules.UniqueValueRenderer({
        //     type: 'uniqueValue',
        //     field1: 'SUBCATEGORY',
        //     uniqueValueInfos: uniqueValueInfos
        //   });

        //   amenities1.renderer = amenities1Symbols;
        //   amenities2.renderer = amenities2Symbols;

        //   modules.map.layers.addItems([amenities1, amenities2]);
        // });
        
        // Show park name on hover
        var tooltip = new modules.TooltipDialog({ id: "tooltip" });
        tooltip.startup();


        modules.on(modules.parks, 'mouse-over', openParkTooltip);
        modules.on(modules.parks, 'mouse-out', closeTooltip);
        
        // modules.on(amenities1, 'mouse-over', openAmenitiesTooltip);
        // modules.on(amenities1, 'mouse-out', closeTooltip);
        // modules.on(amenities2, 'mouse-over', openAmenitiesTooltip);
        // modules.on(amenities2, 'mouse-out', closeTooltip);
        
        
        function openParkTooltip(evt) {
          var content = evt.graphic.attributes.NAME;
          tooltip.setContent(content);
          modules.dijitPopup.open({
            popup: tooltip,
            x: evt.pageX + 10,
            y: evt.pageY + 10
          });
          return false;
        }

        function openAmenitiesTooltip(evt) {
          var content = amenitiesService.activities[evt.graphic.attributes.SUBCATEGORY].name;
          tooltip.setContent(content);
          modules.dijitPopup.open({
            popup: tooltip,
            x: evt.pageX + 10,
            y: evt.pageY + 10
          });
          return false;
        }

        function closeTooltip(evt) {
          modules.dijitPopup.close(tooltip);
        }

      });

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

  }]);

})(window.angular);
