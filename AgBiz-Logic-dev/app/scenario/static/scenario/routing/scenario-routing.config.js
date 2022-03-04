(function() {
  'use strict';

  angular
    .module('scenarioModule')
    .config(scenarioRoutingConfig);

  scenarioRoutingConfig.$inject = [
    "$locationProvider",
    "$stateProvider",
    "$urlRouterProvider",
  ];

  function scenarioRoutingConfig(
    $locationProvider,
    $stateProvider,
    $urlRouterProvider) {

    $locationProvider.html5Mode(false);

    // Client side routing
    $urlRouterProvider.otherwise('/scenario-manager');

    $stateProvider

      // Plan Manager state
      .state('planManager', {
        url: '/plan-manager?scenario&&module',
        template: "<plan-manager></plan-manager>",
      })

      // Plan Creation state
      .state('planCreate', {
        url: '/plan-create?plan&&module&&new&&editing',
        template: "<plan-create></plan-create>",
      })

      // Edit plan budget state
      .state('budgetEditor', {
        url: "/budget-editor",
        template: "<budget-editor></budget-editor>",
      })

      // Plan time period state
      .state('planTimePeriod', {
        url: "/plan-time-period?plan&&module",
        template: "<plan-time-period></plan-time-period>",
      })

      // Plan budget inflation state
      .state('planInflation', {
        url: "/plan-inflation?plan&&module",
        template: "<plan-inflation></plan-inflation>",
      })

      // Plan total space state
      .state('planTotalSpace', {
        url: "/plan-total-space?plan&&module",
        template: "<plan-total-space></plan-total-space>",
      })

      // Plan summary
      .state('planSummary', {
        url: "/plan-summary?plan&&module&&edited",
        template: "<plan-summary></plan-summary>",
      })

      // Plan Sensitive Analysis state
      .state('planSensitiveAnalysis', {
        url: '/plan-sensitive-analysis?plan&&module',
        template: "<plan-sensitive-analysis></plan-sensitive-analysis>",
      })

      .state('planSensitivitySummary', {
        url: '/plan-sensitivity-summary?plan&&module',
        template: "<plan-sensitivity-summary></plan-sensitivity-summary>",
      })

      // Scenario manager state
      .state('scenarioManager', {
        url: '/scenario-manager?module',
        template: "<scenario-manager></scenario-manager>",

      })

      // Scenario create state
      .state('scenarioCreate', {
        url: '/scenario-create?scenario&module&new&from_profit',
        template: "<scenario-create></scenario-create>",
      })

      // Profit scenario discount rate and beginning/ending investment state
      .state('scenarioDiscountRate', {
        url: '/scenario-discount-rate?scenario&&module&from_profit',
        template: "<scenario-discount-rate></scenario-discount-rate>",
      })

      // Scenario contributions state
      .state('scenarioContributions', {
        url: '/scenario-contributions?scenario&role',
        template: "<scenario-contributions></scenario-contributions>",
      })

      // Scenario summary state
      .state('scenarioSummary', {
        url: '/scenario-summary?scenario&module&edited&from_profit',
        template: "<scenario-summary></scenario-summary>",
      })
      //profit summary state
      .state('profitSummary',{
          url: '/profit-summary?scenario&module&edited&from_profit',
          template: "<profit-summary></profit-summary>",
      })
      // Finance indicator state
      .state('financeStepIndicator', {
        url: '/finance-step-indicator?scenario&module',
        template: "<finance-step-indicator></finance-step-indicator>",
      })

      // Finance setup
      .state('financeAnalysis', {
        url: '/finance-analysis?analysis&module',
        template: "<finance-analysis></finance-analysis>",
      })
      // Finance income statment
      .state('financeIncomeStatment', {
        url: '/finance-income-statment?scenario& module &from_scenario',
        template: "<finance-income-statment></finance-income-statment>",
      })

      // Finance balance sheet
      .state('financeBalanceSheet', {
        url: '/finance-balance-sheet?balance-sheet&module',
        template: "<finance-balance-sheet></finance-balance-sheet>",
      })
      .state('financeBalanceSheetYear', {
        url: '/finance-balance-sheet-years?scenario&module',
        template: "<finance-balance-sheet-year></finance-balance-sheet-year>",
      })

      // Finance loans
      .state('financeLoans', {
        url: '/finance-loans?module',
        template: "<finance-loans></finance-loans>",
      })

      // Finance leses
      .state('financeLeases', {
        url: '/finance-leases?module',
        template: "<finance-leases></finance-leases>",
      })

      // Finance family withdraw
      .state('financeDistributions', {
        url: '/finance-distributions?scenario&&module&&new',
        template: "<finance-distributions></finance-distributions>",
      })
      // Accrual Adjustments
      .state('financeAccrualAdjustments', {
        url: '/finance-accural-adjustments?scenario&&module',
        template: "<finance-accrual-adjustments></finance-accrual-adjustments>",
      })

      .state('abc', {
        url: '/cashflow?scenario&&module',
        template: "<abc></abc>",
      })

      // Finance depreciation
      .state('financeDepreciation', {
        url: '/finance-depreciation?scenario&module',
        template: "<finance-depreciation></finance-depreciation>",
      })


      // Finance new transaction
      .state('financeFutureLoans', {
        url: '/finance-future-loans?scenario&module',
        template: "<finance-future-loans></finance-future-loans>",
      })

      .state('financeFirstReview', {
        url: '/finance-first-review?scenario&module',
        template: "<finance-first-review></finance-first-review>",
      })

      .state('financeSummary',{
          url: '/finance-finance-summary?scenario&module',
          template: "<finance-summary></finance-summary>",
      })

      .state('financeCurrentSummary',{
          url: '/finance-current-summary?&module',
          template: "<finance-current-summary></finance-current-summary>",
      })

      .state('financeTransactions',{
          url: '/finance-transactions?scenario&module',
          template: "<finance-transactions></finance-transactions>",
      })

      // Finance inflation
      .state('financeInflation',{
          url: '/finance-inflation?scenario&module',
          template: "<finance-inflation></finance-inflation>",
      })

      .state('financeFutureLeases', {
        url: '/finance-future-leases?scenario&module',
        template: "<finance-future-leases></finance-future-leases>",

      })

      //finance Ratios
      .state('financeRatios', {
        url: '/finance-ratios?scenario&module',
        template: "<finance-ratios></finance-ratios>",
      });
  }

})();
