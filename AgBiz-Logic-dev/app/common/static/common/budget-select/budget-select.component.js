(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("budgetSelect", {
      templateUrl: "/static/common/budget-select/budget-select.component.html",
      controller: BudgetSelectComponentController,
      bindings: {
        itemList: "<",
        itemLimit: "<",
        optionList: "<",
        showNotes: "<",
        fromPlan: "<",
        editable: "<",
        onDelete: "&",
        onEdit: "&",
        onAdd: "&",
        ordered: "<",
        onOrderChange: "&",
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  BudgetSelectComponentController.$inject = [

  ];

  function BudgetSelectComponentController() {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.$onChanges = $onChanges;
    $ctrl.selectBudget = selectBudget;

    // Item list
    $ctrl.itemList;

    // Budget
    $ctrl.new_budget;

    // Misc
    $ctrl.itemLimit;
    $ctrl.items_allowed;
    $ctrl.editable;
    $ctrl.showNotes;
    $ctrl.ordered;
    $ctrl.fromPlan;


    /****************************************************************
                         Controller Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.items_allowed = true;
      if ($ctrl.editable === undefined) {
        $ctrl.editable = true;
      }
      if ($ctrl.showNotes === undefined) {
        $ctrl.showNotes = true;
      }
      if ($ctrl.ordered === undefined) {
        $ctrl.ordered = false;
      }
      if ($ctrl.fromPlan === undefined) {
        $ctrl.fromPlan = false;
      }
    }


    function $onChanges(changes) {
      checkList();
    }


    function selectBudget(budget) {
      if (budget !== undefined &&
          budget.id !== undefined &&
          budget.id > 0) {
        $ctrl.new_budget = budget;
      }
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Checks if the item list is over/under the limit.
    */
    function checkList() {
      if ($ctrl.itemList !== undefined) {
        if ($ctrl.itemList.length >= $ctrl.itemLimit) {
          $ctrl.items_allowed = false;
        }
        else {
          $ctrl.items_allowed = true;
        }
      }
    }

  }

})();
