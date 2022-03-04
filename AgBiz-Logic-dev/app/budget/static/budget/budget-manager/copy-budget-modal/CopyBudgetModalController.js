(function() {
  'use strict';

  angular
    .module("budgetModule")
    .controller("CopyBudgetModalController", CopyBudgetModalController);

  CopyBudgetModalController.$inject = [
    "filterFilter",
    "budgetService",
    'commonService',
    "$uibModalInstance",
    "$state",
    'budget_list'
  ];

  function CopyBudgetModalController(
    filterFilter,
    budgetService,
    commonService,
    $uibModalInstance,
    $state,
    budget_list) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    /****************************************************************
                         Bindable Members
    ****************************************************************/
    // Methods
    vm.$onInit = $onInit;
    vm.selectBudget = selectBudget;
    vm.addNewBudget = addNewBudget;
    vm.cancel = cancel;
    vm.Validate = Validate;
    vm.isEmpty = isEmpty;

    // Modal
    vm.modal_title;

    // University budgets
    vm.budget_list;
    vm.budget = new Object();
    vm.copy_budget = new Object();

    // title validity
    vm.budgetTitleArr = [];
    vm.duplicateBudgetTitle = false;
    vm.new_name = "";
    vm.newBudgetForm = {};


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      vm.modal_title = "Choose Budget to copy";
      vm.budget_list = budget_list;
      retrieveBudgetNameList();
    }


    function selectBudget(budget) {
      if (budget !== undefined &&
          budget.id !== undefined &&
          budget.id > 0) {
        vm.budget = budget;
      }
    }


    function Validate() {
      vm.duplicateBudgetTitle = duplicateBudgetTitle(vm.new_name);
    }


    function isEmpty(title) {
      if (title.length === 0 ) {
        var budgetTitle = document.getElementsByName("budgetTitle")[0];
        budgetTitle.style.borderColor = "red";
        return true;
      }

      return false;
    }


    function addNewBudget() {
      budgetService.copyBudget(vm.budget)
      .then(function(copy_budget_response) {
        if (copy_budget_response !== undefined &&
            copy_budget_response.data !== undefined &&
            copy_budget_response.data.id !== undefined &&
            copy_budget_response.data.id > 0) {
          vm.copy_budget = copy_budget_response.data;
          vm.copy_budget.created_date = new Date();
          vm.copy_budget.title = vm.new_name;
          vm.copy_budget.notes = vm.copy_budget.notes + " (copy of " + vm.budget.title + ")";

          budgetService.updateBudget(vm.copy_budget);
          $state.reload();
          $uibModalInstance.dismiss();
        }
      });
    }


    function cancel() {
      $uibModalInstance.dismiss();
    }



    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    function duplicateBudgetTitle(title) {
      var budgetTitle = document.getElementsByName("budgetTitle")[0];

      if ( title !== '' && vm.budgetTitleArr.indexOf(title) === -1 ) {
        budgetTitle.style.borderColor = "";
        return false;
      } else {
         budgetTitle.style.borderColor = "red";
        return true;
      }
    }


    function retrieveBudgetNameList() {
      var current_user;

      commonService.retrieveCurrentUser().then(function(response) {
        current_user = response.data;

        budgetService.listBudgets(current_user.username, "title", "allocate")
        .then(function(budget_title_list_response) {
          if (budget_title_list_response !== undefined &&
              budget_title_list_response.data !== undefined) {
            var budget_title_list = budget_title_list_response.data;
            vm.budgetTitleArr = budget_title_list.map(function(budget){ return budget.title });
          }
        });
      });
    }

  }

}());
