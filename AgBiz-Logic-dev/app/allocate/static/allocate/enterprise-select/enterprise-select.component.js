(function() {
  'use strict';

  angular
    .module("allocateModule")
    .component("enterpriseSelect", {
      templateUrl: "/static/allocate/enterprise-select/enterprise-select.component.html",
      controller: EnterpriseSelectComponentController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  EnterpriseSelectComponentController.$inject = [
    '$scope',
    '$state',
    '$q',
    '$interval',
    'allocateService',
    'commonService',
    '$uibModal',
  ];

  function EnterpriseSelectComponentController(
    $scope,
    $state,
    $q,
    $interval,
    allocateService,
    commonService,
    $uibModal) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.addEnterpriseData = addEnterpriseData;
    $ctrl.removeEnterpriseData = removeEnterpriseData;
    $ctrl.back = back;
    $ctrl.saveEnterprises = saveEnterprises;

    // User
    $ctrl.user;

    // Selection
    $ctrl.enterprises_allowed = true;
    $ctrl.business_data_list;
    $ctrl.enterprise_data_list;
    $ctrl.commodities;
    $ctrl.enterprise = {};
    $ctrl.allowed_enterprises = [];
    $ctrl.enterprise_limit = 7;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      commonService.retrieveCurrentUser()
      .then(function(current_user_response) {
        $ctrl.user = current_user_response.data;

        return allocateService.listBusinessData($ctrl.user.username);
      })
      .then(function(business_data_list_response) {
        $ctrl.business_data_list = business_data_list_response.data;
      })
      .then(function() {
        return allocateService.listEnterpriseData($ctrl.user.username);
      })
      .then(function(enterprise_data_list_response) {
        $ctrl.enterprise_data_list = enterprise_data_list_response.data;
        $ctrl.allowed_enterprises = setAllowedEnterprises($ctrl.business_data_list, $ctrl.enterprise_data_list);
        return commonService.listCommodities();
      })
      .then(function(commodities_response) {
        $ctrl.commodities = commodities_response.data;

        return commodities_response;
      })
      .then(function() {
        if ($ctrl.business_data_list.length == 0) {
          $state.go("home");
        }
      });
    }


    function addEnterpriseData() {
      if ($ctrl.enterprise.enterprise != undefined &&
          $ctrl.enterprise.category_1 != undefined &&
          $ctrl.enterprise.market != undefined) {
        startProgress(1);

        $ctrl.enterprise = buildNewEnterpriseData();
        allocateService.createEnterpriseData($ctrl.enterprise)
        .then(function() {
          $ctrl.enterprise = {};

          return allocateService.listEnterpriseData($ctrl.user.username);
        })
        .then(function(enterprise_data_list_response) {
          $ctrl.enterprise_data_list = enterprise_data_list_response.data;
          $ctrl.allowed_enterprises = setAllowedEnterprises($ctrl.business_data_list, $ctrl.enterprise_data_list);
        });
      }
    }


    function removeEnterpriseData(enterprise_data) {
      if (enterprise_data != undefined &&
        enterprise_data.id !== undefined &&
        enterprise_data.id > 0) {
        startProgress(1);

        allocateService.destroyEnterpriseData(enterprise_data.id)
        .then(function() {
          return allocateService.listEnterpriseData($ctrl.user.username);
        })
        .then(function(enterprise_data_list_response) {
          if (enterprise_data_list_response !== undefined &&
              enterprise_data_list_response.data !== undefined) {
            $ctrl.enterprise_data_list = enterprise_data_list_response.data;
            $ctrl.allowed_enterprises = setAllowedEnterprises($ctrl.business_data_list, $ctrl.enterprise_data_list);
          }
        });
      }
    }


    function back() {
      $state.go("businessAllocate");
    }


    function saveEnterprises() {
      if ($ctrl.enterprise_data_list.length > 0) {
        var i=0;
        $ctrl.allowed_enterprises.forEach(function(enterprises)  {
          if (enterprises.count==0){
            i=i+1;
          }
        });

        if (i!=0){
          var allowed_enterprises_list = [];
          var current_enterprises_list = [];
          var needed_enterprises_list = [];

          $ctrl.allowed_enterprises.forEach(function(obj){
            allowed_enterprises_list.push(obj.business_type);
          });

          $ctrl.enterprise_data_list.forEach(function(obj){
            current_enterprises_list.push(obj.enterprise);
          });
          needed_enterprises_list = $(allowed_enterprises_list).not(current_enterprises_list).get();

          var modal = $uibModal.open({
            animation: true,
            templateUrl: 'static/allocate/enterprise-select/enterprise-select-error-modal/enterprise-select-error-modal.html',
            controller: 'EnterpriseErrorModalController',
            controllerAs: '$ctrl',
            resolve: {
              enterprises: function () {
                return needed_enterprises_list;
              },
            },
          });
        }else if (i==0) {
          $state.go("enterpriseAllocate");
        }
      }
    }




    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Sets the attributes of the new EnterpriseData object using the values
        from the JSON file.
    */
    function buildNewEnterpriseData() {
      var new_enterprise = {
        'enterprise': $ctrl.enterprise.enterprise,
        'category_1': $ctrl.enterprise.category_1.name,
        'category_2': $ctrl.enterprise.category_2 != undefined ? $ctrl.enterprise.category_2.name : "",
        'category_3': $ctrl.enterprise.category_3 != undefined ? $ctrl.enterprise.category_3.name : "",
        'category_4': $ctrl.enterprise.category_4 != undefined ? $ctrl.enterprise.category_4.name : "",
        'category_5': $ctrl.enterprise.category_5 != undefined ? $ctrl.enterprise.category_5.name : "",
        'market': $ctrl.enterprise.market.name,
      };

      return new_enterprise;
    }


    /*
        Returns an array containing the enterprise type's whose number of EnterpriseData objects is less than the limit.
    */
    function setAllowedEnterprises(business_data_list, enterprise_data_list) {
      var enterprises = business_data_list.map(function(business_data) {
        return {
          'business_type': business_data.business_type,
          'count': 0,
        };
      });

      enterprise_data_list.forEach(function(enterprise_data) {
        enterprises.forEach(function(enterprise) {
          if (enterprise.business_type == enterprise_data.enterprise) {
            enterprise.count++;
          }
        });
      });

      var allowed_enterprises = enterprises.filter(function(enterprise) {
        return enterprise.count < $ctrl.enterprise_limit;
      });

      return allowed_enterprises;
    }


    /*
        Faux progress method.  Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function() {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }
  }

}());
