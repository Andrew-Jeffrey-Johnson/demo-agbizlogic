(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller('addFinanceScenarioComponentController', addFinanceScenarioComponentController);

    /****************************************************************
                         Controller
    ****************************************************************/

    addFinanceScenarioComponentController.$inject = [
      '$uibModalInstance',
      '$state',
      '$filter',
      '$uibModal',
      'scenarioService',
      // 'finance_scenario',
      'finance_analysis',
      'scenario_list',

    ];

    function addFinanceScenarioComponentController(
      $uibModalInstance,
      $state,
      $filter,
      $uibModal,
      scenarioService,
      // finance_scenario,
      finance_analysis,
      scenario_list
    ) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.addScenario = addScenario;
      $ctrl.addPlan = addPlan;
      $ctrl.removePlan = removePlan;
      $ctrl.updateFinanceScenario = updateFinanceScenario;
      $ctrl.cancel = cancel;
      $ctrl.proceed = proceed;
      $ctrl.add=add;


      // variables
      $ctrl.plan_list = [];
      $ctrl.scenario_list = scenario_list;
      // $ctrl.finance_scenario = finance_scenario;
      $ctrl.finance_analysis=finance_analysis;
      $ctrl.selected_scenario;
      $ctrl.max_plans = 40;
      $ctrl.selected_plan_list = [];
      $ctrl.plans=[];
      $ctrl.selected_scenario;




      /****************************************************************
                           Private Helper Functions
      ****************************************************************/

      function $onInit() {
        // console.log(finance_scenario)
        console.log($ctrl.scenario_list)

        // scenarioService.listPlansByScenario(finance_scenario.id, ["id", "title", "notes", "scenario"])
        // .then(function(plan_response) {
        //   $ctrl.plans = plan_response.data;
        // });
      }

      function add (){
        console.log($ctrl.finance_analysis)
        console.log($ctrl.selected_scenario)
        //$ctrl.selected_scenario.finance_analysis=$ctrl.finance_analysis
        scenarioService.retrieveScenario($ctrl.selected_scenario.id)
        .then(function(xixi){
          console.log(xixi.data)
          var a=xixi.data
          a.finance_analysis.push($ctrl.finance_analysis.id)
          console.log(a)
          scenarioService.updateScenario(a)
        })
        scenarioService.updateScenario($ctrl.selected_scenario)
        .then(function(){
          location.reload();
        })
        // $ctrl.finance_analysis.scenarios=1
        // scenarioService.updateFinanceAnalysis($ctrl.finance_analysis)
        // scenarioService.updateFinanceAnalysis($ctrl.financeAnalysis)
        // .then(function(updated_financeAnalysis_response) {
        //   if (updated_financeAnalysis_response !== undefined &&
        //       updated_financeAnalysis_response.data !== undefined &&
        //       updated_financeAnalysis_response.data.id !== undefined) {
        //     $ctrl.financeAnalysis = updated_financeAnalysis_response.data;
        //   }
        // });
      }

      function addScenario() {
        if ($ctrl.selected_scenario != undefined) {
          scenarioService.retrieveScenario($ctrl.selected_scenario.id, ["id", "title", "plans"])
          .then(function(scenario_response) {
            if (scenario_response !== undefined &&
                scenario_response.data !== undefined) {
              angular.forEach(scenario_response.data.plans, function(plan) {
                addPlan(plan);
              });
              //measurementCheck(scenario_response.data);
            }
          });
        }
      }


      function addPlan(plan) {
        console.log(plan)
        if (plan !== undefined &&
            plan.id !== undefined) {
          scenarioService.copyPlan(plan.id, $ctrl.finance_scenario.id)
          .then(function(new_plan_response) {
            if (new_plan_response !== undefined &&
                new_plan_response.data !== undefined &&
                new_plan_response.data.id !== undefined &&
                new_plan_response.data.id > 0) {
                  console.log($ctrl.finance_scenario.id)
              return scenarioService.listPlansByScenario($ctrl.finance_scenario.id,["id", "title", "notes", "scenario"]);
            }
          })
          .then(function(scenario_response) {
            console.log(scenario_response.data)

              // $ctrl.finance_scenario = scenario_response.data;
              // $ctrl.selected_plan_list = $ctrl.selected_plan_list.concat($ctrl.finance_scenario.plans);
              $ctrl.plans = scenario_response.data;
              console.log($ctrl.plans)
          });
        }
      }


      function removePlan(plan) {
        if (plan !== undefined &&
            plan.id !== undefined &&
            plan.id > 0) {
          scenarioService.destroyPlan(plan.id)
          .then(function(response) {
            return scenarioService.listPlansByScenario($ctrl.finance_scenario.id,["id", "title", "notes", "scenario"]);})
          .then(function(finance_scenario_response) {
              $ctrl.plans = finance_scenario_response.data
              console.log()
          });
        }
      }



      function updateFinanceScenario() {
        if ($ctrl.finance_scenario !== undefined &&
            $ctrl.finance_scenario.title !== undefined &&
            $ctrl.finance_scenario.title.length > 0) {
          scenarioService.updateScenario($ctrl.finance_scenario)
          .then(function(updated_scenario_response) {
            if (updated_scenario_response !== undefined &&
                updated_scenario_response.data !== undefined &&
                updated_scenario_response.data.id !== undefined) {
              $ctrl.finance_scenario = updated_scenario_response.data;
            }
          });
        }
      }

      function cancel() {
        $uibModalInstance.dismiss();
      }
      // function cancel() {
      //   scenarioService.destroyScenario($ctrl.finance_scenario.id)
      //   .then(function(response) {
      //     $uibModalInstance.dismiss();
      //   });
      // }


      function proceed() {
        console.log(1)
        //$uibModalInstance.close($ctrl.finance_scenario);
      }


    }

}());
