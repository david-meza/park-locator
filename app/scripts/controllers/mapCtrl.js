(function(angular) {
  
  'use strict';

  angular.module('appControllers').controller('mapCtrl', ['$scope', '$state', 'amenitiesService', 'Esri', '$mdDialog',
    function($scope, $state, amenitiesService, Esri, $mdDialog){

      Esri.modulesReady().then(function(modules) {

        // modules.map.on('zoom-end', function(evt) {
        //   modules.parks.setVisibility(evt.level <= 17);
        // });

        modules.map.on('extent-change', function(evt) {
          if ( !modules.basemapLayer.visible ) {
            
            modules.queryInstance.geometry = evt.extent.getCenter();
            
            modules.aerialLayer2015Query.executeForCount(modules.queryInstance, function(count) {
              var isOutside2015Bounds = count === 0;
              modules.aerialLayer2013.setVisibility(isOutside2015Bounds);
              modules.aerialLayer.setVisibility(!isOutside2015Bounds);
            });

          }
        });

        // Change all the icons for the amenities
        amenitiesService.getAmenitiesIcons().then(function(response) {
          var uniqueValueInfos = response.data;
          
          var amenities1Symbols = new modules.UniqueValueRenderer({
            type: 'uniqueValue',
            field1: 'SUBCATEGORY',
            uniqueValueInfos: uniqueValueInfos
          });
          var amenities2Symbols = new modules.UniqueValueRenderer({
            type: 'uniqueValue',
            field1: 'SUBCATEGORY',
            uniqueValueInfos: uniqueValueInfos
          });

          modules.amenities1.setRenderer(amenities1Symbols);
          modules.amenities2.setRenderer(amenities2Symbols);

          modules.amenities1.setMinScale(5000);
          modules.amenities2.setMinScale(5000);

          modules.map.addLayers([modules.amenities1, modules.amenities2]);
        });
        
        // Park on click event
        modules.parks.on('touchend, click, mouse-down', function (evt) {
          var parkName = evt.graphic.attributes.NAME.toLowerCase().replace(/\W+/g, '');
          $state.go('home.park', {name: parkName});
        });

        // Show park name on hover
        var tooltip = new modules.TooltipDialog({ id: "tooltip" });
        tooltip.startup();

        function openParkTooltip(evt) {
          var content = evt.graphic.attributes.NAME;
          return setTooltipContent(content, evt);
        }

        function openAmenitiesTooltip(evt) {
          var content = amenitiesService.activities[evt.graphic.attributes.SUBCATEGORY].name;
          return setTooltipContent(content, evt);
        }
        
        function openGreenwaysTooltip(evt) {
          return setTooltipContent('Greenway Trail', evt);
        }

        function setTooltipContent(content, evt) {
          tooltip.setContent(content);
          modules.dijitPopup.open({
            popup: tooltip,
            x: evt.pageX + 10,
            y: evt.pageY + 10
          });
          return false;
        }

        function closeTooltip() {
          modules.dijitPopup.close(tooltip);
        }

        modules.parks.on('mouse-over', openParkTooltip);
        modules.parks.on('mouse-out', closeTooltip);
        
        modules.amenities1.on('mouse-over', openAmenitiesTooltip);
        modules.amenities1.on('mouse-out', closeTooltip);
        modules.amenities2.on('mouse-over', openAmenitiesTooltip);
        modules.amenities2.on('mouse-out', closeTooltip);

        modules.greenways.on('mouse-over', openGreenwaysTooltip);
        modules.greenways.on('mouse-out', closeTooltip);
        modules.greenways2.on('mouse-over', openGreenwaysTooltip);
        modules.greenways2.on('mouse-out', closeTooltip);
        
        
      });

    // Opens the dialog showing the map icons key
    $scope.openKey = function (ev) {
      $mdDialog.show({
        templateUrl: 'views/partials/key-dialog.html',
        targetEvent: ev,
        fullscreen: true,
        clickOutsideToClose: true,
        controller: 'DialogCtrl',
        locals: {
          activities: amenitiesService.activities.categoriesArr
        },
        bindToController: true
      });
    };

  }]);

})(window.angular);
