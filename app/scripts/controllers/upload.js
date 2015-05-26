'use strict';

angular.module('photomapApp')
  .controller('UploadCtrl',['$scope','$location','$upload','$cookieStore', function ($scope,$location,$upload,$cookieStore) {

    var headers = {};
    var session = $cookieStore.get("session");
    var user;
    if(session){
      headers["x-authid"] = session["userid"];
      headers["x-auth"] = session["authtoken"];
      user = session["userid"];
    }else{
      $location.url("/login");
    }

    var mq_url      = ServiceConfig.amq;
    var ws = new SockJS(mq_url);
    var client = Stomp.over(ws);
    client.heartbeat.outgoing = 0;
    client.heartbeat.incoming = 0;
    client.debug = function() {
      if (window.console && console.log && console.log.apply) {
        console.log.apply(console, arguments);
      }
    };

    function on_connect(){
      console.log("connected");
    }

    function on_error(err) {
      console.log("connection failed " , err);
    }

    function on_message(m) {
      console.log('message received',m);
      m = JSON.parse(m.body);
      if(m.Status === "complete" || m.Status === "error"){
        $scope.progress = 100;
      }else {
        $scope.progress += 10;
      }
      $scope.progressMessage = m.Message + " " + $scope.progress;
      $scope.$apply();
    }

    if(client){
      try {
        client.disconnect()
      }catch(e){

      }
      client.connect('webclient', 'secret', on_connect, on_error, '/');
    }



    $scope.onFileSelect = function($files) {
      $scope.progress = 0;
      $scope.$apply();

      //$files: an array of files selected, each file has name, size, and type.
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];
        console.log("file",file);
        client.subscribe('/topic/picjob.update.'+user + file.name, on_message);
        $scope.upload = $upload.upload({
          url: ServiceConfig.api +'file/upload', //upload.php script, node.js route, or servlet url
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
