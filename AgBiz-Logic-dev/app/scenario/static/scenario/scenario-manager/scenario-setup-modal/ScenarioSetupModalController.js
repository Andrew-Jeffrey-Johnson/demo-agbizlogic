(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller("ScenarioSetupModalController", ScenarioSetupModalController);

  ScenarioSetupModalController.$inject = [
    "filterFilter",
    "scenarioService",
    "$uibModalInstance",
    "$state"
  ];

  function ScenarioSetupModalController(
    filterFilter,
    scenarioService,
    $uibModalInstance,
    $state) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    vm.$onInit = $onInit;
    vm.proceed = proceed;
    vm.skip = skip;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {

      }




    function proceed() {
      console.log(324)
      var default_scenario = {
        'title': "New Scenario",
        'type':  "finance",
      };
      $uibModalInstance.close();
      scenarioService.createScenario(default_scenario)
      .then(function(new_scenario_response) {
        if (new_scenario_response !== undefined &&
            new_scenario_response.data !== undefined &&
            new_scenario_response.data.id !== undefined &&
            new_scenario_response.data.id > 0 &&
            new_scenario_response.data.title !== undefined) {
          $state.go("scenarioCreate", {
            'scenario': new_scenario_response.data.id,
            'module': "finance",
            'new': 'new',
          });
        }
      });

    }

    function skip() {
      $uibModalInstance.dismiss();
    }

  }

}());
