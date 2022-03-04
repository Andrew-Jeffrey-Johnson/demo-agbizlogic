(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller('farmUnitAdjustmentComponentController', farmUnitAdjustmentComponentController);

    /****************************************************************
                         Controller
    ****************************************************************/

    farmUnitAdjustmentComponentController.$inject = [
      '$uibModalInstance',
      '$state',
      '$filter',
      '$uibModal',
      'plan'
    ];

    function farmUnitAdjustmentComponentController(
      $uibModalInstance,
      $state,
      $filter,
      $uibModal,
      plan) {
      var vm = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      vm.$onInit = $onInit;
      vm.cancel = cancel;
      vm.proceed = proceed;
      vm.validate = validate;


      // variables
      vm.plan = plan;
      vm.unit_dic = {};
      vm.selected_unit;
      vm.input_invalid = false;


      /****************************************************************
                           Private Helper Functions
      ****************************************************************/

      function $onInit() {
        angular.forEach(plan.plan_budgets, function(budget) {
          if ( !(budget.farm_unit in vm.unit_dic)) {
            vm.unit_dic[budget.farm_unit] = {
              'unit': budget.farm_unit,
              'converted': 1,   // this budget farm unit
              'selected': 1,   // selected unit
            };
          }
        });
      }


      function cancel() {
        $uibModalInstance.dismiss();
      }


      function proceed() {
        $uibModalInstance.close(vm.transaction);
      }

      function validate() {
        for (var key in vm.unit_dic) {
          if (typeof vm.unit_dic[key]['converted'] != 'number' || typeof vm.unit_dic[key]['selected'] != 'number') {
            vm.input_invalid = true;
            break;
          } else {
            vm.input_invalid = false;
          }
        }
      }


    }

}());
