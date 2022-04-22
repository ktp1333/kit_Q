var app = angular.module("myApp", ["ngMaterial"]);
app.controller("q_sitController", function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, $interval, $filter, globalSetting) {
  var vm = this;
  // vm.department = "จุดตรวจสอบสิทธิ์ชั้น 1";
  vm.department = $location.search()["dep"];
  console.log(vm.department);
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
  $scope.updatestatus = updatestatus;
  $scope.updatestatus_call = updatestatus_call;
  $scope.updatestatus_finish = updatestatus_finish;
  // $scope.refresh_opdbyHN = refresh_opdbyHN;
  $scope.updateroom = updateroom;
  $scope.callpt = callpt;
  vm.roomtxt = false;
  vm.callq = false;
  getOrguid();
  resetvm();

  function getOrguid() {
    $http.get('/org-config').then(function (success) {
      var orgSite = success.data.org
      $scope.orguid = globalSetting.setting.orguid[orgSite];
      $scope.iip = globalSetting.setting.url[orgSite];
      $scope.vatnuser = globalSetting.setting.vatnuser[orgSite]
      listdep();
      findroom(vm.department);
      findopd(vm.department);
    })
  }

  function refreshpage() {
    findopd(vm.department);
  }

  function fourdigit(params) {
    return params.slice(-4);
  }

  function detail_hn(params) {
    resetvm();

    vm.findhn = true;
    $scope.selectopd = params;
    
    console.log('$scope.selectopd', $scope.selectopd);
    if (params.currenttracking.room != '') {
      vm.callq = true;
      vm.roomtxt = true;
      vm.callroom = params.currenttracking.room;
      vm.qno=fourdigit(params.AN);
      // callpt(vm.callroom, vm.qno)
    }

  }

  function findopd(department) {
    $scope.opd = $scope.opd || [];
    $http
      .post("/local_host/q_bydepartment", {
        orguid: $scope.orguid,
        visitdate: today,
        department: department,
      })
      .success(function (data) {
        if (data && data.data.length > 0) {
          var doc1 = data.data;
          vm.mcall = 0;
          vm.mnotseen = 0;
          vm.mhang = 0;
          vm.mfinish = 0;
          vm.mwait = 0;
          for (let index = 0; index < doc1.length; index++) {
            switch (doc1[index].currenttracking.status) {
              case 'รอเรียกคิว':
                vm.mwait = vm.mwait + 1;
                break;
              case 'พักคิว':
                vm.mhang = vm.mhang + 1;
                break;
              case 'ไม่มา':
                vm.mnotseen = vm.mnotseen + 1;
                break;
              case 'คิวเรียก':
                vm.mcall = vm.mcall + 1;
                break;
              case 'เสร็จสิ้น':
                vm.mfinish = vm.mfinish + 1;
                break;
              default:
                break;
            }


          }
          // $scope.opd = _.filter(doc1, function (o) {
          //   return  o.sitstop == ''
          // });
          $scope.opd = doc1;
          // console.log("$scope.opd", $scope.opd);
          // console.log( $scope.selectopd);
          if ($scope.selectopd) {
            var man = $scope.selectopd.AN;
          } else {
            var man = '';
          }
         
          var thispt = _.filter($scope.opd, function (o) {
            return o.AN == man
          });
          $scope.selectopd =thispt[0];
          console.log($scope.selectopd);
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

  function findroom(department) {
    $http.post('/local_host/findroom_bydep', {
      orguid: $scope.orguid,
      department: department,
    }).success(function (response) {
      $scope.room = response.data;
      // console.log($scope.room);
      // for (let index = 0; index < $scope.department.length; index++) {
      //   if ($scope.department[index].department == 'จุดคัดกรองชั้น M') {
      //     $scope.department[index].show = false;
      //   } else if ($scope.department[index].department == "จุดคัดกรองผู้ป่วยใหม่จักษุ") {
      //     $scope.department[index].show = false;
      //   } else {}
      // }
      // vm.R1 = true;
    });
  }

  function listdep() {
    $http.post('/local_host/finddepartment', {
      orguid: $scope.orguid,
    }).success(function (response) {
      $scope.department = response.data;
      console.log('$scope.department',$scope.department);
      for (let index = 0; index < $scope.department.length; index++) {
        if ($scope.department[index].department == 'OPD') {
          $scope.department[index].show = false;
        // } else if ($scope.department[index].department == "Check point") {
        //   $scope.department[index].show = false;
        } else {}
      }
      vm.R1 = true;
    });
  }

  function updateroom(room, patient) {
    // console.log(room);
    // console.log(patient);
    $http
      .post("/local_host/update_room", {
        orguid: $scope.orguid,
        room: room,
        patient: patient,
        department: vm.department
      })
      .success(function (data) {
        vm.roomtxt = true;
        vm.callroom = room;
        console.log('data', data);
        updatestatus('คิวเรียก', patient);

        // $scope.txt_savedep = "Save data ready";
      });
  }

  function updatestatus_call(status, patient) {
    if (status == 'คิวเรียก') {
      if ($scope.room.length < 2) {
        updateroom($scope.room[0].room, patient);
        vm.callq = true;
        vm.roomtxt = true;
      } else {
        vm.callq = true;
        vm.roomtxt = false;
      }

    } else {
      vm.callq = false;
    }
  }

  function updatestatus_finish(status, patient) {
    vm.finish = true;
    vm.status = status;
    vm.pt = patient;

  }

  function updatestatus(status, patient) {
    // console.log(status);
    // console.log(patient);
    if (status != 'คิวเรียก') {
      vm.callq = false;
    }
    vm.pt = patient;
    $http
      .post("/local_host/savestatus", {
        orguid: $scope.orguid,
        status: status,
        patient: patient,
        department: patient.department,
      })
      .success(function (data) {
        vm.thisstatus = status;
        // refresh_opdbyHN(patient.AN);

        // resetvm();

        findopd(vm.department);

        // $scope.txt_savedep = "Save data ready";
      });

  }

  // function refresh_opdbyHN(params) {
  //   console.log(params);
  //   async.waterfall([
  //     function get1(callback) {
  //       $http
  //         .post("/local_host/q_bydepartment", {
  //           orguid: $scope.orguid,
  //           visitdate: today,
  //           department: "Check point",
  //         })
  //         .success(function (data) {
  //           if (data && data.data.length > 0) {
  //             var doc1 = data.data;
  //             vm.mcall = 0;
  //             vm.mnotseen = 0;
  //             vm.mhang = 0;
  //             vm.mfinish = 0;
  //             vm.mwait = 0;
  //             for (let index = 0; index < doc1.length; index++) {
  //               switch (doc1[index].status) {
  //                 case 'รอเรียกคิว':
  //                   vm.mwait = vm.mwait + 1;
  //                   break;
  //                 case 'พักคิว':
  //                   vm.mhang = vm.mhang + 1;
  //                   break;
  //                 case 'ไม่มา':
  //                   vm.mnotseen = vm.mnotseen + 1;
  //                   break;
  //                 case 'คิวเรียก':
  //                   vm.mcall = vm.mcall + 1;
  //                   break;
  //                 case 'เสร็จสิ้น':
  //                   vm.mfinish = vm.mfinish + 1;
  //                   break;
  //                 default:
  //                   break;
  //               }
  //             }
  //             $scope.opd = _.filter(doc1, function (o) {
  //               return o.sitstop == ''
  //             });
  //             // console.log($scope.opd);
  //             callback(null, $scope.opd);
  //           }
  //         });

  //     },
  //     function get2(docs, callback) {
  //       $scope.opd = docs;
  //       console.log(docs);
  //       var doc1 = _.filter(docs, function (o) {
  //         return o.AN == params
  //       });
  //       $scope.selectopd = doc1[0];
  //       // console.log($scope.selectopd);
  //       callback(null, $scope.selectopd);
  //     },
  //   ], function () {})
  // }

  function referto(params, patient) {
    vm.referto = params;
    vm.title1 = 'ส่งไป :';
    vm.selectcase = true;
    vm.pt = patient;
  }

  function save_rec(department, patient, status) {
    console.log(department);
    console.log(patient);
    $http
      .post("/local_host/transaction_finalstage", {
        department: department,
        patient: patient,
        status: status,
      })
      .success(function (data) {
        vm.findhn = false;
        vm.thisstatus = status;
        // refresh_opdbyHN(patient.AN);


        findopd(vm.department);
        resetvm();
        // vm.finish = false;

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
        } else {}
      });
  }

  function resetvm() {
    // vm.department = '';
    vm.title1 = '';
    vm.selectcase = false;
    vm.qnumber = '';
    vm.finish = false;
    vm.callq = false;
    vm.patient = [];
    vm.callroom = '';
  }


  function callpt(roomno, qno) {

      console.log(qno);

     const message =new SpeechSynthesisUtterance();
     const voices = speechSynthesis.getVoices();
     const thVoice = voices.find(voice => voice.lang === "th-TH");
     // const thVoice = voices.find(voice => voice.lang === "en-GB");
     message.voice = thVoice;
     message.text ="ขอเชิญหมายเลข "+qno+'ที่ห้อง'+roomno;
      speechSynthesis.speak(message);


    // var language = "th";//th, en 
    // var queuenumber = qno;
    // var destination = "counter";//room, counter 
    // var destinationnumber = roomno;
    // $http({
    //     method: 'GET',
    //     responseType: 'blob',
    //     url: `http://203.154.49.150:8085/queue/voice/${language}/${queuenumber}/${destination}/${destinationnumber}`,
    //     headers: {
    //         'Content-type': 'audio/mpeg',
    //     }
    // }).then((response) => {
    //     var blob = new Blob([response.data], { type: 'audio/mpeg' });
    //     var blobUrl = URL.createObjectURL(blob);
    //     var audio = new Audio(blobUrl);
    //     setTimeout(() => {
    //         audio.playbackRate = language == "th" ? 1.5 : 1;
    //         audio.play();
    //     }, 1000);
    // });
  }
});