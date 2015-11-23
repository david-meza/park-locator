'use strict';

var app = angular
  .module('parkLocator', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', 
    function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');


      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
        });

  }]);
