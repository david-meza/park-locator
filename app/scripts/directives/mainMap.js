'use strict';

angular.module('appDirectives').directive('mainMap', function(){
	return {
		
		controller: ['amenitiesService', '$scope', '$state', function(amenitiesService, $scope, $state) {

 
      require(['esri/map', 'esri/layers/VectorTileLayer', 'esri/layers/FeatureLayer', 'esri/dijit/PopupTemplate', 'esri/dijit/LocateButton', 'esri/renderers/SimpleRenderer', 'esri/renderers/UniqueValueRenderer', 'dojo/on', 'dojo/domReady!'],

        function(Map, VectorTileLayer, FeatureLayer, PopupTemplate, LocateButton, SimpleRenderer, UniqueValueRenderer, on) {

        var map = new Map('map-canvas', {
          center: [-78.646, 35.785],
          zoom: 14,
          logo: false
        });

        var geoLocate = new LocateButton({
          map: map
        }, 'geolocate-button');
        
        geoLocate.startup();
        
        var tileLyr = new VectorTileLayer('https://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json');
        map.addLayer(tileLyr);

        var amenities1 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2', {
          mode: FeatureLayer.MODE_SNAPSHOT,
          outFields: ['*']
        });

        var amenities2 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3', {
          mode: FeatureLayer.MODE_SNAPSHOT,
          outFields: ['*']
        });

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
        

        var greenways = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/0');
        map.addLayer(greenways);
        var greenways2 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/1');
        map.addLayer(greenways2);

        var parks = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0', { 
          mode: FeatureLayer.MODE_SNAPSHOT,
          outFields: ['*']
        });

        on(parks, 'click', function (evt) {
          var parkName = evt.graphic.attributes.NAME.toLowerCase().replace(/\W+/g, '');
          console.log(parkName);
          $state.go('home.park', {name: parkName});
        });

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
        
        });
    }],
		restrict: 'E',
    template: '<div id="map-canvas"><div id="geolocate-button"></div></div>',
		// templateUrl: 'views/directives/map.html',
		replace: true,
    link: function(scope, element, attrs) {
    }

	};
});