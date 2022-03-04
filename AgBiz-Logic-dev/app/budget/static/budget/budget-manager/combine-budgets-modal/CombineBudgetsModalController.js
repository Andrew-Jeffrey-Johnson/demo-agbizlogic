(function() {
  'use strict';

  angular
    .module("budgetModule")
    .controller("CombineBudgetsModalController", CombineBudgetsModalController);

  CombineBudgetsModalController.$inject = [
    "$uibModalInstance",
    "$state",
    "budgetService",
    "budget_list",
  ];

  function CombineBudgetsModalController(
    $uibModalInstance,
    $state,
    budgetService,
    budget_list) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    vm.$onInit = $onInit;
    vm.addNewBudget = addNewBudget;
    vm.addBudgetToCombine = addBudgetToCombine;
    vm.removeBudgetToCombine = removeBudgetToCombine;
    vm.cancel = cancel;

    // Budget list
    vm.budget_list = [];

    // Combine budget list
    vm.combine_budget_list = [];
    vm.combine_limit = 5;

    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      vm.budget_list = budget_list;
      vm.combine_limit;
    }


    function addNewBudget() {
      var combine_budgets_ids = vm.combine_budget_list.map(function(budget) {
        return budget.id;
      });

      budgetService.copyBudgetByID(combine_budgets_ids[0])
      .then(function(copy_response) {
        if (copy_response !== undefined &&
            copy_response.data !== undefined &&
            copy_response.data.id !== undefined &&
            copy_response.data.id > 0) {
          combine_budgets_ids[0] = copy_response.data.id;
        }
      });

      budgetService.combineBudgets(combine_budgets_ids)
      .then(function(combined_budget_response) {
        if (combined_budget_response !== undefined &&
            combined_budget_response.data !== undefined &&
            combined_budget_response.data.id !== undefined &&
            combined_budget_response.data.id > 0) {
          vm.new_budget = combined_budget_response.data;
          $uibModalInstance.close();

          $state.go("budget-editor", {
            'budget': vm.new_budget.id,
          });
        }
      });
    }


    function addBudgetToCombine(budget) {
      if (vm.combine_budget_list.length < vm.combine_limit) {
        vm.combine_budget_list.push(budget);
      }
    }


    function removeBudgetToCombine(budget_to_remove) {
      vm.combine_budget_list = vm.combine_budget_list.filter(function(budget) {
        return budget.id != budget_to_remove.id;
      });
    }


    function cancel() {
      $uibModalInstance.dismiss();
    }


  }

}());
