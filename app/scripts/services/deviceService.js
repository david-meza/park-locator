'use strict';

angular.module('appServices').factory('deviceService', ['$window', '$q', 
  function($window, $q){

    var _width = $window.innerWidth;
    var activeToast = $q.defer();

    function toastIsClosed() {
      return activeToast.promise;
    }

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
    activeToast: activeToast,
    toastIsClosed: toastIsClosed,
    scrollTo: scrollTo
	};

}]);