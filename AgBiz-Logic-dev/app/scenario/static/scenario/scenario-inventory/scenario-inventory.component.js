(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("scenarioInventory", {
      templateUrl: "/static/scenario/scenario-inventory/scenario-inventory.component.html",
      controller: ScenarioInventoryComponentController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ScenarioInventoryComponentController.$inject = [
    '$state',
    '$filter',
    'commonService',
    'scenarioService',
    "$window",
    "$uibModal",
  ];

  function ScenarioInventoryComponentController(
    $state,
    $filter,
    commonService,
    scenarioService,
    $window,
    $uibModal) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.addNewScenario = addNewScenario;
    $ctrl.editScenario = editScenario;
    $ctrl.removeScenario = removeScenario;
    $ctrl.viewSummary = viewSummary;
    $ctrl.back = back;

    // Module
    $ctrl.module;

    // Scenarios
    $ctrl.scenario_list;

    // User
    $ctrl.user;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.module = $state.params["module"];

      commonService.retrieveCurrentUser()
      .then(function(current_user_response) {
        $ctrl.user = current_user_response.data;
        return scenarioService.listScenarios($ctrl.user.username, ["id", "title", "notes", "created_date", "modified_date"]);
      })
      .then(function(scenario_list_response) {
        if (scenario_list_response !== undefined &&
            scenario_list_response.data !== undefined) {
          $ctrl.scenario_list = scenario_list_response.data;
        }
      });
    }

    function addNewScenario(scenario_type) {
      if(scenario_type == 'copy'){
        openCopyScenarioModal();
      }
      else if (scenario_type == 'new') {

        if($ctrl.module === undefined){
          $ctrl.module = 'profit';
        }

        var default_scenario = {
          'title': "New Scenario",
        };
        scenarioService.createScenario(default_scenario)
        .then(function(new_scenario_response) {
          if (new_scenario_response !== undefined &&
              new_scenario_response.data !== undefined &&
              new_scenario_response.data.id !== undefined &&
              new_scenario_response.data.id > 0 &&
              new_scenario_response.data.title !== undefined) {
            $state.go("scenarioCreate", {
              'scenario': new_scenario_response.data.id,
              'module': $ctrl.module,
            });
          }
        });

      }
    }


    function editScenario(scenario) {
      if($ctrl.module === undefined){
        $ctrl.module = 'profit';
      }
      if (scenario !== undefined &&
          scenario.id !== undefined &&
          scenario.id > 0) {
        $state.go("scenarioCreate", {
          'scenario': scenario.id,
          'module' : $ctrl.module
        });
      }
    }


    function removeScenario(scenario) {
      if (scenario !== undefined &&
          scenario.id !== undefined &&
          scenario.id > 0) {
        scenarioService.destroyScenario(scenario.id)
        .then(function(response) {
          return scenarioService.listScenarios($ctrl.user.username);
        })
        .then(function(scenario_list_response) {
          if (scenario_list_response !== undefined &&
              scenario_list_response.data !== undefined) {
            $ctrl.scenario_list = scenario_list_response.data;
          }
        });
      }
    }


    function viewSummary(scenario) {
      if (scenario !== undefined &&
          scenario.id !== undefined) {
        $state.go("scenarioSummary", {
          'scenario': scenario.id,
          'module': $ctrl.module,
        });
      }
    }

    function back() {
      $window.location.replace("/dashboard");
    }

    function openCopyScenarioModal() {
      $uibModal.open({
        animation: true,
        size: "lg",
        templateUrl: "/static/scenario/scenario-manager/copy-scenario-modal/copy-scenario-modal.html",
        controller: "CopyScenarioModalController",
        controllerAs: "$ctrl",
        resolve: {
          scenario_list: function() {
            return $ctrl.scenario_list;
          },
        },
      });
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/
  }

}());
