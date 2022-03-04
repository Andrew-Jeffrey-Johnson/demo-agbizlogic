(function() {
  "use strict";

  angular
  .module('climateModule')
  .config(climateRoutingConfig);

  climateRoutingConfig.$inject = [
    "$locationProvider",
    "$urlRouterProvider",
    "$stateProvider",
  ];

  function climateRoutingConfig(
    $locationProvider,
    $urlRouterProvider,
    $stateProvider) {
    $locationProvider.html5Mode(false);

    // Client side routing
    $urlRouterProvider.otherwise('/manager');

    $stateProvider
      // Home state
      .state('manager', {
        url: '/manager',
        template: "<climate-manager></climate-manager>"
      })

      // Create scenario state
      .state('create', {
        url: "/create/?scenario&new",
        template: "<climate-create-scenario></climate-create-scenario>"
      })

      // Edit Scenario budget state
      .state('budgetEditor', {
        url: "/budget-editor/{module}/{original}?scenario&budget&climate_budget&state&region",
        template: "<climate-budget-editor-route></climate-budget-editor-route>"
      })

      // Region selection state
      .state('regionSelect', {
        url: "/region-select?scenario",
        template: "<climate-region-select></climate-region-select>"
      })

      // Variable selection state
      .state('variableSelect', {
        url: "/variable-select/{original}?scenario&state&region&climate_budget",
        template: "<climate-variable-select></climate-variable-select>"
      })

      // Variable impact state
      .state('variableImpact', {
        url: "/variable-impact?scenario&climate_budget&state&region",
        template: "<climate-variable-impact></climate-variable-impact>"
      })

      // Total impact state
      .state('totalImpact', {
        url: "/total-impact?scenario&climate_budget&state&region",
        template: "<climate-total-impact></climate-total-impact>"
      })

      // Summary state
      .state('summary', {
        url: "/summary?scenario",
        template: "<climate-summary></climate-summary>"
      })

      // Short term Climate Data Impact State
      .state('climateDataImpact', {
          url: '/data-impact/{original}?scenario&climate_budget&state&region',
          template: "<climate-data-impact></climate-data-impact>"
      });
  }

})();
