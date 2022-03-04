(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeStepIndicator", {
      templateUrl: "/static/scenario/finance-step-indicator/finance-step-indicator.component.html",
      controller: FinanceStepIndicatorComponentController,
      bindings: {
        'step': "<",
        'steps': "<"
      }
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceStepIndicatorComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      "$uibModal"
    ];

    function FinanceStepIndicatorComponentController(
      $state,
      $filter,
      commonService,
      scenarioService,
      $uibModal) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.goto = goto;

      // Scenario
      $ctrl.scenario_id;
      $ctrl.module;

      // Inputs
      // console.log("steps:");
      // console.log($ctrl.steps);
      //console.log($ctrl.steps.length());
      if(!$ctrl.steps){
        $ctrl.steps = ['Create Scenario','Budget Adjustments',
        'Depreciation', 'Inflation', 'Review', 'Future Transactions', 'Summary'];
      }
      $ctrl.step;

      //old to be removed
      //'Future Loans': 'financeFutureLoans',
      //'Future Leases': 'financeFutureLeases',


      $ctrl.pageDict = {
        'Beginning Balance Sheet': 'financeBalanceSheet',
        'Current Capital Leases': 'financeLeases',
        'Current Loans': 'financeLoans',
        'Current Summary': 'financeCurrentSummary',
        'Budget Adjustments': 'financeDistributions',
        'Depreciation': 'financeDepreciation',
        'Inflation': 'financeInflation',
        'Review': 'financeFirstReview',
        'Future Transactions': 'financeTransactions',
        'Summary': 'financeSummary',

      }



      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        $ctrl.module = $state.params['module'];
      }

      function goto(index) {
        var des = $ctrl.pageDict[$ctrl.steps[index]];

        if ($ctrl.steps[index] == 'Beginning Balance Sheet') {
          $state.go("financeBalanceSheet", {
            'module':$ctrl.module
          });
        }
        else {
          $state.go(des, {
            'scenario': $state.params['scenario'],
            'module':$ctrl.module
          });
        };
      }


    }

}());
