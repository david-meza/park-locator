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
        'esri/Map',
        'esri/views/MapView',
        'esri/Basemap', 
        'esri/Graphic',
        
        'esri/layers/GraphicsLayer',
        'esri/layers/VectorTileLayer',
        'esri/layers/FeatureLayer',
        'esri/layers/ImageryLayer', 
        
        'esri/renderers/SimpleRenderer', 
        'esri/renderers/UniqueValueRenderer',
        
        'esri/symbols/PictureMarkerSymbol',
        
        'esri/geometry/Point',

        'esri/tasks/support/Query',
        'esri/tasks/QueryTask',
        
        'dijit/TooltipDialog', 
        'dijit/popup',
        'dojo/domReady!'],
        
        function( Map,
                  MapView,
                  Basemap,
                  Graphic,
                  
                  GraphicsLayer,
                  VectorTileLayer,
                  FeatureLayer,
                  ImageryLayer,
                  
                  SimpleRenderer,
                  UniqueValueRenderer,
                  
                  PictureMarkerSymbol,
                  
                  Point,
                  
                  Query,
                  QueryTask,
                  TooltipDialog,
                  dijitPopup) {
          
          // Base map layer
          service.basemapLayer = new VectorTileLayer({
            url: 'https://ral.maps.arcgis.com/sharing/rest/content/items/49d007c1e87249ef9581f5662989fb9a/resources/styles/root.json',
            visible: true
          });
          // Define the basemap
          var corBasemap = new Basemap({
            baseLayers: [service.basemapLayer],
            title: 'Raleigh Nature Styled Basemap',
            id: 'cor-basemap'
          });
          // initialize the ESRI map
          service.map = new Map({
            basemap: corBasemap
          });
          // Initialize the Map view
          service.mapView = new MapView({
            container: 'map-canvas',
            map: service.map,
            center: [-78.646, 35.785],
            zoom: 13,
            constraints: {
              snapToZoom: false,
              maxZoom: 18,
              minZoom: 10
            }
          });


          // Aerial views
          service.aerialLabels = new VectorTileLayer({
            url: 'https://ral.maps.arcgis.com/sharing/rest/content/items/fb05b96c9aaa4d90bbb9bc7702330916/resources/styles/root.json',
            visible: false 
          });

          service.aerialLayer = new ImageryLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2015/ImageServer',
            format: 'png',
            visible: false
          });

          service.aerialLayer2013 = new ImageryLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2013/ImageServer',
            format: 'png',
            visible: false
          });


          // Change the default green line renderer
          var greenwaysLine = new SimpleRenderer({
            type: 'simple',
            symbol: {
              type: 'simple-line-symbol',
              color: [150, 188, 152],
              style: 'solid',
              width: 3
            }
          });
          // Greenway Layers
          service.greenways = new FeatureLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/0',
            title: 'greenways',
            renderer: greenwaysLine
          });
          service.greenways2 = new FeatureLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/Greenway/MapServer/1',
            title: 'greenway-connectors',
            renderer: greenwaysLine
          });


          // Change the icon for the park marker
          var parkSymbol = new SimpleRenderer({
            type: 'simple',
            symbol: {
              type: 'picture-marker-symbol',
              url: '/img/icons/park-marker.svg',
              height: 36, width: 36,
              xoffset: 0, yoffset: 0, angle: 0
            }
          });
          // Park Markers layer
          service.parks = new FeatureLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0',
            renderer: parkSymbol,
            title: 'parks'
          });


          // Amenity Markers (outdoors)
          service.amenities1 = new FeatureLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/2',
            title: 'amenities-outdoors',
            minScale: 5000
          });
          // Amenity Markers (indoors)
          service.amenities2 = new FeatureLayer({
            url: 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/3',
            title: 'amenities-indoors',
            minScale: 5000
          });



          // Add all layers to the map. Basemap must go first so map gets the right extent and coordinate system from it
          // Layers are put on top of each other so later layers will show if overlapping with a previous layer
          service.map.addMany([service.aerialLayer2013, service.aerialLayer, service.aerialLabels]);
          service.map.addMany([service.greenways,service.greenways2, service.parks]);

          // Tracker graphic
          service.trackerGraphic = new Graphic({
            attributes: {
              title: 'My Location'
            },
            geometry: new Point([-78.646, 35.785]),
            symbol: {
              type: 'picture-marker-symbol',
              url: '/img/icons/my-location.svg',
              height: 36, width: 36,
              xoffset: 0, yoffset: 0, angle: 0
            },
            visible: true
          });
          // My Location graphic
          service.userMarker = new Graphic({
            geometry: new Point([-78.646, 35.785]),
            attributes: {
              title: 'User Marker'
            },
            symbol: new PictureMarkerSymbol({
              url: '/img/icons/user-marker.svg',
              height: 36, width: 36
            }),
            visible: true
          });

          // Add my location graphic to map after it has loaded
          service.mapView.then(function() {
            console.log(service.mapView);
            service.mapView.graphics.addMany([service.userMarker, service.trackerGraphic]);
          });


          // Switch between aerial imagery when outside 2015 bounds
          var queryInstance = new Query();
          var aerialLayer2015Query = new QueryTask('https://maps.raleighnc.gov/arcgis/rest/services/Orthos10/Orthos2015/ImageServer');

          service.mapView.watch('extent', function(newExtent) {
            if ( !service.basemapLayer.visible ) {

              queryInstance.geometry = newExtent.center;
              
              aerialLayer2015Query.executeForCount(queryInstance).then(function(count) {
                var isOutside2015Bounds = count === 0;
                service.aerialLayer2013.visible = isOutside2015Bounds;
                service.aerialLayer.visible = !isOutside2015Bounds;
              });

            }
          });

          service.mapView.whenLayerView(service.parks).then( function(lyrView) {
            lyrView.watch('updating', function(val) {
              if (!val) { // wait for the layer view to finish updating
                lyrView.queryFeatures().then(function(graphics) {
                  console.log(graphics);
                });
              }
            });
          });

          // Get the screen point from the view's click event
          service.mapView.on('click', function(evt){
            // Search for graphics at the clicked location
            service.mapView.hitTest(evt.screenPoint).then(function(response){
              if(response.results[0].graphic){
                console.log("Top graphic found! Here it is: ", response.results[0].graphic);
              }
            });
          });


          // Attach all Esri modules to the service so they can be used from outside
          service.VectorTileLayer = VectorTileLayer;
          service.ImageryLayer = ImageryLayer;
          service.FeatureLayer = FeatureLayer;
          service.SimpleRenderer = SimpleRenderer;
          service.UniqueValueRenderer = UniqueValueRenderer;
          service.Point = Point;
          service.Query = Query;
          service.QueryTask = QueryTask;
          service.TooltipDialog = TooltipDialog;
          service.dijitPopup = dijitPopup;

          // Finally resolve the promise so we can signal other components that all modules are ready to be used
          deferred.resolve(service);
        }
      );
    });

  }]);

})(angular || window.angular);