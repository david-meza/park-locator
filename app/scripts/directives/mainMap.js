(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('mainMap', function(){
    return {
      
      controller: 'mapCtrl',
      restrict: 'E',
      templateUrl: 'views/directives/main-map.html',
      replace: true

    };
  });

})(window.angular);