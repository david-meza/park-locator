(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('gmapsAddress', ['$timeout',
    function ($timeout) {
    
    return { 
      restrict: 'AE',
      transclude: true,
      replace: true,
      template: '<div ng-transclude></div>',
      scope: {
        inputId: '='
      },
      controller: 'autocompleteCtrl',
      
      link: function postLink(scope, element) {

        var moveAddressResults = function () {
          var dropdown = angular.element( document.getElementsByClassName('pac-container') );
          if (dropdown.length === 0) { 
            return $timeout(function(){
              moveAddressResults();
            }, 200); 
          }
          dropdown.detach();
          element.append(dropdown);
        };

        moveAddressResults();

      }
    };

  }]);

})(window.angular);
