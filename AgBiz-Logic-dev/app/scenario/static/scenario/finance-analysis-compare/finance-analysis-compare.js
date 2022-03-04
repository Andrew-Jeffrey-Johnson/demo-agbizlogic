(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeAnalysisCompare", {
      templateUrl: "/static/scenario/finance-analysis-compare/finance-analysis-compare.html",
      controller: FinanceAnalysisCompareComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceAnalysisCompareComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      "$uibModal"
    ];

    function FinanceAnalysisCompareComponentController(
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

      // Scenario
      $ctrl.scenario_list;
      $ctrl.plan_list;
      $ctrl.module;
      $ctrl.selected_scenario;
      $ctrl.selected_scenario_list;
      $ctrl.selected_plan;
      $ctrl.finance_scenario_list = [];
      $ctrl.financeAnalysis;
      $ctrl.cashflow_list=[];
      $ctrl.cash=[];
      $ctrl.supplies=[];
      $ctrl.short_asset=[];
      $ctrl.long_asset=[];
      $ctrl.account_receivable=[];
      $ctrl.accounts_payable=[];
      $ctrl.breeding_livestock=[];
      $ctrl.contracts_and_notes_receivable=[];
      $ctrl.deferred_taxes=[];
      $ctrl.employee_payroll_withholding=[];
      $ctrl.income_taxes=[];
      $ctrl.investment=[];
      $ctrl.investment_in_capital_leases=[];
      $ctrl.marketable_livestock=[];
      $ctrl.other_accured_expenses=[];
      $ctrl.other_assets=[];
      $ctrl.other_current_liabilites=[];
      $ctrl.other_noncurrent_assets=[];
      $ctrl.prepaid_expenses=[];
      $ctrl.purchased_feed=[];
      $ctrl.real_estate_land=[];
      $ctrl.stored_crops_and_feed=[];
      $ctrl.vehicles=[];
      $ctrl.user;
      $ctrl.balance_sheets_list=[];
      $ctrl.scenario;
      $ctrl.max_plan;
      $ctrl.years = [];
      $ctrl.totals = [];
      $ctrl.income_state_list=[];



      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {

        $ctrl.module = $state.params['module'];
        var id = $state.params['analysis'];
        var list_id_scenario=[];
        console.log(id)
        scenarioService.retrieveFinanceAnalysis(id)
        .then(function(financeAnalysis_response) {
          console.log(financeAnalysis_response.data.scenarios)
          list_id_scenario=get_scenarios_id(financeAnalysis_response.data.scenarios)
          console.log(list_id_scenario)
          create_cash_flow_list(list_id_scenario,$state.params['analysis']);
          create_balance_list(list_id_scenario)
          create_income_state_list([125,126])// the original code does not make a database. this fucntion only calculate and show in the table.
      });



        // commonService.retrieveCurrentUser()
        // .then(function(current_user_response) {
        //   $ctrl.user = current_user_response.data;
        //   return scenarioService.listScenarios($ctrl.user.username, ["id", "title"]);
        // })
        // .then(function(scenario_list_response) {
        //   if (scenario_list_response !== undefined &&
        //       scenario_list_response.data !== undefined) {
        //     $ctrl.scenario_list = scenario_list_response.data;
        //   }
        //   scenarioService.listPlans($ctrl.user.username, "all", ["id", "title"])
        //   .then(function(plans_response) {
        //     if(plans_response !== undefined &&
        //        plans_response.data !== undefined) {
        //          $ctrl.plan_list = plans_response.data;
        //        }
        //   });
        // });

      }
      function create_income_state_list (scenario_id_list){

        angular.forEach(scenario_id_list, function(scenario_id, key) {
          console.log(key)

        scenarioService.retrieveScenario(scenario_id)
        .then(function(scenario_response) {
            $ctrl.scenario = scenario_response.data;
            var a_years=[]
            var a_totals=[]
            console.log()
            for(var i = 0; i < max_plan_array(); i++){
              console.log(i);
              var year = [];
              //var total = [0,0,0,0];
              var total = {"return_with_inflation": 0,"cost_with_inflation":0,"net_return":0,"cumulative_net_returns":0};
              // console.log($ctrl.scenario.plans);
              // console.log($ctrl.scenario.plans.length);
              for(var j = 0; j < $ctrl.scenario.plans.length; j++){

                //console.log($ctrl.scenario.plans[j]);

                if (typeof $ctrl.scenario.plans[j].net_returns_over_time[i] === 'undefined') {
                  year.push($ctrl.scenario.plans[j].net_returns_over_time[0]);
                }else{
                  year.push($ctrl.scenario.plans[j].net_returns_over_time[i]);
                  // total[0] += $ctrl.scenario.plans[j].net_returns_over_time[i].return_with_inflation
                  // total[1] += $ctrl.scenario.plans[j].net_returns_over_time[i].cost_with_inflation
                  // total[2] += $ctrl.scenario.plans[j].net_returns_over_time[i].net_return
                  // total[3] += $ctrl.scenario.plans[j].net_returns_over_time[i].cumulative_net_returns
                  total.return_with_inflation += $ctrl.scenario.plans[j].net_returns_over_time[i].return_with_inflation;
                  total.cost_with_inflation += $ctrl.scenario.plans[j].net_returns_over_time[i].cost_with_inflation;
                  total.net_return += $ctrl.scenario.plans[j].net_returns_over_time[i].net_return;
                  total.cumulative_net_returns += $ctrl.scenario.plans[j].net_returns_over_time[i].cumulative_net_returns;
                }
              }
              a_totals.push(total);
              a_years.push(year);
              console.log(a_totals);
              console.log(a_years);

            };
            // console.log($ctrl.years)
            console.log(a_years)
            $ctrl.income_state_list[key]={
              "name":$ctrl.scenario.title,
              "year":a_years,
              "total":a_totals,
              "scenario":$ctrl.scenario
            }
            console.log($ctrl.income_state_list);


          });
          $ctrl.totals=[]
          $ctrl.years=[]

      })
    }



      function create_balance_list(scenario_id_list){
        console.log(scenario_id_list)
        angular.forEach(scenario_id_list, function(scenario_id, key) {
          console.log(key)
        var combine_plans;
        commonService.retrieveCurrentUser()
        .then(function(user_response) {
          if(user_response !== undefined){
            $ctrl.user = user_response.data;
          }
          console.log($ctrl.user.username)
          scenarioService.retrieveBalanceSheet('?username=', $ctrl.user.username)
          .then(function(balancesheet_response) {
              $ctrl.first_year = balancesheet_response.data[0];
              console.log(scenario_id)
              scenarioService.retrieveAccrualAdjustment('?scenario=',scenario_id).then(function(acc){
                console.log(acc)
                var acc_filter =  acc.data.filter(function(hero) {
	                 return hero.scenario == $ctrl.scenario_id;
                 });//scenarioService.retrieveAccrualAdjustment doesnt work it return all the accural adjustment
                 console.log(acc_filter)
                 console.log($ctrl.first_year)
                initialization($ctrl.first_year,acc_filter);
                calculate_short_long_asset(scenario_id,$ctrl.first_year,acc_filter);
                console.log($ctrl.real_estate_land)

                $ctrl.balance_sheets_list[key]={
                  "cash":$ctrl.cash,
                  "supplies":$ctrl.supplies,
                  "account_receivable":$ctrl.account_receivable,
                  "accounts_payable":$ctrl.accounts_payable,
                  "breeding_livestock":$ctrl.breeding_livestock,
                  "contracts_and_notes_receivable":$ctrl.contracts_and_notes_receivable,
                  "deferred_taxes":$ctrl.deferred_taxes,
                  "income_taxes":$ctrl.income_taxes,
                  "investment":$ctrl.investment,
                  "investment_in_capital_leases":$ctrl.investment_in_capital_leases,
                  "marketable_livestock":$ctrl.marketable_livestock,
                  "other_accured_expenses":$ctrl.other_accured_expenses,
                  "other_assets":$ctrl.other_assets,
                  "other_current_liabilites":$ctrl.other_current_liabilites,
                  "other_noncurrent_assets":$ctrl.other_noncurrent_assets,
                  "purchased_feed":$ctrl.purchased_feed,
                  "real_estate_land":$ctrl.real_estate_land,
                  "stored_crops_and_feed":$ctrl.stored_crops_and_feed,
                  "prepaid_expenses":$ctrl.prepaid_expenses,
                  "employee_payroll_withholding":$ctrl.employee_payroll_withholding
                }
              })

          });
        });

        scenarioService.retrieveScenario(scenario_id)
          .then(function (scenario_response) {
            if (scenario_response !== undefined &&
              scenario_response.data !== undefined) {
              $ctrl.scenario = scenario_response.data;
              $ctrl.scenario.plans.sort(function (a, b) {
                return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
              });
              combine_plans=combinePlans($ctrl.scenario);
              var a=retrieve_net_return_for_year(scenario_response);
              a[0]=parseFloat($ctrl.first_year.cash_and_checking);
              for (var i=1;i<11;i++){
                a[i]=parseFloat(a[i-1])+parseFloat(a[i]);
              }
              $ctrl.cash=a;
              console.log($ctrl.cash)
              $ctrl.balance_sheets_list[key]={
                "name":$ctrl.scenario.title,
                "cash":$ctrl.cash,
                "supplies":$ctrl.supplies,
                "account_receivable":$ctrl.account_receivable,
                "accounts_payable":$ctrl.accounts_payable,
                "breeding_livestock":$ctrl.breeding_livestock,
                "contracts_and_notes_receivable":$ctrl.contracts_and_notes_receivable,
                "deferred_taxes":$ctrl.deferred_taxes,
                "income_taxes":$ctrl.income_taxes,
                "investment":$ctrl.investment,
                "investment_in_capital_leases":$ctrl.investment_in_capital_leases,
                "marketable_livestock":$ctrl.marketable_livestock,
                "other_accured_expenses":$ctrl.other_accured_expenses,
                "other_assets":$ctrl.other_assets,
                "other_current_liabilites":$ctrl.other_current_liabilites,
                "other_noncurrent_assets":$ctrl.other_noncurrent_assets,
                "purchased_feed":$ctrl.purchased_feed,
                "real_estate_land":$ctrl.real_estate_land,
                "stored_crops_and_feed":$ctrl.stored_crops_and_feed,
                "prepaid_expenses":$ctrl.prepaid_expenses,
                "employee_payroll_withholding":$ctrl.employee_payroll_withholding
              }


            //location.reload();
          }
          })



        })
        console.log($ctrl.balance_sheets_list)
      }



      function create_cash_flow_list(list_id_scenario,id){
        var combine_plans = {}
        angular.forEach(list_id_scenario, function(value, key) {
          console.log(value)
          $ctrl.cashflow_list[key]={name:null,income:null,expense : null}
          console.log(1)
        scenarioService.retrieveScenario(value).then(function(scenario_reponse){
          console.log(scenario_reponse.data.title)
          $ctrl.cashflow_list[key]={name:scenario_reponse.data.title,income:null,expense : null}
        scenarioService.retrieveCashFlowItem(value)
          .then(function(cash_flow_reponse) {
            console.log(cash_flow_reponse.data)
              var output_expense = cash_flow_reponse.data.filter(function(obj) {
                return obj.type == "expense";
              });
              $ctrl.cashflowitem_expense = trans_year_to_item(output_expense)
              console.log($ctrl.cashflowitem_expense)
              $ctrl.cashflow_list[key].expense = $ctrl.cashflowitem_expense
              console.log($ctrl.cashflow_list[key])

              var output_income = cash_flow_reponse.data.filter(function(obj) {
                return obj.type == "income";
              });
              $ctrl.cashflowitem_income = trans_year_to_item(output_income)
              console.log($ctrl.cashflowitem_income)

            angular.forEach(combine_plans, function(value, key) {
              console.log(value.cost)
              for (var key in value.cost) {
                scenarioService.createCashFlowForBalance({"year":value.year,"scenario":scenario_id,"type":"expense","name":key ,"total":value.cost[key].toFixed(2)});
              }
              for (var key in value.income) {
                scenarioService.createCashFlowForBalance({"year":value.year,"scenario":scenario_id,"type":"income","name":key ,"total":value.income[key].toFixed(2)});
              }
            })
              scenarioService.listNewTransactions(scenario_id).then(function(future_leases_response) {
                console.log(future_leases_response)
                var filters = future_leases_response.data.filter(function(scenario) {
                  return scenario.scenario == id
                })
                $ctrl.capital_sales = search_new_transcations(filters, "capital_sales")
                console.log($ctrl.capital_sales)
                $ctrl.capital_sales = trans_year_to_item_for_capital_sales($ctrl.capital_sales)
                console.log($ctrl.capital_sales)
                $ctrl.capital_purchase = search_new_transcations(filters, "capital_purchase")
                console.log($ctrl.capital_purchase)
                $ctrl.capital_purchase = trans_year_to_item_for_capital_purchase($ctrl.capital_purchase)
                console.log($ctrl.capital_purchase)

          var output_income = cash_flow_reponse.data.filter(function(obj) {
            return obj.type == "income";
          });
          $ctrl.cashflowitem_income=trans_year_to_item(output_income)
          console.log($ctrl.cashflowitem_income)
          $ctrl.cashflow_list[key].income = $ctrl.cashflowitem_income
          console.log($ctrl.cashflow_list)
              })

          })
        })//add scenario name to  $ctrl.cashflow_list

        })
      }

      function get_scenarios_id(scenario){
        var list=[]
        angular.forEach(scenario, function(value, key) {
          list.push(value.id)
        });
        console.log(list)
        return list
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

      function removeFinanceScenario(finance_scenario, index) {
        $ctrl.finance_scenario_list.splice(index, 1);
        $ctrl.financeAnalysis.scenarios = $ctrl.finance_scenario_list;

        if (finance_scenario !== undefined &&
            finance_scenario.id !== undefined &&
            finance_scenario.id > 0) {
          scenarioService.destroyScenario(finance_scenario.id)
          .then(function(response) {
            return scenarioService.retrieveFinanceAnalysis($ctrl.financeAnalysis.id);
          })
          .then(function(financeAnalysis_response) {
            if (financeAnalysis_response !== undefined &&
                financeAnalysis_response.data !== undefined &&
                financeAnalysis_response.data.id !== undefined &&
                financeAnalysis_response.data.id > 0) {
              $ctrl.financeAnalysis = financeAnalysis_response.data;
            }
          });
        }
      }

      function proceed() {
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

      function addFinanceScenario() {
        var default_scenario = {
          'title': "New Finance Scenario",
          'finance_analysis': $ctrl.financeAnalysis.id,
        };
        scenarioService.createScenario(default_scenario)
        .then(function(new_scenario_response) {
          if (new_scenario_response !== undefined &&
              new_scenario_response.data !== undefined &&
              new_scenario_response.data.id !== undefined &&
              new_scenario_response.data.id > 0 &&
              new_scenario_response.data.title !== undefined) {
            var new_scenario = new_scenario_response.data;

            var modal = $uibModal.open({
              animation: true,
              templateUrl: '/static/scenario/finance-analysis/addFinanceScenario/addFinanceScenario.component.html',
              controller: 'addFinanceScenarioComponentController',
              controllerAs: '$ctrl',
              resolve: {
                finance_scenario: function() {
                  return new_scenario;
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
              $ctrl.finance_scenario_list.push(financeScenario);
              $ctrl.financeAnalysis.scenarios = $ctrl.finance_scenario_list;
              updateFinanceAnalysis();
            });
          }
        });
      }




function trans_year_to_item(cashflow) {
  var tl = {
    name: "",
    year_1: 0,
    year_2: 0,
    year_3: 0,
    year_4: 0,
    year_5: 0,
    year_6: 0,
    year_7: 0,
    year_8: 0,
    year_9: 0,
    year_10: 0
  }
  var cashflow_by_item = [];
  var name = [];
  angular.forEach(cashflow, function(cashflow) {
    name.push(cashflow.name)
  })
  var unique_name = name.filter(onlyUnique);
  angular.forEach(unique_name, function(unique_name) {
    var tl = {
      name: unique_name,
      year_1: 0,
      year_2: 0,
      year_3: 0,
      year_4: 0,
      year_5: 0,
      year_6: 0,
      year_7: 0,
      year_8: 0,
      year_9: 0,
      year_10: 0
    }
    cashflow_by_item.push(tl);
  })
  angular.forEach(cashflow_by_item, function(cashflow_by_item) {
    for (var i = 0; i < cashflow.length; i++) {
      if (cashflow[i].name == cashflow_by_item.name) {
        switch (cashflow[i].year) {
          case "1.00":
            cashflow_by_item.year_1 = cashflow[i].total;
          case "2.00":
            cashflow_by_item.year_2 = cashflow[i].total;
          case "3.00":
            cashflow_by_item.year_3 = cashflow[i].total;
          case "4.00":
            cashflow_by_item.year_4 = cashflow[i].total;
          case "5.00":
            cashflow_by_item.year_5 = cashflow[i].total;
          case "6.00":
            cashflow_by_item.year_6 = cashflow[i].total;
          case "7.00":
            cashflow_by_item.year_7 = cashflow[i].total;
          case "8.00":
            cashflow_by_item.year_8 = cashflow[i].total;
          case "9.00":
            cashflow_by_item.year_9 = cashflow[i].total;
          case "10.00":
            cashflow_by_item.year_10 = cashflow[i].total;


        }
      }
    }
  })
  return (cashflow_by_item)
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function search_new_transcations(transcations, type) {
  var i;
  var operating_loans = [];
  var capital_purchase = [];
  var capital_sales = [];
  var capital_leases = []
  var cash_from_asset_loan = [];
  for (i = 0; i < transcations.length; i++) {
    if (transcations[i].financed_through != "" && transcations[i].loan_amount != 0 && transcations[i].interest_rate != 0 && transcations[i].number_of_months_to_borrow != 0) {
      operating_loans.push(transcations[i]);
      continue;
    } else if (transcations[i].financed_through != "" && transcations[i].select_beginning_year != "") {
      capital_purchase.push(transcations[i]);
      continue;
    } else if (transcations[i].sold_through != "" && transcations[i].sale_price != 0) {
      capital_sales.push(transcations[i]);
      continue;
    } else if (transcations[i].down_payment != 0 && transcations[i].annual_payment != 0) {
      capital_leases.push(transcations[i]);
      continue;
    } else {
      cash_from_asset_loan.push(transcations[i]);
    }
    console.log($ctrl.cash_from_asset_loan)
  }
  switch (type) {
    case "operating_loans":
      return operating_loans;
      break;
    case "capital_purchase":
      //console.log(capital_purchase)
      return capital_purchase
      break;
    case "capital_sales":
      return capital_sales
      break;
    case "capital_leases":
      return capital_leases
      break;

    case "cash_from_asset_loan":
      return cash_from_asset_loan;
      break;
  }
}

function trans_year_to_item_for_capital_sales(items) {
  var tl = {
    name: "",
    year_1: 0,
    year_2: 0,
    year_3: 0,
    year_4: 0,
    year_5: 0,
    year_6: 0,
    year_7: 0,
    year_8: 0,
    year_9: 0,
    year_10: 0
  }
  var capital_sales_by_item = [];
  var name = [];
  angular.forEach(items, function(items) {
    name.push(items.sold_through)
  })
  var unique_name = name.filter(onlyUnique);
  angular.forEach(unique_name, function(unique_name) {
    var tl = {
      name: unique_name,
      year_1: 0,
      year_2: 0,
      year_3: 0,
      year_4: 0,
      year_5: 0,
      year_6: 0,
      year_7: 0,
      year_8: 0,
      year_9: 0,
      year_10: 0
    }
    capital_sales_by_item.push(tl);
  })

  angular.forEach(capital_sales_by_item, function(capital_sales_by_item) {
    console.log(items)
    for (var i = 0; i < items.length; i++) {

      if (items[i].sold_through == capital_sales_by_item.name) {

        switch (items[i].select_year) {
          case 1:
            capital_sales_by_item.year_1 = items[i].sale_price;
            break;
          case 2:
            capital_sales_by_item.year_2 = items[i].sale_price;
            break;
          case 3:
            capital_sales_by_item.year_3 = items[i].sale_price;
            break;
          case 4:
            capital_sales_by_item.year_4 = items[i].sale_price;
            break;
          case 5:
            capital_sales_by_item.year_5 = items[i].sale_price;
            break;
          case 6:
            capital_sales_by_item.year_6 = items[i].sale_price;
            break;
          case 7:
            capital_sales_by_item.year_7 = items[i].sale_price;
          case 8:
            capital_sales_by_item.year_8 = items[i].sale_price;
            break;
          case 9:
            capital_sales_by_item.year_9 = items[i].sale_price;
            break;
          case 10:
            capital_sales_by_item.year_10 = items[i].sale_price;
            break;


        }
      }
    }
  })
  return (capital_sales_by_item)
}
function trans_year_to_item_for_capital_purchase(items) {
  var tl = {
    name: "",
    year_1: 0,
    year_2: 0,
    year_3: 0,
    year_4: 0,
    year_5: 0,
    year_6: 0,
    year_7: 0,
    year_8: 0,
    year_9: 0,
    year_10: 0
  }
  var capital_sales_by_item = [];
  var name = [];
  angular.forEach(items, function(items) {
    name.push(items.financed_through)
  })
  var unique_name = name.filter(onlyUnique);
  angular.forEach(unique_name, function(unique_name) {
    var tl = {
      name: unique_name,
      year_1: 0,
      year_2: 0,
      year_3: 0,
      year_4: 0,
      year_5: 0,
      year_6: 0,
      year_7: 0,
      year_8: 0,
      year_9: 0,
      year_10: 0
    }
    capital_sales_by_item.push(tl);
  })

  angular.forEach(capital_sales_by_item, function(capital_sales_by_item) {
    console.log(items)
    for (var i = 0; i < items.length; i++) {

      if (items[i].financed_through == capital_sales_by_item.name) {

        switch (items[i].select_beginning_year) {
          case 1:
            capital_sales_by_item.year_1 = items[i].purchase_price - items[i].trade_in_value;
            break;
          case 2:
            capital_sales_by_item.year_2 = items[i].purchase_price - items[i].trade_in_value;
            break;
          case 3:
            capital_sales_by_item.year_3 = items[i].purchase_price - items[i].trade_in_value;
            break;
          case 4:
            capital_sales_by_item.year_4 = items[i].purchase_price - items[i].trade_in_value;
            break;
          case 5:
            capital_sales_by_item.year_5 = items[i].purchase_price - items[i].trade_in_value;
            break;
          case 6:
            capital_sales_by_item.year_6 = items[i].purchase_price - items[i].trade_in_value;
            break;
          case 7:
            capital_sales_by_item.year_7 = items[i].purchase_price - items[i].trade_in_value;
          case 8:
            capital_sales_by_item.year_8 = items[i].purchase_price - items[i].trade_in_value;
            break;
          case 9:
            capital_sales_by_item.year_9 = items[i].purchase_price - items[i].trade_in_value;
            break;
          case 10:
            capital_sales_by_item.year_10 = items[i].purchase_price - items[i].trade_in_value;
            break;


        }
      }
    }
  })
  return (capital_sales_by_item)
}
//--------------------------------------balancesheets functon----------------------------------------


function sumObjectsByKey(...objs) {
  return objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k))
        a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
}
function combinePlans(scenario){
    var item_arr = [];

    angular.forEach(scenario.plans, function (plan) {
      angular.forEach(plan.plan_budgets, function (plan_budget) {
        var item = {};
        item['year']=plan_budget.position + 1;
        item['income']=plan_budget.income_items_with_inflation;
        item['cost']=plan_budget.cost_items_with_inflation;
        if(item_arr.length <10){
          item_arr.push(item);
        } else {
          //console.log(item.cost)
          for (var key in item.cost){
          // console.log(item_arr[plan_budget.position].cost[key])
           //console.log(item.cost[key])
           if(item_arr[plan_budget.position].cost[key]==undefined){
             item_arr[plan_budget.position].cost[key]=item.cost[key]
             //console.log(item_arr[plan_budget.position].cost[key])
           }
           else{
              item_arr[plan_budget.position].cost[key] += item.cost[key];


}


          }

          for (var key in item.income){
            if(item_arr[plan_budget.position].income[key]==undefined){
                item_arr[plan_budget.position].income[key]= item.income[key];
            }
            else{
              item_arr[plan_budget.position].income[key] += item.income[key];
            }
          }

        }


      });

    });
    return(item_arr);


  }
  function retrieve_net_return_for_year (scenario){
    var net_return=[];
    var net_returns_with_inflation=[];
    for(var year=0;year<11;year++){
    for (var i=0;i<scenario.data.plans.length;i++){
      net_return=sumObjectsByKey(net_return,scenario.data.plans[i].net_returns_over_time[year])
    }
    net_returns_with_inflation.push(net_return.return_with_inflation)
    net_return=[];
  }
    return net_returns_with_inflation
  }


  function initialization(first_year,acc) {

    acc.sort(function (a, b) {
      return a.year - b.year
    });
    var i=0;
    console.log(first_year.supplies)
    $ctrl.supplies[i]= parseFloat(first_year.supplies)
    $ctrl.account_receivable[i]=parseFloat(first_year.account_receivable)
    $ctrl.accounts_payable[i]=parseFloat(first_year.accounts_payable)
    $ctrl.breeding_livestock[i]=parseFloat(first_year.breeding_livestock)
    $ctrl.contracts_and_notes_receivable[i]=parseFloat(first_year.contracts_and_notes_receivable)
    $ctrl.deferred_taxes[i]=parseFloat(first_year.deferred_taxes)
    $ctrl.income_taxes[i]=parseFloat(first_year.income_taxes)
    $ctrl.investment[i]=parseFloat(first_year.investment)
    $ctrl.investment_in_capital_leases[i]=parseFloat(first_year.investment_in_capital_leases)
    $ctrl.marketable_livestock[i]=parseFloat(first_year.marketable_livestock)
    $ctrl.other_accured_expenses[i]=parseFloat(first_year.other_accured_expenses)
    $ctrl.other_assets[i]=parseFloat(first_year.other_assets)
    $ctrl.other_current_liabilites[i]=parseFloat(first_year.other_current_liabilites)
    $ctrl.other_noncurrent_assets[i]=parseFloat(first_year.other_noncurrent_assets)
    $ctrl.purchased_feed[i]=parseFloat(first_year.purchased_feed)
    $ctrl.real_estate_land[i]=parseFloat(first_year.real_estate_land)
    $ctrl.stored_crops_and_feed[i]=parseFloat(first_year.stored_crops_and_feed)
    $ctrl.prepaid_expenses[i]=parseFloat(first_year.prepaid_expenses);
    $ctrl.employee_payroll_withholding[i]=parseFloat(first_year.employee_payroll_withholding);
    if(acc.length!=0){
    for(var i=1;i<11;i++){
      $ctrl.supplies[i]= parseFloat(first_year.supplies)+parseFloat(acc[i-1].supplies)
      $ctrl.account_receivable[i]=parseFloat(first_year.account_receivable)+parseFloat(acc[i-1].account_receivable)
      $ctrl.accounts_payable[i]=parseFloat(first_year.accounts_payable)+parseFloat(acc[i-1].accounts_payable)
      $ctrl.breeding_livestock[i]=parseFloat(first_year.breeding_livestock)+parseFloat(acc[i-1].breeding_livestock)
      $ctrl.contracts_and_notes_receivable[i]=parseFloat(first_year.contracts_and_notes_receivable)+parseFloat(acc[i-1].contracts_and_notes_receivable)
      $ctrl.deferred_taxes[i]=parseFloat(first_year.deferred_taxes)+parseFloat(acc[i-1].deferred_taxes)
      $ctrl.income_taxes[i]=parseFloat(first_year.income_taxes)+parseFloat(acc[i-1].income_taxes)
      $ctrl.investment[i]=parseFloat(first_year.investment)+parseFloat(acc[i-1].investment)
      $ctrl.investment_in_capital_leases[i]=parseFloat(first_year.investment_in_capital_leases)+parseFloat(acc[i-1].investment_in_capital_leases)
      $ctrl.marketable_livestock[i]=parseFloat(first_year.marketable_livestock)+parseFloat(acc[i-1].marketable_livestock)
      $ctrl.other_accured_expenses[i]=parseFloat(first_year.other_accured_expenses)+parseFloat(acc[i-1].other_accured_expenses)
      $ctrl.other_assets[i]=parseFloat(first_year.other_assets)+parseFloat(acc[i-1].other_assets)
      $ctrl.other_current_liabilites[i]=parseFloat(first_year.other_current_liabilites)+parseFloat(acc[i-1].other_current_liabilites)
      $ctrl.other_noncurrent_assets[i]=parseFloat(first_year.other_noncurrent_assets)+parseFloat(acc[i-1].other_noncurrent_assets)
      $ctrl.purchased_feed[i]=parseFloat(first_year.purchased_feed)+parseFloat(acc[i-1].purchased_feed)
      $ctrl.real_estate_land[i]=parseFloat(first_year.real_estate_land)+parseFloat(acc[i-1].real_estate_land)
      $ctrl.stored_crops_and_feed[i]=parseFloat(first_year.stored_crops_and_feed)+parseFloat(acc[i-1].stored_crops_and_feed)
      $ctrl.prepaid_expenses[i]=parseFloat(first_year.prepaid_expenses)+parseFloat(acc[i-1].prepaid_expenses)
      $ctrl.employee_payroll_withholding[i]=parseFloat(first_year.employee_payroll_withholding)+parseFloat(acc[i-1].employee_payroll_withholding)
    }}
    if(acc.length==0){
      for(var i=1;i<11;i++){
      $ctrl.supplies[i]= parseFloat(first_year.supplies)
      $ctrl.account_receivable[i]=parseFloat(first_year.account_receivable)
      $ctrl.accounts_payable[i]=parseFloat(first_year.accounts_payable)
      $ctrl.breeding_livestock[i]=parseFloat(first_year.breeding_livestock)
      $ctrl.contracts_and_notes_receivable[i]=parseFloat(first_year.contracts_and_notes_receivable)
      $ctrl.deferred_taxes[i]=parseFloat(first_year.deferred_taxes)
      $ctrl.income_taxes[i]=parseFloat(first_year.income_taxes)
      $ctrl.investment[i]=parseFloat(first_year.investment)
      $ctrl.investment_in_capital_leases[i]=parseFloat(first_year.investment_in_capital_leases)
      $ctrl.marketable_livestock[i]=parseFloat(first_year.marketable_livestock)
      $ctrl.other_accured_expenses[i]=parseFloat(first_year.other_accured_expenses)
      $ctrl.other_assets[i]=parseFloat(first_year.other_assets)
      $ctrl.other_current_liabilites[i]=parseFloat(first_year.other_current_liabilites)
      $ctrl.other_noncurrent_assets[i]=parseFloat(first_year.other_noncurrent_assets)
      $ctrl.purchased_feed[i]=parseFloat(first_year.purchased_feed)
      $ctrl.real_estate_land[i]=parseFloat(first_year.real_estate_land)
      $ctrl.stored_crops_and_feed[i]=parseFloat(first_year.stored_crops_and_feed)
      $ctrl.prepaid_expenses[i]=parseFloat(first_year.prepaid_expenses)
      $ctrl.employee_payroll_withholding[i]=parseFloat(first_year.employee_payroll_withholding)
    }
    }

  }

  function calculate_short_long_asset (scenario_id,first_year,acc){
    scenarioService.retrieveDepreciation(scenario_id)
    .then(function(depreciation_response){
        //set existing data to the depreciation_list
        var depreciation_list = depreciation_response.data;
        depreciation_list.sort(function (a, b) {
          return a.year - b.year
        });
        acc.sort(function (a, b) {
          return a.year - b.year
        });
        console.log(first_year)
        $ctrl.short_asset[0]=parseFloat(first_year.machinery_equipment);
        $ctrl.long_asset[0]=parseFloat(first_year.buildings_and_improvements);
        console.log(acc)
        for (var i=0;i<10;i++){

          $ctrl.short_asset[i+1]=parseFloat(parseFloat(depreciation_list[i].depreciation)*(parseFloat(depreciation_list[i].depreciation_allocated_to_intermediate_assets)/100))
        }
        for (var i=0;i<10;i++){
          $ctrl.long_asset[i+1]=parseFloat(parseFloat(depreciation_list[i].depreciation)*(1-(parseFloat(depreciation_list[i].depreciation_allocated_to_intermediate_assets)/100)))
        }

        var asset=[];
        for (var i=1;i<11;i++){
           $ctrl.short_asset[i]=parseFloat($ctrl.short_asset[i-1])-parseFloat($ctrl.short_asset[i])
           $ctrl.long_asset[i]=parseFloat($ctrl.long_asset[i-1])-parseFloat($ctrl.long_asset[i])
        }

    });

  }

  //------------------------------------income statement function----------------------------------
  function max_plan_array(){
    var max_length = 0;
    var x;
    angular.forEach($ctrl.scenario.plans, function(plan) {
      if(plan.net_returns_over_time.length > max_length){
          max_length = plan.net_returns_over_time.length;
      }
    });
    var car=[];
    for(var index=0;index<max_length;index++){
      car[index]=index
    }
    console.log(car)
    return max_length;
  }

  function createIncomeStatements(){
    //check if there are any income statments already for this scenario if there are, then delete them
    var scenario_id = $state.params['scenario'];
    var filteredIncomeStatementsList;
    scenarioService.listIncomeStatement().then(function(IncomeStatementResponse){

      filteredIncomeStatementsList = IncomeStatementResponse.data.filter(function(scenario){
        return scenario.scenario = scenario_id;
      });

      for(var j = 0; j < filteredIncomeStatementsList.length; j++){
        scenarioService.destroyIncomeStatement(filteredIncomeStatementsList[j].id);
      };

    });
    //Create a for loop that runs the max plans length number of times and each time does one of the total years from the aclready calculated years array.
    //Years[i].year[Years[i].year.length-1]
    for(var i = 0; i < max_plan_array(); i++){
      var NewIncomeStatement = {
        "scenario": $ctrl.scenario.id,
        "year": i+1,
        "farm_ranch_gross_income": $ctrl.totals[i].return_with_inflation,
        "farm_ranch_costs": $ctrl.totals[i].cost_with_inflation,
        "annual_net_income": $ctrl.totals[i].net_return,
        "accumulated_net_income": $ctrl.totals[i].cumulative_net_returns,
      };
      scenarioService.createIncomeStatement(NewIncomeStatement)
      .then(function(new_income_statment_response) {
        if (new_income_statment_response !== undefined &&
            new_income_statment_response.data !== undefined &&
            new_income_statment_response.data.id !== undefined) {
              //console.log('IncomeStatement '+ i + 'created');
        }
      } );
    }

  }



//end
}
  }());
