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
        'esri/layers/VectorTileLayer',
        'esri/layers/ArcGISImageServiceLayer', 
        'esri/layers/FeatureLayer', 
        'esri/dijit/LocateButton', 
        'esri/renderers/SimpleRenderer', 
        'esri/renderers/UniqueValueRenderer',
        'esri/geometry/Point',
        'dojo/on', 
        'dijit/TooltipDialog', 
        'dijit/popup',
        'dojo/domReady!'],
        function(Map,VectorTileLayer,ArcGISImageServiceLayer,FeatureLayer,LocateButton,e,f,Point,g,h,i) {
          

          // initialize the ESRI map
          service.map = new Map('map-canvas', {
            center: [-78.646, 35.785],
            zoom: 13,
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

          // Aerial view
          service.aerialLayer = new ArcGISImageServiceLayer('https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2015/ImageServer', {
            visible: false
          });

          service.map.addLayer(service.basemapLayer);
          service.map.addLayer(service.aerialLayer);


          service.VectorTileLayer = VectorTileLayer;
          service.ArcGISImageServiceLayer = ArcGISImageServiceLayer;
          service.FeatureLayer = FeatureLayer;
          service.LocateButton = LocateButton;
          service.SimpleRenderer = e;
          service.UniqueValueRenderer = f;
          service.Point = Point;
          service.on = g;
          service.TooltipDialog = h;
          service.dijitPopup = i;

          deferred.resolve(service);
        }
      );
    });

  }]);

})(window.angular);