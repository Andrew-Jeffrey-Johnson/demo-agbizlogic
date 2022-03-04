(function() {
  "use strict";

  angular
  .module('budgetModule')
  .config(budgetRoutingConfig);

  budgetRoutingConfig.$inject = [
    "$locationProvider",
    "$urlRouterProvider",
    "$stateProvider",
  ];

  function budgetRoutingConfig(
    $locationProvider,
    $urlRouterProvider,
    $stateProvider) {
    $locationProvider.html5Mode(false);

    // Client side routing
    $urlRouterProvider.otherwise('/budget-manager');

    $stateProvider
      // Manager state
      .state('budget-manager', {
        url: '/budget-manager?view-university-budgets',
        template: "<manager></manager>"
      })

      // Editor state
      .state('budget-editor', {
        url: '/budget-editor?budget&university',
        template: "<budget-editor-route></budget-editor-route>",
      });
  }

})();
