(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeAnalysis", {
      templateUrl: "/static/scenario/finance-analysis/finance-analysis.component.html",
      controller: FinanceAnalysisComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceAnalysisComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      "$uibModal"
    ];

    function FinanceAnalysisComponentController(
      $state,
      $filter,
      commonService,
      scenarioService,
      $uibModal) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/


      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.proceed = proceed;
      $ctrl.back = back;
      $ctrl.updateFinanceAnalysis = updateFinanceAnalysis;
      $ctrl.addFinanceScenario = addFinanceScenario;
      $ctrl.editFinanceScenario = editFinanceScenario;
      $ctrl.removeFinanceScenario = removeFinanceScenario;
      $ctrl.removeFinanceScenarioWithoutIndex = removeFinanceScenarioWithoutIndex;
      $ctrl.validateFinanceAnalysisTitle = validateFinanceAnalysisTitle;
      $ctrl.add = add;


      // Scenario
      $ctrl.scenario_list;
      $ctrl.plan_list;
      $ctrl.module;
      $ctrl.selected_scenario;
      $ctrl.selected_scenario_list;
      $ctrl.selected_plan;
      $ctrl.finance_scenario_list = [];
      $ctrl.finance_scenario_list_with_plans=[]; // add plans to this list to show in the html pages
      $ctrl.financeAnalysis;
      $ctrl.plans=[];
      $ctrl.id

      $ctrl.financeAnalysisTitleArr = [];



      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        $(document).ready(function() {
          $('#example').DataTable( {
              "scrollY": 200,
              "scrollX": true
          } );
        } );
        $ctrl.module = $state.params['module'];
        $ctrl.id = $state.params['analysis'];

        scenarioService.retrieveFinanceAnalysis($ctrl.id)
        .then(function(financeAnalysis_response) {
          if (financeAnalysis_response !== undefined &&
              financeAnalysis_response.data !== undefined) {
            $ctrl.financeAnalysis = financeAnalysis_response.data;
            if ( $ctrl.financeAnalysis.title === 'New Finance Analysis' ) {
              $ctrl.financeAnalysis.title = "";
              $ctrl.old_title = "";
              $ctrl.form.name.$setValidity("notempty", false);
            //  $ctrl.form.name.$setValidity("unique", true);
            }else {
              $ctrl.old_title = $ctrl.financeAnalysis.title;
              //$ctrl.form.name.$setValidity("notempty", true);
              //$ctrl.form.name.$setValidity("unique", true);
            }
            console.log($ctrl.financeAnalysis)
            $ctrl.finance_scenario_list = $ctrl.finance_scenario_list_with_plans = $ctrl.financeAnalysis.scenarios;
            console.log(  $ctrl.finance_scenario_list)
            // angular.forEach($ctrl.finance_scenario_list_with_plans, function(value, key) {
            // scenarioService.listPlansByScenario(value.id).then(function(plans){
            //   console.log(plans.data)
            //   $ctrl.finance_scenario_list_with_plans[key].plans=plans.data
            //   //$ctrl.finance_scenario_list_with_plans[key].plans.push(plans.data)
            // })
            // });
            console.log($ctrl.finance_scenario_list_with_plans)
          }
        });

        commonService.retrieveCurrentUser()
        .then(function(current_user_response) {
          $ctrl.user = current_user_response.data;
          retrieveFinanceAnalysisNameList();
          return scenarioService.listScenarios($ctrl.user.username, ["id", "title", "notes", "created_date", "modified_date", "type"]);
        })
        .then(function(scenario_list_response) {
          if (scenario_list_response !== undefined &&
              scenario_list_response.data !== undefined) {
            $ctrl.scenario_list = scenario_list_response.data;
            // filter for finance type scenarios
            $ctrl.scenario_list=$ctrl.scenario_list.filter(function(scenario) {
              return scenario.type === "finance"
            });
            console.log($ctrl.scenario_list);
          }
          // scenarioService.listPlans($ctrl.user.username, "all", ["id", "title"])
          // .then(function(plans_response) {
          //   if(plans_response !== undefined &&
          //      plans_response.data !== undefined) {
          //        $ctrl.plan_list = plans_response.data;
          //      }
          // });
        });
      }

      function editFinanceScenario(finance_scenario, index) {
        var modal = $uibModal.open({
          animation: true,
          templateUrl: '/static/scenario/finance-analysis/addFinanceScenario/addFinanceScenario.component.html',
          controller: 'addFinanceScenarioComponentController',
          controllerAs: '$ctrl',
          resolve: {
            finance_scenario: function() {
              return finance_scenario;
            },
            plan_list: function() {
              return $ctrl.plan_list;
            },
            scenario_list: function() {
              return $ctrl.scenario_list;
            }
          },
        });

        modal.result.then(function(financeScenario) {
          $ctrl.finance_scenario_list[index] = financeScenario;
        });
      }

      function updateFinanceAnalysis() {
        if ($ctrl.financeAnalysis !== undefined &&
            $ctrl.financeAnalysis.title !== undefined &&
            $ctrl.financeAnalysis.title.length > 0) {
          scenarioService.updateFinanceAnalysis($ctrl.financeAnalysis)
          .then(function(updated_financeAnalysis_response) {
            if (updated_financeAnalysis_response !== undefined &&
                updated_financeAnalysis_response.data !== undefined &&
                updated_financeAnalysis_response.data.id !== undefined) {
              $ctrl.financeAnalysis = updated_financeAnalysis_response.data;
            }
          });
        }
      }

      function removeFinanceScenarioWithoutIndex(finance_scenario) {
        console.log(finance_scenario);
        removeFinanceScenario(finance_scenario, $ctrl.finance_scenario_list.indexOf(finance_scenario));
      }

      function removeFinanceScenario(finance_scenario, index) {
        $ctrl.finance_scenario_list.splice(index, 1);
        $ctrl.financeAnalysis.scenarios = $ctrl.finance_scenario_list;

        if (finance_scenario !== undefined &&
            finance_scenario.id !== undefined &&
            finance_scenario.id > 0) {
            console.log(finance_scenario)
            finance_scenario.finance_analysis.pop($ctrl.id)
            scenarioService.updateScenario(finance_scenario)
            .then(function(financeScenario_response) {
              console.log(financeScenario_response);
                if(financeScenario_response.status == 200){
                  console.log(finance_scenario_list_with_plans);
                }
            });
          // scenarioService.destroyScenario(finance_scenario.id)
          // .then(function(response) {
          //   return scenarioService.retrieveFinanceAnalysis($ctrl.financeAnalysis.id);
          // })
          // .then(function(financeAnalysis_response) {
          //   if (financeAnalysis_response !== undefined &&
          //       financeAnalysis_response.data !== undefined &&
          //       financeAnalysis_response.data.id !== undefined &&
          //       financeAnalysis_response.data.id > 0) {
          //     $ctrl.financeAnalysis = financeAnalysis_response.data;
          //   }
          // });
        }
      }

      function validateFinanceAnalysisTitle() {
        console.log("checking title");
        var new_title = $ctrl.financeAnalysis.title;
        if (new_title !== undefined && new_title !== '' && (new_title === $ctrl.old_title || $ctrl.financeAnalysisTitleArr.indexOf(new_title) === -1)) {
          $ctrl.form.name.$setValidity("unique", true);
          $ctrl.form.name.$setValidity("notempty", true);
        }
        else if ( new_title === undefined || new_title === '' ) {
          $ctrl.form.name.$setValidity("notempty", false);
          $ctrl.form.name.$setValidity("unique", true);
        }
        else {
          console.log("unique is false");
          $ctrl.form.name.$setValidity("notempty", true);
          $ctrl.form.name.$setValidity("unique", false);
        }
      }

      function proceed() {
        $ctrl.financeAnalysis.temp = "False";
        updateFinanceAnalysis();
        $state.go("financeIncomeStatment", {
          'module':$ctrl.module
        });
      }

      function back() {
        $state.go("scenarioManager", {
          'module':$ctrl.module
        });
      }


      /****************************************************************
                           Private Helper Functions
      ****************************************************************/


      function measurementCheck(scenario) {
        var farm_unit;
        for (var i = 0; i < scenario.plans.length; i++) {
          var plan = scenario.plans[i];

          for(var j = 0; j < plan.plan_budgets.length; j++) {
            var budget = plan.plan_budgets[j];

            if (farm_unit === undefined) {
              farm_unit = budget.farm_unit;
            } else if (farm_unit != budget.farm_unit) {
              farmUnitAdjustment(scenario.plans);
              break;
            }
          }
        }
      }

      function farmUnitAdjustment(plans) {
        console.log("adjust unit");
        var modal = $uibModal.open({
          animation: true,
          templateUrl: '/static/scenario/finance-analysis/farm-unit-adjustment/farm-unit-adjustment.component.html',
          controller: 'farmUnitAdjustmentComponentController',
          controllerAs: '$ctrl',
          resolve: {
            plans: function() {
              return plans;
            }
          },
        });
      }

      function retrieveFinanceAnalysisNameList() {
        var finance_analysis_title_list ;

        scenarioService.listFinanceAnalysis($ctrl.user.username, "title")
        .then(function(finance_analysis_title_list_response) {
          if (finance_analysis_title_list_response !== undefined &&
              finance_analysis_title_list_response.data !== undefined) {
            finance_analysis_title_list = finance_analysis_title_list_response.data;
            $ctrl.financeAnalysisTitleArr = finance_analysis_title_list.map(function(financeAnalysis){ return financeAnalysis.title });
          }
        });
      }


      function add (){
        console.log($ctrl.finance_analysis)
        console.log($ctrl.selected_scenario)
        //$ctrl.selected_scenario.finance_analysis=$ctrl.finance_analysis
        scenarioService.retrieveScenario($ctrl.selected_scenario.id)
        .then(function(xixi){
          console.log(xixi.data)
          var a=xixi.data
          a.finance_analysis.push($ctrl.financeAnalysis.id)
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

      function addFinanceScenario() {
        console.log($ctrl.financeAnalysis.id)
        // var default_scenario = {
        //   'title': "New Finance Scenario",
        //   'type': "scenario",
        //   'finance_analysis': $ctrl.financeAnalysis.id,
        // };
        // scenarioService.createScenario(default_scenario)
        // .then(function(new_scenario_response) {
          // if (new_scenario_response !== undefined &&
          //     new_scenario_response.data !== undefined &&
          //     new_scenario_response.data.id !== undefined &&
          //     new_scenario_response.data.id > 0 &&
          //     new_scenario_response.data.title !== undefined) {
            // var new_scenario = new_scenario_response.data;
            var modal = $uibModal.open({
              animation: true,
              templateUrl: '/static/scenario/finance-analysis/addFinanceScenario/addFinanceScenario.component.html',
              controller: 'addFinanceScenarioComponentController',
              controllerAs: '$ctrl',
              resolve: {
                // finance_scenario: function() {
                //   return [1,2];
                // },
                finance_analysis:function(){
                  return $ctrl.financeAnalysis;
                },
                scenario_list: function() {
                  return $ctrl.scenario_list;
                },
              },
            });

            modal.result.then(function(financeScenario) {
              $ctrl.finance_scenario_list.push(financeScenario);
              console.log($ctrl.finance_scenario_list)
              $ctrl.financeAnalysis.scenarios = $ctrl.finance_scenario_list;
              updateFinanceAnalysis();
            });
          // }
        // });
      }

    }
}());
