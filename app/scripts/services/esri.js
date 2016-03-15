// We must use this hack to set Dojo config
window.dojoConfig = {
  async: true,
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
        'esri/SpatialReference',
        'esri/geometry/Extent',
        'esri/layers/VectorTileLayer',
        'esri/layers/ArcGISImageServiceLayer', 
        'esri/layers/FeatureLayer', 
        'esri/dijit/LocateButton', 
        'esri/renderers/SimpleRenderer', 
        'esri/renderers/UniqueValueRenderer',
        'esri/geometry/Point',
        'esri/geometry/webMercatorUtils',
        'esri/tasks/query',
        'dojo/on', 
        'dijit/TooltipDialog', 
        'dijit/popup',
        'extras/ClusterLayer',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/Font',
        'esri/renderers/ClassBreaksRenderer',
        'esri/symbols/PictureMarkerSymbol',
        'dojo/domReady!'],
        function(Map,SpatialReference,Extent,VectorTileLayer,ArcGISImageServiceLayer,FeatureLayer,LocateButton,SimpleRenderer,f,Point, webMercatorUtils, Query, g,h,i, ClusterFeatureLayer, SimpleMarkerSymbol, Font, ClassBreaksRenderer, PictureMarkerSymbol) {
          

          // initialize the ESRI map
          service.map = new Map('map-canvas', {
            center: [-78.646, 35.785],
            zoom: 13,
            // basemap: 'streets-vector',
            extent: webMercatorUtils.geographicToWebMercator( new Extent({
              xmin: -78.946,
              ymin: 35.485,
              xmax: -78.346,
              ymax: 36.085,
              spatialReference: { wkid: 4326 }
            })),
            logo: false
          });

          // Park Markers layer
          service.parks = new ClusterFeatureLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0',
            distance: 50,
            where: '1 = 1',
            useDefaultSymbol: false,
            id: 'clusters',
            labelColor: '#fff',
            labelOffset: 0,
            font: new Font('13pt').setFamily('Roboto'),
            resolution: service.map.extent.getWidth() / service.map.width,
            singleSymbol: new PictureMarkerSymbol('/img/icons/park-marker.svg', 28, 28),
            zoomOnClick: true,
            showSingles: false,
            spatialReference: new SpatialReference({ 'wkid': 102719 }),
            outFields: ['*']
          });

          console.log(service.parks);

          // Base map layer
          service.basemapLayer = new VectorTileLayer('https://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json');

          // Aerial view
          service.aerialLayer = new ArcGISImageServiceLayer('https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2015/ImageServer', {
            visible: false
          });
          
          // Add the basemap layer and aerial view layers
          service.map.addLayer(service.basemapLayer);
          service.map.addLayer(service.aerialLayer);

          // Greenways Layers
          var greenways = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/0');
          service.map.addLayer(greenways);
          var greenways2 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/1');
          service.map.addLayer(greenways2);

          var defaultSym = new SimpleMarkerSymbol().setSize(4);
          var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

          // Change the icon for the park marker
          var parkSymbolClusterSm = new PictureMarkerSymbol('/img/icons/park-marker-cluster.svg', 40, 40).setOffset(0, 15);
          var parkSymbolClusterMd = new PictureMarkerSymbol('/img/icons/park-marker-cluster.svg', 55, 55).setOffset(0, 15);
          var parkSymbolClusterLg = new PictureMarkerSymbol('/img/icons/park-marker-cluster.svg', 72, 72).setOffset(0, 15);
          renderer.addBreak(2, 10, parkSymbolClusterSm);
          renderer.addBreak(11, 40, parkSymbolClusterMd);
          renderer.addBreak(41, 1001, parkSymbolClusterLg);

          // Set the parks renderer and add the layer to the map
          service.parks.setRenderer(renderer);
          service.map.addLayer(service.parks);


          // Assign other modules to the service object
          service.VectorTileLayer = VectorTileLayer;
          service.Query = Query;
          service.ArcGISImageServiceLayer = ArcGISImageServiceLayer;
          service.FeatureLayer = FeatureLayer;
          service.LocateButton = LocateButton;
          service.SimpleRenderer = SimpleRenderer;
          service.UniqueValueRenderer = f;
          service.Point = Point;
          service.on = g;
          service.TooltipDialog = h;
          service.dijitPopup = i;

          // Finally resolve the promise so we can use it in other controllers or services
          deferred.resolve(service);
        }
      );
    });

  }]);

})(window.angular);