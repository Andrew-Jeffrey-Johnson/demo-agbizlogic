(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("confirmButton", {
      templateUrl: "/static/common/confirm-button/confirm-button.component.html",
      controller: ConfirmButtonComponentController,
      bindings: {
        'label': "<",
        'message': "<",
        'type': "<",
        'disabled': "<",
        'onConfirm': "&",
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ConfirmButtonComponentController.$inject = [

  ];

  function ConfirmButtonComponentController() {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;

    // Inputs
    $ctrl.label;
    $ctrl.message;
    $ctrl.type;
    $ctrl.disabled;

    // Attributes
    $ctrl.confirm = false;


    /****************************************************************
                         Controller Methods
    ****************************************************************/

    function $onInit() {
      if ($ctrl.type === undefined) {
        $ctrl.type = "danger";
      }
      if ($ctrl.disabled === undefined) {
        $ctrl.disabled = false;
      }
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

  }

})();
