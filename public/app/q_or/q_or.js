var app = angular.module("myApp", ["ngMaterial"]);
app.controller("q_orController", function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, $interval, $filter, globalSetting) {
  var vm = this;
  vm.department = $location.search()["dep"];
  $scope.tabIndex = 0;
  // vm.department = $location.search()["dep"];
  // console.log(vm.department);
  var classControl = {
    'Waiting Area': 'content-yellow',
    'In OR': 'content-green',
    'Transfer to Ward': 'content-blue',
    'Transfer to OPD/ER': 'content-blue',
    'PACU': 'content-green'
  };


  // var today = new Date('12/10/2021');
  var today = new Date();

  $scope.listor = listor;
  $scope.displayListOr = [];

  getOrguid();

  function getOrguid() {
    $http.get('/org-config').then(function (success) {
      var orgSite = success.data.org
      $scope.orguid = globalSetting.setting.orguid[orgSite];
      $scope.iip = globalSetting.setting.url[orgSite];
      console.log($scope.orguid);
      listor();
    })
  }


  function listor() {

    $scope.tabIndex = 0;
    $http.post('/centrix_q/findcaseor', {
      orguid: $scope.orguid,
      visitdate: today,
    }).success(function (response) {
      $scope.orcase = response.data;
      var tmpData = Object.assign([], $scope.orcase);
      var resultDisplay = [];
      var isprocess = true;
      while (isprocess) {
        resultDisplay.push(tmpData.splice(0, 5));
        if (!tmpData.length) {
          isprocess = false;
        }
      }
      $scope.displayListOr = resultDisplay;

      vm.R1 = true;

      async.timesSeries(resultDisplay.length, (n, cb) => {
        $scope.tabIndex = n;
        $timeout(() => {
          console.log($scope.tabIndex);
          cb();
        }, 15000);
      }, err => {
        listor();
      });

    });
  }


  function fourdigit(params) {
    return params.slice(-4);
  }

  vm.displaySecureName = function (nameString) {

    var result = "";
    var arrTarget = nameString.split(' ');
    if (arrTarget.length > 1) {

      for (let index = 0; index < arrTarget.length; index++) {
        if (index == 0) {
          arrTarget[index] = arrTarget[index].slice(0, 8);
          arrTarget[index] += "....";
        }
        else if (arrTarget[index]) {
          arrTarget[index] = arrTarget[index].slice(0, 4);
          arrTarget[index] += "....";
        }

      }

      result = arrTarget.join(' ');
    }
    else {
      result = nameString;
    }

    return result;
  }


});