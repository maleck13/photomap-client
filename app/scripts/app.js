'use strict';
//http://192.168.33.10:8280/api-photomap/
var ServiceConfig = {
  "api":"http://192.168.33.10:8003/",
  "amq":"http://192.168.33.12:15674/stomp"
};

angular.module('photomapApp', [
  'bootstrapLightbox',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui-rangeSlider',
  'angularFileUpload',
  'uiGmapgoogle-maps',
  'ngGeolocation'
])
  .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
     // key: 'AIzaSyCasrbOUfMWMnsVxpO8xdm5o7FA1G-UitQ',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });
  }])
  .config(function (LightboxProvider) {
    // set a custom template
    LightboxProvider.templateUrl = 'views/lightbox-modal.html';
    LightboxProvider.calculateImageDimensionLimits = function (dimensions) {
      return {
        'maxWidth': dimensions.windowWidth >= 768 ? // default
        dimensions.windowWidth - 92 :
        dimensions.windowWidth - 52,
        'maxHeight': 1600                           // custom
      };
    };
    LightboxProvider.calculateModalDimensions = function (dimensions) {
      var width = Math.max(400, dimensions.imageDisplayWidth + 32);

      if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
        width = 'auto';
      }

      return {
        'width': width,                             // default
        'height': 'auto'                            // custom
      };
    };
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/upload', {
        templateUrl: 'views/upload.html',
        controller: 'UploadCtrl'
      }).when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/collection', {
        templateUrl: 'views/collection.html',
        controller: 'CollectionCtrl'
      }).otherwise({redirectTo: '/'});
  });
