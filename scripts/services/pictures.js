'use strict';

angular.module('photomapApp')
  .factory('Pictures', ['$http','$location','$cookieStore',function ($http,$location, $cookieStore) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return{
      "getYearRange": function(user,cb){
        $http({method:"get",url:ServiceConfig.api + "pictures/range/" + user}).
          success(function (ok){
            console.log("all good ", ok );
            cb(undefined, ok);
          }).error( function (err, status){
            console.log(err, status);
            cb(err);
          });
      },
      "getPicturesInRange": function (from,to,cb){
        $http({method:"get",url:ServiceConfig.api + "pictures/"+from+"/"+to}).
          success(function (ok){
            cb(undefined, ok);
          }).error( function (err, status){
            console.log(err, status);
            cb(err);
          });
      }
    }

  }]);
