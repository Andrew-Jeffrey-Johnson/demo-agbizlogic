(function() {
  'use strict';

  angular
    .module("climateModule")
    .component("climateManager", {
      templateUrl: "/static/climate/climate-manager/climate-manager.component.html",
      controller: ClimateManagerController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ClimateManagerController.$inject = [
    '$scope',
    '$state',
    '$uibModal',
    '$q',
    '$interval',
    'climateService',
    'budgetService',
    'commonService'
  ];

  function ClimateManagerController(
    $scope,
    $state,
    $uibModal,
    $q,
    $interval,
    climateService,
    budgetService,
    commonService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.removeScenario = removeScenario;
    $ctrl.newScenario = newScenario;
    $ctrl.editScenario = editScenario;
    $ctrl.viewSummary = viewSummary;
    $ctrl.viewClimateManagerHelp = viewClimateManagerHelp;
    $ctrl.back=back;

    // ClimateScenario objects
    $ctrl.scenario_list = [];
    $ctrl.current_user = {};

    // Misc
    $ctrl.progress = 100;
    $ctrl.confirm = [];


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      // Load user if needed
      commonService.retrieveCurrentUser()
      .then(function(current_user_response) {
        if (current_user_response !== undefined &&
            current_user_response.data !== undefined &&
            current_user_response.data.id !== undefined &&
            current_user_response.data.id > 0 &&
            current_user_response.data.username !== undefined) {
          $ctrl.current_user = current_user_response.data;

          return climateService.listScenarios($ctrl.current_user.username);
        }
      })
      .then(function(scenario_list_response) {
        if (scenario_list_response !== undefined &&
            scenario_list_response.data !== undefined) {
          $ctrl.scenario_list = scenario_list_response.data;
          resetConfirm($ctrl.scenario_list);
        }
      });
    }


    function removeScenario(scenario) {
      startProgress(2);
      // Call data service to destroy each associated climate budget's target budget (Django performs ON DELETE CASCADE)
      angular.forEach(scenario.climate_budgets, function(climate_budget) {
        budgetService.destroyBudget(climate_budget.budget);
       });

      // Call data service to destroy scenario
      climateService.destroyScenario(scenario.id)
      .then(function() {
        return climateService.listScenarios($ctrl.current_user.username);
      })
      .then(function(climate_scenario_list_response) {
        if (climate_scenario_list_response != undefined && climate_scenario_list_response.data !== undefined) {
          $ctrl.scenario_list = climate_scenario_list_response.data;
        }
      });
    }


    function newScenario() {
      startProgress(1);

      var new_climate_scenario = {
        'title': "New Climate Scenario",
      };

      climateService.createScenario(new_climate_scenario)
      .then(function(climate_scenario_response) {
        if (climate_scenario_response !== undefined &&
            climate_scenario_response.data !== undefined &&
            climate_scenario_response.data.id !== undefined &&
            climate_scenario_response.data.id > 0) {
          $state.go("create", {
            'scenario': climate_scenario_response.data.id,
            'new':true,
          });
        }
      });
    }


    function editScenario(climate_scenario) {
      if (climate_scenario !== undefined &&
          climate_scenario.id !== undefined &&
          climate_scenario.id > 0) {
        $state.go("create", {
          'scenario': climate_scenario.id,
          'new': false,
        });
      }
    }

    function viewSummary(climate_scenario) {
      if (climate_scenario !== undefined &&
          climate_scenario.id !== undefined &&
          climate_scenario.id > 0) {
        $state.go("summary", {
          'scenario': climate_scenario.id,
        });
      }
    }

    function viewClimateManagerHelp(){
      //console.log("Called modal...")
      openClimateManagerHelpModal();
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Faux progress method.  Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function() {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }
    function back() {
      window.location.replace("/dashboard");
    }


    /*
        Resets all elements of the array of confirm flags to 0. Creates a confirm elements
        for each member of the input object.
    */
    function resetConfirm(object) {
      $ctrl.confirm = [];
      angular.forEach(object, function() {
        $ctrl.confirm.push(0);
      });
    }

    function openClimateManagerHelpModal() {
      //console.log("Called modal...")
      var modal = $uibModal.open({
        animation: true,
        templateUrl: '/static/climate/climate-manager/climate-manager-help-modal/climate-manager-help-modal.html',
      });
    }


  }

})();
