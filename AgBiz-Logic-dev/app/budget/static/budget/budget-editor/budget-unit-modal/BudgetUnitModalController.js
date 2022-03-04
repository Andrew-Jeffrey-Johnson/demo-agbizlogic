(function() {
  'use strict';

  angular
    .module('budgetModule')
    .controller("BudgetUnitModalController", BudgetUnitModalController);

  BudgetUnitModalController.$inject = [
    '$uibModalInstance',
    'budgetService',
    'budget',
    'cropFarmUnits',
    'nurseryFarmUnits',
    'livestockFarmUnits',
  ];

  function BudgetUnitModalController(
    $uibModalInstance,
    budgetService,
    budget,
    cropFarmUnits,
    nurseryFarmUnits,
    livestockFarmUnits) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    vm.$onInit = $onInit;
    vm.cancel = cancel;
    vm.save = save;

    // Form
    vm.form;
    vm.new_farm_unit;
    vm.new_farm_unit_quantity;
    vm.scale_type;
    vm.scale_factor;
    vm.is_new_unit = false;
    vm.smaller_unit;
    vm.larger_unit;
    vm.farm_unit_options;

    // Misc
    vm.farm_unit;
    vm.farm_unit_quantity;
    vm.confirm_save = false;

    /****************************************************************
                        Controller Methods
    ****************************************************************/

    function $onInit() {
      vm.new_farm_unit = budget.farm_unit;
      vm.farm_unit = budget.farm_unit;
      vm.farm_unit_quantity = budget.farm_unit_quantity;
      vm.farm_unit_options = setFarmUnits(budget);
    }


    function cancel() {
      $uibModalInstance.dismiss();
    }


    function save() {
      if (vm.is_new_unit &&
          vm.scale_type !== undefined &&
          vm.new_farm_unit !== undefined &&
          vm.scale_factor !== undefined &&
          vm.scale_factor > 0) {
        var updated_budget = angular.copy(budget);
        updated_budget.farm_unit = vm.new_farm_unit;
        updated_budget.farm_unit_quantity = convertFarmUnitQuantity(vm.scale_factor, budget.farm_unit_quantity, vm.scale_type);
        //updated_budget.sale_unit_quantity = updated_budget.farm_unit_quantity;

        angular.forEach(updated_budget.income_items, function(income_item) {
          income_item.sale_unit_quantity = updated_budget.farm_unit_quantity;
          income_item.sale_unit = vm.new_farm_unit;
          budgetService.updateBudgetItem("income", income_item);
        });

        angular.forEach(updated_budget.cost_items, function(cost_item) {
          cost_item.unit_quantity = updated_budget.farm_unit_quantity;
          cost_item.unit = vm.new_farm_unit;
          budgetService.updateBudgetItem("general", cost_item);
        });

        budgetService.updateBudget(updated_budget)
        .then(function(updated_budget_response) {
          $uibModalInstance.dismiss();
        });
      }
      else if (!vm.is_new_unit && vm.new_farm_unit_quantity > 0) {
        budgetService.scaleFarmUnitQuantity(budget.id, vm.new_farm_unit_quantity)
        .then(function(response) {
          $uibModalInstance.dismiss();
        });
      }
    }


    /****************************************************************
                        Private Helper Functions
    ****************************************************************/

    /*
        Returns the correct list of farm unit options for the given Budget enterprise type.
    */
    function setFarmUnits(budget) {
      var farm_units = '';
      if (budget.enterprise == 'Crop') {
        farm_units = cropFarmUnits;
      }
      else if (budget.enterprise == 'Livestock') {
        farm_units = livestockFarmUnits;
      }
      else if (budget.enterprise == 'Nursery') {
        farm_units = nurseryFarmUnits;
      }
      else{
        farm_units = cropFarmUnits;
      }

      return farm_units;
    }


    /*

    */
    function convertFarmUnitQuantity(scale_factor, farm_unit_quantity, scale_type) {
      var new_farm_unit_quantity = 0;
      switch (scale_type) {
        case "smaller":
          new_farm_unit_quantity = farm_unit_quantity * scale_factor;
          break;

        case "larger":
          new_farm_unit_quantity = farm_unit_quantity / scale_factor;
          break;

        default:
          throw Error("scale_type is not 'smaller' nor 'larger'");
      }

      return new_farm_unit_quantity;
    }

  }

})();
