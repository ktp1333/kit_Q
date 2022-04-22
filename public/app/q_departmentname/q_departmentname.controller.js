var app = angular.module('myApp', ['ngMaterial']);
app.controller('q_departmentnameController', function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, globalSetting) {
    var vm = this;
    getOrguid();
    $scope.formToggle=formToggle;
    $scope.savedepartment = savedepartment;
    $scope.listdepartment = listdepartment;
    $scope.getOrguid = getOrguid;
    var today = new Date();

    $scope.dtp = {
        // value: new Date(today.getFullYear(), today.getMonth(), 1)
        value: today
    };
    $scope.dtp2 = {
        value: today
    };
    $scope.todaydate = new Date();

    $scope.showright = 'N'
    function getOrguid() {
        $http.get('/org-config').then(function (success) {
            var orgSite = success.data.org
            $scope.orguid = globalSetting.setting.orguid[orgSite];
            $scope.iip = globalSetting.setting.url[orgSite];
            listdepartment();
        })
    }
    function listdepartment() {
        $http.post('/local_host/finddepartment', {
            orguid: $scope.orguid,
        }).success(function (data) {
            $scope.department = data.data;
            // for (var i = 0; i < $scope.department.length; i++) {
            //     $scope.department[i].NO = i + 1;
            // }
            // document.location.href = '#top';
            // console.log($scope.department);
            // $scope.commandeditForm = false;
            $scope.commandform = false;
        });
    }
    function clearcontent(commandinfo) {
        commandinfo.department = "";
        commandinfo.pwd = "";
        commandinfo.displayorder= "";
        commandinfo.group= "";
    }
    $scope.show_form = true;

    function formToggle() {
        $('#commandform').slideToggle();
        $('#command_editForm').css('display', 'none');
    }
    function savedepartment(pwd,department,group,displayorder) {
        console.log(pwd);
        console.log(department);
        if (department && department!='') {
        $http
          .post("/local_host/savedep", {
            orguid: $scope.orguid,
            department: department,
            pwd: pwd,
            "group": group,
            "displayorder": displayorder,
          })
          .success(function (data) {
            $('#commandform').css('display', 'none');
            clearcontent(info);
            listdepartment();
          });
        }
      }
    $scope.currentUser = {};
    $scope.editcommand = function (command) {
        vm.dep = command;
        console.log(vm.dep);
        $('#commandform').slideUp();
        $('#commandeditForm').slideToggle();
        document.location.href = '#top';
    }
    $scope.deletecommand = function (command) {
        $http.post('/local_host/delete_department', {
            orguid: $scope.orguid,
            "ID": command._id
            // "department": command.department
        }).success(function () {
            listdepartment();
        });
    }
    $scope.cancelMsg = function (ID) {
        $('#commandeditForm').css('display', 'none');
    }
    $scope.Updatecommand = function (command) {
        $http.post('/local_host/savedep', {
            "ID": command._id,
            "orguid": $scope.orguid,
            "department": command.department,
            "pwd": command.pwd,
            "group": command.group,
            "displayorder": command.displayorder,
        }).success(function (data) {

            $('#commandform').css('display', 'none');
            $('#commandeditForm').css('display', 'none');
            listdepartment();
        });


    }
})






