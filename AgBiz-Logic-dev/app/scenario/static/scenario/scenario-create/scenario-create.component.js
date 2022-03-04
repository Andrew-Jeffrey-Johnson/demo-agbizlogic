(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("scenarioCreate", {
      templateUrl: "/static/scenario/scenario-create/scenario-create.component.html",
      controller: ScenarioCreateComponentController,
    });


  /****************************************************************
                         Controller
  ****************************************************************/

  ScenarioCreateComponentController.$inject = [
    "$state",
    "scenarioService",
    "commonService",
    "$interval",
  ];

  function ScenarioCreateComponentController(
    $state,
    scenarioService,
    commonService,
    $interval) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.updateScenario = updateScenario;
    $ctrl.addPlan = addPlan;
    $ctrl.removePlan = removePlan;
    $ctrl.newPlan = newPlan;
    $ctrl.proceed = proceed;
    $ctrl.cancel = cancel;
    $ctrl.back = back;
    $ctrl.validateScenarioTitle = validateScenarioTitle;
    $ctrl.new;


    // Scenario
    $ctrl.scenario;
    $ctrl.from_profit;
    $ctrl.plans;
    $ctrl.plan_list;
    $ctrl.module;

    // Errors
    $ctrl.plans_allowed = true;
    $ctrl.max_plans = 5;
    $ctrl.duplicate = false;
    $ctrl.old_title = '';

    //title setValidity
    $ctrl.scenarioTitleArr = [];


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.new =$state.params['new'];
      $ctrl.from_profit=$state.params['from_profit'];
      var scenario_id = $state.params['scenario'];
      $ctrl.module = $state.params['module'];
      if ($ctrl.module=="finance"){
        $ctrl.max_plans=20;
      }
      if (scenario_id === undefined || scenario_id < 1) {
        $state.go("manager");
      }
      else {
        startProgress(10);
        scenarioService.retrieveScenario(scenario_id)
        .then(function(scenario_response) {
          if (scenario_response === undefined ||
              scenario_response.data === undefined ||
              scenario_response.data.id === undefined ||
              scenario_response.data.id < 1) {
                $state.go("manager");
          }
          else {
            $ctrl.scenario = scenario_response.data;
            console.log($ctrl.scenario);
            /*If it is a default name, 'New Scenario', set it as blank to force users name it*/
            if ( $ctrl.scenario.title === 'New Scenario' ) {
              $ctrl.scenario.title = "";
              $ctrl.old_title = "";
              $ctrl.form.name.$setValidity("notempty", false);
            //  $ctrl.form.name.$setValidity("unique", true);
          }else if ($ctrl.new=='manager') {
            $ctrl.old_title = "";
            $ctrl.form.name.$setValidity("unique", false);
          }else {
              $ctrl.old_title = $ctrl.scenario.title;
              //$ctrl.form.name.$setValidity("notempty", true);
              //$ctrl.form.name.$setValidity("unique", true);
            }
            scenarioService.listPlansByScenario(scenario_id, ["id", "title", "notes", "scenario", "full_title"])
            .then(function(plan_response) {
              $ctrl.plans = plan_response.data;
              console.log($ctrl.plans)

              // Check if maximum plans per scenario has been reached
              if ($ctrl.plans.length == $ctrl.max_plans) {
                $ctrl.plans_allowed = false;
              }
              else {
                $ctrl.plans_allowed = true;
              }

            });
            return commonService.retrieveCurrentUser();
          }
        })
        .then(function(current_user_response) {
          if (current_user_response !== undefined &&
              current_user_response.data !== undefined) {
            $ctrl.current_user = current_user_response.data;

            retrieveScenarioNameList();
            //return scenarioService.listPlans($ctrl.current_user.username);
            return scenarioService.listPlans($ctrl.current_user.username, "all", ["id", "title", "scenario","full_title"]);
            // return scenarioService.listPlans($ctrl.current_user.username,"all");

          }
        })
        .then(function(plans_list_response) {
          if (plans_list_response !== undefined &&
              plans_list_response.data !== undefined) {
            $ctrl.plan_list = plans_list_response.data;
            sortOn($ctrl.plan_list,"title")
          }
        });
      }
    }


    function updateScenario() {
      if ($ctrl.scenario !== undefined &&
          $ctrl.scenario.title !== undefined &&
          $ctrl.scenario.title.length > 0 &&
          validation()) {
        scenarioService.updateScenario($ctrl.scenario)
        .then(function(updated_scenario_response) {
          if (updated_scenario_response !== undefined &&
              updated_scenario_response.data !== undefined &&
              updated_scenario_response.data.id !== undefined) {
            $ctrl.scenario = updated_scenario_response.data;
          }
        });
      }
    }


    function addPlan(plan) {
      startProgress(1);
      console.log(plan);

      if (plan !== undefined &&
          plan.id !== undefined && plan.scenario !== null) {
        scenarioService.copyPlan(plan.id, $ctrl.scenario.id)
        .then(function(new_plan_response) {
          if (new_plan_response !== undefined &&
              new_plan_response.data !== undefined &&
              new_plan_response.data.id !== undefined &&
              new_plan_response.data.id > 0) {
            return scenarioService.listPlansByScenario($ctrl.scenario.id, ["id", "title", "notes", "scenario", "full_title"]);
          }
        })
        .then(function(add_plan_response) {
          if (add_plan_response !== undefined &&
              add_plan_response.data !== undefined &&
              add_plan_response.data.id !== undefined &&
              add_plan_response.data.id > 0) {
            $ctrl.plans = add_plan_response.data;
          }
        });
        $state.reload();
      } else if(plan.scenario == null) {
        plan.scenario = $ctrl.scenario.id;
        plan.scenario_list = $ctrl.scenario.title;
        console.log(plan);
        scenarioService.updatePlan(plan)
        .then(function(new_plan_response) {
          console.log(new_plan_response);
          if (new_plan_response !== undefined &&
              new_plan_response.data !== undefined &&
              new_plan_response.data.id !== undefined &&
              new_plan_response.data.id > 0) {
            return scenarioService.listPlansByScenario($ctrl.scenario.id, ["id", "title", "notes", "scenario", "full_title"]);
          }
        })
        .then(function(add_plan_response) {
          if (add_plan_response !== undefined &&
              add_plan_response.data !== undefined) {
            $ctrl.plans = add_plan_response.data;
            console.log($ctrl.plans);
            //$state.reload();
          }
        });
      }
    }

    function sortOn (arr, prop) {
    arr.sort (
        function (a, b) {
            if (a[prop] < b[prop]){
                return -1;
            } else if (a[prop] > b[prop]){
                return 1;
            } else {
                return 0;
            }
        }
    );
    }

    function removePlan(plan) {
      startProgress(1);

      if (plan !== undefined &&
          plan.id !== undefined &&
          plan.id > 0) {
        plan.scenario = null;
        console.log(plan);
        scenarioService.updatePlan(plan)
        .then(function(new_plan_response) {
          console.log(new_plan_response);
          if (new_plan_response !== undefined &&
              new_plan_response.data !== undefined &&
              new_plan_response.data.id !== undefined &&
              new_plan_response.data.id > 0) {
            return scenarioService.listPlansByScenario($ctrl.scenario.id, ["id", "title", "notes", "scenario", "full_title"]);
          }
        })
        .then(function(plans_response) {
          if (plans_response !== undefined &&
              plans_response.data !== undefined &&
              plans_response.data.id !== undefined &&
              plans_response.data.id > 0) {
            $ctrl.plans = add_plan_response.data;
            console.log($ctrl.plans);
          }
        });
      }
    }


    function newPlan() {
      if($ctrl.module === undefined){
        $ctrl.module = 'profit';
      }
      var new_plan = {
        'title': "New Plan",
        'scenario': $ctrl.scenario.id,
        'notes': "",
        'discount_rate': 0,
        'beginning_investment': 0,
        'ending_investment': 0,
        'lease_type': "Default",
        'land_market_value': 0,
        'annual_land_rate': 0,
        'required_roi': 0,
        'investment_inflation': 0,
      };
      scenarioService.createPlan(new_plan)
      .then(function(new_plan_response) {
        if (new_plan_response !== undefined &&
            new_plan_response.data !== undefined &&
            new_plan_response.data.id !== undefined) {
          $state.go("planCreate", {
            'plan': new_plan_response.data.id,
            'module' : $ctrl.module
          });
        }
      });
    }

    function validateScenarioTitle() {
      var new_title = $ctrl.scenario.title;

      if (new_title !== undefined && new_title.length !== '' && new_title === $ctrl.old_title) {
        $ctrl.form.name.$setValidity("unique", true);
        $ctrl.form.name.$setValidity("notempty", true);
      }
      else if ( new_title !== undefined && new_title.length !== '' && $ctrl.scenarioTitleArr.indexOf(new_title) === -1 ) {
        $ctrl.form.name.$setValidity("unique", true);
        $ctrl.form.name.$setValidity("notempty", true);
      }
      else if ( new_title === undefined || new_title.length === '' ) {
        $ctrl.form.name.$setValidity("notempty", false);
        $ctrl.form.name.$setValidity("unique", true);
      }
      else {
        $ctrl.form.name.$setValidity("notempty", true);
        $ctrl.form.name.$setValidity("unique", false);
      }
    }


    function proceed() {
      var scenario_id = $state.params['scenario'];
      $ctrl.new =$state.params['new'];
      console.log($ctrl.new)
      startProgress(1);
      if($ctrl.new==="new"){
        buildDate();
      }

      if($ctrl.module === undefined){
        $ctrl.module = 'profit';
      }
      if ($ctrl.scenario !== undefined &&
          $ctrl.scenario.id !== undefined) {
        scenarioService.updateScenario($ctrl.scenario)
        .then(function(updated_scenario_response) {
          console.log(1)
          if ($ctrl.module === "profit" &&$ctrl.from_profit==undefined) {
            $state.go("scenarioDiscountRate", {
              'scenario': $ctrl.scenario.id,
              'module':$ctrl.module
            });
          }
          if ($ctrl.module === "profit" &&$ctrl.from_profit=="true") {
            $state.go("scenarioDiscountRate", {
              'scenario': $ctrl.scenario.id,
              'module':$ctrl.module,
              'from_profit':"true"
            });
          }
          if ($ctrl.module === "scenario") {
            $state.go("scenarioSummary", {
              'scenario': $ctrl.scenario.id,
              'module':$ctrl.module,
              'edited':"true"
            });
          } else if ($ctrl.module === "finance") {
            $state.go("financeDistributions", {
              'scenario': $ctrl.scenario.id,
              'module':$ctrl.module,
              'new':$ctrl.new,
            });
          }
        });
      }
    }


    function buildDate(){
      var scenario_id = $state.params['scenario'];
      for(var b=1;b<11;b++){
        //console.log("---------")
        //console.log(b)

         //console.log($ctrl.acres_arr[b])
         scenarioService.createDistributions({"year":b ,"scenario":scenario_id});

       }
    }

    function back(){
        if ($ctrl.from_profit=="true"){
          $state.go("profitSummary", {
              'scenario': $ctrl.scenario.id,
              'module': $ctrl.module,
              'from_profit':"true"
          });
        }
        else if($ctrl.module=="profit"){
          $state.go("scenarioManager", {'module':$ctrl.module});
        }

        else{
          $state.go("scenarioSummary", {
              'scenario': $ctrl.scenario.id,
              'module': $ctrl.module,
          });
      }


    }
    function cancel() {
      startProgress(1);
      if($ctrl.module === undefined){
        $ctrl.module = 'profit';
      }
      if ($ctrl.scenario !== undefined) {
        scenarioService.destroyScenario($ctrl.scenario.id)
        .then(function(response) {
          $state.go("scenarioManager", {'module':$ctrl.module});
        });
      }
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

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


    /*Validate the title name before update the scenario*/
    function validation() {
      if ( $ctrl.form.length == null ){
        return true;
      }
      else{
        if ( $ctrl.form.name.$error.notempty || $ctrl.form.name.$error.unique || $ctrl.scenario.title === undefined || $ctrl.scenario.title.length === 0 ) {
          return false;
        }
        else {
          return true;
        }
      }

    }


    /*Retrieve all scenario names for detecting duplicate name*/
    function retrieveScenarioNameList() {
      var scenario_title_list ;

      scenarioService.listScenarios($ctrl.current_user.username, "title")
      .then(function(scenario_title_list_response) {
        if (scenario_title_list_response !== undefined &&
            scenario_title_list_response.data !== undefined) {
          scenario_title_list = scenario_title_list_response.data;
          $ctrl.scenarioTitleArr = scenario_title_list.map(function(scenario){ return scenario.title });
        }
      });
    }

  }

}());
