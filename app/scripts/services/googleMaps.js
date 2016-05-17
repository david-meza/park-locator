(function(angular) {

  'use strict';

  angular.module('appServices').service('googleMaps', ['$q', '$timeout', function ($q, $timeout) {

    var service = this;
    var deferred = $q.defer();
    
    function _isGooglePresent() {
      return angular.isDefined(window.google) && angular.isDefined(window.google.maps);
    }

    function _resolveScript(retriesLeft) {
      var retries = retriesLeft || 40; // Times out after 20 seconds of waiting
      if (_isGooglePresent()) {
        deferred.resolve(google.maps || window.google.maps);
      } else {
        if (retries > 1) { // Err... 0 is false so it goes back to 40 :)
          $timeout(_resolveScript, 500, false, --retries);
        } else {
          console.error('Error: Google Maps library timed out. Try refreshing the page.');
          deferred.reject(service);
        }
      }
    }

    _resolveScript();

    service.isReady = function() {
      return deferred.promise;
    };

    service.manualRetry = function() {
      if (_isGooglePresent()) {
        deferred.resolve(google.maps || window.google.maps);
      }
    }

  }]);

})(angular || window.angular);