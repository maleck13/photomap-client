'use strict';

angular.module('photomapApp')
  .controller('MainCtrl', ['$scope','Pictures','uiGmapGoogleMapApi','$cookieStore','$geolocation',function ($scope,Pictures,GoogleMapApi,$cookieStore,$geolocation) {

    $geolocation.getCurrentPosition().then(function(location) {
      $scope.location = location
    });

    $scope.map = {
      center: {
        latitude:52 ,
        longitude: -7.2
      },
      zoom: 2
    };

    $scope.$watch('location', function (newValue, oldValue) {
      console.log("position changed", newValue);
        if(newValue) {
          $scope.map = {
            center: {
              latitude: newValue.coords.latitude,
              longitude: newValue.coords.longitude
            },
            zoom: 7
          };
        }
    }, true);


    $scope.markers = [];

    $scope.years = {
      min: Number(1990),
      max: Number(2015)
    };

    $scope.quantity = 7;

    $scope.months = {
      min: 1,
      max: 12,
      from: 1,
      to : moment().get("month") +1
    };

    Pictures.getYearRange(function (err,ok){

      if(err){
        console.log("err ",err);
        return;
      }
      ok.sort();

      console.log("range", ok);

      if(ok.length > 0) {
        $scope.years = {
          min: Number(ok[0]),
          max: Number(ok[ok.length - 1]),
          from: Number(ok[0]),
          to: Number(ok[ok.length - 1])
        }
      }
    });

    function getPicsInRange(from,to){
      if(! from || ! to) return;

      Pictures.getPicturesInRange(from,to,function (err,ok){
        var sessionId;
        var uid;
        if($cookieStore) {
          var session = $cookieStore.get("session");
          console.log("session ", session);
          if(session){

            sessionId = session["authtoken"];
            uid = session["userid"];
          }

        }
        $scope.markers = [];
        console.log("total pics ", ok.length);//need paging of some kind
        var len = ok.length > 30 ? 30 : ok.length;
        for(var i=0; i < len; i++ ){
          var it = ok[i];
          console.log(it);
          $scope.markers.push({
            "latitude":it.LonLat[1],
            "longitude":it.LonLat[0],
            "title": it.Name,
            "year": it.Year,
            "lon": it.LonLat[0],
            "lat": it.LonLat[1],
            "thumb": ServiceConfig.api + "picture?file="+it.Img + "&sessid=" + sessionId +"&userid=" + uid + "&id="+it._id,
            "id":i,
            "date":moment.utc(it.TimeStamp * 1000).format('YYYY-MM-DD'),
            "show":false,
            "options":{"content":"test" + i},
            handleMarkerClick: function(gMarker,eventName, model){
              console.log("I was clicked", model);
             // gMarker.icon = model.thumbImg;
              model.show = !model.show;


            }
          });
        }
      });
    }

    var fromYear = 2011;
    var toYear;
    var fromMonth =1;
    var toMonth=12;
    var fromDate;
    var toDate;

    function  getToDate(){
      if(! toYear) toYear = $scope.years.max;
      var to = toYear + "/"+toMonth+"/"+ "30";
      console.log("to year", to);
      var t = moment(to);
      toDate = t.endOf("month");
      toDate = toDate.unix();
      console.log("to date ", toDate);
    }

    function getFromDate(){
      var from = fromYear + "/"+fromMonth+"/"+"01";
      console.log("from date ", from);
      fromDate = moment(from).unix();
      console.log("from date ", fromDate);
    }

    $scope.markerControl = {};

    $scope.thumbClick = function (){
      console.log("clicked " , this.$index, $scope.markerControl.getPlurals());
      var marker = $scope.markerControl.getPlurals().get(this.$index);
      console.log(marker);
      new google.maps.event.trigger( marker.gObject, 'click' );
      $scope.map.center.latitude = marker.clonedModel.latitude;
      $scope.map.center.longitude = marker.clonedModel.longitude;
      $scope.map.zoom = 10;
    };

    $scope.imgClick = function (){
      console.log("clicked img");
    }

    $scope.$watch('years.from', function() {
      console.log('hey, myVar has changed!', this);
      if(this.last) {
        var prev = fromYear;
        fromYear = this.last;
        if(Number(prev) === Number(fromYear)) return;

        console.log("from year changed requesting pics ", prev, fromYear)
        getFromDate();
        getToDate();

        getPicsInRange(fromDate,toDate)
      }

    });

    $scope.$watch('years.to', function() {
      console.log('hey, myVar has changed!', this);
      if(this.last) {
        var current = toYear;
        toYear = this.last;
        if(Number(current) == Number(toYear))return;

        console.log("year changed requesting pics ", current, toYear)
        getToDate();
        getFromDate();
        getPicsInRange(fromDate,toDate)
      }
    });


    $scope.$watch('months.to', function (){
      console.log('hey, myVar has changed!', this);
      if(this.last) {
        var oldMonth = toMonth;
        toMonth = this.last;
        if(Number(toMonth) === Number(oldMonth)) return;
        getToDate();
        getFromDate();
        getPicsInRange(fromDate,toDate);
      }
    });

    $scope.$watch('months.from', function (){
      console.log('hey, myVar has changed!', this);
      if(this.last) {
        var oldMonth = fromMonth;
        fromMonth = this.last;
        if(Number(fromMonth) === Number(oldMonth)) return;

        getToDate();
        getFromDate();
        console.log('hey, myVar has changed! from to ', fromDate);
        getPicsInRange(fromDate,toDate);
      }
    });

    GoogleMapApi.then(function(maps){
      console.log("maps ready", maps);


    });



}]);
