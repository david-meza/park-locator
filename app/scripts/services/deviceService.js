'use strict';

angular.module('appServices').factory('deviceService', ['$window', 
  function($window){

    var _width = $window.innerWidth;
    var activeTab = { name: 'search' };

    function isIE() {
      return !!window.MSInputMethodContext && !!document.documentMode;
    }

    function isMobile() {
      return _width < 768;
    }

    function scrollTo(target) {
      var contentArea = angular.element(document.getElementById('main-scrollable'));
      var ngTarget = angular.element(document.getElementById(target));
      contentArea.scrollToElementAnimated(ngTarget);
    }
  

	return {
    isMobile: isMobile,
    isIE: isIE,
    activeTab: activeTab,
    scrollTo: scrollTo
	};

}]);