(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("planSummary", {
      templateUrl: "static/scenario/plan-summary/plan-summary.component.html",
      controller: PlanSummaryComponentController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  PlanSummaryComponentController.$inject = [
    "$state",
    "$q",
    "budgetService",
    "scenarioService",
  ];

  function PlanSummaryComponentController(
    $state,
    $q,
    budgetService,
    scenarioService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.loadBudget = loadBudget;
    $ctrl.back = back;
    $ctrl.proceed = proceed;
    $ctrl.scaleIncomeItems = scaleIncomeItems;
    $ctrl.scaleCostItems = scaleCostItems;

    // Plan
    $ctrl.plan;
    $ctrl.module;

    // Plan budgets
    $ctrl.current_budget;
    $ctrl.stored_budgets = [];
    $ctrl.current_plan_budget;
    $ctrl.plan_id;
    $ctrl.edited;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.plan_id = $state.params['plan'];
      $ctrl.module = $state.params['module'];
      $ctrl.edited = $state.params['edited'];
      console.log($ctrl.edited)

      if ($ctrl.plan_id === undefined || $ctrl.plan_id < 1) {
        $state.go("planManager");
      }
      else {
        scenarioService.retrievePlan($ctrl.plan_id, ["id", "scenario", "title", "notes", "plan_budgets","scenario_list","full_title"])
        .then(function(plan_response) {
          console.log(plan_response );
          if (plan_response === undefined ||
              plan_response.data === undefined ||
              plan_response.data.id === undefined ||
              plan_response.data.id < 1) {
            $state.go("planManager");
          }
          else {
            $ctrl.plan = plan_response.data;
          }
        });
      }
    }


    function loadBudget(plan_budget) {
      var stored;

      if (plan_budget !== undefined &&
          plan_budget.budget !== undefined &&
          plan_budget.budget > 0) {
        $ctrl.stored_budgets.forEach(function(stored_budget, index) {
          if (stored_budget.id == plan_budget.budget) {
            stored = stored_budget;
            $ctrl.stored_budgets.splice(index, 1);
          }
        });

        $q.when(stored)
        .then(function(stored_budget) {
          if (stored_budget !== undefined) {
            return $q.when({'data': stored_budget});
          }
          else {
            return budgetService.retrieveBudget(plan_budget.budget);
          }
        })
        .then(function(budget_response) {
          if (budget_response !== undefined &&
              budget_response.data !== undefined &&
              budget_response.data.id !== undefined &&
              budget_response.data.id > 0) {
            $ctrl.stored_budgets.push(budget_response.data);
            var budget = budget_response.data;

            $ctrl.current_budget = assignBudgetItemInflationRates(budget, plan_budget);
            $ctrl.current_plan_budget = plan_budget;
          }
        });
      }
    }


    function back() {
     if($ctrl.module === undefined){
        $ctrl.module = 'profit';
      }
      if($ctrl.module = 'profit'){
      $state.go("planInflation", {'plan': $ctrl.plan.id,'module': $ctrl.module});
      }
      if ($ctrl.module = 'plan'){
          if ($ctrl.edited!=='true'){
          window.location.replace('/scenario/#/plan-manager?module=plan')
         }
     else{
              $state.go('planInflation', {plan: $ctrl.plan.id, module: $ctrl.module});
          }
      }

    }


    function proceed() {
      if($ctrl.module === undefined){
        $ctrl.module = 'profit';
      }
      else if($ctrl.module == "plan"){
          if($ctrl.edited=="true"){
              $state.go("planManager",{'module': $ctrl.module});
          }
          else{
              $state.go("planCreate", {'plan': $ctrl.plan_id,'module': $ctrl.module});
          }
      }
      else if ($ctrl.plan.scenario !== undefined && $ctrl.plan.scenario > 0&& $ctrl.module !== "plan") {
        console.log($ctrl.plan_id)
        $state.go("scenarioCreate", {'scenario': $ctrl.plan.scenario,'module': $ctrl.module});
      }
      else {
        $state.go("planManager");
      }
    }

    function scaleIncomeItems(plan) {
      console.log(plan);
      console.log("Income Scalar: ", $ctrl.incomeScalar);

      //For each plan on the page
      angular.forEach(plan.plan_budgets, function(budget){
        console.log(budget.id);
          //For each income item in a plan
          angular.forEach(budget.income_item_inflation_rates, function(ratesArrayItem){
            console.log(ratesArrayItem);
            //Get the items from the API endpoint
            budgetService.retrieveBudgetItem("income", ratesArrayItem.income_item).then(function(result) {

              //Scale the values by the user given amount
              var percentScalar = $ctrl.incomeScalar / 100;
              result.data.sale_unit_quantity = (result.data.sale_unit_quantity * (1 + (percentScalar))).toFixed(2);
              console.log("After: ", result.data.sale_unit_quantity);
              //Put the scaled item back into the data using the API endpoint
              budgetService.updateBudgetItem("income", result.data).then(function(updatedResult) {
                console.log("Successfully Updated :)");
              }, function(err){
                console.log("Failed!", err); // Error: "It broke"
              })
            }, function(err) {
              console.log("Failed!", err); // Error: "It broke"
            });
          })
      });
    }

    function scaleCostItems(plan) {
      console.log(plan);
      console.log("Cost Scalar: ", $ctrl.costScalar);

      //For each plan on the page
      angular.forEach(plan.plan_budgets, function(budget){
        console.log(budget.id);
          //For each cost item in a plan
          angular.forEach(budget.cost_item_inflation_rates, function(ratesArrayItem){

            //Get the items from the API endpoint
            budgetService.retrieveBudgetItem("general", ratesArrayItem.cost_item).then(function(result) {
              console.log(result);

              //Scale the values by the user given amount
              var percentScalar = $ctrl.costScalar / 100;
              result.data.unit_quantity = (result.data.unit_quantity * (1 + (percentScalar))).toFixed(2);
              console.log("After: ", result.data.unit_quantity);
              //Put the scaled item back into the data using the API endpoint
              budgetService.updateBudgetItem("general", result.data).then(function(updatedResult) {
                console.log("Successfully Updated :)");
              }, function(err){
                console.log("Failed!", err); // Error: "It broke"
              });
            }, function(err) {
              console.log("Failed!", err); // Error: "It broke"
            });
          })
      });
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Assigns the correct inflation rate to each IncomeItem and CostItem in the given Budget.
        Returns the updated Budget.
    */
    function assignBudgetItemInflationRates(budget, plan_budget) {
      // Income items
      budget.income_items.forEach(function(income_item) {
        plan_budget.income_item_inflation_rates.forEach(function(income_item_inflation_rate) {
          if (income_item.id == income_item_inflation_rate.income_item) {
            income_item.inflation_rate = income_item_inflation_rate.inflation_rate;
            income_item.compound_inflation_rate = income_item_inflation_rate.compound_inflation_rate;
          }
        });
      });

      // Cost items
      budget.cost_items.forEach(function(cost_item) {
        plan_budget.cost_item_inflation_rates.forEach(function(cost_item_inflation_rate) {
          if (cost_item.id == cost_item_inflation_rate.cost_item) {
            cost_item.inflation_rate = cost_item_inflation_rate.inflation_rate;
            cost_item.compound_inflation_rate = cost_item_inflation_rate.compound_inflation_rate;
          }
        });
      });

      return budget;
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

}());
