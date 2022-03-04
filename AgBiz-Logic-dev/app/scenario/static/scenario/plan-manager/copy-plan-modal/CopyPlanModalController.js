(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller("CopyPlanModalController", CopyPlanModalController);

  CopyPlanModalController.$inject = [
    "filterFilter",
    "scenarioService",
    "commonService",
    "$uibModalInstance",
    "$state",
    'plan_list',
    'type'
  ];

  function CopyPlanModalController(
    filterFilter,
    scenarioService,
    commonService,
    $uibModalInstance,
    $state,
    plan_list,
    type) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    /****************************************************************
                         Bindable Members
    ****************************************************************/
    // Methods
    vm.$onInit = $onInit;
    vm.selectPlan = selectPlan;
    vm.addNewPlan = addNewPlan;
    vm.Validate = Validate;
    vm.cancel = cancel;

    // Modal
    vm.modal_title;

    // Plans
    vm.plan_list;
    vm.plan = new Object();
    vm.copy_plan = new Object();
    vm.type;
    vm.planTitleArr = [];
    vm.duplicatePlanTitle = false;
    vm.selectedPlan = false;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      vm.modal_title = "Choose Plan to copy";
      vm.plan_list = plan_list;
      vm.type = type;
      retrievePlanNameList();
    }


    function selectPlan(plan) {
      if (plan !== undefined &&
          plan !== null &&
          plan.id !== undefined &&
          plan.id > 0) {
        vm.plan = plan;
        vm.selectedPlan = true;
      }
      else {
        vm.plan = new Object();
        vm.selectedPlan = false;
      }
    }


    function addNewPlan() {
      scenarioService.copyPlan(vm.plan.id, -1)
      .then(function(copy_plan_response) {
        if (copy_plan_response !== undefined &&
            copy_plan_response.data !== undefined &&
            copy_plan_response.data.id !== undefined &&
            copy_plan_response.data.id > 0) {
          vm.copy_plan = copy_plan_response.data;
          vm.copy_plan.created_date = new Date();
          vm.copy_plan.modified_date = new Date();
          vm.copy_plan.title = vm.new_name;
          scenarioService.updatePlan(vm.copy_plan);
          $uibModalInstance.close();
          if (vm.type === 'copy') {
            $state.reload();
          }
          else if (vm.type === 'sensitive_analysis') {
            //scenarioService.retrievePlan(vm.plan.id).then(function(response) {
              $state.go("planSensitiveAnalysis", {'plan': vm.copy_plan.id, 'module': 'profit'});
            //});
          }
        }
      });
    }

    function Validate() {
      vm.duplicatePlanTitle = duplicatePlanTitle(vm.new_name);
    }


    function cancel() {
      $uibModalInstance.dismiss();
    }



    /****************************************************************
                         Private Helper Functions
    ****************************************************************/


    function duplicatePlanTitle(title) {
      var planTitle = document.getElementsByName("planTitle")[0];
      if ( title !== '' && vm.planTitleArr.indexOf(title) === -1 ) {
        planTitle.style.borderColor = "";
        return false;
      } else {
        planTitle.style.borderColor = "red";
        return true;
      }
    }


    function retrievePlanNameList() {
      commonService.retrieveCurrentUser().then(function(response) {
        var current_user = response.data;
        scenarioService.listPlans(current_user.username, "all", ["title"])
        .then(function(plan_title_list_response) {
          if (plan_title_list_response !== undefined &&
              plan_title_list_response.data !== undefined) {
              var plan_title_list = plan_title_list_response.data;
              vm.planTitleArr = plan_title_list.map(function(plan){ return plan.title });
          }
        });
      });
    }

  }

}());
