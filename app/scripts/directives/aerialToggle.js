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
            
            modules.aerialLayer.setVisibility($scope.aerial);
            modules.aerialLayer2013.setVisibility($scope.aerial);
            modules.map.setExtent(modules.map.extent);
            modules.aerialLabels.setVisibility($scope.aerial);
            modules.basemapLayer.setVisibility(!$scope.aerial);
          };

        });

      }]
    };
  });
  
})(window.angular);