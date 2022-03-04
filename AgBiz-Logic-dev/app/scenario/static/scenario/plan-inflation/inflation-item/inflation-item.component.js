(function () {
  'use strict';

  angular
    .module("scenarioModule")
    .component("inflationItem", inflationItem());

  function inflationItem() {
    var component = {
      templateUrl: "/static/scenario/plan-inflation/inflation-item/inflation-item.component.html",
      controller: InflationItemComponentController,
      bindings: {
        item: '<',
        onChange: '&',
      }
    };

    return component;
  }


  /****************************************************************
   Controller
   ****************************************************************/

  InflationItemComponentController.$inject = [];

  function InflationItemComponentController() {
    var $ctrl = this;

    /****************************************************************
     Bindable Members
     ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.$onChanges = $onChanges;

    // Inputs
    $ctrl.item;

    /****************************************************************
     Methods
     ****************************************************************/

    function $onInit() {
      if ($ctrl.item.income_item !== undefined) {
        $ctrl.budget_item_type = "income";
      }
      else if ($ctrl.item.cost_item !== undefined) {
        $ctrl.budget_item_type = "expense";
      }
    }


    function $onChanges(changes) {
      if (changes['item'] !== undefined) {
        $ctrl.item = angular.copy(changes['item'].currentValue);
        $ctrl.item.inflation_rate = parseFloat($ctrl.item.inflation_rate);
      }
    }


    /****************************************************************
     Private Helper Functions
     ****************************************************************/

  }

})();
