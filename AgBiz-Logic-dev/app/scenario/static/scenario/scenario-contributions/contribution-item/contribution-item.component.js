(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("contributionItem", {
      templateUrl: "/static/scenario/scenario-contributions/contribution-item/contribution-item.component.html",
      controller: ContributionItemComponentController,
      bindings: {
        'plan': '<',
        'onChange': '&',
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ContributionItemComponentController.$inject = [

  ];

  function ContributionItemComponentController() {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;

    // Inputs
    $ctrl.plan;

    // Form fields
    $ctrl.form;
    $ctrl.discount_rate = 0;
    $ctrl.beginning_land = 0;
    $ctrl.appreciation = 0;
    $ctrl.roi = 0;
    $ctrl.beginning_capital = 0;
    $ctrl.ending_capital = 0;
    $ctrl.inflation_rate = 0;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {

    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

  }

})();
