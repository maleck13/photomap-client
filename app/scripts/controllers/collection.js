'use strict';

angular.module('photomapApp')
  .controller('CollectionCtrl', ["$scope","Lightbox","$cookieStore","Pictures","uiGmapGoogleMapApi",function ($scope,Lightbox,$cookieStore,Pictures,GoogleMapApi) {

    var session = $cookieStore.get("session");
    var sessionId;
    var uid;
    if(session){

      sessionId = session["authtoken"];
      uid = session["userid"];
    }
    GoogleMapApi.then(function(maps){
      $scope.googleMaps = maps;

    });

    $scope.images= [];
    $scope.years = [];
    $scope.byLoc = false;
    $scope.rotateStyle = "<style type='text/css'> #5564dd07221cc40001000001{ -webkit-transform: rotate(270deg); \n -moz-transform: rotate(270deg);  \n -ms-transform: rotate(270deg); \n -o-transform: rotate(270deg); \n transform: rotate(270deg);} </style>";

    $scope.getMissingData = function (){
      console.log("getMissingData");
      reset();
      Pictures.getMissingDataPics(function (err, ok){
        console.log("pics missing data", err, ok);
        gatherImages(ok);


      });
    };

    function gatherImages(images){
      images.forEach(function (it, i){
        $scope.images.push({
          'url': ServiceConfig.api + "picture?file="+it.Img+"&sessid=" + sessionId +"&userid=" + uid + "&id="+it._id,
          'thumbUrl':ServiceConfig.api + "picture?"+it.Img+"&sessid=" + sessionId +"&userid=" + uid + "&id="+it._id,
          'title':it.Name,
          'caption':"",
          "id":it._id,
          "lon": it.LonLat[0],
          "lat": it.LonLat[1],
          "tags":it.Tags,
          "date":moment(it.TimeStamp * 1000).format("YYYY/MM/DD"),
          "year":it.Year,
          "complete":it.Complete,
          "index":i
        });
      });
    }

    function reset(){
      $scope.years = [];
      $scope.images = [];
      $scope.byLoc = false;
    }


    $scope.getYearRange = function(){
      reset();
      Pictures.getYearRange(function (err,years){
        console.log(err, years);
        $scope.years = years;
      });

    };


    $scope.codeAddress = function (index,address, cb) {
      var geocoder = new $scope.googleMaps.Geocoder();
      geocoder.geocode( { 'address': address}, function(results, status) {
        console.log("results geocode ", results);
        if (status == $scope.googleMaps.GeocoderStatus.OK) {
          var lat = results[0].geometry.location.lat();
          var lon = results[0].geometry.location.lng();
          console.log(results[0].geometry.location);
          console.log(results[0].geometry.location.lat());
          console.log(results[0].geometry.location.lng());
          console.log("images ", $scope.images);
          cb(undefined,results[0].geometry.location);
          //$scope.map.marker.latitude = results[0].geometry.location.lat();
          //$scope.map.marker.longitude = results[0].geometry.location.lng();
        } else {
          cb();
          alert('Geocode was not successful for the following reason: ' + status);

        }
      });
    };

    $scope.getPhotosForYear = function (year){
      reset();
      console.log(year);
      var from = year + "-01-01";
      var to = year + "-12-31";
      var fStamp = moment(from).unix();
      var tStamp = moment(to).unix();
      Pictures.getPicturesInRange(fStamp,tStamp, function (err, pics){
        console.log("pics fromto ", pics);
        gatherImages(pics);
      });
    };

    $scope.updateImg = function (id){

      var self = this;
      var lonLat = [];
      var params = self.Lightbox.image;
      params.lonLat = lonLat;
      if(params.address){
        $scope.codeAddress(params.index,params.address, function(err,location){
          params.lonLat = [];
          params.lonLat[0] = location.lng();
          self.Lightbox.image.lon =  location.lng();
          params.lonLat[1] = location.lat();
          updateImgMeta(id,params);
        });
      }else {
        updateImgMeta(id, params);
      }
      return;
    };

    $scope.byLocation = function (){
      console.log("bylocation");
      reset();
      $scope.byLoc = true;
    };

    function updateImgMeta(id, params){
      var payload = {
        "name":params.title,
        "tags":params.tags,
        "location": params.lonLat,
        "time":moment(self.time).unix(),
        "year":params.year,
        "complete":params.complete
      };

      Pictures.updateMeta(id,payload, function (err, ok){
        console.log("update ", err, ok);
      });
    }

    //$scope.images = [{
    //  'url': ServiceConfig.api + "picture?file=IMG_0146.jpg&sessid=" + sessionId +"&userid=" + uid,
    //  'thumbUrl':ServiceConfig.api + "picture?file=IMG_0146.jpg&sessid=" + sessionId +"&userid=" + uid,
    //  'caption': 'This image has dimensions 2272x1704 and the img element is scaled to fit inside the window. The left and right arrow keys are binded for navigation. The escape key for closing the modal is binded by AngularUI Bootstrap.',
    //  'title':"test"
    //
    //}];

    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.images, index);
    }
  }]);

//NOTE add directive for rotating the image.
