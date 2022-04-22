var app = angular.module("myApp", ["ngMaterial"]);
app.controller("q_lcd_erController", function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, $interval, $filter, globalSetting) {
    var vm = this;
    vm.department = $location.search()["department"];
    console.log(vm.department);
    var today = new Date('12/08/2021');
    // var today = new Date(Date.now() - 8.64e7);
    // $scope.dtp = {
    //   // value: new Date(today.getFullYear(), today.getMonth(), 1)
    //   value: today
    // };
    // var tick = function () {
    //   $scope.clock = new Date();
    // };
    // tick();
    // $interval(tick, 1000);
    // $scope.findopd = findopd;
    // $scope.get_hn = get_hn;
    // $scope.fourdigit = fourdigit;
    // $scope.detail_hn = detail_hn;
    // $scope.resetvm = resetvm;
    // $scope.refreshpage = refreshpage;
    // $scope.save_rec = save_rec;
    $scope.findtransactionER = findtransactionER;
    vm.findhn = false;
    // $scope.callpt = callpt;
    getOrguid();
    // resetvm();

    function getOrguid() {
        $http.get('/org-config').then(function (success) {
            var orgSite = success.data.org
            $scope.orguid = globalSetting.setting.orguid[orgSite];
            $scope.iip = globalSetting.setting.url[orgSite];
            $scope.vatnuser = globalSetting.setting.vatnuser[orgSite];
            // listdep();
            findtransactionER();
        })
    }

    function findtransactionER() {
        $http.post("/local_host/findtransactionER", {
            orguid: $scope.orguid,
            registdate: today,
            department: vm.department
        }).success(function (data) {
            if (data && data.data.length > 0) {
                $scope.transactionER = data.data;
                console.log("$scope.transactionER", $scope.transactionER);
            } else {

            }
        });
    }

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

    // function refreshpage() {
    //     findopd();
    // }

    // function fourdigit(params) {
    //     return params.slice(-4);
    // }

    // function detail_hn(params) {
    //     vm.findhn = true;
    //     $scope.selectopd = params;
    // }

    // function callpt(patient) {
    //     console.log(patient);
    //     $http
    //         .post("/local_host/savestatusER", {
    //             orguid: $scope.orguid,
    //             recq_er: 1,
    //             patient: patient,
    //             // department: patient.department,
    //         })
    //         .success(function (data) {
    //             findtransactionER();
    //         });
    // }


    // function findopd() {
    //     $http
    //         .post("/centrix_q/q_ertriage", {
    //             orguid: $scope.orguid,
    //             visitdate: today,
    //         })
    //         .success(function (data) {
    //             if (data && data.data.length > 0) {
    //                 $scope.er = data.data;
    //                 console.log("$scope.er", $scope.er);
    //                 for (var i = 0; i < $scope.er.length; i++) {
    //                     save_rec($scope.er[i])
    //                 }
    //                 resetvm();
    //                 findtransactionER();
    //             }
    //         });
    // }

    // function save_rec(patient) {
    //     // console.log(patient);
    //     $http
    //         .post("/local_host/savetransactionER", {
    //             orguid: $scope.orguid,
    //             department: vm.department,
    //             patient: patient,
    //         })
    //         .success(function (data) {
    //             vm.findhn = false;

    //             // $scope.txt_savedep = "Save data ready";
    //         });

    // }

    // function get_hn(fourdigit) {

    //     console.log(fourdigit);

    //     $http
    //         .post("/local_host/findcase_by4digit", {
    //             orguid: $scope.orguid,
    //             visitdate: today,
    //             fourdigit: fourdigit,
    //         })
    //         .success(function (data) {
    //             if (data && data.data.length > 0) {
    //                 $scope.finder = data.data;
    //                 console.log("$scope.finder", $scope.finder);
    //             } else { }
    //         });
    // }

    // function resetvm() {

    //     vm.title1 = '';
    //     vm.selectcase = false;
    //     vm.qnumber = '';
    // }

});