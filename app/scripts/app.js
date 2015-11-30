'use strict';

angular.module('parkLocator', ['ui.router', 'ui.bootstrap', 'uiGmapgoogle-maps', 'flash', 'smoothScroll'])

  .config(['uiGmapGoogleMapApiProvider', 
    function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
          v: '3.20',
          libraries: 'places, geometry'
      });
  }])

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
            },

            'map@home': {
              templateUrl: 'views/partials/map.html',
              controller: 'mapCtrl'
            }
          }
        });

  }]);
