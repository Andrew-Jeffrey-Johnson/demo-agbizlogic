(function() {
  'use strict';

  angular
    .module("dashboardModule")
    .component("actionsBar", {
      templateUrl: "/static/dashboard/dashboard/actions-bar/actions-bar.component.html",
      controller: ActionsBarComponentController,
    });


  /****************************************************************
                         Controller
  ****************************************************************/

  ActionsBarComponentController.$inject = [
    "$window",
  ];

  function ActionsBarComponentController(
    $window) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.go = go;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {

    }


    function go(module_name) {
      if (module_name !== undefined && module_name === "budget") {
        $window.location.assign("/budget/#/budget-manager");
      }
      else if (module_name !== undefined && module_name === "climate") {
        $window.location.assign("/climate/#/climate-manager");
      }
      else if (module_name !== undefined && module_name === "plan") {
        $window.location.assign("/scenario/#/plan-manager");
      }
      else if (module_name !== undefined && module_name === "scenario") {
        $window.location.assign("/scenario/#/scenario-manager");
      }
    }
  }

}());
