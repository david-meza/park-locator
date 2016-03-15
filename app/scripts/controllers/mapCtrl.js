(function(angular) {
  
  'use strict';

  angular.module('appControllers').controller('mapCtrl', ['$scope', '$state', 'amenitiesService', 'Esri',
    function($scope, $state, amenitiesService, Esri){

      Esri.modulesReady().then(function(modules) {


        modules.on(modules.map, 'zoom-end', function(evt) {
          modules.parks.setVisibility(evt.level <= 17);
        });

        // Geolocate button
        var geoLocate = new modules.LocateButton({
          map: modules.map
        }, 'geolocate-button');
        geoLocate.startup();
        

        // Amenity Markers (outdoors)
        var amenities1 = new modules.FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2', {
          mode: modules.FeatureLayer.MODE_SNAPSHOT,
          outFields: ['*']
        });

        // Amenity Markers (indoors)
        var amenities2 = new modules.FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3', {
          mode: modules.FeatureLayer.MODE_SNAPSHOT,
          outFields: ['*']
        });


        // Change all the icons for the amenities
        amenitiesService.getAmenitiesIcons().then(function(response) {
          var uniqueValueInfos = response.data;
          
          var amenities1Symbols = new modules.UniqueValueRenderer({
            type: 'uniqueValue',
            field1: 'SUBCATEGORY',
            uniqueValueInfos: uniqueValueInfos
          });
          var amenities2Symbols = new modules.UniqueValueRenderer({
            type: 'uniqueValue',
            field1: 'SUBCATEGORY',
            uniqueValueInfos: uniqueValueInfos
          });

          amenities1.setRenderer(amenities1Symbols);
          amenities2.setRenderer(amenities2Symbols);

          modules.map.addLayer(amenities1);
          modules.map.addLayer(amenities2);
        });
        
        // Greenways Layers
        var greenways = new modules.FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/0');
        modules.map.addLayer(greenways);
        var greenways2 = new modules.FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/1');
        modules.map.addLayer(greenways2);


        // Change the icon for the park marker
        var parkSymbol = new modules.SimpleRenderer({
          type: 'simple',
          symbol: {
            type: 'esriPMS',
            url: '/img/icons/park-marker.svg',
            height: 28,
            width: 28
          }
        });
        modules.parks.setRenderer(parkSymbol);
        modules.map.addLayer(modules.parks);
        
        // Park on click event
        modules.on(modules.parks, 'click', function (evt) {
          var parkName = evt.graphic.attributes.NAME.toLowerCase().replace(/\W+/g, '');
          $state.go('home.park', {name: parkName});
        });

        // Show park name on hover
        var tooltip = new modules.TooltipDialog({ id: "tooltip" });
        tooltip.startup();


        modules.on(modules.parks, 'mouse-over', openParkTooltip);
        modules.on(modules.parks, 'mouse-out', closeTooltip);
        
        modules.on(amenities1, 'mouse-over', openAmenitiesTooltip);
        modules.on(amenities1, 'mouse-out', closeTooltip);
        modules.on(amenities2, 'mouse-over', openAmenitiesTooltip);
        modules.on(amenities2, 'mouse-out', closeTooltip);
        
        
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

  }]);

})(window.angular);
