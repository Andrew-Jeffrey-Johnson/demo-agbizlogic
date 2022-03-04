(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller("AccrualAdjustmentsModalController", AccrualAdjustmentsModalController);

  AccrualAdjustmentsModalController.$inject = [
    "filterFilter",
    "scenarioService",
    "commonService",
    "$uibModalInstance",
    "$state",
    'scenario_list',
  ];

  function AccrualAdjustmentsModalController(
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
    vm.createAccrualAdjustments = createAccrualAdjustments;
    vm.cancel = cancel;

    // Modal
    vm.modal_title;

    // Scenarios
    vm.scenario_list;
    vm.scenario = new Object();
    vm.copy_scenario = new Object();



    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      vm.modal_title = "Choose a Scenario to make accrual adjustments";
      vm.scenario_list = scenario_list;
      retrieveScenarioNameList();
      console.log(vm.scenario_list)
    }


    function selectScenario(scenario) {
      if (scenario !== undefined &&
          scenario.id !== undefined &&
          scenario.id > 0) {
        vm.scenario = scenario;

      }
    }


    function createAccrualAdjustments() {

      //go to accrual adjustments page with right scenario
      $state.go("financeAccrualAdjustments", {
        'scenario' : vm.scenario.id
      });
        $uibModalInstance.dismiss();

    }


    function cancel() {
      $uibModalInstance.dismiss();
    }



    /****************************************************************
                         Private Helper Functions
    ****************************************************************/


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
