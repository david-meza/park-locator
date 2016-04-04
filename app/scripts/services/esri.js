(function(angular) {

  'use strict';

  angular.module('appServices').service('Esri', ['$q', function ($q) {

    var service = this;
    var deferred = $q.defer();
    
    service.modulesReady = function() {
      return deferred.promise;
    }

    angular.element(document).ready( function() {
      require([
        'esri/map', 
        'esri/graphic',
        'esri/layers/VectorTileLayer',
        'esri/layers/ArcGISImageServiceLayer', 
        'esri/layers/FeatureLayer', 
        'esri/dijit/LocateButton', 
        'esri/dijit/Search', 
        'esri/renderers/SimpleRenderer', 
        'esri/renderers/UniqueValueRenderer',
        'esri/symbols/PictureMarkerSymbol',
        'esri/geometry/Point',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'dojo/on', 
        'dijit/TooltipDialog', 
        'dijit/popup',
        'dojo/domReady!'],
        
        function( Map,
                  Graphic,
                  VectorTileLayer,
                  ArcGISImageServiceLayer,
                  FeatureLayer,
                  LocateButton,
                  Search,
                  SimpleRenderer,
                  UniqueValueRenderer,
                  PictureMarkerSymbol,
                  Point,
                  Query,
                  QueryTask,
                  on,
                  TooltipDialog,
                  dijitPopup) {
          

          // initialize the ESRI map
          service.map = new Map('map-canvas', {
            center: [-78.646, 35.785],
            zoom: 13,
            maxZoom: 18,
            minZoom: 9,
            // basemap: 'streets-vector',
            logo: false
          });

          // Park Markers layer
          service.parks = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0', { 
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ['*']
          });

          // Base map layer
          service.basemapLayer = new VectorTileLayer('https://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json');

          // Aerial views
          service.aerialLayer = new ArcGISImageServiceLayer('https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2015/ImageServer', {
            visible: false
          });

          service.aerialLayer2013 = new ArcGISImageServiceLayer('https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2013/ImageServer', {
            visible: false
          });

          // Greenway Layers
          var greenways = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/0');
          var greenways2 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/1');


          // Add all layers to the map. Basemap must go first so map gets the right extent and coordinate system from it
          service.map.addLayer(service.basemapLayer);
          service.map.addLayer(service.aerialLayer2013);
          service.map.addLayer(service.aerialLayer);
          service.map.addLayer(greenways);
          service.map.addLayer(greenways2);

          // My Location graphic
          service.myLocation = new Graphic({
            geometry: {
              x: -78.646,
              y: 35.785,
              spatialReference: { wkid: 4326 }
            },
            attributes: {
              title: 'My Location'
            },
            symbol: {
              type: 'esriPMS',
              url: '/img/icons/user-marker.svg',
              height: 28,
              width: 28
            }
          });

          // Add my location graphic to map after it has loaded
          service.map.on('load', function() {
            service.map.graphics.add(service.myLocation);
            console.log(service.myLocation.geometry);
          });

          // Geolocate button
          var geoLocate = new LocateButton({
            map: service.map,
            useTracking: true,
            symbol: new PictureMarkerSymbol('/img/icons/my-location.svg', 56, 56)
          }, 'geolocate-button');

          // Geolocation search field
          var search = new Search({
            map: service.map,
            allPlaceholder: 'Manually find your address',
            // enableButtonMode: true,
            enableHighlight: true,
            enableInfoWindow: false
          }, "search-field");
          
          geoLocate.startup();
          search.startup();


          // Attach all Esri modules to the service so they can be used from outside
          service.VectorTileLayer = VectorTileLayer;
          service.ArcGISImageServiceLayer = ArcGISImageServiceLayer;
          service.FeatureLayer = FeatureLayer;
          service.LocateButton = LocateButton;
          service.SimpleRenderer = SimpleRenderer;
          service.UniqueValueRenderer = UniqueValueRenderer;
          service.Point = Point;
          service.Query = Query;
          service.queryInstance = new Query();
          service.QueryTask = QueryTask;
          service.aerialLayer2015Query = new QueryTask('https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2015/ImageServer');
          service.on = on;
          service.TooltipDialog = TooltipDialog;
          service.dijitPopup = dijitPopup;

          // Finally resolve the promise so we can signal other components that all modules are ready to be used
          deferred.resolve(service);
        }
      );
    });

  }]);

})(window.angular);