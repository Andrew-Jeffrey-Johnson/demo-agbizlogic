(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller("FinanceSetupModalController", FinanceSetupModalController);

  FinanceSetupModalController.$inject = [
    "filterFilter",
    "scenarioService",
    "$uibModalInstance",
    "$state"
  ];

  function FinanceSetupModalController(
    filterFilter,
    scenarioService,
    $uibModalInstance,
    $state) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    vm.$onInit = $onInit;
    vm.proceed = proceed;
    vm.skip = skip;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      
      }




    function proceed() {
      $uibModalInstance.close();
      $state.go("financeBalanceSheet", {
      });

    }

    function skip() {
      $uibModalInstance.dismiss();
    }

  }

}());
