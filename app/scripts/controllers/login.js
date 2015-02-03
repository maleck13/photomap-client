'use strict';

angular.module('photomapApp')
  .controller('LoginCtrl', ['$scope','$location','$cookieStore','userService',function ($scope,$location,$cookieStore,userService) {
    $scope.messageClose = function (){
      $scope.showMessage = false;
    };

    function setMessage(title,message){
      $scope.showMessage = true;
      $scope.messageTitle = title;
      $scope.message = message;
    }
    $scope.loginUser = function (){

      userService.login(this.email, this.password, function (status,ok){
        if(status && status === 401){
            setMessage("Login Failed","Invalid username/password");
        }
        else{
          $location.url("/home");
        }
      });
    };
  }]);
