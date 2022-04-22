var app = angular.module('myApp', ['ngMaterial']);
app.controller('q_adminController', function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, $filter, globalSetting) {
    var vm = this;
    $scope.getOrguid = getOrguid;

    getOrguid();
    function getOrguid() {
        $http.get('/org-config').then(function (success) {
            var orgSite = success.data.org
            $scope.orguid = globalSetting.setting.orguid[orgSite];
            $scope.iip = globalSetting.setting.url[orgSite];
        })
    }
    $scope.a2 = a2;
    $scope.a3 = a3;
    // $scope.role = role;
    // $scope.a5 = a5;
    // $scope.a6 = a6;
    // $scope.a7 = a7;
    $scope.showmenu = showmenu;
    $scope.right = false;
    //--------------------------------
    var today = new Date();
    var firstday = new Date(moment(today).startOf('month').format());
    $scope.dtp = {
        // value: new Date(today.getFullYear(), today.getMonth(), 1)
        value: today
    };
    $scope.dtp2 = {
        value: today
    };
    $scope.todaydate = new Date();
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }

    setTimeout(function () {
        $scope.toggleLeft();
    }, 1000);

    function showmenu() {
        $scope.toggleLeft();
    }
    // function a1() {
    //     $scope.right = true;
    //     // $scope.getIframeUrl = "/message"
    //     $scope.getIframeUrl = "/message#?orguid=" + $scope.orguid;
    //     // window.location = "/message#?orguid="+$scope.orguid;
    //     $scope.toggleLeft();
    // }
    function a2() {
        $scope.right = true;
        $scope.getIframeUrl = "/qdepartmentname";
        $scope.toggleLeft();
    }
    // function role() {
    //     $scope.right = true;
    //     $scope.getIframeUrl = "/role#?orguid=" + $scope.orguid;
    //     $scope.toggleLeft();
    // }
    function a3() {
        $scope.right = true;
        $scope.getIframeUrl = "/qroom";
        $scope.toggleLeft();
    }
    // function a4() {
    //     $scope.right = true;
    //     $scope.getIframeUrl = "/room_pharma"
    //     $scope.toggleLeft();
    // }
    // function a5() {
    //     $scope.right = true;
    //     $scope.getIframeUrl = "/lcd_txt#?orguid=" + $scope.orguid;
    //     $scope.toggleLeft();
    // }
    // function a6() {
    //     $scope.right = true;
    //     $scope.getIframeUrl = "/message2#?orguid=" + $scope.orguid;
    //     $scope.toggleLeft();
    // }
    // function a7() {
    //     $scope.right = true;
    //     $scope.getIframeUrl = "/zigbee#?orguid=" + $scope.orguid;
    //     $scope.toggleLeft();
    // }


})



