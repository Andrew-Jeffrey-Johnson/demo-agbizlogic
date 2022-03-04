(function() {
  'use strict';

  angular
    .module("allocateModule", [
      'ui.router',
      'ui.bootstrap',
      'ngAnimate',
      'angular.filter',
      'budgetModule',
      'commonModule',
      'registrationModule',
    ])
    .config(allocateConfig);

  allocateConfig.$inject = [
    "$interpolateProvider",
    "$httpProvider",
    "$locationProvider",
    "$stateProvider",
    "$urlRouterProvider",
  ];

  function allocateConfig(
    $interpolateProvider,
    $httpProvider,
    $locationProvider,
    $stateProvider,
    $urlRouterProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');

    // CSRF configuration
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $locationProvider.html5Mode(false);

    // Client side routing
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      // Home state
      // Performs API calls to determine which step the user is on, then redirects accordingly.
      .state('home', {
        url: "/home",
        template: "<allocate-home></allocate-home>"
      })

      // Business select state
      .state('businessSelect', {
        url: '/business-select',
        template: "<business-select></business-select>"
      })

      // Business allocation state
      .state('businessAllocate', {
        url: '/business-allocate',
        template: "<business-allocate></business-allocate>"
      })

      .state('businessSummary', {
        url: '/business-summary',
        template: "<business-summary></business-summary>"
      })

      // Enterprise select state
      .state('enterpriseSelect', {
        url: '/enterprise-select',
        template: "<enterprise-select></enterprise-select>"
      })

      // Enterprise allocate state
      .state('enterpriseAllocate', {
        url: '/enterprise-allocate',
        template: "<enterprise-allocate></enterprise-allocate>"
      })

      // Summary state
      .state('allocateSummary', {
        url: '/allocate-summary',
        template: "<allocate-summary></allocate-summary>"
      });
  }

}());
