'use strict';

angular.module('photomapApp')
  .factory('Pictures', ['$http','$location','$cookieStore',function ($http,$location, $cookieStore) {


    //centralise
    function setHeaders(){
      var headers = {};
      var session = $cookieStore.get("session");
      if(session){
        headers["x-session-id"] = session["sessionId"];
        headers["x-user-id"] = session["userId"];
      }
      return headers;
    }

    function handleError(err,status,cb){
      if(401 === status){
        cb("unauthorised");
        $location.url("/login");
      }
      else if(err){
        console.error(err);
        cb(err);
      }
    }


    return{
      "getYearRange": function(cb){
        $http({method:"get",url:ServiceConfig.api + "pictures/range","headers":setHeaders()}).
          success(function (ok){
            cb(undefined, ok);
          }).error( function (err, status){
            handleError(err,status,cb);
          });
      },
      "getPicturesInRange": function (from,to,cb){
        $http({method:"get",url:ServiceConfig.api + "pictures/"+from+"/"+to,"headers":setHeaders()}).
          success(function (ok){
            cb(undefined, ok);
          }).error( function (err, status){
           handleError(err,status,cb);
          });
      }
    }

  }]);
