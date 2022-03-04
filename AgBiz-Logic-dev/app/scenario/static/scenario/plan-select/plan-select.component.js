(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("planSelect", planSelect());

  function planSelect() {
    var component = {
      templateUrl: "/static/scenario/plan-select/plan-select.component.html",
      controller: PlanSelectComponentController,
      bindings: {
        planList: "<",
        optionList: "<",
        itemLimit: "<",
        editable: "<",
        onDelete: "&",
        onEdit: "&",
        onAdd: "&",
        onNew: "&",
        module: "<",
      },
    };

    return component;
  }


  /****************************************************************
                       Controller
  ****************************************************************/

  PlanSelectComponentController.$inject = [
    '$state',
    'commonService',
    'scenarioService'
  ];

  function PlanSelectComponentController(
    $state,
    commonService,
    scenarioService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.$onChanges = $onChanges;
    $ctrl.selectPlan = selectPlan;
    $ctrl.addScenarioPlan = addScenarioPlan;

    // Item list
    $ctrl.planList;
    $ctrl.scenario_list;

    // Budget
    $ctrl.new_plan;

    // Misc
    $ctrl.itemLimit;
    $ctrl.items_allowed;
    $ctrl.editable;
    $ctrl.showNotes;
    $ctrl.selected_scenario;
    $ctrl.scenario_id;


    /****************************************************************
                         Controller Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.scenario_id=$state.params['scenario']
      $ctrl.items_allowed = true;
      //get scenario list
      commonService.retrieveCurrentUser()
      .then(function(current_user_response) {
        $ctrl.user = current_user_response.data;
        return scenarioService.listScenarios($ctrl.user.username, ["id", "title","full_title"]);
      })
      .then(function(scenario_list_response) {
        if (scenario_list_response !== undefined &&
            scenario_list_response.data !== undefined) {

          $ctrl.scenario_list =scenario_list_response.data.filter(function(data){
            console.log(data)
            return data.id!=$ctrl.scenario_id
          });
          console.log($ctrl.scenario_list)
        }
      });


      if ($ctrl.editable === undefined) {
        $ctrl.editable = true;
      }

      if ($ctrl.module === 'finance') {
        $ctrl.showNotes = false;
      }
      else if ($ctrl.showNotes === undefined) {
        $ctrl.showNotes = true;
      }
    }

    function addScenarioPlan() {
      console.log("here we are");

      scenarioService.listPlansByScenario($ctrl.selected_scenario.id)
      .then(function (plan_response){
        console.log(plan_response.data)
        angular.forEach(plan_response.data, function(plan) {
          $ctrl.onAdd({plan: plan});
        });

      })
      // console.log($ctrl.selected_scenario);
      // scenarioService.retrieveScenario($ctrl.selected_scenario.id, ["plans"])
      // .then(function(scenario_response) {
      //   console.log(scenario_response)
      //   if (scenario_response !== undefined &&
      //       scenario_response.data !== undefined) {
      //     var plans = scenario_response.data.plans;
      //     console.log(scenario_response.data)
      //
      //
      //
      //
      //
      //     angular.forEach(plans, function(plan) {
      //       console.log(plan);
      //       console.log(123)
      //       $ctrl.onAdd({plan: plan, scenarioTitle: $ctrl.selected_scenario.title});
      //     });
      //   }
      // });
    }


    function $onChanges(changes) {
      checkList();
    }


    function selectPlan(plan) {
      if (plan !== undefined &&
          plan.id !== undefined &&
          plan.id > 0) {
        $ctrl.new_plan = plan;
      }
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Checks if the item list is over/under the limit.
    */
    function checkList() {
      if ($ctrl.planList !== undefined) {
        if ($ctrl.planList.length >= $ctrl.itemLimit) {
          $ctrl.items_allowed = false;
        }
        else {
          $ctrl.items_allowed = true;
        }
      }
    }



  }

})();
