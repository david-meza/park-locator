'use strict';

describe('Controller: Accordion', function () {

  beforeEach(module('parkLocator'));

  var accordionCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    accordionCtrl = $controller('accordionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should exist', function () {
    expect(accordionCtrl.settings).toBe(undefined);
  });
});
