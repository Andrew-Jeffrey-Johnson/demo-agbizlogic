(function() {
  'use strict';

  angular
    .module("dashboardModule")
    .component("finance", {
      templateUrl: "/static/dashboard/finance/finance.component.html",
      controller: FinanceComponentController,
      bindings: {
        inactive: '<',
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  FinanceComponentController.$inject = [

  ];

  function FinanceComponentController() {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;

    // Inputs
    $ctrl.inactive;

    // Misc
    $ctrl.is_inactive;
    $ctrl.css_classes = {
      'panel': true,
      'panel-primary': true,
      'panel-inactive': true,
    };

    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      updateCSS();
    }



    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Disables the component using CSS depending on the input binding from parent component.
        Default is inactive.
    */
    function updateCSS() {
      if ($ctrl.inactive === undefined) {
        $ctrl.is_inactive = true;
      }
      else {
        $ctrl.is_inactive = $ctrl.inactive;
      }
      $ctrl.css_classes['panel-inactive'] = $ctrl.is_inactive;
    }
  }

})();
