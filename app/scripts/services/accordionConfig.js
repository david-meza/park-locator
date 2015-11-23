'use strict';

angular.module('parkLocator').factory('accordionService', function(){
	
	var settings = {
    closeOthers: true,
  };

  settings.first = {
    classes: 'panel-default',
    status: {
      open: true,
      disabled: false,
    }
  };

  settings.second = {
    classes: 'panel-default',
    status: {
      open: false,
      disabled: false,
    }
  };

  settings.third = {
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