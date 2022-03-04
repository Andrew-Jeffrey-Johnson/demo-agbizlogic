(function () {
  'use strict';

  var app = angular.module("scenarioModule");
  app.component("planInflation", planInflation());
  app.filter('orderObjectBy', function () {
    return function (items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function (item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if (reverse) filtered.reverse();
      return filtered;
    };
  });

  function planInflation() {
    var component = {
      templateUrl: "/static/scenario/plan-inflation/plan-inflation.component.html",
      controller: PlanInflationComponentController,
    };

    return component;
  }


  /****************************************************************
   Controller
   ****************************************************************/

  PlanInflationComponentController.$inject = [
    "$scope",
    "$state",
    "$q",
    "$interval",
    "modalService",
    "scenarioService",
    "budgetService",
    "capitalizeFilter",
    "singularFilter",
  ];

  function PlanInflationComponentController(
    $scope,
    $state,
    $q,
    $interval,
    modalService,
    scenarioService,
    budgetService,
    capitalizeFilter,
    singularFilter) {
    var $ctrl = this;

    /****************************************************************
     Bindable Members
     ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.updateBudgetItemInflationRate = updateBudgetItemInflationRate;
    $ctrl.setAllInflationRates = setAllInflationRates;
    $ctrl.setAllIncomeExpenseInflationRates = setAllIncomeExpenseInflationRates;
    $ctrl.setDefaultExpenseInflationRates = setDefaultExpenseInflationRates;
    $ctrl.setAllmodal = setAllmodal;
    $ctrl.back = back;
    $ctrl.previousBudget = previousBudget;
    $ctrl.proceed = proceed;

    // Plan
    $ctrl.plan = {};
    $ctrl.current_plan_budget;
    $ctrl.budget_item_type = "income";
    $ctrl.module;

    // Errors
    $ctrl.error = false;

    // Misc
    $ctrl.inflation_rate_all = 0;
    $ctrl.inflation_rate_all_income = 0;
    $ctrl.inflation_rate_all_expense = 0;
    $ctrl.apply_all = 0;
    $ctrl.next_step = false;

    // Dictionary
    $ctrl.default_value = {
      'Car and Truck Expenses': 2,
      'Chemicals': 2,
      'Conservation Expenses': 1,
      'Cost of Goods Sold': 2,
      'Custom Hire': 2,
      'Employee Benefit Programs': 3,
      'Feed': 2,
      'Fertilizers and Lime': 2,
      'Freight and Trucking': 2,
      'Gasoline, Fuel, and Oil': 2,
      'Insurance (other than health)': 1,
      'Interest on Loans and Mortgages': 0,
      'L-T asset replacement & section 179 expenses': 3,
      'Labor Hired (less employment credits)': 3,
      'Other expenses': 2,
      'Pension and Profit-Sharing Plans': 3,
      'Property Taxes': 1,
      'Rent and leases: Land and animals': 0,
      'Rent and leases: Machinery, equipment and vehicles': 0,
      'Repairs and Maintenance': 2,
      'Seeds and Plants': 2,
      'Storage and Warehousing': 2,
      'Supplies': 2,
      'Utilities': 2,
      'Veterinary, Breeding and Medicine': 2,
    };

    /****************************************************************
     Methods
     ****************************************************************/

    function $onInit() {
      var plan_id = $state.params['plan'];
      $ctrl.module = $state.params['module'];

      if (plan_id === undefined || plan_id < 1) {
        $state.go("planManager", {'module':$ctrl.module});
      }
      else {
        scenarioService.retrievePlan(plan_id, ["id", "title", "notes", "plan_budgets"])
          .then(function (plan_response) {
            if (plan_response === undefined ||
              plan_response.data === undefined ||
              plan_response.data.id === undefined ||
              plan_response.data.plan_budgets === undefined ||
              plan_response.data.plan_budgets.length < 1) {
              $state.go("planManager");
            }
            else {
              $ctrl.plan = plan_response.data;

              $ctrl.plan.plan_budgets.sort(function (a, b) {
                return a.position - b.position
              });

              $ctrl.current_plan_budget = $ctrl.plan.plan_budgets[0];
              if ($ctrl.current_plan_budget !== undefined && $ctrl.current_plan_budget.cost_item_inflation_rates !== undefined) {
                $ctrl.current_plan_budget.cost_item_inflation_rates.forEach(function (cost_item_inflation_rate) {
                  if (cost_item_inflation_rate !== undefined) {
                    cost_item_inflation_rate.inflation_rate = 0;
                  }
                });
              }
            }
          });
      }
    }

    function updateBudgetItemInflationRate(item) {
      if (item.income_item !== undefined) {
        $ctrl.current_plan_budget.income_item_inflation_rates.forEach(function (income_item_inflation_rate) {
          if (income_item_inflation_rate.id === item.id) {
            income_item_inflation_rate.inflation_rate = item.inflation_rate;
            scenarioService.updateIncomeItemInflationRate(income_item_inflation_rate);
          }
        });
      }
      else if (item.cost_item !== undefined) {
        $ctrl.current_plan_budget.cost_item_inflation_rates.forEach(function (cost_item_inflation_rate) {
          if (cost_item_inflation_rate.id === item.id) {
            cost_item_inflation_rate.inflation_rate = item.inflation_rate;
            scenarioService.updateCostItemInflationRate(cost_item_inflation_rate);
          }
        });
      }
      $ctrl.error = isError();
    }


    function setDefaultExpenseInflationRates(default_rates) {
      $ctrl.current_plan_budget.cost_item_inflation_rates = $ctrl.current_plan_budget.cost_item_inflation_rates.map(function (inflation_rate) {
        if (default_rates[inflation_rate.name] == null){
          inflation_rate.inflation_rate = 2;
        } else {
          inflation_rate.inflation_rate = default_rates[inflation_rate.name];
        }
        scenarioService.updateCostItemInflationRate(inflation_rate);
        $ctrl.error = isError();

        return angular.copy(inflation_rate);
      });
    }


    function setAllInflationRates(budget_item_type, rate) {
      if (rate >= 0) {
        if (budget_item_type.toLowerCase() === "income") {
          $ctrl.current_plan_budget.income_item_inflation_rates = $ctrl.current_plan_budget.income_item_inflation_rates.map(function (inflation_rate) {
            inflation_rate.inflation_rate = rate;
            scenarioService.updateIncomeItemInflationRate(inflation_rate);
            $ctrl.error = isError();

            return angular.copy(inflation_rate);
          });
        }
        else if (budget_item_type.toLowerCase() === "expense") {
          $ctrl.current_plan_budget.cost_item_inflation_rates = $ctrl.current_plan_budget.cost_item_inflation_rates.map(function (inflation_rate) {
            inflation_rate.inflation_rate = rate;
            scenarioService.updateCostItemInflationRate(inflation_rate);
            $ctrl.error = isError();

            return angular.copy(inflation_rate);
          });
        }
      }
    }

    function setAllIncomeInflationRates(rate) {
      if (rate >= 0) {
        angular.forEach($ctrl.plan.plan_budgets, function (budget) {
          angular.forEach(budget.income_item_inflation_rates, function (inflation_rate) {
            inflation_rate.inflation_rate = rate;
            scenarioService.updateIncomeItemInflationRate(inflation_rate);
            $ctrl.error = isError();
          });
        });

        $ctrl.bool_setIncomeInflationRates = true;

        $ctrl.current_plan_budget.income_item_inflation_rates = $ctrl.current_plan_budget.income_item_inflation_rates.map(function (inflation_rate) {
          return angular.copy(inflation_rate);
        });
      }
    }

    function setAllmodal(inflation_rate_all_income, inflation_rate_all_expense) {
      modalService.confirm("The Income and Expense inflation rates you entered will apply to all Budgets in this Plan. Are you sure you want to proceed?",
        "modalConfirmed",
        "modalDenied");
      $scope.$on("modalConfirmed", function () {
        $ctrl.setAllIncomeExpenseInflationRates(inflation_rate_all_income, inflation_rate_all_expense);
      });
    }

    function setAllIncomeExpenseInflationRates(income_rate, expense_rate) {
      if (income_rate >= 0 && expense_rate >= 0) {
        angular.forEach($ctrl.plan.plan_budgets, function (budget) {
          angular.forEach(budget.income_item_inflation_rates, function (inflation_rate) {
            inflation_rate.inflation_rate = income_rate;
            scenarioService.updateIncomeItemInflationRate(inflation_rate);
            $ctrl.error = isError();
          });

          angular.forEach(budget.cost_item_inflation_rates, function (inflation_rate) {
            inflation_rate.inflation_rate = expense_rate;
            scenarioService.updateCostItemInflationRate(inflation_rate);
            $ctrl.error = isError();
          });
        });

        $ctrl.next_step = true;

        $ctrl.current_plan_budget.income_item_inflation_rates = $ctrl.current_plan_budget.income_item_inflation_rates.map(function (inflation_rate) {
          return angular.copy(inflation_rate);
        });

        $ctrl.current_plan_budget.cost_item_inflation_rates = $ctrl.current_plan_budget.cost_item_inflation_rates.map(function (inflation_rate) {
          return angular.copy(inflation_rate);
        });

        proceed();

      }


      /*
      $ctrl.current_plan_budget.cost_item_inflation_rates = $ctrl.current_plan_budget.cost_item_inflation_rates.map(function(inflation_rate) {
        return angular.copy(inflation_rate);
      });
      */
    }

    function back() {
      if ($ctrl.module === undefined) {
        $ctrl.module = 'profit';
      }
      $state.go("planTotalSpace", {'plan': $ctrl.plan.id, 'module': $ctrl.module});
    }


    function previousBudget() {
      if ($ctrl.error === false) {
        var current_budget_index = $ctrl.plan.plan_budgets.indexOf($ctrl.current_plan_budget);
        if (current_budget_index > 0) {
          $ctrl.current_plan_budget = $ctrl.plan.plan_budgets[current_budget_index - 1];
        }
      }
    }


    function proceed() {

      if ($ctrl.error === false) {
        startProgress(2);
        if ($ctrl.module === undefined) {
          $ctrl.module = 'profit';
        }
        var current_budget_index = $ctrl.plan.plan_budgets.indexOf($ctrl.current_plan_budget);
        if ($ctrl.next_step) {
          calculateCompoundedRates();
          $state.go('planSummary', {plan: $ctrl.plan.id, module: $ctrl.module,edited: true});
        }
        else if (current_budget_index < $ctrl.plan.plan_budgets.length - 1) {
          console.log($ctrl.budget_item_type);
          if ($ctrl.budget_item_type === 'income') {
            $ctrl.budget_item_type = 'expense';
          }
          else {
            $ctrl.budget_item_type = 'income';
            $ctrl.current_plan_budget = $ctrl.plan.plan_budgets[current_budget_index + 1];
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          }
        }
        else {
          console.log($ctrl.budget_item_type);
          if ($ctrl.budget_item_type === 'income') {
            $ctrl.budget_item_type = 'expense';
          }
          else {
            calculateCompoundedRates();
            $state.go('planSummary', {plan: $ctrl.plan.id, module: $ctrl.module,edited: true});
          }
        }
      }
    }

    function calculateCompoundedRates() {
      var annual_conversion = 1;
      var prev_income_dict = {};
      var prev_cost_dict = {};

      var plan_budgets_array = $ctrl.plan.plan_budgets;

      plan_budgets_array.sort(function (a, b) {
        return a.time_period_position - b.time_period_position
      });

      angular.forEach(plan_budgets_array, function (budget, budget_index) {
        if (budget.time_unit === 'Month') {
          annual_conversion = 12;
        } else if (budget.time_unit === 'Week') {
          annual_conversion = 52;
        } else if (budget.time_unit === 'Day') {
          annual_conversion = 365;
        }

        angular.forEach(budget.income_item_inflation_rates, function (inflation_rate, index) {
          if (budget_index !== 0) {
            if(prev_income_dict[inflation_rate.name] == undefined){
              var rate_with_time = Math.pow((1 + (inflation_rate.inflation_rate / annual_conversion) / 100), budget_index);
              inflation_rate.compound_inflation_rate = rate_with_time  * (1 + (inflation_rate.inflation_rate / annual_conversion) / 100);
              inflation_rate.compound_inflation_rate = ((inflation_rate.compound_inflation_rate - 1) * 100).toFixed(9);
              prev_income_dict[inflation_rate.name] = inflation_rate.compound_inflation_rate;
            } else {
              inflation_rate.compound_inflation_rate = (1 + prev_income_dict[inflation_rate.name] / 100) * (1 + (inflation_rate.inflation_rate / annual_conversion) / 100);
              inflation_rate.compound_inflation_rate = ((inflation_rate.compound_inflation_rate - 1) * 100).toFixed(9);
              prev_income_dict[inflation_rate.name] = inflation_rate.compound_inflation_rate;
            }


          } else {
            inflation_rate.compound_inflation_rate = inflation_rate.inflation_rate;
            prev_income_dict[inflation_rate.name] = inflation_rate.compound_inflation_rate;
          }
          scenarioService.updateIncomeItemInflationRate(inflation_rate);
          $ctrl.error = isError();
        });


        angular.forEach(budget.cost_item_inflation_rates, function (inflation_rate, index) {

          if (budget_index !== 0) {
            if (prev_cost_dict[inflation_rate.name]==undefined){
              inflation_rate.compound_inflation_rate = inflation_rate.inflation_rate;
              prev_cost_dict[inflation_rate.name] = inflation_rate.compound_inflation_rate;
            }
            inflation_rate.compound_inflation_rate = (1 + prev_cost_dict[inflation_rate.name] / 100) * (1 + (inflation_rate.inflation_rate / annual_conversion) / 100);

            inflation_rate.compound_inflation_rate = ((inflation_rate.compound_inflation_rate - 1) * 100).toFixed(9);

            prev_cost_dict[inflation_rate.name] = inflation_rate.compound_inflation_rate;
          } else {
            inflation_rate.compound_inflation_rate = inflation_rate.inflation_rate;
            prev_cost_dict[inflation_rate.name] = inflation_rate.compound_inflation_rate;
          }
          scenarioService.updateCostItemInflationRate(inflation_rate);
          $ctrl.error = isError();
        });

      });
    }


    /****************************************************************
     Private Helper Functions
     ****************************************************************/

    /*
        Checks all inflation_rate values of each budget item inflation rate object. If at least one is invalid,
        returns true. Otherwise returns false.
        FIXME: This uses dirty checking, find a way for the inflation rate component to signal error.
    */
    function isError() {
      var error = false;
      $ctrl.current_plan_budget.income_item_inflation_rates.concat($ctrl.current_plan_budget.cost_item_inflation_rates)
        .forEach(function (inflation_rate) {
          if (inflation_rate.inflation_rate === undefined || isNaN(inflation_rate.inflation_rate)) {
            error = true;
          }
        });

      return error;
    }


    /*
        Faux progress method. Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function () {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }

  }

})();
