'use strict';

var ServiceConfig = {
  "api":"http://localhost:8080/"
};

angular.module('photomapApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui-rangeSlider',
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
      .otherwise({
        redirectTo: '/'
      });
  });
