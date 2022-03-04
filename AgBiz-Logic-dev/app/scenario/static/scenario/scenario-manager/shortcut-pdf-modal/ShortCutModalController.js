(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller("ShortCutModalController", ShortCutModalController);

  ShortCutModalController.$inject = [
    "filterFilter",
    "scenarioService",
    "$uibModalInstance",
    "$state",
    "scenario"
  ];

  function ShortCutModalController(
    filterFilter,
    scenarioService,
    $uibModalInstance,
    $state,
    scenario) {
    var $ctrl = this

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    $ctrl.pdf_data_cashflow={};
    $ctrl.pdf_data_balance_sheet={};
    $ctrl.pdf_data_income_statement={};
    $ctrl.pdf_data_finance_ratios={};
    $ctrl.cd=[1,2,3]
    $ctrl.balance_data=[]
    $ctrl.check=true
    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.proceed = proceed;
    $ctrl.skip = skip;
    $ctrl.scenario=scenario;



    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      console.log($ctrl.scenario)
      $ctrl.pdf_data_cashflow.cashflowitem_expense=[]
      $ctrl.pdf_data_cashflow.cashflowitem_income=[]
      $ctrl.pdf_data_cashflow.total_cash_operations=[]
      $ctrl.pdf_data_income_statement.cashflowitem_expense=[]
      $ctrl.pdf_data_income_statement.cashflowitem_income=[]
      scenarioService.retrieveCashFlowOutput($ctrl.scenario.id)
        .then(function(cash_flow_response) {
          console.log(cash_flow_response.data)
          if(cash_flow_response.data.length==0){
            $ctrl.check=false
          }
          scenarioService.retrieveCashFlowItemOutput(cash_flow_response.data[0].id)
          .then(function(response){
            console.log(response.data)
            generatePdf_cashflow(response.data)
          })
        })

        scenarioService.retrieveBalanceSheetOutput($ctrl.scenario.id)
          .then(function(response) {
            console.log(response.data)
            if(response.data.length==0){
              $ctrl.check=false
            }
            scenarioService.retrieveBalanceSheetItemOutput(response.data[0].id)
            .then(function(response){
              console.log(response.data)
              generatePdf_balance_sheet(response.data)
            })
          })

          scenarioService.retrieveIncomeStatementOutput($ctrl.scenario.id)
            .then(function(response) {
              console.log(response.data)
              if(response.data.length==0){
                $ctrl.check=false
              }
              scenarioService.retrieveIncomeStatementItemOutput(response.data[0].id)
              .then(function(response){
                console.log(response.data)
                generatePdf_income_statement(response.data)
              })
            })

            scenarioService.retrieveFinanceRatiosOutput($ctrl.scenario.id)
              .then(function(response) {
                console.log(response.data)
                if(response.data.length==0){
                  $ctrl.check=false
                }
                  generatePdf_finance_ratios(response.data)
                })


      }

      function generatePdf_finance_ratios(data){
        $ctrl.pdf_data_finance_ratios.asset_turnover=[]
        $ctrl.pdf_data_finance_ratios.current_ratio=[]
        $ctrl.pdf_data_finance_ratios.working_capital=[]
        $ctrl.pdf_data_finance_ratios.working_to_rev=[]
        $ctrl.pdf_data_finance_ratios.debt_asset=[]
        $ctrl.pdf_data_finance_ratios.equity_assest=[]
        $ctrl.pdf_data_finance_ratios.rate_return_asset=[]
        $ctrl.pdf_data_finance_ratios.rate_return_equity=[]
        $ctrl.pdf_data_finance_ratios.operating_profit_margin=[]
        $ctrl.pdf_data_finance_ratios.net_income=[]
        $ctrl.pdf_data_finance_ratios.ebitda=[]
        $ctrl.pdf_data_finance_ratios.debt_capacity=[]
        $ctrl.pdf_data_finance_ratios.dept_margin=[]
        $ctrl.pdf_data_finance_ratios.replacement_margin=[]
        $ctrl.pdf_data_finance_ratios.term_debt_ratio=[]
        $ctrl.pdf_data_finance_ratios.replacement_margin_ratio=[]
        $ctrl.pdf_data_finance_ratios.operating_expense_ratio=[]
        $ctrl.pdf_data_finance_ratios.depreciation_expense_ratio=[]
        $ctrl.pdf_data_finance_ratios.interest_expense_ratio=[]
        $ctrl.pdf_data_finance_ratios.net_farm_ratio=[]
        data.sort(function(a, b){
          return a.year - b.year;
        });
        console.log(data)
        $ctrl.pdf_data_finance_ratios.scenario_id=$ctrl.scenario.id
        angular.forEach(data, function(value, key) {

          //Liquidity
          $ctrl.pdf_data_finance_ratios.current_ratio.push(value.current_ratio)
          $ctrl.pdf_data_finance_ratios.working_capital.push(value.working_capital)
          $ctrl.pdf_data_finance_ratios.working_to_rev.push(value.working_to_rev)
          //Solvency
          $ctrl.pdf_data_finance_ratios.debt_asset.push(value.debt_asset)
          $ctrl.pdf_data_finance_ratios.equity_assest.push(value.equity_assest)
          //Profitability
          $ctrl.pdf_data_finance_ratios.rate_return_asset.push(value.rate_return_asset)
          $ctrl.pdf_data_finance_ratios.rate_return_equity.push(value.rate_return_equity)
          $ctrl.pdf_data_finance_ratios.operating_profit_margin.push(value.operating_profit_margin)
          $ctrl.pdf_data_finance_ratios.net_income.push(value.net_income)
          $ctrl.pdf_data_finance_ratios.ebitda.push(value.ebitda)
          //Repayment
          $ctrl.pdf_data_finance_ratios.debt_capacity.push(value.debt_capacity)
          $ctrl.pdf_data_finance_ratios.dept_margin.push(value.dept_margin)
          $ctrl.pdf_data_finance_ratios.replacement_margin.push(value.replacement_margin)
          $ctrl.pdf_data_finance_ratios.term_debt_ratio.push(value.term_debt_ratio)
          $ctrl.pdf_data_finance_ratios.replacement_margin_ratio.push(value.replacement_margin_ratio)
          //Efficiency
          $ctrl.pdf_data_finance_ratios.operating_expense_ratio.push(value.operating_expense_ratio)
          $ctrl.pdf_data_finance_ratios.depreciation_expense_ratio.push(value.depreciation_expense_ratio)
          $ctrl.pdf_data_finance_ratios.interest_expense_ratio.push(value.interest_expense_ratio)
          $ctrl.pdf_data_finance_ratios.net_farm_ratio.push(value.net_farm_ratio)
          $ctrl.pdf_data_finance_ratios.asset_turnover.push(value.asset_turnover)
        });
        console.log($ctrl.pdf_data_finance_ratios)
      }

      function generatePdf_income_statement(income_statement){
        $ctrl.pdf_data_income_statement.scenario_id= $ctrl.scenario.id
        // let bigCities = cities.filter(function (e) {return e.population > 3000000;});

        var expense = income_statement.filter(function (income_statement) {return income_statement.type =="expense";});
        slice_income_or_expense_income_statement(expense,"expense")

        // var expense = income_statement.filter(income_statement=>income_statement.type =="expense");
        // slice_income_or_expense_income_statement(expense,"expense")

        var income = income_statement.filter(function (income_statement) {return income_statement.type =="income"});
        slice_income_or_expense_income_statement(income,"income")

        $ctrl.pdf_data_income_statement.cashflowitem_income_total=[]
        var cashflowitem_income_total=income_statement.filter(function (income_statement) {return income_statement.item_name =="cashflowitem_income_total"});
        cashflowitem_income_total.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(cashflowitem_income_total, function(value, key) {
          $ctrl.pdf_data_income_statement.cashflowitem_income_total.push(Number(value.item_number))
        });

        $ctrl.pdf_data_income_statement.cash_interest_paid=[]
        var cash_interest_paid=income_statement.filter(function (income_statement) {return income_statement.item_name =="cash_interest_paid"});
        cashflowitem_income_total.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(cash_interest_paid, function(value, key) {
          $ctrl.pdf_data_income_statement.cash_interest_paid.push(Number(value.item_number))
        });
        console.log($ctrl.pdf_data_income_statement.cash_interest_paid)

        $ctrl.pdf_data_income_statement.gross_farm_revene=[]
        var gross_farm_revene=income_statement.filter(function (income_statement) {return income_statement.item_name =="gross_farm_revene"});
        gross_farm_revene.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(gross_farm_revene, function(value, key) {
          $ctrl.pdf_data_income_statement.gross_farm_revene.push(Number(value.item_number))
        });

        $ctrl.pdf_data_income_statement.cashflowitem_expense_total=[]
        var cashflowitem_expense_total=income_statement.filter(function (income_statement) {return income_statement.item_name =="cashflowitem_expense_total"});
        cashflowitem_expense_total.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(cashflowitem_expense_total, function(value, key) {
          $ctrl.pdf_data_income_statement.cashflowitem_expense_total.push(Number(value.item_number))
        });

        $ctrl.pdf_data_income_statement.depreciation=[]
        var depreciation=income_statement.filter(function (income_statement) {return income_statement.item_name =="depreciation"});
        depreciation.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(depreciation, function(value, key) {
          $ctrl.pdf_data_income_statement.depreciation.push(Number(value.item_number))
        });

        $ctrl.pdf_data_income_statement.total_operating_expense=[]
        var total_operating_expense=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_operating_expense"});
        total_operating_expense.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_operating_expense, function(value, key) {
          $ctrl.pdf_data_income_statement.total_operating_expense.push(Number(value.item_number))
        });

        $ctrl.pdf_data_income_statement.net_farm_income_from_operations=[]
        var net_farm_income_from_operations=income_statement.filter(function (income_statement) {return income_statement.item_name =="net_farm_income_from_operations"});
        net_farm_income_from_operations.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(net_farm_income_from_operations, function(value, key) {
          $ctrl.pdf_data_income_statement.net_farm_income_from_operations.push(Number(value.item_number))
        });

        scenarioService.retrieveAccrualAdjustment('?scenario=',$ctrl.scenario.id).then(function(response){
          console.log(response)
          $ctrl.balance_data = response.data;

          $ctrl.balance_data.sort(function (a, b) {
            return a.year - b.year
          });
          console.log($ctrl.balance_data)
          $ctrl.pdf_data_income_statement.balance_data=[]
          $ctrl.pdf_data_income_statement.balance_data=$ctrl.balance_data
          console.log($ctrl.pdf_data_income_statement)
        })


      }


      function generatePdf_balance_sheet(income_statement){
        $ctrl.pdf_data_balance_sheet.cash=[]
        var cash=income_statement.filter(function (income_statement) {return income_statement.item_name =="cash"});
        cash.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(cash, function(value, key) {
          $ctrl.pdf_data_balance_sheet.cash.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.account_receivable=[]
        var account_receivable=income_statement.filter(function (income_statement) {return income_statement.item_name =="account_receivable"});
        account_receivable.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(account_receivable, function(value, key) {
          $ctrl.pdf_data_balance_sheet.account_receivable.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.prepaid_expenses=[]
        var prepaid_expenses=income_statement.filter(function (income_statement) {return income_statement.item_name =="prepaid_expenses"});
        prepaid_expenses.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(prepaid_expenses, function(value, key) {
          $ctrl.pdf_data_balance_sheet.prepaid_expenses.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.investment=[]
        var investment=income_statement.filter(function (income_statement) {return income_statement.item_name =="investment"});
        investment.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(investment, function(value, key) {
          $ctrl.pdf_data_balance_sheet.investment.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.marketable_livestock=[]
        var marketable_livestock=income_statement.filter(function (income_statement) {return income_statement.item_name =="marketable_livestock"});
        marketable_livestock.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(marketable_livestock, function(value, key) {
          $ctrl.pdf_data_balance_sheet.marketable_livestock.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.stored_crops_and_feed=[]
        var stored_crops_and_feed=income_statement.filter(function (income_statement) {return income_statement.item_name =="stored_crops_and_feed"});
        stored_crops_and_feed.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(stored_crops_and_feed, function(value, key) {
          $ctrl.pdf_data_balance_sheet.stored_crops_and_feed.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.purchased_feed=[]
        var purchased_feed=income_statement.filter(function (income_statement) {return income_statement.item_name =="purchased_feed"});
        purchased_feed.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(purchased_feed, function(value, key) {
          $ctrl.pdf_data_balance_sheet.purchased_feed.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.supplies=[]
        var supplies=income_statement.filter(function (income_statement) {return income_statement.item_name =="supplies"});
        supplies.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(supplies, function(value, key) {
          $ctrl.pdf_data_balance_sheet.supplies.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.short_asset=[]
        var short_asset=income_statement.filter(function (income_statement) {return income_statement.item_name =="short_asset"});
        short_asset.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(short_asset, function(value, key) {
          $ctrl.pdf_data_balance_sheet.short_asset.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.contracts_and_notes_receivable=[]
        var contracts_and_notes_receivable=income_statement.filter(function (income_statement) {return income_statement.item_name =="contracts_and_notes_receivable"});
        contracts_and_notes_receivable.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(contracts_and_notes_receivable, function(value, key) {
          $ctrl.pdf_data_balance_sheet.contracts_and_notes_receivable.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.other_assets=[]
        var other_assets=income_statement.filter(function (income_statement) {return income_statement.item_name =="other_assets"});
        other_assets.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(other_assets, function(value, key) {
          $ctrl.pdf_data_balance_sheet.other_assets.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.investing_in_cooperatives=[]
        var investing_in_cooperatives=income_statement.filter(function (income_statement) {return income_statement.item_name =="investing_in_cooperatives"});
        investing_in_cooperatives.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(investing_in_cooperatives, function(value, key) {
          $ctrl.pdf_data_balance_sheet.investing_in_cooperatives.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.real_estate_land=[]
        var real_estate_land=income_statement.filter(function (income_statement) {return income_statement.item_name =="real_estate_land"});
        real_estate_land.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_estate_land, function(value, key) {
          $ctrl.pdf_data_balance_sheet.real_estate_land.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.long_asset=[]
        var long_asset=income_statement.filter(function (income_statement) {return income_statement.item_name =="long_asset"});
        long_asset.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(long_asset, function(value, key) {
          $ctrl.pdf_data_balance_sheet.long_asset.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.total_assets=[]
        var total_assets=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_assets"});
        total_assets.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_assets, function(value, key) {
          $ctrl.pdf_data_balance_sheet.total_assets.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.accounts_payable=[]
        var accounts_payable=income_statement.filter(function (income_statement) {return income_statement.item_name =="accounts_payable"});
        accounts_payable.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(accounts_payable, function(value, key) {
          $ctrl.pdf_data_balance_sheet.accounts_payable.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.operating_loans=[]
        var operating_loans=income_statement.filter(function (income_statement) {return income_statement.item_name =="operating_loans"});
        operating_loans.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(operating_loans, function(value, key) {
          $ctrl.pdf_data_balance_sheet.operating_loans.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.accrued_interest=[]
        var accrued_interest=income_statement.filter(function (income_statement) {return income_statement.item_name =="accrued_interest"});
        accrued_interest.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(accrued_interest, function(value, key) {
          $ctrl.pdf_data_balance_sheet.accrued_interest.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.ad_valorem_taxes=[]
        var ad_valorem_taxes=income_statement.filter(function (income_statement) {return income_statement.item_name =="ad_valorem_taxes"});
        ad_valorem_taxes.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(ad_valorem_taxes, function(value, key) {
          $ctrl.pdf_data_balance_sheet.ad_valorem_taxes.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.employee_payroll_withholding=[]
        var employee_payroll_withholding=income_statement.filter(function (income_statement) {return income_statement.item_name =="cash"});
        employee_payroll_withholding.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(employee_payroll_withholding, function(value, key) {
          $ctrl.pdf_data_balance_sheet.employee_payroll_withholding.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.income_taxes=[]
        var income_taxes=income_statement.filter(function (income_statement) {return income_statement.item_name =="income_taxes"});
        income_taxes.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(income_taxes, function(value, key) {
          $ctrl.pdf_data_balance_sheet.income_taxes.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.deferred_taxes=[]
        var deferred_taxes=income_statement.filter(function (income_statement) {return income_statement.item_name =="deferred_taxes"});
        deferred_taxes.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(deferred_taxes, function(value, key) {
          $ctrl.pdf_data_balance_sheet.deferred_taxes.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.other_accured_expenses=[]
        var other_accured_expenses=income_statement.filter(function (income_statement) {return income_statement.item_name =="other_accured_expenses"});
        other_accured_expenses.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(other_accured_expenses, function(value, key) {
          $ctrl.pdf_data_balance_sheet.other_accured_expenses.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.capital_leases_current=[]
        var capital_leases_current=income_statement.filter(function (income_statement) {return income_statement.item_name =="capital_leases_current"});
        capital_leases_current.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(capital_leases_current, function(value, key) {
          $ctrl.pdf_data_balance_sheet.capital_leases_current.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.other_current_liabilites=[]
        var other_current_liabilites=income_statement.filter(function (income_statement) {return income_statement.item_name =="other_current_liabilites"});
        other_current_liabilites.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(other_current_liabilites, function(value, key) {
          $ctrl.pdf_data_balance_sheet.other_current_liabilites.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.capital_leases_non_current=[]
        var capital_leases_non_current=income_statement.filter(function (income_statement) {return income_statement.item_name =="capital_leases_non_current"});
        capital_leases_non_current.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(capital_leases_non_current, function(value, key) {
          $ctrl.pdf_data_balance_sheet.capital_leases_non_current.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.real_borrowing_table=[]
        var real_borrowing_table=income_statement.filter(function (income_statement) {return income_statement.item_name =="real_borrowing_table"});
        real_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_borrowing_table, function(value, key) {
          $ctrl.pdf_data_balance_sheet.real_borrowing_table.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.capital_purchase=[]
        var capital_purchase=income_statement.filter(function (income_statement) {return income_statement.item_name =="capital_purchase"});
        capital_purchase.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(capital_purchase, function(value, key) {
          $ctrl.pdf_data_balance_sheet.capital_purchase.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.total_liabilities=[]
        var total_liabilities=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_liabilities"});
        total_liabilities.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_liabilities, function(value, key) {
          $ctrl.pdf_data_balance_sheet.total_liabilities.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.total_equity=[]
        var total_equity=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_equity"});
        total_equity.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_equity, function(value, key) {
          $ctrl.pdf_data_balance_sheet.total_equity.push(Number(value.item_number))
        });

        $ctrl.pdf_data_balance_sheet.scenario_id= $ctrl.scenario.id

        // $ctrl.pdf_data_balance_sheet.cash=[]
        // var cash=income_statement.filter(income_statement => income_statement.item_name =="cash");
        // cash.sort(function(a,b) {return a.year - b.year;});
        // angular.forEach(cash, function(value, key) {
        //   $ctrl.pdf_data_balance_sheet.cash.push(Number(value.item_number))
        // });
        //
        // $ctrl.pdf_data_balance_sheet.cash=[]
        // var cash=income_statement.filter(income_statement => income_statement.item_name =="cash");
        // cash.sort(function(a,b) {return a.year - b.year;});
        // angular.forEach(cash, function(value, key) {
        //   $ctrl.pdf_data_balance_sheet.cash.push(Number(value.item_number))
        // });



        console.log($ctrl.pdf_data_balance_sheet)
      }


      function generatePdf_cashflow(cashflow){

        var expense = cashflow.filter(function (cashflow) { return cashflow.type =="expense"});
        slice_income_or_expense_cashflow(expense,"expense")

        var income = cashflow.filter(function (cashflow) {  return cashflow.type =="income"});
        slice_income_or_expense_cashflow(income,"income")

        var total_cash_operations=cashflow.filter(function (cashflow) {return cashflow.item_name =="total_cash_operations"});
        total_cash_operations.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_cash_operations, function(value, key) {
          $ctrl.pdf_data_cashflow.total_cash_operations.push(Number(value.item_number))
        });

        $ctrl.pdf_data_cashflow.intermediate_sale_table=[]
        var intermediate_sale_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="intermediate_sale_table"});
        intermediate_sale_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(intermediate_sale_table, function(value, key) {
          $ctrl.pdf_data_cashflow.intermediate_sale_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.facilities_sale_table=[]
        var facilities_sale_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="facilities_sale_table"});
        facilities_sale_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(facilities_sale_table, function(value, key) {
          $ctrl.pdf_data_cashflow.facilities_sale_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.real_estate_sale_table=[]
        var real_estate_sale_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="real_estate_sale_table"});
        real_estate_sale_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_cash_operations, function(value, key) {
          $ctrl.pdf_data_cashflow.real_estate_sale_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.total_cash_inflows=[]
        var total_cash_inflows=cashflow.filter(function (cashflow) {return cashflow.item_name =="total_cash_inflows"});
        total_cash_inflows.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_cash_inflows, function(value, key) {
          $ctrl.pdf_data_cashflow.total_cash_inflows.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.rent_leases_table=[]
        var rent_leases_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="rent_leases_table"});
        rent_leases_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(rent_leases_table, function(value, key) {
          $ctrl.pdf_data_cashflow.rent_leases_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.cap_leases_table=[]
        var cap_leases_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="cap_leases_table"});
        cap_leases_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(cap_leases_table, function(value, key) {
          $ctrl.pdf_data_cashflow.cap_leases_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.total_cash_expenses=[]
        var total_cash_expenses=cashflow.filter(function (cashflow) {return cashflow.item_name =="total_cash_expenses"});
        total_cash_expenses.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_cash_expenses, function(value, key) {
          $ctrl.pdf_data_cashflow.total_cash_expenses.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.intermediate_cap_ex_table=[]
        var intermediate_cap_ex_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="intermediate_cap_ex_table"});
        intermediate_cap_ex_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(intermediate_cap_ex_table, function(value, key) {
          $ctrl.pdf_data_cashflow.intermediate_cap_ex_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.long_cap_ex_table=[]
        var long_cap_ex_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="long_cap_ex_table"});
        long_cap_ex_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(long_cap_ex_table, function(value, key) {
          $ctrl.pdf_data_cashflow.long_cap_ex_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.wages_table=[]
        var wages_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="wages_table"});
        wages_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(wages_table, function(value, key) {
          $ctrl.pdf_data_cashflow.wages_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.salaries_table=[]
        var salaries_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="salaries_table"});
        salaries_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(salaries_table, function(value, key) {
          $ctrl.pdf_data_cashflow.salaries_table.push(Number(value.item_number))
        });


        //
        $ctrl.pdf_data_cashflow.family_withdrawls_table=[]
        var family_withdrawls_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="family_withdrawls_table"});
        family_withdrawls_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(family_withdrawls_table, function(value, key) {
          $ctrl.pdf_data_cashflow.family_withdrawls_table.push(Number(value.item_number))
        });
        // //
        $ctrl.pdf_data_cashflow.contributions_table=[]
        var contributions_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="contributions_table"});
        contributions_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(contributions_table, function(value, key) {
          $ctrl.pdf_data_cashflow.contributions_table.push(Number(value.item_number))
        });
        // //
        $ctrl.pdf_data_cashflow.income_tax_table=[]
        var income_tax_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="income_tax_table"});
        income_tax_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(income_tax_table, function(value, key) {
          $ctrl.pdf_data_cashflow.income_tax_table.push(Number(value.item_number))
        });
        // //
        $ctrl.pdf_data_cashflow.short_interest_table=[]
        var short_interest_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="short_interest_table"});
        short_interest_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(short_interest_table, function(value, key) {
          $ctrl.pdf_data_cashflow.short_interest_table.push(Number(value.item_number))
        });
        // //
        $ctrl.pdf_data_cashflow.short_principal_table=[]
        var short_principal_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="short_principal_table"});
        short_principal_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(short_principal_table, function(value, key) {
          $ctrl.pdf_data_cashflow.short_principal_table.push(Number(value.item_number))
        });
        // //
        $ctrl.pdf_data_cashflow.int_interest_table=[]
        var int_interest_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="int_interest_table"});
        int_interest_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(int_interest_table, function(value, key) {
          $ctrl.pdf_data_cashflow.int_interest_table.push(Number(value.item_number))
        });
        // //
        $ctrl.pdf_data_cashflow.int_principal_table=[]
        var int_principal_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="int_principal_table"});
        int_principal_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(int_principal_table, function(value, key) {
          $ctrl.pdf_data_cashflow.int_principal_table.push(Number(value.item_number))
        });


        $ctrl.pdf_data_cashflow.improvement_interest_table=[]
        var improvement_interest_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="improvement_interest_table"});
        improvement_interest_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(improvement_interest_table, function(value, key) {
          $ctrl.pdf_data_cashflow.improvement_interest_table.push(Number(value.item_number))
        });

        $ctrl.pdf_data_cashflow.improvement_principal_table=[]
        var improvement_principal_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="improvement_principal_table"});
        improvement_principal_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(improvement_principal_table, function(value, key) {
          $ctrl.pdf_data_cashflow.improvement_principal_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.real_interest_table=[]
        var real_interest_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="real_interest_table"});
        real_interest_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_interest_table, function(value, key) {
          $ctrl.pdf_data_cashflow.real_interest_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.real_principal_table=[]
        var real_principal_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="real_principal_table"});
        real_principal_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_principal_table, function(value, key) {
          $ctrl.pdf_data_cashflow.real_principal_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.total_cash_outflows=[]
        var total_cash_outflows=cashflow.filter(function (cashflow) {return cashflow.item_name =="total_cash_outflows"});
        total_cash_outflows.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_cash_outflows, function(value, key) {
          $ctrl.pdf_data_cashflow.total_cash_outflows.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.short_borrowing_table=[]
        var short_borrowing_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="short_borrowing_table"});
        short_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(short_borrowing_table, function(value, key) {
          $ctrl.pdf_data_cashflow.short_borrowing_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.int_borrowing_table=[]
        var int_borrowing_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="int_borrowing_table"});
        int_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(int_borrowing_table, function(value, key) {
          $ctrl.pdf_data_cashflow.int_borrowing_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.improvements_borrowing_table=[]
        var improvements_borrowing_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="improvements_borrowing_table"});
        improvements_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(improvements_borrowing_table, function(value, key) {
          $ctrl.pdf_data_cashflow.improvements_borrowing_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.real_borrowing_table=[]
        var real_borrowing_table=cashflow.filter(function (cashflow) {return cashflow.item_name =="real_borrowing_table"});
        real_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_borrowing_table, function(value, key) {
          $ctrl.pdf_data_cashflow.real_borrowing_table.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.beginning_cash_balance=[]
        var beginning_cash_balance=cashflow.filter(function (cashflow) {return cashflow.item_name =="beginning_cash_balance"});
        beginning_cash_balance.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(beginning_cash_balance, function(value, key) {
          $ctrl.pdf_data_cashflow.beginning_cash_balance.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.inflows_minus_outflows=[]
        var inflows_minus_outflows=cashflow.filter(function (cashflow) {return cashflow.item_name =="inflows_minus_outflows"});
        inflows_minus_outflows.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(inflows_minus_outflows, function(value, key) {
          $ctrl.pdf_data_cashflow.inflows_minus_outflows.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.ending_cash_balance=[]
        var ending_cash_balance=cashflow.filter(function (cashflow) {return cashflow.item_name =="ending_cash_balance"});
        ending_cash_balance.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(ending_cash_balance, function(value, key) {
          $ctrl.pdf_data_cashflow.ending_cash_balance.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.outstanding_credit_line=[]
        var outstanding_credit_line=cashflow.filter(function (cashflow) {return cashflow.item_name =="outstanding_credit_line"});
        outstanding_credit_line.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(outstanding_credit_line, function(value, key) {
          $ctrl.pdf_data_cashflow.outstanding_credit_line.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.outstanding_short=[]
        var outstanding_short=cashflow.filter(function (cashflow) {return cashflow.item_name =="outstanding_short"});
        outstanding_short.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(outstanding_short, function(value, key) {
          $ctrl.pdf_data_cashflow.outstanding_short.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.outstanding_nonre=[]
        var outstanding_nonre=cashflow.filter(function (cashflow) {return cashflow.item_name =="outstanding_nonre"});
        outstanding_nonre.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(outstanding_nonre, function(value, key) {
          $ctrl.pdf_data_cashflow.outstanding_nonre.push(Number(value.item_number))
        });
        //
        $ctrl.pdf_data_cashflow.outstanding_real=[]
        var outstanding_real=cashflow.filter(function (cashflow) {return cashflow.item_name =="outstanding_real"});
        outstanding_real.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(outstanding_real, function(value, key) {
          $ctrl.pdf_data_cashflow.outstanding_real.push(Number(value.item_number))
        });

        $ctrl.pdf_data_cashflow.total_outstanding=[]
        var total_outstanding=cashflow.filter(function (cashflow) {return cashflow.item_name =="total_outstanding"});
        total_outstanding.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_outstanding, function(value, key) {
          $ctrl.pdf_data_cashflow.total_outstanding.push(Number(value.item_number))
        });

        $ctrl.pdf_data_cashflow.scenario_id= $ctrl.scenario.id


        console.log($ctrl.pdf_data_cashflow)
        // expense.sort(function(a,b) {
        //   return a.item_name - b.item_name;
        // });
        // console.log(expense)
        // angular.forEach(expense, function(value, key) {
        //   if (value.)
        //
        // });



      }
      function slice_income_or_expense_income_statement(data,type){

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
            $ctrl.pdf_data_income_statement.cashflowitem_expense.push(expense_row)
          });

        }
        else if(type=="income"){
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
            $ctrl.pdf_data_income_statement.cashflowitem_income.push(income_row)
          });
          console.log($ctrl.pdf_data_income_statement)
        }
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
            $ctrl.pdf_data_cashflow.cashflowitem_expense.push(expense_row)
          });

        }
        else if(type=="income"){
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
            $ctrl.pdf_data_cashflow.cashflowitem_income.push(income_row)
          });
          console.log($ctrl.pdf_data_cashflow)
        }
      }

      function groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
     }




    function proceed() {
      $uibModalInstance.dismiss();
    }

    function skip() {
      $uibModalInstance.dismiss();
    }

  }

}());
