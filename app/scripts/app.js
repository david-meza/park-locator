'use strict';

angular.module('parkLocator', ['ui.router', 'ui.bootstrap'])

  .config(['$stateProvider', '$urlRouterProvider', 
    function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');


      $stateProvider
        .state('home', {
          url: '/',
          views: {
            'navbar': {
              templateUrl: 'views/nav.html'
            },
            '': {
              templateUrl: 'views/main.html',
              controller: 'MainCtrl'
            }
          }
        });

  }]);
