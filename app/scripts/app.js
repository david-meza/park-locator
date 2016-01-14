'use strict';

angular.module('parkLocator', ['ui.router', 'ui.bootstrap', 'ngMaterial', 'uiGmapgoogle-maps', 'flash', 'duScroll', 'dcbImgFallback', 'ngAnimate'])

  .config(['uiGmapGoogleMapApiProvider', 
    function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
          v: '3.20',
          libraries: 'places, geometry'
      });
  }])

  .config([ '$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push('httpInterceptor');
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common.Accept = 'application/json';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    
  }])

  .config([ '$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.theme('altTheme')
      .primaryPalette('purple')
      .accentPalette('red')
      .warnPalette('yellow');
  }])

  .config(['$stateProvider', '$urlRouterProvider', 
    function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');


      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'views/main.html',
          controller: 'devicesCtrl'
        })

        .state('home.park', {
          url: ':name',
          templateUrl: 'views/park-information.html',
          controller: 'parkCtrl'

        })

        .state('home.park.section', {
          url: '/:sectionName',
          templateUrl: 'views/course-section.html',
          controller: 'sectionCtrl'
        });

  }]);
