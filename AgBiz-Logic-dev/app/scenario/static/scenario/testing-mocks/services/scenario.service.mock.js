(function() {
  'use strict';

  angular
    .module("mockModule")
    .factory("scenarioServiceMock", scenarioServiceMockFactory);

  scenarioServiceMockFactory.$inject = [
    '$q',
  ];

  function scenarioServiceMockFactory($q) {
    var delete_response = "no element found",
        scenario_list = [
          {
            'id': 1,
            'title': "Scenario 1",
            'plans': [

            ],
          },
        ],
        plan_list = [
          {
            'id': 1,
            'title': "Test Plan",
            'notes': "Some plan notes here",

            'time_period_unit': "years",
            'time_period_value': 1,

            'discount_rate': 19.0,

            'beginning_investment': 100.00,
            'ending_investment': 200.00,

            'lease_type': "Default",
            'land_market_value': 1000.00,
            'annual_land_rate': 32.0,
            'required_roi': 20.0,
            'investment_inflation': 10.0,

            'plan_budgets': [
              {
                'id': 1,
                'plan': 1,
                'budget': 12,
                'title': "Winter Wheat",
                'space_units': "",
                'total_space_available': 0,
                'total_space_used': 0,
              },
              {
                'id': 2,
                'plan': 1,
                'budget': 13,
                'title': "Canola Oil",
                'space_units': "",
                'total_space_available': 0,
                'total_space_used': 0,
              },
              {
                'id': 3,
                'plan': 1,
                'budget': 14,
                'title': "Bison",
                'space_units': "",
                'total_space_available': 0,
                'total_space_used': 0,
              },
              {
                'id': 4,
                'plan': 1,
                'budget': 15,
                'title': "Red Apples",
                'space_units': "",
                'total_space_available': 0,
                'total_space_used': 0,
              },
            ]
          }
        ],
        plan_income_item_list = [
          {
            'id': 1,
            'plan_budget': 1,
            'income_item': 1,
            'inflation_rate': 0,
          },
        ],
        plan_cost_item_list = [
          {
            'id': 1,
            'plan_budget': 1,
            'cost_item': 1,
            'inflation_rate': 0,
            'landowner_cost': 0,
          },
        ];

    return {
      listScenarios: listScenarios,
      createScenario: createScenario,
      retrieveScenario: retrieveScenario,
      updateScenario: updateScenario,
      destroyScenario: destroyScenario,

      setTimePeriod: setTimePeriod,

      listPlans: listPlans,
      listPlansByScenario: listPlansByScenario,
      createPlan: createPlan,
      retrievePlan: retrievePlan,
      updatePlan: updatePlan,
      destroyPlan: destroyPlan,
      copyPlan: copyPlan,
      calculatePlanIRR: calculatePlanIRR,

      listPlanBudgets: listPlanBudgets,
      createPlanBudget: createPlanBudget,
      retrievePlanBudget: retrievePlanBudget,
      updatePlanBudget: updatePlanBudget,
      destroyPlanBudget: destroyPlanBudget,
      generatePlanBudget: generatePlanBudget,

      listPlanIncomeItems: listPlanIncomeItems,
      createPlanIncomeItem: createPlanIncomeItem,
      retrievePlanIncomeItem: retrievePlanIncomeItem,
      updatePlanIncomeItem: updatePlanIncomeItem,
      destroyPlanIncomeItem: destroyPlanIncomeItem,

      listPlanCostItems: listPlanCostItems,
      createPlanCostItem: createPlanCostItem,
      retrievePlanCostItem: retrievePlanCostItem,
      updatePlanCostItem: updatePlanCostItem,
      destroyPlanCostItem: destroyPlanCostItem,

      createIncomeItemInflationRate: createIncomeItemInflationRate,
      updateIncomeItemInflationRate: updateIncomeItemInflationRate,
      createCostItemInflationRate: createCostItemInflationRate,
      updateCostItemInflationRate: updateCostItemInflationRate,
    };


    /****************************************************************
                         Methods
    ****************************************************************/

    // Scenario CRUD operations

    function listScenarios(username) {
      return $q.when({'data': scenario_list});
    }


    function createScenario(new_scenario) {
      new_scenario.id = 1;
      new_scenario.plans = [];
      return $q.when({'data': new_scenario});
    }


    function retrieveScenario(id) {
      return $q.when({'data': scenario_list[0]});
    }


    function updateScenario(updated_plan) {
      return $q.when({'data': updated_plan});
    }


    function destroyScenario(id) {
      scenario_list.forEach(function(plan, key) {
        if (plan.id == id) {
          plan_list.splice(scenario_list[key], 1);
        }
      });

      return $q.when({'data': delete_response});
    }


    // Plan actions

    function setTimePeriod(plan) {
      return $q.when({'data': plan_list[0]});
    }


    // Plan CRUD operations

    function listPlans(username, module_name) {
      return $q.when({'data': plan_list});
    }

    function listPlansByScenario(scenario) {
      return $q.when({'data': plan_list});
    }


    function createPlan(new_plan) {
      new_plan.id = 1;
      new_plan.plan_budgets = [];

      return $q.when({'data': new_plan});
    }


    function retrievePlan(id) {
      return $q.when({'data': plan_list[0]});
    }


    function updatePlan(updated_plan) {
      return $q.when({'data': updated_plan});
    }


    function destroyPlan(id) {
      plan_list.forEach(function(plan, key) {
        if (plan.id == id) {
          plan_list.splice(plan_list[key], 1);
        }
      });

      return $q.when({'data': delete_response});
    }


    function copyPlan(plan_id, scenario_id) {
      var copy_plan = plan_list[0];
      copy_plan.scenario = scenario_id;

      return $q.when({'data': copy_plan});
    }


    function calculatePlanIRR(plan_id) {
      return $q.when({'data': {'internal_rate_of_return': 10.0}});
    }


    // PlanBudget CRUD operations

    function listPlanBudgets(scenario_id) {
      return $q.when({'data': plan_list[0].plan_budgets});
    }


    function createPlanBudget(new_plan_budget) {
      // Assigns a random id
      new_plan_budget.id = Math.random() * 100;
      plan_list[0].plan_budgets.push(new_plan_budget);
      return $q.when({'data': new_plan_budget});
    }


    function retrievePlanBudget(id) {
      return $q.when({'data': plan_list[0].plan_budgets[0]});
    }


    function updatePlanBudget(updated_plan_budget) {
      return $q.when({'data': updated_plan_budget});
    }


    function destroyPlanBudget(id) {
      plan_list.forEach(function(plan) {
        plan.plan_budgets.forEach(function(plan_budget, key) {
          if (plan_budget.id == id) {
            plan.plan_budgets.splice(plan.plan_budgets[key], 1);
          }
        });
      });

      return $q.when({'data': delete_response});
    }


    function generatePlanBudget(plan_id, budget_id) {
      return $q.when({'data': plan_list[0].plan_budgets[0]});
    }


    // PlanIncomeItem CRUD operations

    function listPlanIncomeItems() {
      return $q.when({'data': plan_income_item_list[0]});
    }


    function createPlanIncomeItem(plan_income_item) {
      return $q.when({'data': plan_income_item_list[0]});
    }


    function retrievePlanIncomeItem(id) {
      return $q.when({'data': plan_income_item_list[0]});
    }


    function updatePlanIncomeItem(updated_plan_income_item) {
      return $q.when({'data': updated_plan_income_item});
    }


    function destroyPlanIncomeItem(id) {
      return $q.when({'data': delete_response});
    }


    // PlanCostItem CRUD operations

    function listPlanCostItems() {
      return $q.when({'data': plan_cost_item_list[0]});
    }


    function createPlanCostItem(plan_cost_item) {
      return $q.when({'data': plan_cost_item_list[0]});
    }


    function retrievePlanCostItem(id) {
      return $q.when({'data': plan_cost_item_list[0]});
    }


    function updatePlanCostItem(updated_plan_cost_item) {
      return $q.when({'data': updated_plan_cost_item});
    }


    function destroyPlanCostItem(id) {
      return $q.when({'data': delete_response});
    }


    // IncomeItemInflationRate CRUD

    function createIncomeItemInflationRate(income_item_inflation_rate) {
      return $q.when({'data': income_item_inflation_rate});
    }


    function updateIncomeItemInflationRate(income_item_inflation_rate) {
      return $q.when({'data': income_item_inflation_rate});
    }


    // CostItemInflationRate CRUD

    function createCostItemInflationRate(cost_item_inflation_rate) {
      return $q.when({'data': cost_item_inflation_rate})
    }


    function updateCostItemInflationRate(cost_item_inflation_rate) {
      return $q.when({'data': cost_item_inflation_rate});
    }
  }

})();
