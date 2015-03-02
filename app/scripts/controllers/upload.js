'use strict';

angular.module('photomapApp')
  .controller('UploadCtrl',['$scope','$upload','$cookieStore', function ($scope,$upload,$cookieStore) {

    var headers = {};
    var session = $cookieStore.get("session");
    if(session){
      headers["x-session-id"] = session["sessionId"];
      headers["x-user-id"] = session["userId"];
    }




    //sock.close();

    $scope.onFileSelect = function($files) {
      $scope.progress = 0;
      $scope.$apply();
      var socket = new SockJS(ServiceConfig.api + 'updates');
      var stompClient = Stomp.over(socket);
      stompClient.connect({}, function(frame) {
        //setConnected(true);
        console.log('Connected: ' + frame);
      });
      //$files: an array of files selected, each file has name, size, and type.
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];
        $scope.upload = $upload.upload({
          url: ServiceConfig.api +'pictures/upload', //upload.php script, node.js route, or servlet url
          //method: 'POST' or 'PUT',
          headers: headers,
          //withCredentials: true,
          data: {myObj: $scope.myModelObj},
          file: file // or list of files ($files) for html5 only
          //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
          // customize file formData name ('Content-Disposition'), server side file variable name.
          //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
          // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
          //formDataAppender: function(formData, key, val){}

        }).progress(function(evt) {
          $scope.progress = parseInt(70.0 * evt.loaded / evt.total);
          if($scope.progress == 70){
            $scope.progressMessage = "upload finished +" + $scope.progress + " complete";
          }
        }).success(function(data, status, headers, config) {

          stompClient.subscribe('/queue/jobupdate/'+data.key , function (calResult) {

            var res = JSON.parse(calResult.body);
            if(res.Status === "complete" || res.Status === "error"){
              socket.close();
            }
            console.log("message ", res.Message);
            $scope.progress+=10;
            $scope.progressMessage = res.Message + " " + $scope.progress;
            $scope.$apply();


          });

          stompClient.send("/jobs/update/"+data.key, {}, JSON.stringify({ 'name': name }));
          // file is uploaded successfully


        })
        .error(function (){

        });
        //.then(success, error, progress);
        // access or attach event listeners to the underlying XMLHttpRequest.
        //.xhr(function(xhr){xhr.upload.addEventListener(...)})
      }
      /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
       It could also be used to monitor the progress of a normal http post/put request with large data*/
      // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
    };
  }]);
