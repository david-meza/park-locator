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
        'esri/Map',
        'esri/views/MapView',
        'esri/Basemap',
        'esri/layers/VectorTileLayer',
        'esri/layers/ArcGISImageLayer', 
        'esri/layers/FeatureLayer',
        'esri/layers/GraphicsLayer',
        'esri/renderers/SimpleRenderer', 
        'esri/renderers/UniqueValueRenderer',
        'esri/geometry/Point',
        'esri/geometry/Extent',
        'esri/tasks/support/Query',
        'esri/tasks/QueryTask',
        'dojo/on', 
        'dijit/TooltipDialog', 
        'dijit/popup',
        'dojo/domReady!'],
        
        function( Map,
                  MapView,
                  Basemap,
                  VectorTileLayer,
                  ArcGISImageLayer,
                  FeatureLayer,
                  GraphicsLayer,
                  SimpleRenderer,
                  UniqueValueRenderer,
                  Point,
                  Extent,
                  Query,
                  QueryTask,
                  on,
                  TooltipDialog,
                  dijitPopup) {
          

          // Base map layer
          service.basemapLayer = new VectorTileLayer({
            url: 'https://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json'
          });

          var corBasemap = new Basemap({
            baseLayers: [service.basemapLayer],
            title: "Raleigh Basemap",
            id: "corbasemap"
          });

          // initialize the ESRI map
          service.map = new Map({
            basemap: corBasemap,
            layers: []
          });

          service.mapView = new MapView({
            container: 'map-canvas',
            center: [-78.646, 35.785],
            zoom: 13,
            constraints: {
              snapToZoom: true,
              minZoom: 9,
              maxZoom: 20
            },
            map: service.map
          });

          // Park Markers layer
          service.parks = new FeatureLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0' 
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
          service.parks.renderer = parkSymbol;
          
          // Park on click event
          on(service.parks, 'click', function (evt) {
            var parkName = evt.graphic.attributes.NAME.toLowerCase().replace(/\W+/g, '');
            $state.go('home.park', {name: parkName});
          });

          // Aerial views
          service.aerialLayer = new ArcGISImageLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2015/ImageServer',
            visible: false
          });
          service.aerialLayer2013 = new ArcGISImageLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2013/ImageServer',
            visible: false
          });

          // Greenways Layers
          var greenways = new FeatureLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/0'
          });
          var greenways2 = new FeatureLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/1'
          });

          // Add layers to map. Order is important! Map will get the coordinate system (in this case Web Mercator) from the first layer that is added
          service.map.layers.addItems([service.aerialLayer2013, service.aerialLayer]);          
          service.map.layers.addItems([greenways, greenways2, service.parks]);

          // Map events
          var queryInstance = new Query();
          var aerialLayer2015Query = new QueryTask('https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2015/ImageServer');
          
          // Don't show park markers when zoomed in
          service.mapView.watch('zoom', function(newZoom) {
            // Only run this function when the map has settled in an integer zoom level
            if (newZoom % 1 === 0) {
              service.parks.visible = (newZoom <= 17);
            }
          });

          // Switch between aerial views when out of bounds
          service.mapView.watch('extent', function(newVal) {
            if ( !service.basemapLayer.visible ) {
              console.log(newVal);
              queryInstance.geometry = newVal.getCenter();
              aerialLayer2015Query.executeForCount(queryInstance, function(count) {
                var isOutside2015LayerBoundaries = (count === 0);
                service.aerialLayer2013.visible = isOutside2015LayerBoundaries;
                service.aerialLayer.visible = !isOutside2015LayerBoundaries;
              });
              
            }
          });
          // End map events

          //This graphics layer will store the graphic used to display the user's location
          // var gl = new GraphicsLayer();
          // service.map.layers.addItems([gl]);


          // Attach Esri returned objects to our service so we can use them from other controllers or services
          service.VectorTileLayer = VectorTileLayer;
          service.ArcGISImageLayer = ArcGISImageLayer;
          service.FeatureLayer = FeatureLayer;
          service.SimpleRenderer = SimpleRenderer;
          service.UniqueValueRenderer = UniqueValueRenderer;
          service.Point = Point;
          service.Query = Query;
          service.QueryTask = QueryTask;
          service.on = on;
          service.TooltipDialog = TooltipDialog;
          service.dijitPopup = dijitPopup;

          // Finally, resolve the promise so we can tell other components that the Esri modules are ready to be used (all async modules have been returned)
          deferred.resolve(service);
        }
      );
    });

  }]);

})(window.angular);