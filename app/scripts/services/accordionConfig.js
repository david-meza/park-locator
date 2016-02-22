'use strict';

angular.module('parkLocator').factory('accordionService', function(){
	
	var settings = {
    closeOthers: true,
  };

  settings.activities = {
    classes: 'panel-default',
    status: {
      open: true,
      disabled: false,
    }
  };

  settings.parks = {
    classes: 'panel-default',
    status: {
      open: false,
      disabled: false,
    }
  };
  

	return {
		settings: settings
	};
});