(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("discountItem", {
      templateUrl: "/static/scenario/scenario-discount-rate/discount-item/discount-item.component.html",
      controller: DiscountItemComponentController,
      bindings: {
        'plan': '<',
        'onChange': '&',
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  DiscountItemComponentController.$inject = [

  ];

  function DiscountItemComponentController() {
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
    $ctrl.discount_rate;
    $ctrl.beginning_investment;
    $ctrl.ending_investment;
    $ctrl.use_investment_values = "True";



    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      if ($ctrl.plan !== undefined && $ctrl.plan.id > 0) {
        $ctrl.discount_rate = $ctrl.plan.discount_rate;
        $ctrl.beginning_investment = $ctrl.plan.beginning_investment;
        $ctrl.ending_investment = $ctrl.plan.ending_investment;
        $ctrl.use_investment_values = $ctrl.plan.use_investment_values == true? "True" : "False";
      }
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

  }

})();
