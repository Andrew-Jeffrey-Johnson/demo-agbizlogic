(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("planSearch", {
      templateUrl: "/static/common/plan-search/plan-search.component.html",
      controller: PlanSearchComponentController,
      bindings: {
        'planList': "<",
        'onSelect': "&",
      }
    });


  /****************************************************************
                         Controller
  ****************************************************************/

  PlanSearchComponentController.$inject = [
    "filterFilter",
  ];

  function PlanSearchComponentController(
    filterFilter) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.$onChanges = $onChanges;

    // Inputs
    $ctrl.planList;
    $ctrl.planList;
    console.log($ctrl.planList);

    // Search options
    $ctrl.enterprise_list = [
      {
        'label': "Select",
        'value': "",
      },
      {
        'label': "Crop",
        'value': "Crop",
      },
      {
        'label': "Livestock",
        'value': "Livestock",
      },
    ];
    $ctrl.us_state_list;
    $ctrl.region_list;

    // Filtered plan list
    $ctrl.filtered_plan_list = [];

    // Search object
    $ctrl.search = {
      'title': "",
      'enterprise': $ctrl.enterprise_list[0].value,
      'state': "",
      'region': "",
    };


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.modal_title = "Choose Plan";
      if ($ctrl.planList !== undefined &&
          $ctrl.planList.length !== undefined &&
          $ctrl.planList.length > 0) {
        $ctrl.filtered_plan_list = $ctrl.planList;
      }
    }


    function $onChanges(changes) {
      $ctrl.$onInit();
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

  }
}());
