(function() {
  'use strict';

  angular
    .module("dashboardModule")
    .component("profit", {
      templateUrl: "/static/dashboard/profit/profit.component.html",
      controller: ProfitComponentController,
      bindings: {
        inactive: '<',
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ProfitComponentController.$inject = [

  ];

  function ProfitComponentController() {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;

    // Inputs
    $ctrl.inactive = false;

    // Misc
    $ctrl.css_classes = {
      'panel': 1,
      'panel-primary': 1,
      'panel-inactive': 1,
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
