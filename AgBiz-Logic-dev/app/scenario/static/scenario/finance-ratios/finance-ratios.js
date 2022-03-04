(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeRatios", {
      templateUrl: "/static/scenario/finance-ratios/finance-ratios.html",
      controller:     FinanceRatiosComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceRatiosComponentController.$inject = [
      '$state',
      '$filter',
      '$q',
      'commonService',
      'scenarioService',
      'budgetService',
      "$uibModal"
    ];

    function FinanceRatiosComponentController(
      $state,
      $filter,
      $q,
      commonService,
      scenarioService,
      budgetService,
      $uibModal) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      $ctrl.$onInit = $onInit;

      $ctrl.proceed = proceed;
      $ctrl.back = back;

      // Scenario
      $ctrl.scenario;
      $ctrl.module;

      // variables
      $ctrl.scenario_id;
      $ctrl.income_statement;
      $ctrl.years = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      $ctrl.steps_2=['Cash Flow Review','Balance Sheet Review', 'Income Statement Review','Financial Ratios Review']

      $ctrl.total_current_assets = [];
      $ctrl.total_current_liabilities = [];

      $ctrl.current_ratio = [];
      $ctrl.quick_ratio = [];
      $ctrl.working_capital = [];
      $ctrl.working_to_rev = [];
      $ctrl.debt_asset = [];
      $ctrl.equity_assest = [];
      $ctrl.debt_equity = [];
      $ctrl.rate_return_asset = [];
      $ctrl.rate_return_equity = [];
      $ctrl.operating_profit_margin = [];
      $ctrl.net_income = [];
      $ctrl.ebitda = [];
      $ctrl.debt_capacity = [];
      $ctrl.debt_margin = [];
      $ctrl.replacement_margin = [];
      $ctrl.term_debt_ratio = [];
      $ctrl.replacement_margin_ratio = [];
      $ctrl.asset_turnover = new Array(10).fill(0);
      $ctrl.operating_expense_ratio = new Array(10).fill(5);
      $ctrl.depreciation_expense_ratio = new Array(10).fill(5);
      $ctrl.interest_expense_ratio = new Array(10).fill(5);
      $ctrl.dept_margin = new Array(10).fill(5);
      $ctrl.net_farm_ratio = [];
      $ctrl.pdf_data={}
      $ctrl.cashflow={}
      $ctrl.capital_purchase=[]





      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        var scenario_id = $state.params['scenario'];
        $ctrl.scenario_id=scenario_id;
        $ctrl.module = $state.params["module"];
        cal_efficiency()
        scenarioService.retrieveScenario(scenario_id)
        .then(function (scenario_response) {
          if (scenario_response !== undefined && scenario_response.data !== undefined) {
            $ctrl.scenario = scenario_response.data;
            scenarioService.listPlansByScenario(scenario_id)
            .then(function (plan_response){
              $ctrl.plans = plan_response.data;

              $ctrl.plans.sort(function (a, b) {
                return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
              });

              //get balance sheet data
              scenarioService.listBalanceSheetByScenario($ctrl.scenario.id, [])
              .then(function (balancesheet_response){
                console.log(balancesheet_response)
                $ctrl.balance_data = balancesheet_response.data;
                $ctrl.balance_data.sort(function (a, b) {
                  return a.year - b.year
                });
                console.log($ctrl.balance_data);

                  scenarioService.retrieveIncomeStatement($ctrl.scenario.id)
                  .then(function (income_response){
                    $ctrl.income_statement = income_response.data;
                    $ctrl.income_statement.sort(function (a, b) {
                      return a.year - b.year
                    });
                    console.log($ctrl.income_statement);

                  for (var i=0; i<$ctrl.balance_data.length; i++){
                    //calc total current assests
                    var total_current_assets = parseFloat($ctrl.balance_data[i].cash_and_checking)
                               + parseFloat($ctrl.balance_data[i].account_receivable)
                               + parseFloat($ctrl.balance_data[i].prepaid_expenses)
                               + parseFloat($ctrl.balance_data[i].investment)
                               + parseFloat($ctrl.balance_data[i].marketable_livestock)
                               + parseFloat($ctrl.balance_data[i].stored_crops_and_feed)
                               + parseFloat($ctrl.balance_data[i].purchased_feed)
                               + parseFloat($ctrl.balance_data[i].other_assets)
                               + parseFloat($ctrl.balance_data[i].supplies);

                    //calc total current liabilities
                    var total_current_liabilities = parseFloat($ctrl.balance_data[i].accounts_payable)
                               + parseFloat($ctrl.balance_data[i].employee_payroll_withholding)
                               + parseFloat($ctrl.balance_data[i].income_taxes)
                               + parseFloat($ctrl.balance_data[i].deferred_taxes)
                               + parseFloat($ctrl.balance_data[i].other_accured_expenses)
                               + parseFloat($ctrl.balance_data[i].other_current_liabilites);


                    //calc total quick assets
                    var total_quick_assets = parseFloat($ctrl.balance_data[i].cash_and_checking)
                               + parseFloat($ctrl.balance_data[i].account_receivable)
                               + parseFloat($ctrl.balance_data[i].investment);

                    //
                    if (total_current_liabilities != 0){
                      $ctrl.current_ratio.push((total_current_assets / total_current_liabilities).toFixed(2));
                      $ctrl.quick_ratio.push((total_quick_assets / total_current_liabilities).toFixed(2));
                    } else {
                      $ctrl.current_ratio.push((total_current_assets).toFixed(2));
                      $ctrl.quick_ratio.push((total_quick_assets));
                    }


                    $ctrl.working_capital.push((total_current_assets - total_current_liabilities).toFixed(2));

                    $ctrl.working_to_rev.push(((total_current_assets - total_current_liabilities) / parseFloat($ctrl.income_statement[i].farm_ranch_gross_income)).toFixed(2));

                    var net = parseFloat($ctrl.income_statement[i].annual_net_income).toFixed(2);
                    var gross = parseFloat($ctrl.income_statement[i].farm_ranch_gross_income).toFixed(2);
                    var costs = parseFloat($ctrl.income_statement[i].farm_ranch_costs).toFixed(2);
                    $ctrl.net_income.push(net);

                    //calc total farm liabilities
                    //TODO: get non current
                    var total_farm_liabilities = total_current_liabilities
                                               + parseFloat(0);

                    //calc total farm Assets
                    var total_farm_assets = total_current_assets
                                          + parseFloat($ctrl.balance_data[i].vehicles)
                                          + parseFloat($ctrl.balance_data[i].real_estate_land)
                                          + parseFloat($ctrl.balance_data[i].buildings_and_improvements);

                    //calc total farm equity_assest
                    var total_farm_equity = total_farm_assets - total_farm_liabilities

                    $ctrl.rate_return_asset.push((net/total_farm_assets).toFixed(2));
                    $ctrl.rate_return_equity.push((net/total_farm_equity).toFixed(2));
                    $ctrl.operating_profit_margin.push((net/gross).toFixed(2));
                    $ctrl.ebitda.push(parseFloat(net + costs).toFixed(2));

                    $ctrl.debt_capacity.push(net);
                    console.log($ctrl.debt_capacity)
                    // $ctrl.debt_margin.push(net);
                    //$ctrl.replacement_margin.push(net);
                    //$ctrl.term_debt_ratio.push(0);
                    //$ctrl.replacement_margin_ratio.push(0);

                    // $ctrl.net_farm_ratio.push((net/gross).toFixed(2));

                    if (total_farm_assets != 0){
                      $ctrl.debt_asset.push((total_farm_liabilities / total_farm_assets).toFixed(2));
                      $ctrl.equity_assest.push((total_farm_equity / total_farm_assets).toFixed(2));
                    } else {
                      $ctrl.debt_asset.push((total_farm_liabilities).toFixed(2));
                      $ctrl.equity_assest.push((total_farm_equity).toFixed(2));
                    }

                    if (total_farm_equity != 0){
                      $ctrl.debt_equity.push((total_farm_liabilities / total_farm_equity).toFixed(2));
                    } else {
                      $ctrl.debt_equity.push((total_farm_liabilities).toFixed(2));
                    }

                    //make pdf data to print pdf
                    $ctrl.pdf_data.scenario_id=$ctrl.scenario_id
                    //Liquidity
                    $ctrl.pdf_data.current_ratio=$ctrl.current_ratio
                    $ctrl.pdf_data.working_capital=$ctrl.working_capital
                    $ctrl.pdf_data.working_to_rev=$ctrl.working_to_rev
                    //Solvency
                    $ctrl.pdf_data.debt_asset=$ctrl.debt_asset
                    $ctrl.pdf_data.equity_assest=$ctrl.equity_assest
                    //Profitability
                    $ctrl.pdf_data.rate_return_asset=$ctrl.rate_return_asset
                    $ctrl.pdf_data.rate_return_equity=$ctrl.rate_return_equity
                    $ctrl.pdf_data.operating_profit_margin=$ctrl.operating_profit_margin
                    $ctrl.pdf_data.net_income=$ctrl.net_income
                    $ctrl.pdf_data.ebitda=$ctrl.ebitda
                    //Repayment
                    $ctrl.pdf_data.debt_capacity=$ctrl.debt_capacity
                    $ctrl.pdf_data.dept_margin=$ctrl.dept_margin
                    $ctrl.pdf_data.replacement_margin=$ctrl.replacement_margin
                    $ctrl.pdf_data.term_debt_ratio=$ctrl.term_debt_ratio
                    $ctrl.pdf_data.replacement_margin_ratio=$ctrl.replacement_margin_ratio
                    //Efficiency
                    $ctrl.pdf_data.asset_turnover=$ctrl.asset_turnover
                    $ctrl.pdf_data.operating_expense_ratio=$ctrl.operating_expense_ratio
                    $ctrl.pdf_data.depreciation_expense_ratio=$ctrl.depreciation_expense_ratio
                    $ctrl.pdf_data.interest_expense_ratio=$ctrl.interest_expense_ratio
                    $ctrl.pdf_data.net_farm_ratio=$ctrl.net_farm_ratio

                    console.log($ctrl.pdf_data)



                    //rate of return on farm Assets
                    //(Net farm income from operations + Farm interest expense -Owner withdrawals for unpaid labor and management) ÷ Average total farm assets


                  }
                  cal_repayment_capacity()
                  console.log($ctrl.pdf_data)
                  //console.log($ctrl.total_current_assets);
                  console.log($ctrl.total_current_liabilities);

              });

              });
            });
           }
        });

      }


      function proceed() {
        console.log($ctrl.pdf_data.asset_turnover)
        console.log($ctrl.scenario.id)
        scenarioService.retrieveFinanceRatiosOutput($ctrl.scenario.id)
          .then(function(response) {
            console.log(response.data)
            if(response.data.length==0){
              console.log(response.data.length)
              create_finance_ratios_output()
            }
            else{
              destroy_then_create(response.data)
            }
          })


        $state.go("scenarioManager", {
          'module':$ctrl.module
        });
      }

      function back() {
        $state.go("financeIncomeStatment", {
          'module': $ctrl.module,
          'scenario': $ctrl.scenario_id,
          'from_scenario':"true"
        });
      }




      /****************************************************************
                           Private Helper Functions
      ****************************************************************/
      //Capital Debt Repayment Margin //Term Debt & Capital Lease Coverage Ratio //Replacement Margin Coverage Ratio
      function cal_repayment_capacity(){
        scenarioService.listCapitalPurchases($ctrl.scenario_id).then(function(new_transactions_response) {
          var capital_purchase_array=[0,0,0,0,0,0,0,0,0,0] // 10 of 0s
          console.log(new_transactions_response.data)
          angular.forEach(new_transactions_response.data, function(value, key) {
            if (value.asset_class=="Intermediate assets"){
              $ctrl.capital_purchase.push(value)
            }
          })
          console.log($ctrl.capital_purchase)
          angular.forEach($ctrl.capital_purchase, function(value, key) {
            console.log(value.select_beginning_year)
            capital_purchase_array[value.select_beginning_year-1]=capital_purchase_array[value.select_beginning_year-1]+
            (value.purchase_price-value.trade_in_value)
          })
          console.log(capital_purchase_array)

          console.log($ctrl.capital_purchase);
          scenarioService.retrieveCashFlowOutput($ctrl.scenario_id)
            .then(function(cash_flow_response) {
              scenarioService.retrieveCashFlowItemOutput(cash_flow_response.data[0].id)
              .then(function(response){
                generatePdf_cashflow(response.data)
                console.log($ctrl.cashflow.short_interest_table)
                //short_interest_table  short_principal_table
                console.log($ctrl.debt_capacity)
                angular.forEach($ctrl.debt_capacity, function(value, key) {
                  console.log($ctrl.cashflow.short_interest_table)

                  // Capital Debt Repayment Margin
                  // $ctrl.dept_margin=

                  // Replacement Margin
                  $ctrl.replacement_margin.push(value-$ctrl.cashflow.long_cap_ex_table[key]-$ctrl.cashflow.intermediate_cap_ex_table[key])


                  //Term Debt & Capital Lease Coverage Ratio
                  if (($ctrl.cashflow.short_principal_table[key]+$ctrl.cashflow.short_interest_table[key]
                    +$ctrl.cashflow.cap_leases_table[key]+$ctrl.cashflow.improvement_interest_table[key]+$ctrl.cashflow.improvement_principal_table[key]
                    +$ctrl.cashflow.real_interest_table[key]+$ctrl.cashflow.real_principal_table[key])!=0){

                    $ctrl.term_debt_ratio.push(value/($ctrl.cashflow.short_principal_table[key]+$ctrl.cashflow.short_interest_table[key]
                      +$ctrl.cashflow.cap_leases_table[key]+$ctrl.cashflow.improvement_interest_table[key]+$ctrl.cashflow.improvement_principal_table[key]
                      +$ctrl.cashflow.real_interest_table[key]+$ctrl.cashflow.real_principal_table[key]))
                  }
                  else{
                    $ctrl.term_debt_ratio.push(value)
                  }

                  // Replacement Margin Coverage Ratio
                  if (($ctrl.cashflow.short_principal_table[key]+$ctrl.cashflow.short_interest_table[key]
                    +$ctrl.cashflow.cap_leases_table[key]+$ctrl.cashflow.improvement_interest_table[key]+$ctrl.cashflow.improvement_principal_table[key]
                    +$ctrl.cashflow.real_interest_table[key]+$ctrl.cashflow.real_principal_table[key])!=0){

                    $ctrl.replacement_margin_ratio.push((value/($ctrl.cashflow.short_principal_table[key]+$ctrl.cashflow.short_interest_table[key]
                    +$ctrl.cashflow.cap_leases_table[key]+$ctrl.cashflow.improvement_interest_table[key]+$ctrl.cashflow.improvement_principal_table[key]
                    +$ctrl.cashflow.real_interest_table[key]+$ctrl.cashflow.real_principal_table[key]))
                    +$ctrl.cashflow.family_withdrawls_table[key]+$ctrl.cashflow.intermediate_cap_ex_table[key])
                    //need add futrure
                  }
                  else{
                    $ctrl.replacement_margin_ratio.push(Number(value+$ctrl.cashflow.family_withdrawls_table[key]+$ctrl.cashflow.intermediate_cap_ex_table[key]).toFixed(2))
                  }
                });
                //add futrure
                $ctrl.replacement_margin_ratio=$ctrl.replacement_margin_ratio.map(function (num, idx) {
                  return Number(num) + Number(capital_purchase_array[idx]);
                });

                console.log($ctrl.replacement_margin_ratio)
              })
            })
        });
      }
      function generatePdf_cashflow(cashflow){
        $ctrl.cashflow.cashflowitem_expense=[]
        var expense = cashflow.filter(function (cashflow) { return cashflow.type =="expense"});
        slice_income_or_expense_cashflow(expense,"expense")
        var income = cashflow.filter(function (cashflow) {  return cashflow.type =="income"});
        slice_income_or_expense_cashflow(income,"income")
        $ctrl.cashflow.total_cash_operations=[]
        var total_cash_operations=cashflow.filter(function (cashflow) {return cashflow.item_name =="total_cash_operations"});
        total_cash_operations.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_cash_operations, function(value, key) {
          $ctrl.cashflow.total_cash_operations.push(Number(value.item_number))
        });

        $ctrl.cashflow.intermediate_sale_table=[]
        var intermediate_sale_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="intermediate_sale_table"});
        intermediate_sale_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(intermediate_sale_table, function(value, key) {
          $ctrl.cashflow.intermediate_sale_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.facilities_sale_table=[]
        var facilities_sale_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="facilities_sale_table"});
        facilities_sale_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(facilities_sale_table, function(value, key) {
          $ctrl.cashflow.facilities_sale_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.real_estate_sale_table=[]
        var real_estate_sale_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="real_estate_sale_table"});
        real_estate_sale_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_cash_operations, function(value, key) {
          $ctrl.cashflow.real_estate_sale_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.total_cash_inflows=[]
        var total_cash_inflows=cashflow.filter(function (cashflow) {return cashflow.item_name =="total_cash_inflows"});
        total_cash_inflows.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_cash_inflows, function(value, key) {
          $ctrl.cashflow.total_cash_inflows.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.rent_leases_table=[]
        var rent_leases_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="rent_leases_table"});
        rent_leases_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(rent_leases_table, function(value, key) {
          $ctrl.cashflow.rent_leases_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.cap_leases_table=[]
        var cap_leases_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="cap_leases_table"});
        cap_leases_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(cap_leases_table, function(value, key) {
          $ctrl.cashflow.cap_leases_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.total_cash_expenses=[]
        var total_cash_expenses=cashflow.filter(function (cashflow) {return cashflow.item_name =="total_cash_expenses"});
        total_cash_expenses.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_cash_expenses, function(value, key) {
          $ctrl.cashflow.total_cash_expenses.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.intermediate_cap_ex_table=[]
        var intermediate_cap_ex_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="intermediate_cap_ex_table"});
        intermediate_cap_ex_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(intermediate_cap_ex_table, function(value, key) {
          $ctrl.cashflow.intermediate_cap_ex_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.long_cap_ex_table=[]
        var long_cap_ex_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="long_cap_ex_table"});
        long_cap_ex_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(long_cap_ex_table, function(value, key) {
          $ctrl.cashflow.long_cap_ex_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.wages_table=[]
        var wages_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="wages_table"});
        wages_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(wages_table, function(value, key) {
          $ctrl.cashflow.wages_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.salaries_table=[]
        var salaries_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="salaries_table"});
        salaries_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(salaries_table, function(value, key) {
          $ctrl.cashflow.salaries_table.push(Number(value.item_number))
        });


        //
        $ctrl.cashflow.family_withdrawls_table=[]
        var family_withdrawls_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="family_withdrawls_table"});
        family_withdrawls_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(family_withdrawls_table, function(value, key) {
          $ctrl.cashflow.family_withdrawls_table.push(Number(value.item_number))
        });
        // //
        $ctrl.cashflow.contributions_table=[]
        var contributions_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="contributions_table"});
        contributions_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(contributions_table, function(value, key) {
          $ctrl.cashflow.contributions_table.push(Number(value.item_number))
        });
        // //
        $ctrl.cashflow.income_tax_table=[]
        var income_tax_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="income_tax_table"});
        income_tax_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(income_tax_table, function(value, key) {
          $ctrl.cashflow.income_tax_table.push(Number(value.item_number))
        });
        // //
        $ctrl.cashflow.short_interest_table=[]
        var short_interest_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="short_interest_table"});
        short_interest_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(short_interest_table, function(value, key) {
          $ctrl.cashflow.short_interest_table.push(Number(value.item_number))
        });
        // //
        $ctrl.cashflow.short_principal_table=[]
        var short_principal_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="short_principal_table"});
        short_principal_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(short_principal_table, function(value, key) {
          $ctrl.cashflow.short_principal_table.push(Number(value.item_number))
        });
        // //
        $ctrl.cashflow.int_interest_table=[]
        var int_interest_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="int_interest_table"});
        int_interest_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(int_interest_table, function(value, key) {
          $ctrl.cashflow.int_interest_table.push(Number(value.item_number))
        });
        // //
        $ctrl.cashflow.int_principal_table=[]
        var int_principal_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="int_principal_table"});
        int_principal_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(int_principal_table, function(value, key) {
          $ctrl.cashflow.int_principal_table.push(Number(value.item_number))
        });


        $ctrl.cashflow.improvement_interest_table=[]
        var improvement_interest_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="improvement_interest_table"});
        improvement_interest_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(improvement_interest_table, function(value, key) {
          $ctrl.cashflow.improvement_interest_table.push(Number(value.item_number))
        });

        $ctrl.cashflow.improvement_principal_table=[]
        var improvement_principal_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="improvement_principal_table"});
        improvement_principal_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(improvement_principal_table, function(value, key) {
          $ctrl.cashflow.improvement_principal_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.real_interest_table=[]
        var real_interest_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="real_interest_table"});
        real_interest_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_interest_table, function(value, key) {
          $ctrl.cashflow.real_interest_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.real_principal_table=[]
        var real_principal_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="real_principal_table"});
        real_principal_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_principal_table, function(value, key) {
          $ctrl.cashflow.real_principal_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.total_cash_outflows=[]
        var total_cash_outflows=cashflow.filter(function (cashflow) {return cashflow.item_name =="total_cash_outflows"});
        total_cash_outflows.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_cash_outflows, function(value, key) {
          $ctrl.cashflow.total_cash_outflows.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.short_borrowing_table=[]
        var short_borrowing_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="short_borrowing_table"});
        short_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(short_borrowing_table, function(value, key) {
          $ctrl.cashflow.short_borrowing_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.int_borrowing_table=[]
        var int_borrowing_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="int_borrowing_table"});
        int_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(int_borrowing_table, function(value, key) {
          $ctrl.cashflow.int_borrowing_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.improvements_borrowing_table=[]
        var improvements_borrowing_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="improvements_borrowing_table"});
        improvements_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(improvements_borrowing_table, function(value, key) {
          $ctrl.cashflow.improvements_borrowing_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.real_borrowing_table=[]
        var real_borrowing_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="real_borrowing_table"});
        real_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_borrowing_table, function(value, key) {
          $ctrl.cashflow.real_borrowing_table.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.beginning_cash_balance=[]
        var beginning_cash_balance=cashflow.filter(function (cashflow) {return cashflow.item_name =="beginning_cash_balance"});
        beginning_cash_balance.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(beginning_cash_balance, function(value, key) {
          $ctrl.cashflow.beginning_cash_balance.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.inflows_minus_outflows=[]
        var inflows_minus_outflows=cashflow.filter(function (cashflow) {return cashflow.item_name =="inflows_minus_outflows"});
        inflows_minus_outflows.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(inflows_minus_outflows, function(value, key) {
          $ctrl.cashflow.inflows_minus_outflows.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.ending_cash_balance=[]
        var ending_cash_balance=cashflow.filter(function (cashflow) {return cashflow.item_name =="ending_cash_balance"});
        ending_cash_balance.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(ending_cash_balance, function(value, key) {
          $ctrl.cashflow.ending_cash_balance.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.outstanding_credit_line=[]
        var outstanding_credit_line=cashflow.filter(function (cashflow) {return cashflow.item_name =="outstanding_credit_line"});
        outstanding_credit_line.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(outstanding_credit_line, function(value, key) {
          $ctrl.cashflow.outstanding_credit_line.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.outstanding_short=[]
        var outstanding_short=cashflow.filter(function (cashflow) {return cashflow.item_name =="outstanding_short"});
        outstanding_short.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(outstanding_short, function(value, key) {
          $ctrl.cashflow.outstanding_short.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.outstanding_nonre=[]
        var outstanding_nonre=cashflow.filter(function (cashflow) {return cashflow.item_name =="outstanding_nonre"});
        outstanding_nonre.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(outstanding_nonre, function(value, key) {
          $ctrl.cashflow.outstanding_nonre.push(Number(value.item_number))
        });
        //
        $ctrl.cashflow.outstanding_real=[]
        var outstanding_real=cashflow.filter(function (cashflow) {return cashflow.item_name =="outstanding_real"});
        outstanding_real.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(outstanding_real, function(value, key) {
          $ctrl.cashflow.outstanding_real.push(Number(value.item_number))
        });

        $ctrl.cashflow.total_outstanding=[]
        var total_outstanding=cashflow.filter(function (cashflow) {return cashflow.item_name =="total_outstanding"});
        total_outstanding.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_outstanding, function(value, key) {
          $ctrl.cashflow.total_outstanding.push(Number(value.item_number))
        });

        $ctrl.cashflow.scenario_id= $ctrl.scenario.id


        console.log($ctrl.cashflow)
        // expense.sort(function(a,b) {
        //   return a.item_name - b.item_name;
        // });
        // console.log(expense)
        // angular.forEach(expense, function(value, key) {
        //   if (value.)
        //
        // });
      }

      function slice_income_or_expense_cashflow(data,type){

        if (type=="expense"){
          var expense_group = groupBy(data, 'item_name');
          console.log(expense_group)
          angular.forEach(expense_group, function(row, key) {
            var expense_row={}
            expense_row.name=key
            row.sort(function(a,b) {return a.year - b.year;});
            console.log(row)
            expense_row.year_1=Number(row[0].item_number)
            expense_row.year_2=Number(row[1].item_number)
            expense_row.year_3=Number(row[2].item_number)
            expense_row.year_4=Number(row[3].item_number)
            expense_row.year_5=Number(row[4].item_number)
            expense_row.year_6=Number(row[5].item_number)
            expense_row.year_7=Number(row[6].item_number)
            expense_row.year_8=Number(row[7].item_number)
            expense_row.year_9=Number(row[8].item_number)
            expense_row.year_10=Number(row[9].item_number)
            $ctrl.cashflow.cashflowitem_expense.push(expense_row)
          });
        }
        else if(type=="income"){
          $ctrl.cashflow.cashflowitem_income=[]
          var income_group = groupBy(data, 'item_name');
          console.log(income_group)
          angular.forEach(income_group, function(row, key) {
            var income_row={}
            income_row.name=key
            row.sort(function(a,b) {return a.year - b.year;});
            console.log(row)
            income_row.year_1=Number(row[0].item_number)
            income_row.year_2=Number(row[1].item_number)
            income_row.year_3=Number(row[2].item_number)
            income_row.year_4=Number(row[3].item_number)
            income_row.year_5=Number(row[4].item_number)
            income_row.year_6=Number(row[5].item_number)
            income_row.year_7=Number(row[6].item_number)
            income_row.year_8=Number(row[7].item_number)
            income_row.year_9=Number(row[8].item_number)
            income_row.year_10=Number(row[9].item_number)
            $ctrl.cashflow.cashflowitem_income.push(income_row)
          });
          console.log($ctrl.cashflow)
        }
      }


      //Asset Turnover Ratio  //Operating Expense Ratio  //Depreciation Expense Ratio  //Interest Expense Ratio //Net Income from Operations Ratio
      function cal_efficiency(){
        // part 1 Efficiency
        //Depreciation Expense Ratio  //Interest Expense Ratio //Net Income from Operations Ratio
        // Depreciation Expense Ratio check
        //Interest Expense Ratio //Cash Interest Paid not finished in income_statement so finish in income_statement first
        // net_farm_income_from_operations check
        //net_farm_income_from_operations check
        scenarioService.retrieveIncomeStatementOutput($ctrl.scenario_id)
          .then(function(response) {
            console.log(response.data)
            scenarioService.retrieveIncomeStatementItemOutput(response.data[0].id)
            .then(function(response){
              console.log(response.data)
              var income_statement_data =generatePdf_income_statement(response.data)
              console.log(income_statement_data)

              //Depreciation Expense Ratio Cal
              angular.forEach(income_statement_data.depreciation, function(value, key) {
                $ctrl.depreciation_expense_ratio[key]= (value/income_statement_data.gross_farm_revene[key]).toFixed(2)
              })
              //Interest Expense Ratio Cal and Asset Turnover Ratio FORMULA_2021
              cal_expense_ratio(income_statement_data) // plus Asset Turnover Ratio FORMULA_2021
              console.log($ctrl.interest_expense_ratio)

              // Net Income from Operations Ratio Cal
              angular.forEach(income_statement_data.net_farm_income_from_operations, function(value, key) {
                $ctrl.net_farm_ratio[key]= (value/income_statement_data.gross_farm_revene[key]).toFixed(2)
              })

              console.log($ctrl.interest_expense_ratio)
              console.log($ctrl.depreciation_expense_ratio)
              console.log($ctrl.net_farm_ratio)
            })
          })

        // part 2 Efficiency
        //Asset-Turnover Rate totally dont understand


        // Capital Debt Repayment Margin

        // repeat cashflow.
        // Replacement Margin Coverage Ratio totally dont understand


        // more questions, balance_sheet = balance_sheet or balance_sheet = balance_sheet + acc.

      }
      function cal_expense_ratio(income_statement_data){
        scenarioService.retrieveBalanceSheetOutput($ctrl.scenario.id)
          .then(function(response) {
            console.log(response.data)
            if(response.data.length==0){
              $ctrl.check=false
            }
            scenarioService.retrieveBalanceSheetItemOutput(response.data[0].id)
            .then(function(response){
              console.log(response.data)
              var result=generatePdf_balance_sheet(response.data)
              console.log(result)
              $ctrl.asset_turnover[0]=((income_statement_data.net_farm_income_from_operations[1]-result.purchased_feed[1])/result.total_assets[1]).toFixed(2)
              console.log($ctrl.asset_turnover)
              angular.forEach(result.accrued_interest.slice(1), function(value, key) {
                $ctrl.interest_expense_ratio[key]=(value/income_statement_data.gross_farm_revene[key]).toFixed(2)
              })

              angular.forEach(result.accrued_interest.slice(1), function(value, key) {
                $ctrl.operating_expense_ratio[key]=((income_statement_data.gross_farm_revene[key]-income_statement_data.net_farm_income_from_operations[key]-
                value-income_statement_data.depreciation[key])/ income_statement_data.gross_farm_revene[key]).toFixed(2)
              })
              console.log($ctrl.operating_expense_ratio)

            })
          })
      }

      function destroy_then_create(data){
        angular.forEach(data, function(value, key) {
              scenarioService.destroyFinanceRatiosOutput(value.id)
            })
        create_finance_ratios_output()
      }

      function create_finance_ratios_output(){
        angular.forEach([0,1,2,3,4,5,6,7,8,9], function(value, key) {
          scenarioService.createFinanceRatiosOutput({"scenario":$ctrl.scenario.id,"year":key+1,
            "current_ratio":$ctrl.pdf_data.current_ratio[key], "debt_asset":$ctrl.pdf_data.debt_asset[key], "debt_capacity":$ctrl.pdf_data.debt_capacity[key], "depreciation_expense_ratio":$ctrl.pdf_data.depreciation_expense_ratio[key], "dept_margin": $ctrl.pdf_data.dept_margin[key],
            "ebitda":$ctrl.pdf_data.ebitda[key], "equity_assest":$ctrl.pdf_data.equity_assest[key], "interest_expense_ratio":$ctrl.pdf_data.interest_expense_ratio[key], "net_farm_ratio":$ctrl.pdf_data.net_farm_ratio[key],"net_income":$ctrl.pdf_data.net_income[key],
            "operating_expense_ratio":$ctrl.pdf_data.operating_expense_ratio[key], "operating_profit_margin":$ctrl.pdf_data.operating_profit_margin[key], "rate_return_asset":$ctrl.pdf_data.rate_return_asset[key], "rate_return_equity":$ctrl.pdf_data.rate_return_equity[key],
            "replacement_margin":$ctrl.pdf_data.replacement_margin[key], "replacement_margin_ratio":$ctrl.pdf_data.replacement_margin_ratio[key], "term_debt_ratio":$ctrl.pdf_data.term_debt_ratio[key], "working_capital":$ctrl.pdf_data.working_capital[key], "working_to_rev":$ctrl.pdf_data.working_to_rev[key]
          })
        });
      }
      function generatePdf_balance_sheet(income_statement){
        var result={}
        result.cash=[]
        var cash=income_statement.filter(function (income_statement) {return income_statement.item_name =="cash"});
        cash.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(cash, function(value, key) {
          result.cash.push(Number(value.item_number))
        });

        result.account_receivable=[]
        var account_receivable=income_statement.filter(function (income_statement) {return income_statement.item_name =="account_receivable"});
        account_receivable.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(account_receivable, function(value, key) {
          result.account_receivable.push(Number(value.item_number))
        });

        result.prepaid_expenses=[]
        var prepaid_expenses=income_statement.filter(function (income_statement) {return income_statement.item_name =="prepaid_expenses"});
        prepaid_expenses.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(prepaid_expenses, function(value, key) {
          result.prepaid_expenses.push(Number(value.item_number))
        });

        result.investment=[]
        var investment=income_statement.filter(function (income_statement) {return income_statement.item_name =="investment"});
        investment.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(investment, function(value, key) {
          result.investment.push(Number(value.item_number))
        });

        result.marketable_livestock=[]
        var marketable_livestock=income_statement.filter(function (income_statement) {return income_statement.item_name =="marketable_livestock"});
        marketable_livestock.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(marketable_livestock, function(value, key) {
          result.marketable_livestock.push(Number(value.item_number))
        });

        result.stored_crops_and_feed=[]
        var stored_crops_and_feed=income_statement.filter(function (income_statement) {return income_statement.item_name =="stored_crops_and_feed"});
        stored_crops_and_feed.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(stored_crops_and_feed, function(value, key) {
          result.stored_crops_and_feed.push(Number(value.item_number))
        });

        result.purchased_feed=[]
        var purchased_feed=income_statement.filter(function (income_statement) {return income_statement.item_name =="purchased_feed"});
        purchased_feed.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(purchased_feed, function(value, key) {
          result.purchased_feed.push(Number(value.item_number))
        });

        result.supplies=[]
        var supplies=income_statement.filter(function (income_statement) {return income_statement.item_name =="supplies"});
        supplies.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(supplies, function(value, key) {
          result.supplies.push(Number(value.item_number))
        });

        result.short_asset=[]
        var short_asset=income_statement.filter(function (income_statement) {return income_statement.item_name =="short_asset"});
        short_asset.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(short_asset, function(value, key) {
          result.short_asset.push(Number(value.item_number))
        });

        result.contracts_and_notes_receivable=[]
        var contracts_and_notes_receivable=income_statement.filter(function (income_statement) {return income_statement.item_name =="contracts_and_notes_receivable"});
        contracts_and_notes_receivable.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(contracts_and_notes_receivable, function(value, key) {
          result.contracts_and_notes_receivable.push(Number(value.item_number))
        });

        result.other_assets=[]
        var other_assets=income_statement.filter(function (income_statement) {return income_statement.item_name =="other_assets"});
        other_assets.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(other_assets, function(value, key) {
          result.other_assets.push(Number(value.item_number))
        });

        result.investing_in_cooperatives=[]
        var investing_in_cooperatives=income_statement.filter(function (income_statement) {return income_statement.item_name =="investing_in_cooperatives"});
        investing_in_cooperatives.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(investing_in_cooperatives, function(value, key) {
          result.investing_in_cooperatives.push(Number(value.item_number))
        });

        result.real_estate_land=[]
        var real_estate_land=income_statement.filter(function (income_statement) {return income_statement.item_name =="real_estate_land"});
        real_estate_land.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_estate_land, function(value, key) {
          result.real_estate_land.push(Number(value.item_number))
        });

        result.long_asset=[]
        var long_asset=income_statement.filter(function (income_statement) {return income_statement.item_name =="long_asset"});
        long_asset.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(long_asset, function(value, key) {
          result.long_asset.push(Number(value.item_number))
        });

        result.total_assets=[]
        var total_assets=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_assets"});
        total_assets.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_assets, function(value, key) {
          result.total_assets.push(Number(value.item_number))
        });

        result.accounts_payable=[]
        var accounts_payable=income_statement.filter(function (income_statement) {return income_statement.item_name =="accounts_payable"});
        accounts_payable.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(accounts_payable, function(value, key) {
          result.accounts_payable.push(Number(value.item_number))
        });

        result.operating_loans=[]
        var operating_loans=income_statement.filter(function (income_statement) {return income_statement.item_name =="operating_loans"});
        operating_loans.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(operating_loans, function(value, key) {
          result.operating_loans.push(Number(value.item_number))
        });

        result.accrued_interest=[]
        var accrued_interest=income_statement.filter(function (income_statement) {return income_statement.item_name =="accrued_interest"});
        accrued_interest.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(accrued_interest, function(value, key) {
          result.accrued_interest.push(Number(value.item_number))
        });

        result.ad_valorem_taxes=[]
        var ad_valorem_taxes=income_statement.filter(function (income_statement) {return income_statement.item_name =="ad_valorem_taxes"});
        ad_valorem_taxes.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(ad_valorem_taxes, function(value, key) {
          result.ad_valorem_taxes.push(Number(value.item_number))
        });

        result.employee_payroll_withholding=[]
        var employee_payroll_withholding=income_statement.filter(function (income_statement) {return income_statement.item_name =="cash"});
        employee_payroll_withholding.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(employee_payroll_withholding, function(value, key) {
          result.employee_payroll_withholding.push(Number(value.item_number))
        });

        result.income_taxes=[]
        var income_taxes=income_statement.filter(function (income_statement) {return income_statement.item_name =="income_taxes"});
        income_taxes.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(income_taxes, function(value, key) {
          result.income_taxes.push(Number(value.item_number))
        });

        result.deferred_taxes=[]
        var deferred_taxes=income_statement.filter(function (income_statement) {return income_statement.item_name =="deferred_taxes"});
        deferred_taxes.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(deferred_taxes, function(value, key) {
          result.deferred_taxes.push(Number(value.item_number))
        });

        result.other_accured_expenses=[]
        var other_accured_expenses=income_statement.filter(function (income_statement) {return income_statement.item_name =="other_accured_expenses"});
        other_accured_expenses.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(other_accured_expenses, function(value, key) {
          result.other_accured_expenses.push(Number(value.item_number))
        });

        result.capital_leases_current=[]
        var capital_leases_current=income_statement.filter(function (income_statement) {return income_statement.item_name =="capital_leases_current"});
        capital_leases_current.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(capital_leases_current, function(value, key) {
          result.capital_leases_current.push(Number(value.item_number))
        });

        result.other_current_liabilites=[]
        var other_current_liabilites=income_statement.filter(function (income_statement) {return income_statement.item_name =="other_current_liabilites"});
        other_current_liabilites.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(other_current_liabilites, function(value, key) {
          result.other_current_liabilites.push(Number(value.item_number))
        });

        result.capital_leases_non_current=[]
        var capital_leases_non_current=income_statement.filter(function (income_statement) {return income_statement.item_name =="capital_leases_non_current"});
        capital_leases_non_current.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(capital_leases_non_current, function(value, key) {
          result.capital_leases_non_current.push(Number(value.item_number))
        });

        result.real_borrowing_table=[]
        var real_borrowing_table=income_statement.filter(function (income_statement) {return income_statement.item_name =="real_borrowing_table"});
        real_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_borrowing_table, function(value, key) {
          result.real_borrowing_table.push(Number(value.item_number))
        });

        result.capital_purchase=[]
        var capital_purchase=income_statement.filter(function (income_statement) {return income_statement.item_name =="capital_purchase"});
        capital_purchase.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(capital_purchase, function(value, key) {
          result.capital_purchase.push(Number(value.item_number))
        });

        result.total_liabilities=[]
        var total_liabilities=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_liabilities"});
        total_liabilities.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_liabilities, function(value, key) {
          result.total_liabilities.push(Number(value.item_number))
        });

        result.total_equity=[]
        var total_equity=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_equity"});
        total_equity.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_equity, function(value, key) {
          result.total_equity.push(Number(value.item_number))
        });

        result.scenario_id= $ctrl.scenario.id

        // result.cash=[]
        // var cash=income_statement.filter(income_statement => income_statement.item_name =="cash");
        // cash.sort(function(a,b) {return a.year - b.year;});
        // angular.forEach(cash, function(value, key) {
        //   result.cash.push(Number(value.item_number))
        // });
        //
        // result.cash=[]
        // var cash=income_statement.filter(income_statement => income_statement.item_name =="cash");
        // cash.sort(function(a,b) {return a.year - b.year;});
        // angular.forEach(cash, function(value, key) {
        //   result.cash.push(Number(value.item_number))
        // });



        console.log(result)
        return result
      }

      function generatePdf_income_statement(income_statement){
        var result={}

        result.cashflowitem_income_total=[]
        var cashflowitem_income_total=income_statement.filter(function (income_statement) {return income_statement.item_name =="cashflowitem_income_total"});
        cashflowitem_income_total.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(cashflowitem_income_total, function(value, key) {
          result.cashflowitem_income_total.push(Number(value.item_number))
        });

        result.gross_farm_revene=[]
        var gross_farm_revene=income_statement.filter(function (income_statement) {return income_statement.item_name =="gross_farm_revene"});
        gross_farm_revene.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(gross_farm_revene, function(value, key) {
          result.gross_farm_revene.push(Number(value.item_number))
        });

        result.cashflowitem_expense_total=[]
        var cashflowitem_expense_total=income_statement.filter(function (income_statement) {return income_statement.item_name =="cashflowitem_expense_total"});
        cashflowitem_expense_total.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(cashflowitem_expense_total, function(value, key) {
          result.cashflowitem_expense_total.push(Number(value.item_number))
        });

        result.depreciation=[]
        var depreciation=income_statement.filter(function (income_statement) {return income_statement.item_name =="depreciation"});
        depreciation.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(depreciation, function(value, key) {
          result.depreciation.push(Number(value.item_number))
        });

        result.total_operating_expense=[]
        var total_operating_expense=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_operating_expense"});
        total_operating_expense.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_operating_expense, function(value, key) {
          result.total_operating_expense.push(Number(value.item_number))
        });

        result.net_farm_income_from_operations=[]
        var net_farm_income_from_operations=income_statement.filter(function (income_statement) {return income_statement.item_name =="net_farm_income_from_operations"});
        net_farm_income_from_operations.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(net_farm_income_from_operations, function(value, key) {
          result.net_farm_income_from_operations.push(Number(value.item_number))
        });

        scenarioService.retrieveAccrualAdjustment('?scenario=',$ctrl.scenario.id).then(function(response){
          console.log(response)
          $ctrl.balance_data = response.data;

          $ctrl.balance_data.sort(function (a, b) {
            return a.year - b.year
          });
          console.log($ctrl.balance_data)
          result.balance_data=[]
          result.balance_data=$ctrl.balance_data
          console.log(result)
        })
        return (result)
      }

      function groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
     }

      function startProgress(num_calls) {
        $ctrl.progress = 0;
        var time_per_call = 500;

        $interval(function() {
          $ctrl.progress++;
        }, ((time_per_call * num_calls) / 100), 100)
      }


    }

}());
