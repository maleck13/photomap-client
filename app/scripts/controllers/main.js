'use strict';

angular.module('photomapApp')
  .controller('MainCtrl', ['$scope','Pictures','GoogleMapApi'.ns(),'$cookieStore',function ($scope,Pictures,GoogleMapApi,$cookieStore) {
    $scope.map = {
      center: {
        latitude: 52,
        longitude: -7.3
      },
      zoom: 8
    };

    $scope.markers = [];

    $scope.years = {
      min: Number(1990),
      max: Number(2014)
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

      var first = Number(ok[0]);
      var last = Number(ok[ok.length -1]);

      //for(var i=0; i < ok.length; i++){
      //  var n =  Number(ok[i]);
      //  if( n < first) first = n;
      //  else if (n > last) last = n;
      //
      //}
      //
      //var index = ok.length;
      //if(ok.length >=2){
      //  index = index -3;
      //}
      //$scope.years = {
      //  min: Number(ok[0]),
      //  max: Number(ok[ok.length -1]),
      //  from:Number(2011),
      //  to:Number(ok[ok.length -1])
      //}
    });

    function getPicsInRange(from,to){
      if(! from || ! to) return;

      Pictures.getPicturesInRange(from,to,function (err,ok){
        var sessionId;
        var uid;
        if($cookieStore) {
          var session = $cookieStore.get("session");
          if(session){

            sessionId = session["sessionId"];
            uid = session["userId"];
          }

        }
        $scope.markers = [];
        console.log("total pics ", ok.length);//need paging of some kind
        var len = ok.length > 30 ? 30 : ok.length;
        for(var i=0; i < len; i++ ){
          var it = ok[i];
          $scope.markers.push({
            "latitude":it.lonlat[1],
            "longitude":it.lonlat[0],
            "title": it.name,
            "year": it.year,
            "lon": it.lonlat[0],
            "lat": it.lonlat[1],
            "thumb": ServiceConfig.api + "picture?file="+it.name + "&sessid=" + sessionId +"&userid=" + uid,
            "id":i,
            "date":moment.utc(it.timestamp, 'X').format('YYYY-MM-DD'),
            "show":false,
            "options":{"content":"test" + i},
            handleMarkerClick: function(gMarker,eventName, model){
              console.log("I was clicked", this, gMarker, model);
             // gMarker.icon = model.thumbImg;
              this.show = !this.show;


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
      var to = toYear + "/12/"+ "30";
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
      if(this.last) {
        var oldMonth = fromMonth;
        fromMonth = this.last;
        if(Number(fromMonth) === Number(oldMonth)) return;

        getToDate();
        getFromDate();
        getPicsInRange(fromDate,toDate);
      }
    });

    GoogleMapApi.then(function(maps){
      console.log("maps ready");


    });



}]);
