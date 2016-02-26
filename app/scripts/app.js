'use strict';

function easeInOutCubic (t) { 
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

angular.module('parkLocator', ['appServices', 'appFilters', 'appControllers', 'appDirectives', 'ui.router', 'ngMaterial', 'uiGmapgoogle-maps', 'duScroll', 'dcbImgFallback', 'ngAnimate'])

  .value('duScrollDuration', 600)
  .value('duScrollOffset', 0)
  .value('duScrollEasing', easeInOutCubic)

  .config(['uiGmapGoogleMapApiProvider', 
    function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
        signed_in: true,
        // v: '3.21',
        libraries: 'places'
      });
  }])

  .config([ '$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push('httpInterceptor');
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
          views: {
            '': {
              templateUrl: 'views/partials/park-information.html',
              controller: 'parkCtrl',
            },
            'classes-info@home.park': {
              templateUrl: 'views/partials/class-section-selection.html',
              controller: 'classesCtrl'
            }
          },
          resolve: {
            maps: ['uiGmapGoogleMapApi', function(uiGmapGoogleMapApi) {
              return uiGmapGoogleMapApi;
            }],
            currentPark: ['parkService', '$stateParams', '$timeout', '$q', function(parkService, $stateParams, $timeout, $q) {
              var deferred = $q.defer();
              $timeout( function () {
                parkService.getCurrentPark(deferred, $stateParams.name);
              }, 0, false);
              return deferred.promise;
            }]
          }
        })

        .state('home.park.section', {
          url: '/:sectionName',
          views: {
            'classes-info@home.park': {
              templateUrl: 'views/partials/course-section.html',
              controller: 'sectionCtrl'
            }
          }
        });

  }]);
