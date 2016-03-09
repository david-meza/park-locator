'use strict';

angular.module('appDirectives').directive('mainMap', function(){
	return {
		
		controller: ['$http', '$scope', function($http, $scope) {

      console.log('map ctrl');
 
      require(['esri/map', 'esri/layers/VectorTileLayer', 'esri/layers/FeatureLayer', 'esri/dijit/PopupTemplate', "esri/dijit/LocateButton", "dojo/domReady!"], 

        function(Map, VectorTileLayer, FeatureLayer, PopupTemplate, LocateButton) {

        var map = new Map('map-canvas', {
          center: [-78.646, 35.785],
          zoom: 14,
          // basemap: 'dark-gray-vector',
          logo: false
        });

        var geoLocate = new LocateButton({
          map: map
        }, "geolocate-button");
        
        geoLocate.startup();
        
        var tileLyr = new VectorTileLayer('https://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json');
        map.addLayer(tileLyr);

        var entrances = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/1', {
          mode: FeatureLayer.MODE_SNAPSHOT,
          outFields: ['*']
        });
        map.addLayer(entrances);

        var amenities1 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2', {
          mode: FeatureLayer.MODE_SNAPSHOT,
          outFields: ['*']
        });
        map.addLayer(amenities1);
        var amenities2 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3', {
          mode: FeatureLayer.MODE_SNAPSHOT,
          outFields: ['*']
        });
        map.addLayer(amenities2);

        var greenways = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/0');
        map.addLayer(greenways);
        var greenways2 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/1');
        map.addLayer(greenways2);
      
        var template = new PopupTemplate({
          title: '{NAME}',
          description: '<a ui-sref="home.park({NAME})">More Info</a>'
        });
        var parks = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0', { 
          mode: FeatureLayer.MODE_SNAPSHOT,
          infoTemplate: template,
          outFields: ['*']
        });
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