var app = angular.module("myApp", ["ngMaterial"]);
app.controller("q_registController", function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, $interval, $filter, globalSetting) {
  var vm = this;
  // $scope.token = $location.search()["token"];
  // $scope.orguid = $location.search()["orguid"];
  // console.log($scope.token);
  // console.log($scope.site);

  // $scope.token = '1234';
  // $location.url($location.path());
  // vm.show_month = false;
  // vm.lba_btn = "Monthly";
  // $scope.changechart = changechart;
  // $scope.refreshdata = refreshdata;
  // $scope.mlabel = "DASHBOARD";
  var today = new Date();
  // var today = new Date(Date.now() - 8.64e7);
  // $scope.dtp = {
  //   // value: new Date(today.getFullYear(), today.getMonth(), 1)
  //   value: today
  // };
  // $scope.dtp2 = {
  //   value: today
  // };
  // var tick = function () {
  //   $scope.clock = new Date();
  // };
  // tick();
  // $interval(tick, 1000);
  $scope.findopd = findopd;
  $scope.get_hn = get_hn;
  $scope.fourdigit = fourdigit;
  $scope.detail_hn = detail_hn;
  $scope.resetvm = resetvm;
  $scope.refreshpage = refreshpage;
  $scope.save_rec = save_rec;
  $scope.referto = referto;
  $scope.listdep = listdep;
  // $scope.each_hosp = each_hosp;
  // $scope.findorgname = findorgname;
  // $scope.toggleLeft = buildToggler("left");
  // $scope.toggleRight = buildToggler("right");
  // $scope.hidepage = true;

  getOrguid();
  resetvm();

  function getOrguid() {
    $http.get('/org-config').then(function (success) {
      var orgSite = success.data.org
      $scope.orguid = globalSetting.setting.orguid[orgSite];
      $scope.iip = globalSetting.setting.url[orgSite];
      $scope.vatnuser = globalSetting.setting.vatnuser[orgSite];
      listdep();
      findopd();
    })
  }

  function refreshpage() {
    findopd();
  }

  function fourdigit(params) {
    return params.slice(-4);
  }

  function detail_hn(params) {
    vm.findhn = true;
    $scope.selectopd = params;
  }

  function referto(params) {
    vm.department = params;
    vm.title1 = 'ส่งไป :';
    vm.selectcase = true;
  }

  function findopd() {
    $http
      .post("/centrix_q/q_regist", {
        orguid: $scope.orguid,
        visitdate: today,
      })
      .success(function (data) {
        if (data && data.data.length > 0) {
          $scope.opd = data.data;

          $http
            .post("/local_host/findtransaction", {
              orguid: $scope.orguid,
              registdate: today,
            })
            .success(function (data) {
              if (data && data.data.length > 0) {
                $scope.transaction = data.data;
                console.log("$scope.transaction", $scope.transaction);
                for (var i = 0; i < $scope.opd.length; i++) {
                  for (var ii = 0; ii < $scope.transaction.length; ii++) {
                    if ($scope.opd[i].AN == $scope.transaction[ii].AN) {
                      $scope.opd[i].recq_regist = true;
                    }
                  }
                }

              } else {

              }
            });
          console.log("$scope.opd", $scope.opd);
          // async.waterfall([
          //   function get3(callback) {


          //     callback();
          //   },
          // ], function (
          // ) {

          // })
        }
      });
  }

  function listdep() {
    $http
      .post("/local_host/finddepartment", {
        orguid: $scope.orguid,
      })
      .success(function (response) {
        $scope.department = response.data;
        console.log("$scope.department", $scope.department);
      });
  }

  function save_rec(department, patient) {
    console.log(department);
    console.log(patient);
    $http
      .post("/local_host/savetransaction", {
        orguid: $scope.orguid,
        department: department,
        patient: patient,
      })
      .success(function (data) {
        vm.findhn = false;
        resetvm();
        findopd();
        // $scope.txt_savedep = "Save data ready";
      });

  }

  function get_hn(AN) {

    console.log(AN);
    $http
      .post("/centrix_q/findopd_byHN", {
        orguid: $scope.orguid,
        visitdate: today,
        AN: AN,
      })
      .success(function (data) {
        if (data && data.data.length > 0) {
          $scope.opd = data.data;
          // console.log("$scope.selectopd", $scope.selectopd);
        } else {
        }
      });
  }

  function resetvm() {
    vm.department = '';
    vm.title1 = '';
    vm.selectcase = false;
    vm.qnumber='';
  }

});