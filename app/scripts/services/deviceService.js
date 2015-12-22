'use strict';

angular.module('parkLocator').factory('deviceService', ['$window', 
  function($window){

    var _width = $window.innerWidth;
    var activeTab = { name: 'search' };

    var isMobile = function () {
      return _width < 768
    };
  

	return {
    isMobile: isMobile,
    activeTab: activeTab
	};

}]);