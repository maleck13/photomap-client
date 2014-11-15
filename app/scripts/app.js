'use strict';

var ServiceConfig = {
  "api":"http://api.photomap.me/"
};

angular.module('photomapApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui-rangeSlider',
  'angularFileUpload',
  'google-maps'.ns()
])
  .config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
    GoogleMapApi.configure({
     // key: 'AIzaSyCasrbOUfMWMnsVxpO8xdm5o7FA1G-UitQ',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/upload', {
        templateUrl: 'views/upload.html',
        controller: 'UploadCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
