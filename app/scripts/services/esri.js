// We must use this hack to set Dojo config
var dojoConfig = { 
  paths: {
    extras: location.pathname.replace(/\/[^/]+$/, "") + "extras"
  }
};

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
        'esri/geometry/Extent',
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
        'extras/ClusterLayer',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/renderers/ClassBreaksRenderer',
        'esri/symbols/PictureMarkerSymbol',
        'dojo/domReady!'],
        function(Map,Extent,VectorTileLayer,ArcGISImageServiceLayer,FeatureLayer,LocateButton,e,f,Point,g,h,i, ClusterLayer, SimpleMarkerSymbol, ClassBreaksRenderer, PictureMarkerSymbol) {
          

          // initialize the ESRI map
          service.map = new Map('map-canvas', {
            center: [-78.646, 35.785],
            zoom: 13,
            // basemap: 'streets-vector',
            logo: false,
            extent: new Extent({
              xmin:-78.946,
              ymin:35.485,
              xmax:-78.346,
              ymax:36.085,
              spatialReference:{wkid:4326}
            })
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
          console.log(service.map);
          // Parks cluster layer 
          service.clusterLayer = new ClusterLayer({
            "data": service.parks,
            "distance": 100,
            "id": "clusters",
            "labelColor": "#fff",
            "labelOffset": 10,
            "resolution": service.map.extent.getWidth() / service.map.width,
            "singleColor": "#888",
            "webmap": true,
            "spatialReference": 4326
          });

          var defaultSym = new SimpleMarkerSymbol().setSize(4);
          var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

          var picBaseUrl = "https://static.arcgis.com/images/Symbols/Shapes/";
          var blue = new PictureMarkerSymbol(picBaseUrl + "BluePin1LargeB.png", 32, 32).setOffset(0, 15);
          var green = new PictureMarkerSymbol(picBaseUrl + "GreenPin1LargeB.png", 64, 64).setOffset(0, 15);
          var red = new PictureMarkerSymbol(picBaseUrl + "RedPin1LargeB.png", 72, 72).setOffset(0, 15);
          renderer.addBreak(0, 2, blue);
          renderer.addBreak(2, 200, green);
          renderer.addBreak(200, 1001, red);

          service.clusterLayer.setRenderer(renderer);
          service.map.addLayer(service.clusterLayer);

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