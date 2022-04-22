var app = angular.module('myApp', ['ngMaterial']);
app.controller('q_lcdController', function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, globalSetting) {
  var vm = this;
  getOrguid();
  function getOrguid() {
    $http.get('/org-config').then(function (success) {
      var orgSite = success.data.org
      $scope.orguid = globalSetting.setting.orguid[orgSite];
      $scope.iip = globalSetting.setting.url[orgSite];
      $scope.vatnuser = globalSetting.setting.vatnuser[orgSite];
      initdata();
    })
  }

  $scope.entypeuid = globalSetting.setting.entypeuid_opd;
  $scope.department = $location.search()['department'];
  console.log($scope.department);


  vm.displaySecureName = function (nameString) {

    var result = "";
    var arrTarget = nameString.split(' ');
    if (arrTarget.length > 1) {
      arrTarget[arrTarget.length - 1] = arrTarget[arrTarget.length - 1].slice(0, 4);
      result = arrTarget.join(' ');
    }
    else {
      result = nameString;
    }

    result += '.......';

    return result;
  }

  var today = new Date();

  setInterval(() => {
    // initdata();
  }, 5000);


  function initdata() {
    $scope.opd = null;
    var url = "/local_host/q_bydepartment";

    // if ($scope.department == 'จุดตรวจสอบสิทธิ์ชั้น 1') {
    //   url = "/local_host/q_lcd_sit";
    // }
    // else if ($scope.department == 'จุดคัดกรองชั้น M') {
    //   url = "/local_host/q_screen";
    // }
    // else if ($scope.department == 'จุดคัดกรองชั้น M') {
    //   url = "/local_host/q_screen";
    // }
    // else if ($scope.department == 'จุดคัดกรองชั้น M') {
    //   url = "/local_host/q_screen";
    // }
    // else if ($scope.department == 'จุดคัดกรองชั้น M') {
    //   url = "/local_host/q_screen";
    // }
    // else if ($scope.department == 'จุดคัดกรองชั้น M') {
    //   url = "/local_host/q_screen";
    // }


    $http.post(url, {
      orguid: $scope.orguid,
      visitdate: today,
      department: $scope.department,
    }).success(function (data) {
      if (data && data.data.length > 0) {
        $scope.opd = data.data;
        console.log("$scope.opd", $scope.opd);
      }
    });
  }

})






