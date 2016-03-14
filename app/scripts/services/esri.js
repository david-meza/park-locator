(function(angular) {

  'use strict';

  angular.module('appServices').service('Esri', ['$q', function ($q) {

    var service = this;

    var deferred = $q.defer();
    
    service.modulesReady = function() {
      return deferred.promise;
    }

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
      'dijit/popup'],
      function(Map,b,c,d,e,f,Point,g,h,i) {
        
        // initialize the ESRI map
        service.map = new Map('map-canvas', {
          center: [-78.646, 35.785],
          zoom: 13,
          logo: false,
          basemap: 'streets-vector',
          fadeOnZoom: true,
          force3DTransforms: true
        });

        service.VectorTileLayer = b; 
        service.FeatureLayer = c;
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


  }]);

})(window.angular);