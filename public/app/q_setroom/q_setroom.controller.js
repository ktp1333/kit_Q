var app = angular.module('myApp', ['ngMaterial']);
app.controller('q_setroomController', function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, globalSetting) {
    var vm = this;

    getOrguid();

 
    $scope.initdata = initdata;
    $scope.formToggle=formToggle;
    $scope.saveroom = saveroom;
    $scope.listroom = listroom;
    // $scope.deleteroom = deleteroom;
    // $scope.updateroom = updateroom;
    $scope.listdep = listdep;
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
            initdata();
        })
    }


    function initdata() {
        listdep();
        listroom();
    }

    function listdep() {
        $http.post('/local_host/finddepartment', {
            orguid: $scope.orguid,
        }).success(function (response) {
            $scope.department = response.data;
            console.log('$scope.department', $scope.department);
            //   vm.R1 = true;
        });
    }

    function listroom() {
        $http.post('/local_host/findroom', {
            orguid: $scope.orguid,
        }).success(function (data) {
            $scope.rooms = data.data;
            for (var i = 0; i < $scope.rooms.length; i++) {
                $scope.rooms[i].NO = i + 1;
            }
            // document.location.href = '#top';
            console.log($scope.rooms);
            $scope.commandeditForm = false;
            $scope.commandform = false;
        });
    }


    function clearcontent(commandinfo) {
        commandinfo.room = "";
        commandinfo.Qno = "";
    }

    $scope.show_form = true;

    function formToggle() {
        $('#commandform').slideToggle();
        $('#command_editForm').css('display', 'none');
    }
    function saveroom(info,department) {
        console.log(info.room);
        console.log(department);
        $http
          .post("/local_host/saveroom", {
            orguid: $scope.orguid,
            department: department,
            room: info.room,

          })
          .success(function (data) {
            $('#commandform').css('display', 'none');
            clearcontent(info);
            listroom();
          });
      }


    $scope.currentUser = {};
    $scope.editcommand = function (command) {
        $scope.currentUser = command;
        $('#commandform').slideUp();
        $('#commandeditForm').slideToggle();
        document.location.href = '#top';
    }

 

    $scope.deletecommand = function (command) {
        $http.post('/local_host/delete_room', {
            orguid: $scope.orguid,
            "ID": command._id
            // "room": command.room
        }).success(function () {
            listroom();
        });
    }
    $scope.cancelMsg = function (ID) {
        $('#commandeditForm').css('display', 'none');
    }
    $scope.Updatecommand = function (command) {
        $http.post('/local_host/saveroom', {
            "ID": command._id,
            "orguid": $scope.orguid,
            "department": command.department,
            "room": command.room,

        }).success(function (data) {

            $('#commandform').css('display', 'none');
            $('#commandeditForm').css('display', 'none');
            listdepartment();
        });


    }
})