(function() {
  'use strict';
  var app = angular.module("scenarioModule");
  angular
    .module("scenarioModule")
    .component("abc", {
      templateUrl: "/static/scenario/abc/abc.html",
      controller: FinaceComponentController,
    });

  app.filter('InitCase', function() {
    return function(str) {
      return str.toLowerCase().split(' ').map(function(word) {
        return word != 'and' && word != 'from' && word != 'than' ? word.replace(word[0], word[0].toUpperCase()) : word;
      }).join(' ');
    }
});
  /****************************************************************
                       Controller
  ****************************************************************/

  FinaceComponentController.$inject = [
    '$state',
    '$filter',
    '$q',
    'commonService',
    'scenarioService',
    'budgetService',
    "$uibModal"
  ];

  function FinaceComponentController(
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
    var plan_number = 1;
    var plan_data = "";
    $ctrl.future_lease_list = [];
    $ctrl.futureloans = [];
    $ctrl.scenario;
    $ctrl.plans;
    $ctrl.distributions;
    $ctrl.net_returns = new Array();
    $ctrl.table_income = new Array();
    $ctrl.back = back;
    $ctrl.proceed = proceed;
    $ctrl.biginningYearForm = [
      "Cash & Checking", "Accounts Receivable", "Prepaid Expenses", "Cash Investment Growing Crops Inventories", "Marketable Livestock", "Stored Crops and Feed", "Purchased Feed", "Supplies", "Other Current Assets",
      "Breeding Livestock", "Vehicles", "Machinery, Equipment", "Investment in Capital Leases", "Contracts & Notes Receivable",
      "Real Estate, Land", "Buildings & Improvements", "Other Non-Current Assets",
      "Accounts Payable", "Employee Payroll Withholding", "Income Taxes", "Deferred Taxes", "Other Accrued Expenses", "Other Current Liabilities",
    ];
    $ctrl.steps_2=['Cash Flow Review','Balance Sheet Review', 'Income Statement Review','Financial Ratios Review']
    $ctrl.cashflowitem_income = [];
    $ctrl.cashflowitem_expense = [];
    $ctrl.current_loans_list_table = [];
    $ctrl.current_leases_list_table = [];
    $ctrl.operating_loans_list_table = [];
    $ctrl.intermediate_sale_table = new Array(10).fill(0);
    $ctrl.facilities_sale_table = new Array(10).fill(0);
    $ctrl.real_estate_sale_table = new Array(10).fill(0);
    $ctrl.intermediate_cap_ex_table = new Array(10).fill(0);
    $ctrl.long_cap_ex_table = new Array(10).fill(0);
    $ctrl.int_interest_table  = new Array(10).fill(0);
    $ctrl.int_principal_table  = new Array(10).fill(0);
    $ctrl.short_interest_table  = new Array(10).fill(0);
    $ctrl.short_principal_table  = new Array(10).fill(0);
    $ctrl.improvement_interest_table = new Array(10).fill(0);
    $ctrl.improvement_principal_table = new Array(10).fill(0);
    $ctrl.real_interest_table = new Array(10).fill(0);
    $ctrl.real_principal_table = new Array(10).fill(0);
    $ctrl.int_borrowing_table = new Array(10).fill(0);
    $ctrl.short_borrowing_table = new Array(10).fill(0);
    $ctrl.improvements_borrowing_table = new Array(10).fill(0);
    $ctrl.real_borrowing_table  = new Array(10).fill(0);
    //totals
    $ctrl.total_cash_operations = new Array(10).fill(0);
    $ctrl.total_cash_inflows = new Array(10).fill(0);
    $ctrl.total_cash_expenses = new Array(10).fill(0);
    $ctrl.total_cash_outflows = new Array(10).fill(0);
    $ctrl.beginning_cash_balance = new Array(10).fill(0);
    $ctrl.inflows_minus_outflows = new Array(10).fill(0);
    $ctrl.ending_cash_balance = new Array(10).fill(0);
    //outstanding Loans
    // $ctrl.outstanding_credit_line = new Array(10).fill(0);
    $ctrl.outstanding_short = new Array(10).fill(0);
    $ctrl.outstanding_nonre = new Array(10).fill(0);
    $ctrl.outstanding_real = new Array(10).fill(0);
    $ctrl.total_outstanding = new Array(10).fill(0);
    //other
    $ctrl.wages_salaries_table = [];
    $ctrl.family_withdrawls_table = [];
    $ctrl.contributions_table = [];
    $ctrl.income_tax_table = [];
    $ctrl.employee_and_pension = new Array(10).fill(0);
    $ctrl.rent_leases_table = new Array(10).fill(0);
    $ctrl.cap_leases_table = new Array(10).fill(0);
    $ctrl.down_payment_table = new Array(10).fill(0);
    $ctrl.inflation;
    $ctrl.current_loans;
    $ctrl.current_leases;
    $ctrl.operating_loans;
    $ctrl.cash_from_asset_loan;
    $ctrl.capital_purchase;
    $ctrl.capital_sales;
    $ctrl.capital_leases;
    $ctrl.depreciation;
    $ctrl.user;
    $ctrl.pdf_data={};



    // Scenario variable


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      var combine_plans = {};
      var scenario_id = $state.params['scenario'];
      $ctrl.scenario = $state.params['scenario']
      console.log(scenario_id)
      $ctrl.module = $state.params["module"];
      scenarioService.retrieveCashFlowItem(scenario_id)
        .then(function(cash_flow_reponse) {
          console.log(cash_flow_reponse.data)
          if (cash_flow_reponse.data.length == 0) {
            scenarioService.retrieveScenario(scenario_id)
              .then(function(scenario_response) {
                console.log(scenario_response.data)
                if (scenario_response !== undefined &&
                  scenario_response.data !== undefined) {
                  scenarioService.listPlansByScenario(scenario_id)
                  .then(function (plan_response){
                    console.log(plan_response.data)
                    $ctrl.plans = plan_response.data;

                    $ctrl.plans.sort(function (a, b) {
                      return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
                    });
                  console.log($ctrl.plans)
                  combine_plans = combinePlans($ctrl.plans);
                  console.log(combine_plans)



                  angular.forEach(combine_plans, function(value, key) {
                    console.log(value.cost)
                    for (var key in value.cost) {
                      scenarioService.createCashFlowForBalance({
                        "year": value.year,
                        "scenario": scenario_id,
                        "type": "expense",
                        "name": key,
                        "total": value.cost[key].toFixed(2)
                      });
                    }
                    for (var key in value.income) {
                      scenarioService.createCashFlowForBalance({
                        "year": value.year,
                        "scenario": scenario_id,
                        "type": "income",
                        "name": key,
                        "total": value.income[key].toFixed(2)
                      });
                    }
                  })
                  });
                  //location.reload();
                }



              })
            //location.reload();
          } else {
            var output_expense = cash_flow_reponse.data.filter(function(obj) {
              return obj.type == "expense";
            });
            $ctrl.cashflowitem_expense = trans_year_to_item(output_expense)

            var output_income = cash_flow_reponse.data.filter(function(obj) {
              return obj.type == "income";
            });
            $ctrl.cashflowitem_income = trans_year_to_item(output_income)

          angular.forEach(combine_plans, function(value, key) {
            console.log(value.cost)
            for (var key in value.cost) {
              scenarioService.createCashFlowForBalance({"year":value.year,"scenario":scenario_id,"type":"expense","name":key ,"total":value.cost[key].toFixed(2)});
            }
            for (var key in value.income) {
              scenarioService.createCashFlowForBalance({"year":value.year,"scenario":scenario_id,"type":"income","name":key ,"total":value.income[key].toFixed(2)});
            }
          });
          }
        });



        commonService.retrieveCurrentUser()
        .then(function(current_user_response) {
          $ctrl.user = current_user_response.data;

          scenarioService.listCurrentLease($ctrl.user.username)
          .then(function(current_lease_response) {
            $ctrl.current_leases = current_lease_response.data;
            console.log($ctrl.current_leases);

            var current_leases = $ctrl.current_leases;
            for(var i = 0; i < current_leases.length; i++){
              console.log('here');
              calculate_current_leases(current_leases[i]);
            }
          });

          scenarioService.listCurrentLoans($ctrl.user.username)
          .then(function(current_loans_response) {
            $ctrl.current_loans = current_loans_response.data;
            console.log($ctrl.current_loans);
            var current_loans = $ctrl.current_loans;
          });


          scenarioService.listInflation(scenario_id)
          .then(function(inflation_response) {
            $ctrl.inflation = inflation_response.data[0];
            console.log($ctrl.inflation);

            scenarioService.retrieveDepreciation(scenario_id)
            .then(function(depreciation_response){
              $ctrl.depreciation = depreciation_response.data;
              $ctrl.depreciation.sort(function (a, b) {
                return a.year - b.year
              });
              //console.log($ctrl.depreciation);
              var i = 0;
              angular.forEach($ctrl.depreciation, function(depreciation) {
                var rate = parseFloat($ctrl.inflation.value_of_capital_expenditures) * .01 + 1;
                //console.log(rate);
                var int_cap_ex = parseFloat(depreciation.capital_expenditures) * (parseFloat(depreciation.capital_expenditures_to_intermediate_assets) * .01);
                int_cap_ex = int_cap_ex + parseFloat(depreciation.replacement_costs) * (parseFloat(depreciation.replacement_costs_for_intermediate_assets) * .01);
                //console.log(int_cap_ex);
                var long_cap_ex = parseFloat(depreciation.capital_expenditures) * (1-(parseFloat(depreciation.capital_expenditures_to_intermediate_assets) * .01));
                long_cap_ex = long_cap_ex + parseFloat(depreciation.replacement_costs) * (1-(parseFloat(depreciation.replacement_costs_for_intermediate_assets) * .01));
                var inflated_int_cap_ex = parseFloat(int_cap_ex) * Math.pow(rate, parseInt(depreciation.year));
                //console.log(inflated_int_cap_ex);
                var inflated_long_cap_ex = parseFloat(long_cap_ex) * Math.pow(rate, parseInt(depreciation.year));
                $ctrl.intermediate_cap_ex_table[i] += (parseInt(inflated_int_cap_ex));
                $ctrl.total_cash_outflows[i] += (parseInt(inflated_int_cap_ex));
                $ctrl.long_cap_ex_table[i] += (parseInt(inflated_long_cap_ex));
                $ctrl.total_cash_outflows[i] += (parseInt(inflated_long_cap_ex));
                i = i +1;

              });
            });

            scenarioService.listDistributions(scenario_id)
            .then(function(distributions_response){
              $ctrl.distributions = distributions_response.data;
              $ctrl.distributions.sort(function (a, b) {
                return a.year - b.year
              });
              console.log($ctrl.distributions);
              angular.forEach($ctrl.distributions, function(distributions) {

                $ctrl.wages_salaries_table.push(parseInt(distributions.inflated_wages) + parseInt(distributions.inflated_salaries));
                $ctrl.family_withdrawls_table.push(parseInt(distributions.inflated_family_withdrawls));
                $ctrl.contributions_table.push(parseInt(distributions.inflated_contributions));
                //TODO: fix income tax
                $ctrl.income_tax_table.push(0);

              });
              for(var i; i<10; i++){
                $ctrl.total_cash_outflows[i] += parseInt($ctrl.wages_salaries_table[i]);
                $ctrl.total_cash_outflows[i] += parseInt($ctrl.family_withdrawls_table[i]);
                $ctrl.total_cash_outflows[i] += parseInt($ctrl.contributions_table[i]);
                $ctrl.total_cash_outflows[i] += parseInt($ctrl.income_tax_table[i]);
              }
            });

            scenarioService.listOperatingLoans(scenario_id)
            .then(function(new_transactions_response) {
              console.log(new_transactions_response.data);
              $ctrl.operating_loans=new_transactions_response.data;
              angular.forEach($ctrl.operating_loans, function(loan) {
                var rate =  parseFloat($ctrl.inflation.intermediate_assets_inflation) * .01 + 1;
                var year = parseInt(loan.select_year);
                var inflated_loan = parseFloat(loan.loan_amount) * Math.pow(rate, year);
                var loan_interest = inflated_loan * (parseFloat(loan.interest_rate *.01));
                var total_due = 0
                var total_payed = 0
                if(year-1 < 10){
                  $ctrl.short_interest_table[year-1] += parseInt(loan_interest);
                  $ctrl.short_principal_table[year-1] += parseInt(inflated_loan);
                  $ctrl.total_cash_outflows[year-1] += parseInt(loan_interest + inflated_loan);
                  $ctrl.short_borrowing_table[year-1] += parseInt(loan_interest + inflated_loan);
                  total_payed += $ctrl.short_borrowing_table[year-1]
                  $ctrl.outstanding_short[year-1] += total_payed
                  $ctrl.total_outstanding[year-1] += total_payed
                }
              });
            });

            scenarioService.listCapitalPurchases(scenario_id)
            .then(function(new_transactions_response) {
              console.log(new_transactions_response.data);
              $ctrl.capital_purchase=new_transactions_response.data;

              angular.forEach($ctrl.capital_purchase, function(purchase) {
                var rate = 0;
                if(purchase.asset_class === 'Intermediate assets'){
                  rate = parseFloat($ctrl.inflation.intermediate_assets_inflation) * .01 + 1;
                } else if (purchase.asset_class === 'Facilities and Other Improvement') {
                  rate = parseFloat($ctrl.inflation.value_of_facilities_and_other_improvements_inflation) * .01 + 1;
                } else if (purchase.asset_class === 'Real Estate') {
                  rate = parseFloat($ctrl.inflation.value_of_real_estate) * .01 + 1;
                }

                if(purchase.financed_from === 'Conventional Loan'){
                  var inflated_purchase = parseFloat(purchase.purchase_price) * Math.pow(rate, purchase.select_beginning_year);
                  var inflated_trade_in = parseFloat(purchase.trade_in_value) * Math.pow(rate, purchase.select_beginning_year);
                  var remaining = inflated_purchase - inflated_trade_in - parseFloat(purchase.down_payment);
                  var start = parseInt(purchase.select_beginning_year);

                  if(purchase.asset_class === 'Intermediate assets'){
                    $ctrl.int_borrowing_table[start-1] += parseInt(remaining);
                    $ctrl.outstanding_nonre[start-1] += parseInt(remaining);
                    $ctrl.total_cash_outflows[start-1] += parseInt(remaining);
                  } else if (purchase.asset_class === 'Facilities and Other Improvement') {
                    $ctrl.improvements_borrowing_table[start-1] += parseInt(remaining);
                    $ctrl.outstanding_nonre[start-1] += parseInt(remaining);
                    $ctrl.total_cash_outflows[start-1] += parseInt(remaining);
                  } else if (purchase.asset_class === 'Real Estate') {
                    $ctrl.real_borrowing_table[start-1] += parseInt(remaining);
                    $ctrl.total_cash_outflows[start-1] += parseInt(remaining);
                  }


                  for(var i = 0; i<purchase.years_of_loan;i++){
                    var annual_payment = remaining/(purchase.years_of_loan-i)
                    var interest_payment = remaining * (parseFloat(purchase.interest_rate * .01));
                    var principle_payment = parseFloat(annual_payment) - interest_payment;
                    remaining = remaining - parseFloat(annual_payment);
                    console.log(purchase,interest_payment,principle_payment,remaining);
                    if(purchase.asset_class === 'Intermediate assets' && (i+start-1) <10){
                      $ctrl.int_interest_table[i+start-1] += parseInt(interest_payment);
                      $ctrl.int_principal_table[i+start-1] += parseInt(principle_payment);
                      $ctrl.outstanding_nonre [i+start-1] += parseInt(remaining);
                      $ctrl.total_outstanding [i+start-1] += parseInt(remaining);
                    } else if (purchase.asset_class === 'Facilities and Other Improvement' && (i+start-1) <10) {
                      $ctrl.improvement_interest_table[i+start-1] += parseInt(interest_payment);
                      $ctrl.improvement_principal_table[i+start-1] += parseInt(principle_payment);
                      $ctrl.outstanding_nonre [i+start-1] += parseInt(remaining);
                      $ctrl.total_outstanding [i+start-1] += parseInt(remaining);
                    } else if (purchase.asset_class === 'Real Estate' && (i+start-1) <10) {
                      $ctrl.real_interest_table[i+start-1] += parseInt(interest_payment);
                      $ctrl.real_principal_table[i+start-1] += parseInt(principle_payment);
                      $ctrl.outstanding_real[i+start-1] += parseInt(remaining);
                      $ctrl.total_outstanding [i+start-1] += parseInt(remaining);
                    }

                  }
                } else {
                  //from annual cash - capital_expenditures
                  var inflated_purchase = parseFloat(purchase.purchase_price) * Math.pow(rate, purchase.select_beginning_year);
                  var inflated_trade_in = parseFloat(purchase.trade_in_value) * Math.pow(rate, purchase.select_beginning_year);
                  var price = inflated_purchase - inflated_trade_in;
                  var year = parseInt(purchase.select_beginning_year);

                  if(purchase.asset_class === 'Intermediate assets'){
                    $ctrl.intermediate_cap_ex_table[year-1] += price;
                  }else{
                    $ctrl.long_cap_ex_table[year-1] += price;
                  }

                }

              });
            });

            scenarioService.listCapitalSales(scenario_id).then(function(new_transactions_response) {
              console.log(new_transactions_response.data);
               $ctrl.capital_sales=new_transactions_response.data;
               angular.forEach($ctrl.capital_sales, function(sale) {
                 if(sale.asset_class === 'Intermediate assets'){
                   var rate = parseFloat($ctrl.inflation.intermediate_assets_inflation) * .01 + 1;
                   var inflated_sales = parseFloat(sale.sale_price) * Math.pow(rate, sale.select_year);
                   $ctrl.intermediate_sale_table[sale.select_year - 1] += parseInt(inflated_sales);
                   $ctrl.total_cash_inflows[sale.select_year - 1]  += parseInt(inflated_sales);
                 } else if (sale.asset_class === 'Facilities and Other Improvement') {
                   var rate = parseFloat($ctrl.inflation.value_of_facilities_and_other_improvements_inflation) * .01 + 1;
                   var inflated_sales = parseFloat(sale.sale_price) * Math.pow(rate, sale.select_year);
                   $ctrl.facilities_sale_table[sale.select_year - 1] += parseInt(inflated_sales);
                   $ctrl.total_cash_inflows[sale.select_year - 1]  += parseInt(inflated_sales);
                 } else if (sale.asset_class === 'Real Estate') {
                   var rate = parseFloat($ctrl.inflation.value_of_real_estate) * .01 + 1;
                   var inflated_sales = parseFloat(sale.sale_price) * Math.pow(rate, sale.select_year);
                   $ctrl.real_estate_sale_table[sale.select_year - 1] += parseInt(inflated_sales);
                   $ctrl.total_cash_inflows[sale.select_year - 1]  += parseInt(inflated_sales);
                 }
               });
            });
            scenarioService.listFutureCapitalLeases(scenario_id).then(function(new_transactions_response) {
              console.log(new_transactions_response.data);
               $ctrl.capital_leases=new_transactions_response.data;
               angular.forEach($ctrl.capital_leases, function(lease) {
                 var start = parseInt(lease.select_year);
                 var years = parseInt(lease.year_of_lease);
                 var payment = parseInt(lease.annual_payment);
                 var down_payment = parseInt(lease.down_payment);

                 if(lease.asset_class === 'Intermediate Assets'){
                   var rate = parseFloat($ctrl.inflation.intermediate_assets_inflation) * .01 + 1;
                   payment = payment * Math.pow(rate, start);
                   $ctrl.intermediate_cap_ex_table[start-1] += down_payment;
                 } else if (lease.asset_class === 'Facilities and Other Improvement') {
                   var rate = parseFloat($ctrl.inflation.value_of_facilities_and_other_improvements_inflation) * .01 + 1;
                   payment = payment * Math.pow(rate, start);
                   $ctrl.long_cap_ex_table[start-1] += down_payment;
                 }

                 for (var i = 0; i < years; i++){
                   if((start + i - 1) < 10){
                     $ctrl.cap_leases_table[start + i - 1] += parseInt(payment);
                     $ctrl.total_cash_expenses[start + i - 1] += parseInt(payment);
                   }
                 }

               });

            });
            scenarioService.listCashFromAssetLoans(scenario_id).then(function(new_transactions_response) {
              console.log(new_transactions_response.data);
              $ctrl.cash_from_asset_loan=new_transactions_response.data;

              angular.forEach($ctrl.cash_from_asset_loan, function(loan) {
                //TODO:does loan value need to get inflated?
                var loan = parseFloat(loan.loan_amount);
                var rate = (parseFloat(loan.interest_rate) *.01);
                var loan_interest = loan * rate;
                var start = parseInt(loan.select_year);
                var years = parseInt(loan.years_of_loan);

                if(years === 1){
                  $ctrl.short_interest_table[year-1] += parseInt(loan_interest);
                  $ctrl.short_principal_table[year-1] += parseInt(loan);
                  $ctrl.short_borrowing_table[year-1] += parseInt(loan_interest + loan);
                  $ctrl.total_cash_outflows[year-1] += parseInt(loan_interest + loan);
                }else{
                  var remaining = loan;
                  $ctrl.real_borrowing_table[start-1] += parseInt(remaining);

                  for(var i = 0; i<years;i++){

                    var interest_payment = remaining * rate;
                    var annual_payment = loan_amount * (rate * Math.pow(1 + rate, years))/( pow( 1 + (rate), years) - 1);
                    var principle_payment = annual_payment - interest_payment;
                    remaining = remaining - annual_payment;
                    $ctrl.real_interest_table[i+start-1] += parseInt(interest_payment);
                    $ctrl.total_cash_outflows[i+start-1] += parseInt(interest_payment);
                    $ctrl.real_principal_table[i+start-1] += parseInt(principle_payment);
                    $ctrl.total_cash_outflows[i+start-1] += parseInt(principle_payment);
                  }

                }


              });

            });
            //TODO: get beginning balance sheet with only cash field
            for (var i = 0; i<10; i++){
              $ctrl.total_cash_inflows[i] += $ctrl.total_cash_operations[i];
              $ctrl.total_cash_outflows[i] += $ctrl.total_cash_expenses[i];
              $ctrl.inflows_minus_outflows[i] += $ctrl.total_cash_inflows[i] - $ctrl.total_cash_outflows[i];
              $ctrl.ending_cash_balance[i] += $ctrl.inflows_minus_outflows[i];
              if(i<9){
              $ctrl.beginning_cash_balance[i+1] += $ctrl.ending_cash_balance[i];
              }

            }
            generatePdf( )
            console.log($ctrl.pdf_data)

          });

        });

    }
    function generatePdf( ){
      $ctrl.pdf_data.scenario_id=$ctrl.scenario
      $ctrl.pdf_data.cashflowitem_income=$ctrl.cashflowitem_income
      $ctrl.pdf_data.total_cash_operations=  $ctrl.total_cash_operations
      $ctrl.pdf_data.intermediate_sale_table=$ctrl.intermediate_sale_table
      $ctrl.pdf_data.facilities_sale_table=$ctrl.facilities_sale_table

      $ctrl.pdf_data.real_estate_sale_table=$ctrl.real_estate_sale_table
      $ctrl.pdf_data.total_cash_inflows=$ctrl.total_cash_inflows
      $ctrl.pdf_data.cashflowitem_expense=$ctrl.cashflowitem_expense
      $ctrl.pdf_data.rent_leases_table= $ctrl.rent_leases_table
      $ctrl.pdf_data.cap_leases_table= $ctrl.cap_leases_table
      $ctrl.pdf_data.total_cash_expenses=$ctrl.total_cash_expenses
      $ctrl.pdf_data.intermediate_cap_ex_table=$ctrl.intermediate_cap_ex_table

      $ctrl.pdf_data.long_cap_ex_table=  $ctrl.long_cap_ex_table
      $ctrl.pdf_data.wages_salaries_table=$ctrl.wages_salaries_table
      $ctrl.pdf_data.family_withdrawls_table=$ctrl.family_withdrawls_table
      $ctrl.pdf_data.contributions_table=$ctrl.contributions_table
      $ctrl.pdf_data.income_tax_table=$ctrl.income_tax_table
      $ctrl.pdf_data.short_interest_table= $ctrl.short_interest_table
      $ctrl.pdf_data.short_principal_table= $ctrl.short_principal_table
      $ctrl.pdf_data.int_interest_table=$ctrl.int_interest_table

      $ctrl.pdf_data.int_principal_table=  $ctrl.int_principal_table
      $ctrl.pdf_data.improvement_interest_table=$ctrl.improvement_interest_table
      $ctrl.pdf_data.improvement_principal_table=$ctrl.improvement_principal_table
      $ctrl.pdf_data.real_interest_table=$ctrl.real_interest_table
      $ctrl.pdf_data.real_principal_table=$ctrl.real_principal_table
      $ctrl.pdf_data.total_cash_outflows=$ctrl.total_cash_outflows
      $ctrl.pdf_data.short_borrowing_table= $ctrl.short_borrowing_table
      $ctrl.pdf_data.int_borrowing_table= $ctrl.int_borrowing_table
      $ctrl.pdf_data.improvements_borrowing_table=$ctrl.improvements_borrowing_table

      $ctrl.pdf_data.real_borrowing_table=  $ctrl.real_borrowing_table
      $ctrl.pdf_data.beginning_cash_balance=$ctrl.beginning_cash_balance
      $ctrl.pdf_data.inflows_minus_outflows=$ctrl.inflows_minus_outflows
      $ctrl.pdf_data.ending_cash_balance=$ctrl.ending_cash_balance
      // $ctrl.pdf_data.outstanding_credit_line=$ctrl.outstanding_credit_line
      $ctrl.pdf_data.outstanding_short=$ctrl.outstanding_short
      $ctrl.pdf_data.outstanding_nonre= $ctrl.outstanding_nonre
      $ctrl.pdf_data.outstanding_real= $ctrl.outstanding_real
      $ctrl.pdf_data.total_outstanding=$ctrl.total_outstanding


    }


    function calculate_capital_purchases(transaction){
      //variables
      var calculation = []
      var amount_left = (transaction.purchase_price - transaction.trade_in_value) * .01 * transaction.percent_financed;
      var amount_not_financed = (transaction.purchase_price - transaction.trade_in_value) * .01 * (100 - transaction.percent_financed);
      var relative_value_inflation = 0;
      switch (transaction.asset_type) {
        case "Real Estate":
          relative_value_inflation = 0;
        break;
        case "Facilities and Other Improvement":
          relative_value_inflation = $ctrl.inflation.value_of_facilities_and_other_improvements_inflation;
        break;
        case "Intermediate assets":
          relative_value_inflation = $ctrl.inflation.intermediate_assets_inflation;
          break;
        default:
      };
      amount_left = amount_left * Math.pow( 1 + (relative_value_inflation*.01),transaction.select_beginning_year ) ;
      var interest_rate = transaction.interest_rate;
      var years_of_loan = transaction.years_of_loan;
      var years_of_interest_only_payment = transaction.years_of_interest_only_payment;
      var transaction_down_payment = amount_not_financed * Math.pow( 1 + (relative_value_inflation*.01),transaction.select_beginning_year );
      var annual_payments = amount_left * ((interest_rate * .01 * Math.pow(1 + (.01 * interest_rate), years_of_loan-years_of_interest_only_payment)) / (Math.pow(1 + (.01 * interest_rate), years_of_loan-years_of_interest_only_payment) - 1))
      var loan_values = [];
      //for each year of the loan calculating the interest payment and priciple payment and updating the amount remaining on the loan
      calculate_yearly_loan_payments(calculation, annual_payments, amount_left, interest_rate, years_of_loan, years_of_interest_only_payment);

      //for each year that is displayed 0 thru 10 match the right calculated year to the matching year
      var empty_year = {
        interest_payment: ' ',
        principle_payment: ' ',
        total_payment: ' ',
        down_payment: ' '
      };
      match_calculation_to_years(transaction,calculation,loan_values,transaction_down_payment,empty_year);

      //create an object that holds the title of the loan and the years of the loan and add those to a global variable of all loans to be displayed in the html
      var loan_data = {
        title: transaction.financed_through,
        years: loan_values
      }
      $ctrl.current_loans_list_table.push(loan_data)


    }




    function match_calculation_to_years(transaction,calculation,loan_values,transaction_down_payment,empty_year){
      for (var j = 0; j < 10; j++) {
        var year_of_calculation = j - Math.max(transaction.select_beginning_year,transaction.select_year);
        if (year_of_calculation >= 0 && year_of_calculation < calculation.length) {
          loan_values.push(calculation[year_of_calculation]);
        } else if(year_of_calculation === -1){
          var temp_empty_year = Object.assign({}, empty_year);;
          temp_empty_year.total_payment = transaction_down_payment.toFixed(2);
          temp_empty_year.down_payment = transaction_down_payment.toFixed(2);
          loan_values.push(temp_empty_year);
        }else{
          loan_values.push(empty_year);
        };
      }
    }

    function calculate_yearly_loan_payments(calculation, annual_payments, amount_left, interest_rate, years_of_loan, years_of_interest_only_payment ){
      years_of_interest_only_payment = years_of_interest_only_payment || 0;
      for (var j = 0; j < years_of_loan; j++) {
        var temp_interest_payment = amount_left * interest_rate * .01
        if(j >= years_of_interest_only_payment ){
          var temp_principle_payment = annual_payments - temp_interest_payment
          amount_left = amount_left - temp_principle_payment;
          //each year is an object that holds both interst and principle payment
          var loan_year = {
            interest_payment: temp_interest_payment.toFixed(2),
            principle_payment: temp_principle_payment.toFixed(2),
            total_payment: Number(annual_payments).toFixed(2),
            down_payment: ' '
          }
        } else{
          var loan_year = {
            interest_payment: temp_interest_payment.toFixed(2),
            principle_payment: 0,
            total_payment: temp_interest_payment.toFixed(2),
            down_payment: ' '
          }
        }

        calculation.push(loan_year);
      }
    }

    function calculate_yearly_lease_payments(calculation, annual_payments, years_of_loan ){
      var years_of_interest_only_payment = years_of_interest_only_payment || 0;
      for (var j = 0; j < years_of_loan; j++) {
        //each year is an object that holds both interst and principle payment
        var loan_year = {
          annual_payment: Number(annual_payments).toFixed(2),
          total_payment: Number(annual_payments).toFixed(2),
          down_payment: ' '
        }
        calculation.push(loan_year);
      }
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



    function trans_year_to_item(cashflow) {
      console.log(cashflow);
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
        if(cashflow.name !== 'Rent and leases: Machinery, equipment and vehicles'
           && cashflow.name !== 'Rent and leases: Land and animals'
           && cashflow.name !== 'Interest on Loans and Mortgages'
           && cashflow.name !== 'L-t Asset Replacement & Section 179 Expenses'
           && cashflow.name !== 'Employee Benefit Programs'
           && cashflow.name !== 'Pension and Profit-Sharing'){
             name.push(cashflow.name)
           } else if (cashflow.name !== 'Rent and leases: Land and animals') {
             var year = parseInt(cashflow.year) - 1;
             $ctrl.rent_leases_table[year] += parseInt(cashflow.total);
             $ctrl.total_cash_expenses[year] +=  parseInt(cashflow.total);
           } else if (cashflow.name === 'Rent and leases: Machinery, equipment and vehicles') {
             //do nothing for now, as to not double count

           }else if(cashflow.name === 'Interest on Loans and Mortgages'){
             //Do nothing so we don't count twice
             //$ctrl.real_interest_table[year] += parseInt(cashflow.total);
           }else if(cashflow.name === 'L-t Asset Replacement & Section 179 Expenses'){
             //Do nothing removed from cash flow page
           }else if(cashflow.name === 'Employee Benefit Programs' || cashflow.name === 'Pension and Profit-Sharing'){
             //combine to table
             var year = parseInt(cashflow.year) - 1;
             $ctrl.employee_and_pension[year] += parseInt(cashflow.total);
           }

           //$ctrl.employee_and_pension
           //Employee Benefit Programs
           //Pension and Profit-Sharing

      });
      var unique_name = name.filter(onlyUnique);
      angular.forEach(unique_name, function(unique_name) {
        //console.log(unique_name);
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
      });

      angular.forEach(cashflow_by_item, function(cashflow_by_item) {
          for (var i = 0; i < cashflow.length; i++) {
            if (cashflow[i].name == cashflow_by_item.name) {
              if(cashflow[i].year === '1.00'){
                cashflow_by_item.year_1 = parseInt(cashflow[i].total);
                if(cashflow[i].type === 'expense'){
                  $ctrl.total_cash_expenses[0] +=  parseInt(cashflow[i].total);
                }else if (cashflow[i].type === 'income') {
                  $ctrl.total_cash_operations[0] +=  parseInt(cashflow[i].total);
                }
              } else if (cashflow[i].year === '2.00') {
                cashflow_by_item.year_2 = parseInt(cashflow[i].total);
                if(cashflow[i].type === 'expense'){
                  $ctrl.total_cash_expenses[1] +=  parseInt(cashflow[i].total);
                }else if (cashflow[i].type === 'income') {
                  $ctrl.total_cash_operations[1] +=  parseInt(cashflow[i].total);
                }
              }  else if (cashflow[i].year === '3.00') {
                cashflow_by_item.year_3 = parseInt(cashflow[i].total);
                if(cashflow[i].type === 'expense'){
                  $ctrl.total_cash_expenses[2] +=  parseInt(cashflow[i].total);
                }else if (cashflow[i].type === 'income') {
                  $ctrl.total_cash_operations[2] +=  parseInt(cashflow[i].total);
                }
              } else if (cashflow[i].year === '4.00') {
                cashflow_by_item.year_4 = parseInt(cashflow[i].total);
                if(cashflow[i].type === 'expense'){
                  $ctrl.total_cash_expenses[3] +=  parseInt(cashflow[i].total);
                }else if (cashflow[i].type === 'income') {
                  $ctrl.total_cash_operations[3] +=  parseInt(cashflow[i].total);
                }
              } else if (cashflow[i].year === '5.00') {
                cashflow_by_item.year_5 = parseInt(cashflow[i].total);
                if(cashflow[i].type === 'expense'){
                  $ctrl.total_cash_expenses[4] +=  parseInt(cashflow[i].total);
                }else if (cashflow[i].type === 'income') {
                  $ctrl.total_cash_operations[4] +=  parseInt(cashflow[i].total);
                }
              } else if (cashflow[i].year === '6.00') {
                cashflow_by_item.year_6 = parseInt(cashflow[i].total);
                if(cashflow[i].type === 'expense'){
                  $ctrl.total_cash_expenses[5] +=  parseInt(cashflow[i].total);
                }else if (cashflow[i].type === 'income') {
                  $ctrl.total_cash_operations[5] +=  parseInt(cashflow[i].total);
                }
              } else if (cashflow[i].year === '7.00') {
                cashflow_by_item.year_7 = parseInt(cashflow[i].total);
                if(cashflow[i].type === 'expense'){
                  $ctrl.total_cash_expenses[6] +=  parseInt(cashflow[i].total);
                }else if (cashflow[i].type === 'income') {
                  $ctrl.total_cash_operations[6] +=  parseInt(cashflow[i].total);
                }
              } else if (cashflow[i].year === '8.00') {
                cashflow_by_item.year_8 = parseInt(cashflow[i].total);
                if(cashflow[i].type === 'expense'){
                  $ctrl.total_cash_expenses[7] +=  parseInt(cashflow[i].total);
                }else if (cashflow[i].type === 'income') {
                  $ctrl.total_cash_operations[7] +=  parseInt(cashflow[i].total);
                }
              } else if (cashflow[i].year === '9.00') {
                cashflow_by_item.year_9 = parseInt(cashflow[i].total);
                if(cashflow[i].type === 'expense'){
                  $ctrl.total_cash_expenses[8] +=  parseInt(cashflow[i].total);
                }else if (cashflow[i].type === 'income') {
                  $ctrl.total_cash_operations[8] +=  parseInt(cashflow[i].total);
                }
              } else if (cashflow[i].year === '10.00') {
                cashflow_by_item.year_10 = parseInt(cashflow[i].total);
                if(cashflow[i].type === 'expense'){
                  $ctrl.total_cash_expenses[9] +=  parseInt(cashflow[i].total);
                }else if (cashflow[i].type === 'income') {
                  $ctrl.total_cash_operations[9] +=  parseInt(cashflow[i].total);
                }
              }
            }
          }

      });
      return (cashflow_by_item)
    }

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    function combinePlans(plans) {
      var item_arr = [];

      angular.forEach(plans, function(plan) {
        angular.forEach(plan.plan_budgets, function(plan_budget) {
          var item = {};
          item['year'] = plan_budget.position + 1;
          item['income'] = plan_budget.income_items_with_inflation;
          item['cost'] = plan_budget.cost_items_with_inflation;
          if (item_arr.length < 10) {
            item_arr.push(item);
          } else {
            //console.log(item.cost)
            for (var key in item.cost) {
              // console.log(item_arr[plan_budget.position].cost[key])
              //console.log(item.cost[key])
              if (item_arr[plan_budget.position].cost[key] == undefined) {
                item_arr[plan_budget.position].cost[key] = item.cost[key]
                //console.log(item_arr[plan_budget.position].cost[key])
              } else {
                item_arr[plan_budget.position].cost[key] += item.cost[key];


              }


            }

            for (var key in item.income) {
              if (item_arr[plan_budget.position].income[key] == undefined) {
                item_arr[plan_budget.position].income[key] = item.income[key];
              } else {
                item_arr[plan_budget.position].income[key] += item.income[key];
              }
            }

          }


        });

      });
      return (item_arr);


    }

    function back() {
      $state.go("financeSummary", {
        'scenario': $state.params['scenario'],
        'module': $ctrl.module
      });
    }


    function proceed() {
      console.log($ctrl.scenario)
      scenarioService.retrieveCashFlowOutput($ctrl.scenario)
        .then(function(cash_flow_reponse) {
          if(cash_flow_reponse.data.length==0){
            console.log(cash_flow_reponse.data.length)
            // create cash_flow_output
            scenarioService.createCashFlowOutput({"scenario":$ctrl.scenario})
              .then(function(response) {
                create_cash_flow_output_item(response.data.id)
              })
          }
          else{
            scenarioService.retrieveCashFlowOutput($ctrl.scenario)
              .then(function(response) {
                console.log(response.data)
                scenarioService.destroyCashFlowOutput(response.data[0].id)
                  .then(function(response) {
                  scenarioService.createCashFlowOutput({"scenario":$ctrl.scenario})
                    .then(function(response) {
                      create_cash_flow_output_item(response.data.id)
                    })
              })
              })
          }
        })

        $state.go("financeBalanceSheetYear", {
          'scenario': $state.params['scenario'],
          'module': $ctrl.module
        });
    }

    function create_cash_flow_output_item(cashflow_id){
        // console.log(1231)

        angular.forEach($ctrl.cashflowitem_income, function(row, key) {
          Object.keys(row).forEach(function (key, index) {
              if(index!==0){
                scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":index, "item_name":row.name, "item_number": row[key],"type":"income"})
              }
            });
        })

        angular.forEach($ctrl.cashflowitem_expense, function(row, key) {
          Object.keys(row).forEach(function (key, index) {
              if(index!==0){
                scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":index, "item_name":row.name, "item_number": row[key],"type":"expense"})
              }
            });
        })


        angular.forEach($ctrl.total_cash_operations, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"total_cash_operations", "item_number": value})
        })
        angular.forEach($ctrl.intermediate_sale_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"intermediate_sale_table", "item_number": value})
        })

        angular.forEach($ctrl.facilities_sale_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"facilities_sale_table", "item_number": value})
        })

        angular.forEach($ctrl.real_estate_sale_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"real_estate_sale_table", "item_number": value})
        })

        angular.forEach($ctrl.total_cash_inflows, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"total_cash_inflows", "item_number": value})
        })


        angular.forEach($ctrl.rent_leases_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"rent_leases_table", "item_number": value})
        })

        angular.forEach($ctrl.cap_leases_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"cap_leases_table", "item_number": value})
        })

        angular.forEach($ctrl.total_cash_expenses, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"total_cash_expenses", "item_number": value})
        })

        angular.forEach($ctrl.intermediate_cap_ex_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"intermediate_cap_ex_table", "item_number": value})
        })

        angular.forEach($ctrl.long_cap_ex_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"long_cap_ex_table", "item_number": value})
        })

        angular.forEach($ctrl.wages_salaries_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"wages_table", "item_number": value})
        })

        angular.forEach($ctrl.family_withdrawls_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"family_withdrawls_table", "item_number": value})
        })

        angular.forEach($ctrl.contributions_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"contributions_table", "item_number": value})
        })

        angular.forEach($ctrl.income_tax_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"income_tax_table", "item_number": value})
        })

        angular.forEach($ctrl.short_interest_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"short_interest_table", "item_number": value})
        })

        angular.forEach($ctrl.short_principal_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"short_principal_table", "item_number": value})
        })

        angular.forEach($ctrl.int_interest_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"int_interest_table", "item_number": value})
        })

        angular.forEach($ctrl.int_principal_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"int_principal_table", "item_number": value})
        })

        angular.forEach($ctrl.improvement_interest_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"improvement_interest_table", "item_number": value})
        })

        angular.forEach($ctrl.improvement_principal_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"improvement_principal_table", "item_number": value})
        })

        angular.forEach($ctrl.real_interest_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"real_interest_table", "item_number": value})
        })

        angular.forEach($ctrl.real_principal_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"real_principal_table", "item_number": value})
        })

        angular.forEach($ctrl.total_cash_outflows, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"total_cash_outflows", "item_number": value})
        })

        angular.forEach($ctrl.short_borrowing_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"short_borrowing_table", "item_number": value})
        })

        angular.forEach($ctrl.int_borrowing_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"int_borrowing_table", "item_number": value})
        })

        angular.forEach($ctrl.improvements_borrowing_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"improvements_borrowing_table", "item_number": value})
        })

        angular.forEach($ctrl.real_borrowing_table, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"real_borrowing_table", "item_number": value})
        })

        angular.forEach($ctrl.beginning_cash_balance, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"beginning_cash_balance", "item_number": value})
        })

        angular.forEach($ctrl.inflows_minus_outflows, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"inflows_minus_outflows", "item_number": value})
        })

        angular.forEach($ctrl.ending_cash_balance, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"ending_cash_balance", "item_number": value})
        })

        angular.forEach($ctrl.outstanding_credit_line, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"outstanding_credit_line", "item_number": value})
        })
        angular.forEach($ctrl.outstanding_short, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"outstanding_short", "item_number": value})
        })
        angular.forEach($ctrl.outstanding_nonre, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"outstanding_nonre", "item_number": value})
        })
        angular.forEach($ctrl.outstanding_real, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"outstanding_real", "item_number": value})
        })
        angular.forEach($ctrl.total_outstanding, function(value, key) {
            scenarioService.createCashFlowItemOutput({"cash_flow":cashflow_id, "year":key, "item_name":"total_outstanding", "item_number": value})
        })

    }





  }

}());
