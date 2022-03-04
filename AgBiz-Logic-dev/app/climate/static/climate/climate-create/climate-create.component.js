(function() {
  'use strict';

  angular
    .module("climateModule")
    .component("climateCreateScenario", {
      templateUrl: "/static/climate/climate-create/climate-create.component.html",
      controller: ClimateCreateScenarioController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ClimateCreateScenarioController.$inject = [
    "$state",
    '$interval',
    'climateService',
    'budgetService',
    "commonService",
  ];

  function ClimateCreateScenarioController(
    $state,
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
    $ctrl.proceed = proceed;
    $ctrl.updateScenario = updateScenario;
    $ctrl.addBudget = addBudget;
    $ctrl.removeBudget = removeBudget;
    $ctrl.editBudget = editBudget;
    $ctrl.cancel = cancel;
    $ctrl.back = back;
    $ctrl.destroyAfterBudgets = destroyAfterBudgets;

    // New ClimateScenario object
    $ctrl.climate_scenario = {};
    $ctrl.new_budget = {};

    // Misc
    $ctrl.current_user = {};
    $ctrl.budget_list = [];
    $ctrl.max_budgets = 5;
    $ctrl.budgets_allowed = 1;
    $ctrl.progress = 100;
    $ctrl.confirm_cancel = false;
    $ctrl.is_new = false;
    $ctrl.allVisibleBudgets = [];
    // Errors
    $ctrl.is_error;



    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      var scenario_id = $state.params['scenario'];


      if (scenario_id === undefined || scenario_id < 1) {
        $state.go("manager");
      }
      else {
        startProgress(1);
        console.log($ctrl.is_new)
        $ctrl.is_new = $state.params['new'] === "true";
        console.log($ctrl.is_new)
        climateService.retrieveScenario(scenario_id)
        .then(function(climate_scenario_response) {
          if (climate_scenario_response === undefined ||
              climate_scenario_response.data === undefined ||
              climate_scenario_response.data.id === undefined ||
              climate_scenario_response.data.id < 1) {
            $state.go("manager");
          }
          else {
            $ctrl.climate_scenario = climate_scenario_response.data;
            // destroyAfterBudgets();

            // Check if maximum budgets per scenario has been reached
            if ($ctrl.climate_scenario.climate_budgets.length == $ctrl.max_budgets) {
              $ctrl.budgets_allowed = 0;
            }
            else {
              $ctrl.budgets_allowed = 1;
            }

            return commonService.retrieveCurrentUser();
          }
        })
        .then(function(current_user_response) {
          angular.forEach($ctrl.climate_scenario.climate_budgets,function(value,key){
              if(!value['is_original']){
                 location.reload();
              }
          });
          if (current_user_response !== undefined &&
              current_user_response.data !== undefined) {
                $ctrl.current_user = current_user_response.data;

            return budgetService.listBudgets($ctrl.current_user.username, "", "allocate");
          }
        })
        .then(function(budget_list_response) {
          if (budget_list_response !== undefined &&
              budget_list_response.data !== undefined) {
             $ctrl.budget_list = budget_list_response.data;

          }
        });
      }

    }


    function updateScenario() {
      climateService.updateScenario($ctrl.climate_scenario)
      .then(function(updated_climate_scenario_response) {
        if (updated_climate_scenario_response !== undefined &&
            updated_climate_scenario_response.data !== undefined &&
            updated_climate_scenario_response.data.id !== undefined) {
          $ctrl.climate_scenario = updated_climate_scenario_response.data;
        }
      });
    }


    function addBudget(budget) {
      if (budget.id !== undefined && $ctrl.budgets_allowed) {
        startProgress(2);

        climateService.generateClimateBudget(budget.id, $ctrl.climate_scenario.id)
        .then(function(climate_budget_response) {
          //#TODO: review this copy and update
          var updated_scenario = angular.copy($ctrl.climate_scenario);
          if ($ctrl.climate_scenario.title == "") {
            updated_scenario.title = "New Climate Scenario";
          }

          return climateService.updateScenario(updated_scenario);
        })
        .then(function(updated_scenario_response) {
          if (updated_scenario_response !== undefined &&
              updated_scenario_response.data !== undefined &&
              updated_scenario_response.data.id !== undefined &&
              updated_scenario_response.data.id > 0) {
            $ctrl.climate_scenario = updated_scenario_response.data;

            // Check if maximum budgets per scenario has been reached
            if ($ctrl.climate_scenario.climate_budgets.length == $ctrl.max_budgets) {
              $ctrl.budgets_allowed = 0;
            }

          }
        });
      }
    }


    function removeBudget(climate_budget) {
      startProgress(2);

      budgetService.destroyBudget(climate_budget.budget)
      .then(function() {
        return climateService.retrieveScenario($ctrl.climate_scenario.id);
      })
      .then(function(climate_scenario_response) {
        if (climate_scenario_response !== undefined &&
            climate_scenario_response.data !== undefined &&
            climate_scenario_response.data.id !== undefined &&
            climate_scenario_response.data.id > 0) {
          $ctrl.climate_scenario = climate_scenario_response.data;
          // Check if maximum budgets per scenario has been reached
          if ($ctrl.climate_scenario.climate_budgets.length < $ctrl.max_budgets) {
            $ctrl.budgets_allowed = 1;
          }
          else {
            $ctrl.budgets_allowed = 0;
          }
        }
      });
    }

    function destroyAfterBudgets(){

            angular.forEach($ctrl.climate_scenario.climate_budgets,function(value,key){
                if(!value['is_original']){
                  removeBudget(value);
                }
            });

    }


    function hideAfterBudgets(  ){

          var del_budgets = [];

           angular.forEach($ctrl.climate_scenario.climate_budgets,function(value,key){
              if(!value['is_original']){
                del_budgets.push(key);
              }
            });

           angular.forEach(del_budgets.reverse(),function(value){
              $ctrl.climate_scenario.climate_budgets.splice(value,1);
           });

  }
    function editBudget(budget) {
      if (budget !== undefined && $ctrl.budgets_allowed) {
        startProgress(3 + budget.cost_items.length + budget.income_items.length);

        var new_climate_budget;

        climateService.generateClimateBudget(budget.id, $ctrl.climate_scenario.id)
        .then(function(climate_budget_response) {
          if (climate_budget_response !== undefined &&
              climate_budget_response.data !== undefined &&
              climate_budget_response.data.id !== undefined &&
              climate_budget_response.data.id > 0) {
            new_climate_budget = climate_budget_response.data;
            var updated_scenario = angular.copy($ctrl.climate_scenario);

            if ($ctrl.climate_scenario.title == "") {
              updated_scenario.title = "New Climate Scenario";
            }
            return climateService.updateScenario(updated_scenario);
          }
        })
        .then(function(updated_scenario_response) {
          if (updated_scenario_response !== undefined &&
              updated_scenario_response.data !== undefined &&
              updated_scenario_response.data.id !== undefined &&
              updated_scenario_response.data.id > 0) {
            $ctrl.climate_scenario = updated_scenario_response.data;
            // Check if maximum budgets per scenario has been reached
            if ($ctrl.climate_scenario.climate_budgets !== undefined &&
                $ctrl.climate_scenario.climate_budgets.length == $ctrl.max_budgets) {
              $ctrl.budgets_allowed = 0;
            }

            if (new_climate_budget !== undefined &&
                new_climate_budget.id !== undefined &&
                new_climate_budget.budget !== undefined) {
              $state.go("budgetEditor", {
                'module': "climate",
                'original': "original",
                'scenario': $ctrl.climate_scenario.id,
                'climate_budget': new_climate_budget.id,
                'budget': new_climate_budget.budget,
              });
            }
          }
        });
      }
    }


    function proceed() {
      // Clear errors
      $ctrl.is_error = 0;
      $ctrl.errors = [];

      checkValid();
      if ($ctrl.is_error == 0) {
        startProgress(2);
        // Update ClimateScenario fields, and go to next state
        $ctrl.climate_scenario.modified_date = new Date();
        climateService.updateScenario($ctrl.climate_scenario)
        .then(function(updated_scenario_response) {
          $state.go("regionSelect", {'scenario': $ctrl.climate_scenario.id});
        });
      }

    }


    function cancel() {
      startProgress(($ctrl.climate_scenario.climate_budgets.length * 5) + 1);

      angular.forEach($ctrl.climate_scenario.climate_budgets, function(climate_budget) {
        budgetService.destroyBudget(climate_budget.budget);
      });
      climateService.destroyScenario($ctrl.climate_scenario.id).then(function(response) {
        $state.go("manager");
      });
    }


    function back() {
      $state.go("manager");
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    function checkClimateBudget(budget) {
      // Add 'Climate' identifier text to title and notes if needed
      if (budget.title.indexOf('Climate') == -1) {
        budget.title += ' (Climate)';
      }
      if (budget.notes.indexOf('Climate') == -1) {
        budget.notes += ' (created using AgBiz Climate)';
      }
      return budget;
    }


    function checkValid() {
      var number_of_budgets = 0;

      // Title undefined
      if ($ctrl.climate_scenario.title == "") {
        $ctrl.is_error = 1;
      }
      // Budgets undefined
      if ($ctrl.climate_scenario.climate_budgets === undefined) {
        $ctrl.is_error = 2;
      }
      // At least one climate budget saved
      if ($ctrl.climate_scenario.climate_budgets.length < 1) {
        $ctrl.is_error = 3;
      }
    }


    /*
        Faux progress method. Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function() {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }

  }



})();
