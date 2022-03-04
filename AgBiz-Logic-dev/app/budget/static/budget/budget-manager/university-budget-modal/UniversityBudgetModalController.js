(function() {
  'use strict';

  var app = angular.module("budgetModule");
  app.controller("UniversityBudgetModalController", UniversityBudgetModalController);

  /* Filter: to_italics
   *
   * Detect ABL in "Choose ABL Library Budget", and makes ABL in italics
   *
   */
  app.filter("to_italics", ["$sce", function ($sce) {
      return function (text) {
          return $sce.trustAsHtml(text);
      }
  }]);

  UniversityBudgetModalController.$inject = [
    "filterFilter",
    "$uibModalInstance",
    "budgetService",
    "university_budget_list",
  ];

  function UniversityBudgetModalController(
    filterFilter,
    $uibModalInstance,
    budgetService,
    university_budget_list) {
    var vm = this;


    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    vm.$onInit = $onInit;
    vm.selectBudget = selectBudget;
    vm.addNewBudget = addNewBudget;
    vm.cancel = cancel;

    // Modal
    vm.modal_title;

    // University budgets
    vm.university_budget_list;
    vm.university_budget = new Object();


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      // Change Search screen title from "Choose University Budget" to "Choose ABL Library Budget"
      vm.modal_title = "Choose <i>ABL</i> Library Budget";
      vm.university_budget_list = university_budget_list;
    }


    function selectBudget(budget) {
      if (budget !== undefined &&
          budget.id !== undefined &&
          budget.id > 0) {
        vm.university_budget = budget;
      }
    }


    function addNewBudget(university_budget) {
      if (university_budget !== undefined &&
          university_budget.id !== undefined &&
          university_budget.id > 0) {
        budgetService.createFromUniversityBudget(university_budget.id)
        .then(function(new_budget_response){
          if (new_budget_response !== undefined &&
              new_budget_response.data !== undefined &&
              new_budget_response.data.id !== undefined &&
              new_budget_response.data.id > 0) {
            $uibModalInstance.close(new_budget_response.data.id);
          }
        });
      }
    }


    function cancel() {
      $uibModalInstance.dismiss();
    }



    /****************************************************************
                         Private Helper Functions
    ****************************************************************/


  }

}());
