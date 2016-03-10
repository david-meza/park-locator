(function(angular) {
  
  'use strict';

  angular.module('appControllers').controller('mapCtrl', ['$scope', '$state', 'amenitiesService',
    function($scope, $state, amenitiesService){

  	require([
      'esri/map', 
      'esri/layers/VectorTileLayer', 
      'esri/layers/FeatureLayer', 
      'esri/dijit/LocateButton', 
      'esri/renderers/SimpleRenderer', 
      'esri/renderers/UniqueValueRenderer', 
      'dojo/on', 
      'dijit/TooltipDialog', 
      'dijit/popup'],
      function(Map, VectorTileLayer, FeatureLayer, LocateButton, SimpleRenderer, UniqueValueRenderer, on, TooltipDialog, dijitPopup) {

      
      // initialize the ESRI map
      var map = new Map('map-canvas', {
        center: [-78.646, 35.785],
        zoom: 13,
        logo: false
      });


      // Geolocate button
      var geoLocate = new LocateButton({
        map: map
      }, 'geolocate-button');
      geoLocate.startup();
      

      // Base map layer
      var tileLyr = new VectorTileLayer('https://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json');
      map.addLayer(tileLyr);

      // Amenity Markers (outdoors)
      var amenities1 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2', {
        mode: FeatureLayer.MODE_SNAPSHOT,
        outFields: ['*']
      });

      // Amenity Markers (indoors)
      var amenities2 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3', {
        mode: FeatureLayer.MODE_SNAPSHOT,
        outFields: ['*']
      });


      // Change all the icons for the amenities
      amenitiesService.getAmenitiesIcons().then(function(response) {
        var uniqueValueInfos = response.data;
        
        var amenities1Symbols = new UniqueValueRenderer({
          type: 'uniqueValue',
          field1: 'SUBCATEGORY',
          uniqueValueInfos: uniqueValueInfos
        });
        var amenities2Symbols = new UniqueValueRenderer({
          type: 'uniqueValue',
          field1: 'SUBCATEGORY',
          uniqueValueInfos: uniqueValueInfos
        });

        amenities1.setRenderer(amenities1Symbols);
        amenities2.setRenderer(amenities2Symbols);

        map.addLayer(amenities1);
        map.addLayer(amenities2);
      });
      
      // Greenways Layers
      var greenways = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/0');
      map.addLayer(greenways);
      var greenways2 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/1');
      map.addLayer(greenways2);

      // Park Markers layer
      var parks = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0', { 
        mode: FeatureLayer.MODE_SNAPSHOT,
        outFields: ['*']
      });

      // Change the icon for the park marker
      var parkSymbol = new SimpleRenderer({
        type: 'simple',
        symbol: {
          type: 'esriPMS',
          url: '/img/icons/park-marker.svg',
          height: 28,
          width: 28
        }
      });
      parks.setRenderer(parkSymbol);
      map.addLayer(parks);
      
      // Park on click event
      on(parks, 'click', function (evt) {
        var parkName = evt.graphic.attributes.NAME.toLowerCase().replace(/\W+/g, '');
        $state.go('home.park', {name: parkName});
      });

      // Show park name on hover
      var tooltip = new TooltipDialog({ id: "tooltip" });
      tooltip.startup();


      on(parks, 'mouse-over', openTooltip);
      on(parks, 'mouse-out', closeTooltip);
      
      
      function openTooltip(evt) {
        var content = evt.graphic.attributes.NAME;
        tooltip.setContent(content);
        dijitPopup.open({
          popup: tooltip,
          x: evt.pageX,
          y: evt.pageY
        });
      }

      function closeTooltip(evt) {
        dijitPopup.close(tooltip);
      }
    });

  }]);

})(window.angular);
