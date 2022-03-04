(function() {
  'use strict';

  angular
    .module("dashboardModule")
    .component("scenarios", {
      templateUrl: "/static/dashboard/scenarios/scenarios.component.html",
      controller: ScenariosComponentController,
      bindings: {
        inactive: '<',
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ScenariosComponentController.$inject = [

  ];

  function ScenariosComponentController() {
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
