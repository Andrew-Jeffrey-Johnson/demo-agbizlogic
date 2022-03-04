(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("planSpaceItem", planSpaceItem());

  function planSpaceItem() {
    var component = {
      templateUrl: "/static/scenario/plan-space-item/plan-space-item.component.html",
      controller: PlanSpaceItemComponentController,
      bindings: {
        'planBudget': '<',
        'onChange': '&',
      },
    };

    return component;
  }


  /****************************************************************
                       Controller
  ****************************************************************/

  PlanSpaceItemComponentController.$inject = [

  ];

  function PlanSpaceItemComponentController() {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.$onChanges = $onChanges;
    $ctrl.recalculate = recalculate;

    // Units
    $ctrl.unit = "percent";
    // TODO: Make into Angular constant
    $ctrl.space_units = [
      'Acre',
      'AUM',
      'Bale',
      'Bin',
      'Bottle',
      'Box',
      'Bushel',
      'Carton',
      'Case',
      'cwt',
      'Field',
      'Flock',
      'Head',
      'Herd',
      'Linear Foot',
      'Plant',
      'Pound',
      'Square Foot',
      'Square Inches',
      'Square Mile',
      'Square Yard',
      'Ton',
      'Total',
      'Tree',
      'Vine',
    ];

    // Values
    $ctrl.total_space_used_unit = 0;
    $ctrl.total_space_used_percent = 0;

    // Errors
    $ctrl.error;
    $ctrl.valid;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.total_space_used_percent = 100;
      $ctrl.total_space_used_unit = $ctrl.planBudget.farm_unit_quantity;
    }


    function $onChanges(changes) {

    }


    function recalculate(unit_type) {
      $ctrl.error = "";
      if (unit_type == "percent") {
        if ($ctrl.total_space_used_unit <= $ctrl.planBudget.total_space_available && $ctrl.total_space_used_unit > 0) {
          $ctrl.total_space_used_percent = ($ctrl.total_space_used_unit / $ctrl.planBudget.total_space_available) * 100;
        }
        else if ($ctrl.total_space_used_unit > $ctrl.planBudget.total_space_available) {
          $ctrl.error = "Over!";
        }
        else if ($ctrl.total_space_used_unit < 0) {
          $ctrl.error = "Under!";
        }
      }
      else if (unit_type == "unit") {
        if ($ctrl.total_space_used_percent <= 100 && $ctrl.total_space_used_percent > 0) {
          $ctrl.total_space_used_unit = $ctrl.planBudget.total_space_available * ($ctrl.total_space_used_percent / 100);
        }
        else if ($ctrl.total_space_used_percent > 100) {
          $ctrl.error = "Over!";
        }
        else if ($ctrl.total_space_used_percent < 0) {
          $ctrl.error = "Under!";
        }
      }
        if($ctrl.error == "Over!" || $ctrl.error == "Under!"){
          $ctrl.valid = false;
        }
        else{
          $ctrl.valid = true;
        }

        $ctrl.onChange({
          'budget_id': $ctrl.planBudget.id,
          'space_units': $ctrl.planBudget.space_units,
          'total_space_available': $ctrl.planBudget.total_space_available,
          'total_space_used': $ctrl.total_space_used_unit,
          'valid':$ctrl.valid
        });
      }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

  }

}());
