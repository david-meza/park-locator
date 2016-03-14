(function(angular) {

  'use strict';

  angular.module('appServices').service('Esri', ['$q', function ($q) {

    var service = this;
    console.log('esri service');

    var deferred = $q.defer();
    
    service.modulesReady = function() {
      return deferred.promise;
    }

    angular.element(document).ready( function() {
      require([
        'esri/map', 
        'esri/layers/VectorTileLayer', 
        'esri/layers/FeatureLayer', 
        'esri/dijit/LocateButton', 
        'esri/renderers/SimpleRenderer', 
        'esri/renderers/UniqueValueRenderer',
        'esri/geometry/Point',
        'dojo/on', 
        'dijit/TooltipDialog', 
        'dijit/popup',
        'dojo/domReady!'],
        function(Map,b,FeatureLayer,d,e,f,Point,g,h,i) {
          

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

          service.VectorTileLayer = b; 
          service.FeatureLayer = FeatureLayer;
          service.LocateButton = d;
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