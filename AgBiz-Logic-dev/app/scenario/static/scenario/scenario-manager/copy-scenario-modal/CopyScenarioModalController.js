(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller("CopyScenarioModalController", CopyScenarioModalController);

  CopyScenarioModalController.$inject = [
    "filterFilter",
    "scenarioService",
    "commonService",
    "$uibModalInstance",
    "$state",
    'scenario_list',
  ];

  function CopyScenarioModalController(
    filterFilter,
    scenarioService,
    commonService,
    $uibModalInstance,
    $state,
    scenario_list) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/
    // Methods
    vm.$onInit = $onInit;
    vm.selectScenario = selectScenario;
    vm.addNewScenario = addNewScenario;
    vm.cancel = cancel;
    vm.Validate = Validate;

    // Modal
    vm.modal_title;

    // Scenarios
    vm.scenario_list;
    vm.scenario = new Object();
    vm.copy_scenario = new Object();

    // title validity
    vm.scenarioTitleArr = [];
    vm.new_name = "";
    vm.duplicateScenarioTitle = false;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      vm.modal_title = "Choose a Scenario to copy"; 
      vm.scenario_list = scenario_list;
      retrieveScenarioNameList();
    }


    function selectScenario(scenario) {
      if (scenario !== undefined &&
          scenario.id !== undefined &&
          scenario.id > 0) {
        vm.scenario = scenario;
      }
    }


    function Validate() {
      vm.duplicateScenarioTitle = duplicateScenarioTitle(vm.new_name);
    }


    function addNewScenario() {
      scenarioService.copyScenario(vm.scenario)
      .then(function(copy_scenario_response) {
        if (copy_scenario_response !== undefined &&
            copy_scenario_response.data !== undefined &&
            copy_scenario_response.data.id !== undefined &&
            copy_scenario_response.data.id > 0) {
          vm.copy_scenario = copy_scenario_response.data;
          vm.copy_scenario.created_date = new Date();
          vm.copy_scenario.modified_date = new Date();
          vm.copy_scenario.title = vm.new_name;
          scenarioService.updateScenario(vm.copy_scenario);
          $uibModalInstance.close();
          $state.reload();
        }
      });
    }


    function cancel() {
      $uibModalInstance.dismiss();
    }



    /****************************************************************
                         Private Helper Functions
    ****************************************************************/


    function duplicateScenarioTitle(title) {
      var scenarioTitle = document.getElementsByName("scenarioTitle")[0];
      if ( title !== '' && vm.scenarioTitleArr.indexOf(title) === -1 ) {
        scenarioTitle.style.borderColor = "";
        return false;
      } else {
        scenarioTitle.style.borderColor = "red";
        return true;
      }
    }


    function retrieveScenarioNameList() {
      commonService.retrieveCurrentUser().then(function(response) {
        var current_user = response.data;
          scenarioService.listScenarios(current_user.username, "title")
          .then(function(scenario_title_list_response) {
            if (scenario_title_list_response !== undefined &&
                scenario_title_list_response.data !== undefined) {
                  var scenario_title_list = scenario_title_list_response.data;
                  vm.scenarioTitleArr = scenario_title_list.map(function(scenario){ return scenario.title });
            }
          });
        });
    }


  }

}());
