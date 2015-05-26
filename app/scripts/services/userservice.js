'use strict';

angular.module('photomapApp')
  .service('userService', ['$http','$location','$cookieStore',function ($http,$location, $cookieStore) {

    $http.defaults.headers["withCredentials"] = true;





    function setHeaders(){
      var headers = {};
      var session = $cookieStore.get("session");
      console.log("setting headers ", session);
      if(session){
        headers["x-authid"] = session["userid"];
        headers["x-auth"] = session["authtoken"];
      }
      return headers;
    }
    // Public API here
    return {
      getUser : function (userId, cb){

        $http({method:"get",url:ServiceConfig.api + "user/"+userId,headers:setHeaders()}).
          success(function (ok){
            console.log("all good ", ok );
            cb(undefined, ok);
          }).error( function (err, status){
            console.log(err, status);
            if(status === 401){
              $location.url("/login");
            }
            else cb(err);
          });
      },
      register : function (userName, email, password, cb){
        console.log("u ", userName, "e ", email, "p ", password);
        $http({method:"post",url:ServiceConfig.api + "user/register","data":{"userName":userName, "email":email, "password":password}})
          .success(function (ok){
            console.log("registered ok ", ok);
            cb();
          })
          .error(function (err, status){
            console.log(err, status);
            cb({status:status,message:err});
          });
      },
      login : function (userName, password, cb){
        var data = {"email":userName,"password":password};
        console.log("login data ",data);
        $http({method:"post",url:ServiceConfig.api + "user/login","data":data})
          .success(function (data){

            $cookieStore.put("session",data);
            cb(undefined,data);
          }).error(function(info,status){
            cb(status);
          });


      }
    };
  }]);
