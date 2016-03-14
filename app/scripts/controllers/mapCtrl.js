(function(angular) {
  
  'use strict';

  angular.module('appControllers').controller('mapCtrl', ['$scope', '$state', 'amenitiesService', 'Esri',
    function($scope, $state, amenitiesService, Esri){

      Esri.modulesReady().then(function(modules) {
        
        // Geolocate button
        var geoLocate = new modules.LocateButton({
          map: modules.map
        }, 'geolocate-button');
        geoLocate.startup();
        

        // Base map layer
        var tileLyr = new modules.VectorTileLayer('https://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json');
        modules.map.addLayer(tileLyr);

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

        // Park Markers layer
        var parks = new modules.FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0', { 
          mode: modules.FeatureLayer.MODE_SNAPSHOT,
          outFields: ['*']
        });

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
        parks.setRenderer(parkSymbol);
        modules.map.addLayer(parks);
        
        // Park on click event
        modules.on(parks, 'click', function (evt) {
          var parkName = evt.graphic.attributes.NAME.toLowerCase().replace(/\W+/g, '');
          $state.go('home.park', {name: parkName});
        });

        // Show park name on hover
        var tooltip = new modules.TooltipDialog({ id: "tooltip" });
        tooltip.startup();


        modules.on(parks, 'mouse-over', openTooltip);
        modules.on(parks, 'mouse-out', closeTooltip);
        
        
        function openTooltip(evt) {
          var content = evt.graphic.attributes.NAME;
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
