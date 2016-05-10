(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('aerialToggle', function(){
    
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div id="aerial-toggle" class="flex layout-row" ng-transclude></div>',
      controller: ['$scope', 'Esri', function($scope, Esri) {
        
        Esri.modulesReady().then(function(modules) {

          $scope.aerial = false;

          $scope.select = function(button) {
            $scope.aerial = button === 'aerial';
            
            modules.aerialLayer.visible = $scope.aerial;
            modules.aerialLayer2013.visible = $scope.aerial;
            modules.aerialLabels.visible = $scope.aerial;
            modules.basemapLayer.visible = !$scope.aerial;
            modules.map.extent = modules.map.extent;
          };

        });

      }]
    };
  });
  
})(window.angular);