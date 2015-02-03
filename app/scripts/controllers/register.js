'use strict';

angular.module('photomapApp')
  .controller('RegisterCtrl', ['$scope','userService',function ($scope,userService) {
    $scope.messageClose = function (){
      $scope.showMessage = false;
    };

    function setMessage(title,message){
      $scope.showMessage = true;
      $scope.messageTitle = title;
      $scope.message = message;
    }
    $scope.registerUser = function (){

      userService.register(this.username, this.email,this.password,function (err, ok){
        if(err){
          setMessage("Registration Failed", err.message);
        }else{
          $scope.success = true;
          setMessage("Success! ","Check your email (no email actually sent yet)");
        }
      });
    };
  }]);
