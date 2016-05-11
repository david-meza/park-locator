(function(angular) {
  
  'use strict';

  angular.module('appControllers').controller('mapCtrl', ['$scope', '$state', 'amenitiesService', 'Esri', '$mdDialog',
    function($scope, $state, amenitiesService, Esri, $mdDialog){

      Esri.modulesReady().then(function(modules) {

        // Change all the icons for the amenities
        amenitiesService.getAmenitiesIcons().then(function(response) {
          var uniqueValueInfos = response.data;
          
          var amenities1Symbols = new modules.UniqueValueRenderer({
            field: 'SUBCATEGORY',
            type: 'uniqueValue',
            uniqueValueInfos: uniqueValueInfos
          });
          var amenities2Symbols = new modules.UniqueValueRenderer({
            field: 'SUBCATEGORY',
            type: 'uniqueValue',
            uniqueValueInfos: uniqueValueInfos
          });

          modules.amenities1.renderer = amenities1Symbols;
          modules.amenities2.renderer = amenities2Symbols;

          modules.map.addMany([modules.amenities1, modules.amenities2]);
        });
        
        // Park on click event
        function transitionToParkDetails(graphic) {
          var parkName = graphic.attributes.NAME.toLowerCase().replace(/\W+/g, '');
          $state.go('home.park', {name: parkName});
        }


        // Get the screen point from the view's click event
        modules.mapView.on('click', function(evt){
          // Search for graphics at the clicked location
          modules.mapView.hitTest(evt.screenPoint).then(function(response){
            for (var i = 0; i < response.results.length; i++) {
              if (response.results[i].graphic.hasOwnProperty('layer')) {
                if (response.results[i].graphic.layer.id === 'parks-layer') { transitionToParkDetails(response.results[i].graphic) }
                return console.log('Something here:', response.results[i].graphic);
              }
            }
          });
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
