(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller('PlanSensitivitySummaryComponentController', PlanSensitivitySummaryComponentController);

    /****************************************************************
                         Controller
    ****************************************************************/

    PlanSensitivitySummaryComponentController.$inject = [
      '$uibModalInstance',
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      'budgetService',
      '$uibModal',
      'incomeItems_dic',
      'costItems_dic',
      'plan_title'
    ];

    function PlanSensitivitySummaryComponentController(
      $uibModalInstance,
      $state,
      $filter,
      commonService,
      scenarioService,
      budgetService,
      $uibModal,
      incomeItems_dic,
      costItems_dic,
      plan_title) {
      var vm = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      vm.$onInit = $onInit;
      vm.gotoPlanManager = gotoPlanManager;
      vm.back = back;


      // variables
      vm.plan_title = plan_title;

      vm.total_income_before = 0.0;
      vm.total_income_after = 0.0;
      vm.total_income_diff = 0.0;
      vm.total_income_diff_neg = false;

      vm.total_cost_before = 0.0;
      vm.total_cost_after = 0.0;
      vm.total_cost_diff = 0.0;
      vm.total_cost_diff_neg = false;

      vm.net_returns_before = 0.0;
      vm.net_returns_after = 0.0;
      vm.net_returns_diff = 0.0;
      vm.net_returns_diff_neg = false;


      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        CalculateTotalIncome();
        CalculateTotalCost();
        CalculateNetReturns();
      }

      function gotoPlanManager() {
        $uibModalInstance.dismiss();
        $state.go("scenarioManager", {'module':$ctrl.module});
      }

      function back() {
        $uibModalInstance.dismiss();
      }


      /****************************************************************
                           Private Helper Functions
      ****************************************************************/

      function CalculateTotalIncome() {
        for (var key in incomeItems_dic) {
          vm.total_income_before += parseFloat(incomeItems_dic[key].adjusted_value) / (1+incomeItems_dic[key].adjustPersentage/100.0);
          vm.total_income_after += parseFloat(incomeItems_dic[key].adjusted_value);
        }
        vm.total_income_diff = vm.total_income_after - vm.total_income_before;
        if (vm.total_income_diff < 0) {
          vm.total_income_diff *= -1;
          vm.total_income_diff_neg = true;
        }
      }


      function CalculateTotalCost() {
        for (var key in costItems_dic) {
          vm.total_cost_before += parseFloat(costItems_dic[key].adjusted_value) / (1+costItems_dic[key].adjustPersentage/100.0);
          vm.total_cost_after += parseFloat(costItems_dic[key].adjusted_value);
        }
        vm.total_cost_diff = vm.total_cost_after - vm.total_cost_before;
        if (vm.total_cost_diff < 0) {
          vm.total_cost_diff *= -1 ;
          vm.total_cost_diff_neg = true;
        }
      }


      function CalculateNetReturns() {
        vm.net_returns_before = vm.total_income_before - vm.total_cost_before;
        vm.net_returns_after = vm.total_income_after - vm.total_cost_after;
        vm.net_returns_diff = vm.net_returns_after - vm.net_returns_before;
        if (vm.net_returns_diff < 0) {
          vm.net_returns_diff *= -1;
          vm.net_returns_diff_neg = true;
        }
      }

    }

  }());
