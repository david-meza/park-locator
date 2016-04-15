(function(angular) {

  'use strict';

  angular.module('appServices').service('Esri', ['$q', function ($q) {

    var service = this;
    var deferred = $q.defer();
    
    service.modulesReady = function() {
      return deferred.promise;
    };

    angular.element(document).ready( function() {

      require([
        'esri/map', 
        'esri/graphic',
        'esri/layers/VectorTileLayer',
        'esri/layers/ArcGISImageServiceLayer', 
        'esri/layers/GraphicsLayer',
        'esri/layers/FeatureLayer',
        'esri/dijit/Search', 
        'esri/renderers/SimpleRenderer', 
        'esri/renderers/UniqueValueRenderer',
        'esri/symbols/PictureMarkerSymbol',
        'esri/geometry/Point',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'dijit/TooltipDialog', 
        'dijit/popup',
        'dojo/domReady!'],
        
        function( Map,
                  Graphic,
                  VectorTileLayer,
                  ArcGISImageServiceLayer,
                  GraphicsLayer,
                  FeatureLayer,
                  Search,
                  SimpleRenderer,
                  UniqueValueRenderer,
                  PictureMarkerSymbol,
                  Point,
                  Query,
                  QueryTask,
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
            outFields: ['*'],
            id: 'parks'
          });
          // Change the icon for the park marker
          var parkSymbol = new SimpleRenderer({
            type: 'simple',
            symbol: {
              type: 'esriPMS',
              url: '/img/icons/park-marker.svg',
              height: 28,
              width: 28,
              size: 512
            }
          });
          service.parks.setRenderer(parkSymbol);

          // Base map layer
          service.basemapLayer = new VectorTileLayer('https://ral.maps.arcgis.com/sharing/rest/content/items/49d007c1e87249ef9581f5662989fb9a/resources/styles/root.json');

          // Aerial views
          service.aerialLabels = new VectorTileLayer('https://ral.maps.arcgis.com/sharing/rest/content/items/fb05b96c9aaa4d90bbb9bc7702330916/resources/styles/root.json', { visible: false });

          service.aerialLayer = new ArcGISImageServiceLayer('https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2015/ImageServer', {
            visible: false
          });

          service.aerialLayer2013 = new ArcGISImageServiceLayer('https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2013/ImageServer', {
            visible: false
          });

          // Greenway Layers
          service.greenways = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/0', {
            id: 'greenways'
          });
          service.greenways2 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/1', {
            id: 'greenway-connectors'
          });
          // Change the default green line renderer
          var greenwaysLine = new SimpleRenderer({
            type: 'simple',
            symbol: {
              type: 'esriSLS',
              color: [150, 188, 152],
              style: 'esriSLSSolid',
              width: 3,
            }
          });
          service.greenways.setRenderer(greenwaysLine);
          service.greenways2.setRenderer(greenwaysLine);

          // Amenity Markers (outdoors)
          service.amenities1 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2', {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ['*'],
            id: 'amenities-outdoors'
          });

          // Amenity Markers (indoors)
          service.amenities2 = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3', {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ['*'],
            id: 'amenities-indoors'
          });

          // Location Tracking Layer
          service.tracker = new GraphicsLayer({
            id: 'location-tracking',
            visible: true
          });

          // Add all layers to the map. Basemap must go first so map gets the right extent and coordinate system from it
          // Layers are put on top of each other so later layers will show if overlapping with a previous layer
          service.map.addLayer(service.basemapLayer);
          service.map.addLayers([service.aerialLayer2013, service.aerialLayer, service.aerialLabels]);
          service.map.addLayers([service.greenways, service.greenways2, service.parks, service.tracker]);

          // My Location graphic
          service.userMarker = new Graphic({
            geometry: {
              x: -78.646,
              y: 35.785,
              spatialReference: { wkid: 4326 }
            },
            attributes: {
              title: 'User Marker'
            },
            symbol: {
              type: 'esriPMS',
              url: '/img/icons/user-marker.svg',
              height: 28,
              width: 28
            },
          });

          // Add my location graphic to map after it has loaded
          service.map.on('load', function() {
            service.map.graphics.add(service.userMarker);
          });

          // Tracker graphic
          service.trackerGraphic = new Graphic({
            attributes: {
              title: 'My Location'
            },
            symbol: {
              type: 'esriPMS',
              url: '/img/icons/my-location.svg',
              height: 28,
              width: 28
            },
          });
          // Add graphic to graphic layer
          service.tracker.add(service.trackerGraphic);

          // Geolocation search field
          // var addressSearch = new Search({
          //   map: service.map,
          //   allPlaceholder: 'Manually find your address',
          //   // enableButtonMode: true,
          //   enableHighlight: true,
          //   enableInfoWindow: false
          // }, "search-field");
          
          // addressSearch.startup();


          // Attach all Esri modules to the service so they can be used from outside
          service.VectorTileLayer = VectorTileLayer;
          service.ArcGISImageServiceLayer = ArcGISImageServiceLayer;
          service.FeatureLayer = FeatureLayer;
          service.SimpleRenderer = SimpleRenderer;
          service.UniqueValueRenderer = UniqueValueRenderer;
          service.Point = Point;
          service.Query = Query;
          service.queryInstance = new Query();
          service.QueryTask = QueryTask;
          service.aerialLayer2015Query = new QueryTask('https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2015/ImageServer');
          service.TooltipDialog = TooltipDialog;
          service.dijitPopup = dijitPopup;

          // Finally resolve the promise so we can signal other components that all modules are ready to be used
          deferred.resolve(service);
        }
      );
    });

  }]);

})(window.angular);