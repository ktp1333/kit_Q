var app = angular.module("myApp", ["ngMaterial"]);
app.controller("authenController", function ($scope, $http, globalSetting) {
  $scope.error = "";
  $scope.login = login;
  $scope.show_menu = false;
  $scope.getOrguid = getOrguid;

  // $scope.orguid = globalSetting.setting.orguid;
  getOrguid();

  function getOrguid() {
    $http.get("/org-config").then(function (success) {
      var orgSite = success.data.org;
      $scope.orguid = globalSetting.setting.orguid[orgSite];
      $scope.iip = globalSetting.setting.url[orgSite];
      listdep();
    });
  }

  function listdep() {
    $http
      .post("/local_host/finddepartment", {
        orguid: $scope.orguid,
      })
      .success(function (response) {
        $scope.department = response.data;
        // for (let index = 0; index < $scope.department.length; index++) {
        //     if ($scope.department[index].department == 'จุดคัดกรองชั้น M') {
        //         $scope.department[index].show = false;
        //     } else if ($scope.department[index].department == "จุดคัดกรองผู้ป่วยใหม่จักษุ") {
        //         $scope.department[index].show = false;
        //     } else if ($scope.department[index].department == "จุดตรวจสอบสิทธิ์ชั้น 1") {
        //         $scope.department[index].show = false;
        //     } else {}
        // }
        // vm.R1 = true;
      });
  }

  function login(dep, pwd) {
    console.log(dep);
    console.log(pwd);
    for (let index = 0; index < $scope.department.length; index++) {
      const element = $scope.department[index];
      if (
        $scope.department[index].department == dep &&
        $scope.department[index].pwd == pwd
      ) {
        switch (dep) {
          case "Registration":
            window.location = "/qregist#?dep=" + dep;
            break;

          case "Check point":
            window.location = "/qsit#?dep=" + dep;
            break;
          case "Screen point":
            window.location = "/qscreen#?dep=" + dep;
            break;
          // case 'จุดคัดกรองชั้น M':
          //     window.location = "/qscreen#?dep=" + dep;
          //     break;

          case "OPD":
            window.location = "/qopd#?dep=" + dep;
            break;
          // case 'แผนกกุมารเวชกรรม':
          //     window.location = "/qopd#?dep=" + dep;
          //     break;
          // case 'แผนกอายุรกรรมทั่วไป':
          //     window.location = "/qopd#?dep=" + dep;
          //     break;
          // case 'ห้องตรวจ 9-11 ชั้น 2':
          //     window.location = "/qopd#?dep=" + dep;
          //     break;
          // case 'ห้องตรวจ 6-8 ชั้น 2':
          //     window.location = "/qopd#?dep=" + dep;
          //     break;
          // case 'ห้องตรวจ 1-4 ชั้น 2':
          //     window.location = "/qopd#?dep=" + dep;
          //     break;
          // case 'จุดบริการหน้าห้องตรวจชั้น M':
          //     window.location = "/qopd#?dep=" + dep;
          //     break;
          case "ER":
            window.location = "/qer#?dep=" + dep;
            break;
          case "ห้องยา การเงิน":
            window.location = "/qcashier#?dep=" + dep;
            break;
          case "ห้องยา":
            window.location =
              "/qpharma#?dep=" + dep + "&department=ห้องยา";
            break;
          // case 'ห้องยา การเงินชั้น 1':
          //     window.location = "/qcashier#?dep=" + dep;
          //     break;
          // case 'ห้องยา การเงินชั้น 2':
          //     window.location = "/qcashier#?dep=" + dep;
          //     break;
          // case 'ห้องยา การเงินชั้น 3':
          //     window.location = "/qcashier#?dep=" + dep;
          //     break;

          // case 'ห้องยา ชั้น 1':
          //     window.location = "/qpharma#?dep=" + dep + '&department=ห้องยา การเงินชั้น 1';
          //     break;
          // case 'ห้องยา ชั้น 2':
          //     window.location = "/qpharma#?dep=" + dep + '&department=ห้องยา การเงินชั้น 2';
          //     break;
          // case 'ห้องยา ชั้น 3':
          //     window.location = "/qpharma#?dep=" + dep + '&department=ห้องยา การเงินชั้น 2';
          //     break;
          // case 'ห้องผ่าตัด':
          //     window.location = "/qor#?dep=" + dep + '&department=ห้องผ่าตัด';
          //     break;
          case "OR":
            window.location = "/qor#?dep=" + dep + "&department=ห้องผ่าตัด";
            break;

          default:
            break;
        }
      }
    }
    if (pwd == "admin") {
      window.location = "/qadmin";
    } else if (pwd == "regist") {
      window.location = "/qregist";
    } else if (pwd == "lcd") {
      window.location = "/lcd#?orguid=" + $scope.orguid;
    } else {
      // $http.post('/centrix/find_user', {
      //     "orguid": $scope.orguid,
      //     "loginid": pwd,
      // }).success(function (response) {
      //     // console.log(response);
      //     if (response && response.data.length > 0) {
      //         $scope.user = response.data[0];
      //         console.log('$scope.user');
      //         console.log($scope.user);
      //         $scope.loginid = response.data[0].loginid;
      //         $scope.username = response.data[0].name;
      //         $http.post('/local_host/find_role', {
      //             "loginid": $scope.loginid,
      //             "orguid": $scope.orguid,
      //         }).success(function (response) {
      //             // console.log(response);
      //             if (response && response.data.length > 0) {
      //                 $scope.roles = response.data[0];
      //                 console.log('$scope.roles');
      //                 console.log($scope.roles);
      //                 if ($scope.roles.role == 'depart') {
      //                     window.location = "/choosedep#?orguid=" + $scope.orguid + '&role=' + $scope.roles.role + "&user=" + $scope.username;
      //                 } else if ($scope.roles.role == 'regist') {
      //                     window.location = "/department#?centrixdep=" +
      //                         '' + "&counter=regist" +
      //                         '' + "&orguid=" +
      //                         $scope.orguid + "&multi=" +
      //                         '' + "&role=" + $scope.roles.role +
      //                         "&user=" + $scope.username;
      //                 } else if ($scope.roles.role == 'crm') {
      //                     window.location = "/crm#?orguid=" +
      //                         $scope.orguid + "&role=" +
      //                         $scope.role + "&user=" + $scope.username;
      //                 } else if ($scope.roles.role == 'cashier') {
      //                     window.location = "/department#?centrixdep=" +
      //                         '' + "&counter=cashier" +
      //                         '' + "&orguid=" + $scope.orguid + "&multi=" +
      //                         '' + "&role=" + $scope.roles.role + "&user=" + $scope.username;
      //                 } else if ($scope.roles.role == 'pharma') {
      //                     window.location = "/department#?centrixdep=" +
      //                         '' + "&counter=pharma" +
      //                         '' + "&orguid=" + $scope.orguid + "&multi=" +
      //                         '' + "&role=" + $scope.roles.role + "&user=" + $scope.username;
      //                 } else {}
      //                 // window.location = "/choosedep#?orguid="+$scope.orguid+'&role='+$scope.roles.role;
      //                 // if ($scope.roles.role=='ward') {
      //                 // } else  if ($scope.roles.role=='pharma') {
      //                 // } else  if ($scope.roles.role=='cashier') {
      //                 // } else {
      //                 // }
      //             } else {
      //                 $scope.error = 'loginID incorrect';
      //             }
      //         })
      //     } else {
      //         $scope.error = 'loginID incorrect';
      //     }
      // })
    }

    //     } else {
    //         $scope.error = 'site incorrect';
    //     }
    // })
  }


});
