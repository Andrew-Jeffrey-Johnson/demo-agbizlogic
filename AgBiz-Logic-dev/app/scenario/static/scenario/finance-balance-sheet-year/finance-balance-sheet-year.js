(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeBalanceSheetYear", {
      templateUrl: "/static/scenario/finance-balance-sheet-year/finance-balance-sheet-year.html",
      controller: FinanceBalanceSheetYearComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceBalanceSheetYearComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      'budgetService',
      "$uibModal"
    ];

    function FinanceBalanceSheetYearComponentController(
      $state,
      $filter,
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

      //$ctrl.proceed = proceed;
      //$ctrl.back = back;
      //$ctrl.itemAttributeMap = itemAttributeMap;

      // Variables
      $ctrl.cash=[];
      $ctrl.supplies=[];
      $ctrl.short_asset=new Array(11).fill(0);
      $ctrl.other_longterm_assets=new Array(11).fill(0);
      $ctrl.account_receivable=[];
      $ctrl.accounts_payable=new Array(11).fill(0);
      $ctrl.breeding_livestock=[];
      $ctrl.contracts_and_notes_receivable=[];
      $ctrl.investing_in_cooperatives=[];
      $ctrl.other_intermediate = [];
      $ctrl.deferred_taxes=[];
      $ctrl.accrued_interest=[];
      $ctrl.ad_valorem_taxes=new Array(11).fill(0);
      $ctrl.employee_payroll_withholding=[];
      $ctrl.income_taxes=[];
      $ctrl.investment=[];
      $ctrl.investment_in_capital_leases=[];
      $ctrl.marketable_livestock=[];
      $ctrl.other_accured_expenses=[];
      $ctrl.other_assets=[];
      $ctrl.other_liabilites=new Array(11).fill(0);
      $ctrl.other_noncurrent_assets=[];
      $ctrl.prepaid_expenses=[];
      $ctrl.purchased_feed=[];
      $ctrl.real_estate_land=[];
      $ctrl.stored_crops_and_feed=[];
      $ctrl.supplies=[];
      $ctrl.vehicles=[];
      $ctrl.total_current_assets=new Array(11).fill(0);
      $ctrl.total_assets=new Array(11).fill(0);
      $ctrl.total_current_liabilities=new Array(11).fill(0);
      $ctrl.total_noncurrent_liabilities=new Array(11).fill(0);
      $ctrl.total_liabilities=new Array(11).fill(0);
      $ctrl.total_equity= new Array(10).fill(0);
      $ctrl.total_liabilities_equity= new Array(10).fill(0);
      //loan and lease variables
      $ctrl.new_transactions = [];
      $ctrl.operating_loans=[];
      $ctrl.capital_purchase=[];
      $ctrl.capital_sales=[];
      // $ctrl.capital_leases=[];
      $ctrl.capital_leases_current=[];
      $ctrl.capital_leases_non_current=[];
      $ctrl.cash_from_asset_loan=[];
      $ctrl.steps_2=['Cash Flow Review','Balance Sheet Review', 'Income Statement Review','Financial Ratios Review']
      $ctrl.current_portion_of_captical_lease = new Array(11).fill(0);
      $ctrl.current_portion_of_term_debt = new Array(11).fill(0);
      $ctrl.accrued_interest = new Array(11).fill(0);
      $ctrl.intermediate_sale_table = new Array(11).fill(0);
      $ctrl.facilities_sale_table = new Array(11).fill(0);
      $ctrl.real_estate_sale_table = new Array(11).fill(0);
      $ctrl.intermediate_cap_ex_table = new Array(11).fill(0);
      $ctrl.long_cap_ex_table = new Array(11).fill(0);
      $ctrl.int_interest_table  = new Array(11).fill(0);
      $ctrl.int_principal_table  = new Array(11).fill(0);
      $ctrl.short_interest_table  = new Array(11).fill(0);
      $ctrl.short_principal_table  = new Array(11).fill(0);
      $ctrl.improvement_interest_table = new Array(11).fill(0);
      $ctrl.improvement_principal_table = new Array(10).fill(0);
      $ctrl.real_interest_table = new Array(11).fill(0);
      $ctrl.real_principal_table = new Array(11).fill(0);
      $ctrl.int_borrowing_table = new Array(11).fill(0);
      $ctrl.short_borrowing_table = new Array(11).fill(0);
      $ctrl.improvements_borrowing_table = new Array(11).fill(0);
      $ctrl.nonreal_borrowing_table = new Array(11).fill(0);
      $ctrl.real_borrowing_table  = new Array(11).fill(0);
      //totals
      $ctrl.total_cash_operations = new Array(11).fill(0);
      $ctrl.total_cash_inflows = new Array(11).fill(0);
      $ctrl.total_cash_expenses = new Array(11).fill(0);
      $ctrl.total_cash_outflows = new Array(11).fill(0);
      $ctrl.wages_table = [];
      $ctrl.salaries_table = [];
      $ctrl.family_withdrawls_table = [];
      $ctrl.contributions_table = [];
      $ctrl.income_tax_table = [];
      $ctrl.rent_leases_table = new Array(11).fill(0);
      $ctrl.cap_leases_table = new Array(11).fill(0);
      $ctrl.down_payment_table = new Array(11).fill(0);
      $ctrl.current_loans_list_table= [];
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
      $ctrl.module;
      //the copy of variable use to build database


      $ctrl.first_year;
      $ctrl.scenario_id;

      $ctrl.back = back;
      $ctrl.proceed = proceed;
      $ctrl.pdf_data={}

      $ctrl.beginning_balance_sheet = {
        'year': 0,
        'cash_and_checking': 0.00,
        'cash_balance': 0.00,
        'prepaid_expenses': 0.00,
        'marketable_livestock': 0.00,
        'investment': 0.00,
        'account_receivable': 0.00,
        'other_assets': 0.00,
        'stored_crops_and_feed': 0.00,
        'purchased_feed': 0.00,
        'supplies': 0.00,
        //hiding for MVP, using machinery_equipment for all data now
        //'breeding_livestock': 0.00,
        //'vehicles': 0.00,
        'machinery_equipment': 0.00,
        'contracts_and_notes_receivable': 0.00,
        'investing_in_cooperatives':0.00,
        //hiding for MVP
        //'investment_in_capital_leases': 0.00,
        //'contracts_and_notes_receivable': 0.00,
        'real_estate_land': 0.00,
        'other_longterm_assets': 0.00,
        //hiding for MVP
        //'other_noncurrent_assets': 0.00,
        'accounts_payable': 0.00,
        'accrued_interest':0.00,
        'ad_valorem_taxes':0.00,
        'employee_payroll_withholding': 0.00,
        'income_taxes': 0.00,
        'deferred_taxes': 0.00,
        'other_accured_expenses': 0.00,
        'other_liabilites': 0.00,
        'total_current_assets': 0.00,
        'total_current_liabilites': 0.00,
        'total_current_equity': 0.00,
      };

      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        var first_year;
        var combine_plans;
        var scenario_id = $state.params['scenario'];
        $ctrl.scenario_id=$state.params['scenario'];
        $ctrl.module=$state.params['module'];
        //console.log($ctrl.module)
        // scenarioService.retrieveBalanceSheetBySpecificYear(0)
        // .then(function(balancesheet_response) {
        //     first_year = balancesheet_response.data;
        //     initialization(first_year);
        //
        // });

        commonService.retrieveCurrentUser()
        .then(function(user_response) {
          if(user_response !== undefined){
            $ctrl.user = user_response.data;
          }

          //console.log($ctrl.user.username)
          scenarioService.retrieveBalanceSheet('?username=', $ctrl.user.username)
          .then(function(balancesheet_response) {
              $ctrl.first_year = balancesheet_response.data[0];
              //console.log($ctrl.first_year)
              //console.log($ctrl.scenario_id)
              scenarioService.retrieveAccrualAdjustment('?scenario=', $ctrl.scenario_id).then(function(acc){

                var acc_filter =  acc.data.filter(function(hero) {
	                 return hero.scenario == $ctrl.scenario_id;
                 });//scenarioService.retrieveAccrualAdjustment doesnt work it return all the accural adjustment
                 console.log(acc_filter)
                 initialization($ctrl.first_year,acc_filter)
                 .then(function(initialization_response){
                   if(initialization_response !== undefined){
                     calculate_short_other_longterm_assets(scenario_id,$ctrl.first_year,acc_filter)
                     .then(function(short_other_longterm_assets_response){
                       if(short_other_longterm_assets_response !== undefined){
                         scenarioService.retrieveScenario(scenario_id)
                           .then(function (scenario_response) {
                             if (scenario_response !== undefined &&
                               scenario_response.data !== undefined) {
                               $ctrl.scenario = scenario_response.data;
                               scenarioService.listPlansByScenario(scenario_id)
                               .then(function (plan_response){
                                 $ctrl.plans = plan_response.data;

                                 $ctrl.plans.sort(function (a, b) {
                                   return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
                                 });

                                 var net_return=0;
                                 var net_returns_with_inflation=[0,1,2,3,4,5,6,7,8,9,10];
                                 //console.log(net_returns_with_inflation)


                                 for(var year=0;year<11;year++){
                                   for (var i=0;i<$ctrl.plans.length;i++){
                                     if($ctrl.plans[i].net_returns_over_time[year] !== undefined){
                                       net_return += $ctrl.plans[i].net_returns_over_time[year].return_with_inflation;
                                     }
                                   }
                                   net_returns_with_inflation[year]=net_return;
                                 }
                                 // console.log(net_returns_with_inflation);
                                 $ctrl.cash = net_returns_with_inflation;
                                 var scenario_id = $state.params['scenario'];
                                 $ctrl.module = $state.params['module'];
                                 var operating_loans = Array(11).fill(0);
                                 var capital_leases = Array(11).fill(0);
                                 var capital_leases_current = Array(11).fill(0);
                                 var capital_leases_non_current = Array(11).fill(0);
                                 var capital_sales = Array(11).fill(0);
                                 var capital_purchase = Array(11).fill(0);
                                 var cash_from_asset_loan = Array(11).fill(0);

                                 //
                                 //

                                 // Liabilities
                                 // display this one, but do not add to totals of either Liabilities or assets
                                 scenarioService.listOperatingLoans(scenario_id).then(function(new_transactions_response) {
                                   // console.log(new_transactions_response.data)
                                     $ctrl.operating_loans=new_transactions_response.data
                                     angular.forEach($ctrl.operating_loans,function (item){
                                       operating_loans[item.select_year] += parseFloat(item.loan_amount);

                                     });
                                     console.log(operating_loans);
                                     $ctrl.operating_loans=operating_loans;
                                     make_pdf_data()
                                 });
                                 // if conventioal loan then Liability, else its assets
                                 scenarioService.listCapitalPurchases(scenario_id).then(function(new_transactions_response) {
                                   console.log(new_transactions_response.data)
                                   $ctrl.capital_purchase=new_transactions_response.data
                                   angular.forEach($ctrl.capital_purchase,function (item){
                                     for(var i=0; i < item.year_of_lease, i + item.select_year <= 10; i++){
                                       capital_purchase[item.select_year+i] += parseFloat(item.annual_payment);
                                     }


                                   });
                                   console.log(capital_purchase);
                                   $ctrl.capital_purchase=capital_purchase;
                                   make_pdf_data()
                                 });
                                 // dont add to totals but show but dont effect the asset total
                                 scenarioService.listCapitalSales(scenario_id).then(function(new_transactions_response) {
                                   // console.log(new_transactions_response.data)
                                    $ctrl.capital_sales=new_transactions_response.data
                                    angular.forEach($ctrl.capital_sales,function (item){
                                      capital_sales[item.select_year] += parseFloat(item.sale_price);

                                    });
                                    console.log(capital_sales);
                                    $ctrl.capital_sales=capital_sales;

                                 });
                                 // Liabilities
                                 scenarioService.listFutureCapitalLeases(scenario_id).then(function(new_transactions_response) {
                                   // console.log(new_transactions_response.data)

                                   //
                                   //
                                   //     elif self.asset_class == 'Facilities and Other Improvement':
                                   //         inflation_rate = inflation.value_of_facilities_and_other_improvements_inflation
                                   //
                                   //     elif self.asset_class == 'Real Estate':
                                   //         inflation_rate = inflation.value_of_real_estate
                                   //
                                    $ctrl.capital_leases=new_transactions_response.data
                                    angular.forEach($ctrl.capital_leases,function (item){
                                      // for(var i=0; i < item.year_of_lease, i + item.select_year <= 10; i++){
                                      //   capital_leases[item.select_year+i] += parseFloat(item.annual_payment);
                                      // }
                                      if (item.asset_class === 'Intermediate assets'){
                                        for(var i=0; i < item.year_of_lease, i + item.select_year <= 10; i++){
                                          capital_leases_current[item.select_year+i] += parseFloat(item.annual_payment);
                                        }
                                      } else {
                                        for(var i=0; i < item.year_of_lease, i + item.select_year <= 10; i++){
                                          capital_leases_non_current[item.select_year+i] += parseFloat(item.annual_payment);
                                        }
                                      }

                                    });
                                    // console.log(capital_leases);
                                    // $ctrl.capital_leases=capital_leases;
                                    console.log(capital_leases_current);
                                    $ctrl.capital_leases_current=capital_leases_current;
                                    console.log(capital_leases_non_current);
                                    $ctrl.capital_leases_non_current=capital_leases_non_current;
                                    make_pdf_data()



                                 });
                                 // Liabilities
                                 scenarioService.listCashFromAssetLoans(scenario_id).then(function(new_transactions_response) {
                                   // console.log(new_transactions_response.data)
                                   $ctrl.cash_from_asset_loan=new_transactions_response.data
                                   console.log($ctrl.cash_from_asset_loan);
                                   angular.forEach($ctrl.cash_from_asset_loan,function (item){
                                     for(var i=0; i < item.year_of_loan, i + item.select_year <= 10; i++){
                                       // cash_from_asset_loan[item.select_year+i] += parseFloat(item.loan_amount/item.years_of_loan);
                                       cash_from_asset_loan[item.select_year+i] += parseFloat(item.annual_payment);
                                     }

                                   });
                                   console.log(cash_from_asset_loan);
                                   $ctrl.cash_from_asset_loan=cash_from_asset_loan;
                                 });
                                   // scenarioService.createFamilyWithdrawls($ctrl.familyWithdrawals);
                                   // location.reload();//need to be fixed later this fuction makesure function scenarioService.retrieveFamiyWithdrawlsBySpecificScenario to retrieve the new data.
                                   // retrieve current leases
                                   scenarioService.listCurrentLease($ctrl.user.username)
                                   .then(function(current_lease_response) {
                                     $ctrl.current_leases = current_lease_response.data;
                                     console.log("leases:",$ctrl.current_leases);

                                     var current_leases = $ctrl.current_leases;
                                     for(var i = 0; i < current_leases.length; i++){
                                       console.log('here');
                                       calculate_current_leases(current_leases[i]);
                                     }
                                   });
                                   // retrieve current loans
                                   scenarioService.listCurrentLoans($ctrl.user.username)
                                   .then(function(current_loans_response) {
                                     // if (current_loans_response !== undefined &&
                                     //     current_loans_response.data !== undefined) {
                                     //     $ctrl.current_loans_list = current_loans_response.data;
                                     //
                                     //
                                     //     //for every loan the user has calculate the years of each loan and match up those years from now to 10 years from now
                                     //     for(var i = 0; i < $ctrl.current_loans_list.length; i++){
                                     //       //variables
                                     //       var calculation = []
                                     //       var amount_left = $ctrl.current_loans_list[i].loan_amount;
                                     //       var annual_payments = $ctrl.current_loans_list[i].loan_amount * ( ($ctrl.current_loans_list[i].interest_rate * .01 * Math.pow( 1 + (.01 * $ctrl.current_loans_list[i].interest_rate) , $ctrl.current_loans_list[i].years_of_loan )) / ( Math.pow( 1 + (.01 * $ctrl.current_loans_list[i].interest_rate) , $ctrl.current_loans_list[i].years_of_loan ) - 1) )
                                     //       var loan_values = [];
                                     //
                                     //       //console.log("amount_left: " + amount_left + "annual_payment: " + annual_payments );
                                     //
                                     //       //for each year of the loan calculating the interest payment and priciple payment and updating the amount remaining on the loan
                                     //       for(var j = 0; j < $ctrl.current_loans_list[i].years_of_loan; j++){
                                     //         var temp_interest_payment = amount_left * $ctrl.current_loans_list[i].interest_rate * .01
                                     //         var temp_principle_payment = annual_payments - temp_interest_payment
                                     //         amount_left = amount_left - temp_principle_payment;
                                     //         //each year is an object that holds both interst and principle payment
                                     //         var loan_year = {interest_payment: temp_interest_payment.toFixed(2), principle_payment: temp_principle_payment.toFixed(2), total_payment: annual_payments.toFixed(2)}
                                     //         calculation.push( loan_year );
                                     //       }
                                     //       console.log(calculation);
                                     //
                                     //
                                     //       //for each year that is displayed 0 thru 10 match the right calculated year to the matching year
                                     //       for(var j = 0; j < 10; j++){
                                     //         var year_of_calculation = $ctrl.current_loans_list[i].years_of_loan - $ctrl.current_loans_list[i].years_before_loan_matures + j ;
                                     //         if(year_of_calculation >= 0 && year_of_calculation < calculation.length){
                                     //           loan_values.push(calculation[year_of_calculation]);
                                     //         } else {
                                     //           var empty_year = {interest_payment: ' ', principle_payment: ' ', total_payment: ' '};
                                     //           loan_values.push(empty_year);
                                     //         }
                                     //       }
                                     //
                                     //
                                     //       //create an object that holds the title of the loan and the years of the loan and add those to a global variable of all loans to be displayed in the html
                                     //       var loan_data = {title: $ctrl.current_loans_list[i].transaction_description, years: loan_values}
                                     //       $ctrl.current_loans_list_table.push(loan_data)
                                     //     }
                                     //     console.log($ctrl.current_loans_list_table);
                                     // }



                                     $ctrl.current_loans = current_loans_response.data;
                                     console.log("loans:",$ctrl.current_loans);
                                     var current_loans = $ctrl.current_loans;
                                     for(var i = 0; i < current_loans.length; i++){
                                       console.log('here');
                                       calculate_current_loans(current_loans[i]);
                                     }
                                     // removed because ad valorem is calculated from beginning_balance_sheet and accrual_adjustments
                                     // scenarioService.retrieveCashFlowItemByName(scenario_id,"Property Taxes")
                                     //   .then(function(balance_sheet_reponse) {
                                     //     console.log(balance_sheet_reponse.data)
                                     //     if (balance_sheet_reponse.data.length !== 0) {
                                     //       console.log("adding to ad valorem"+balance_sheet_reponse.data.length);
                                     //       for(var i = 0; i < balance_sheet_reponse.data.length; i++){
                                     //         $ctrl.ad_valorem_taxes[parseInt(balance_sheet_reponse.data[i].year)]+=parseFloat(balance_sheet_reponse.data[i].total)/6
                                     //       }
                                     //     }
                                         totals(net_returns_with_inflation)
                                       // })

                                   });



                               });
                           }
                           })

                       }
                     });
                   }
                 });
                 // calculate_short_other_longterm_assets(scenario_id,$ctrl.first_year,acc_filter);

                //console.log($ctrl.real_estate_land)


              })

          });
        });

        // this is calculations copied from abc.js
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

              $ctrl.wages_table.push(parseInt(distributions.inflated_wages));
              $ctrl.salaries_table.push(parseInt(distributions.inflated_salaries));
              $ctrl.family_withdrawls_table.push(parseInt(distributions.inflated_family_withdrawls));
              $ctrl.contributions_table.push(parseInt(distributions.inflated_contributions));
              //TODO: fix income tax
              $ctrl.income_tax_table.push(0);

            });
            for(var i; i<10; i++){
              $ctrl.total_cash_outflows[i] += parseInt($ctrl.wages_table[i]);
              $ctrl.total_cash_outflows[i] += parseInt($ctrl.salaries_table[i]);
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

              $ctrl.short_interest_table[year-1] += parseInt(loan_interest);
              $ctrl.short_principal_table[year-1] += parseInt(inflated_loan);
              $ctrl.total_cash_outflows[year-1] += parseInt(loan_interest + inflated_loan);
              $ctrl.short_borrowing_table[year-1] += parseInt(loan_interest + inflated_loan);
            });
            make_pdf_data()
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
                  $ctrl.nonreal_borrowing_table[start-1] += parseInt(remaining);
                  $ctrl.total_cash_outflows[start-1] += parseInt(remaining);
                } else if (purchase.asset_class === 'Facilities and Other Improvement') {
                  $ctrl.improvements_borrowing_table[start-1] += parseInt(remaining);
                  $ctrl.nonreal_borrowing_table[start-1] += parseInt(remaining);
                  $ctrl.total_cash_outflows[start-1] += parseInt(remaining);
                } else if (purchase.asset_class === 'Real Estate') {
                  $ctrl.real_borrowing_table[start-1] += parseInt(remaining);
                  $ctrl.total_cash_outflows[start-1] += parseInt(remaining);
                }


                for(var i = 0; i<purchase.years_of_loan;i++){

                  var interest_payment = remaining * (parseFloat(purchase.interest_rate * .01));
                  var principle_payment = parseFloat(purchase.annual_payment) - interest_payment;
                  remaining = remaining - parseFloat(purchase.annual_payment);

                  if(purchase.asset_class === 'Intermediate assets'){
                    $ctrl.int_interest_table[i+start-1] += parseInt(interest_payment);
                    $ctrl.int_principal_table[i+start-1] += parseInt(principle_payment);
                  } else if (purchase.asset_class === 'Facilities and Other Improvement') {
                    $ctrl.improvement_interest_table[i+start-1] += parseInt(interest_payment);
                    $ctrl.improvement_principal_table[i+start-1] += parseInt(principle_payment);
                  } else if (purchase.asset_class === 'Real Estate') {
                    $ctrl.real_interest_table[i+start-1] += parseInt(interest_payment);
                    $ctrl.real_principal_table[i+start-1] += parseInt(principle_payment);
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
            make_pdf_data()
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
                 $ctrl.cap_leases_table[start + i - 1] += parseInt(payment);
                 $ctrl.total_cash_expenses[start + i - 1] += parseInt(payment);
               }

             });

          });
          scenarioService.listCashFromAssetLoans(scenario_id).then(function(new_transactions_response) {
            console.log(new_transactions_response.data);
            $ctrl.cash_from_asset_loan=new_transactions_response.data;

            angular.forEach($ctrl.cash_from_asset_loan, function(loan) {
              //TODO:does loan value need to get inflated?
              var loan = parseFloat(loan.loan_amount);
              var interest_rate = (parseFloat(loan.interest_rate) *.01);
              var loan_interest = loan * interest_rate;
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

                  var interest_payment = remaining * (parseFloat(loan.interest_rate) *.01);
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
          for (var i = 0; i<$ctrl.total_cash_inflows.length;i++){
            $ctrl.total_cash_inflows[i] += $ctrl.total_cash_operations[i];
            $ctrl.total_cash_outflows[i] += $ctrl.total_cash_expenses[i];
          }
          // start here
          console.log($ctrl.pdf_data)

        });

      }

      function make_pdf_data(){
         $ctrl.pdf_data.scenario_id=$ctrl.scenario_id
         $ctrl.pdf_data.cash=$ctrl.cash

         $ctrl.pdf_data.account_receivable=  $ctrl.account_receivable
         $ctrl.pdf_data.prepaid_expenses=$ctrl.prepaid_expenses
         $ctrl.pdf_data.investment=$ctrl.investment
         $ctrl.pdf_data.marketable_livestock=$ctrl.marketable_livestock
         $ctrl.pdf_data.stored_crops_and_feed=$ctrl.stored_crops_and_feed
         $ctrl.pdf_data.purchased_feed=$ctrl.purchased_feed
         $ctrl.pdf_data.supplies= $ctrl.supplies
         $ctrl.pdf_data.short_asset= $ctrl.short_asset
         $ctrl.pdf_data.contracts_and_notes_receivable=$ctrl.contracts_and_notes_receivable
         $ctrl.pdf_data.other_assets=$ctrl.other_assets

         $ctrl.pdf_data.investing_in_cooperatives=  $ctrl.investing_in_cooperatives
         $ctrl.pdf_data.other_intermediate=  $ctrl.other_intermediate
         $ctrl.pdf_data.real_estate_land=$ctrl.real_estate_land
         $ctrl.pdf_data.other_longterm_assets=$ctrl.other_longterm_assets
         $ctrl.pdf_data.total_assets=$ctrl.total_assets
         $ctrl.pdf_data.accounts_payable=$ctrl.accounts_payable
         $ctrl.pdf_data.operating_loans=$ctrl.operating_loans
         $ctrl.pdf_data.accrued_interest= $ctrl.accrued_interest
         $ctrl.pdf_data.ad_valorem_taxes= $ctrl.ad_valorem_taxes
         $ctrl.pdf_data.employee_payroll_withholding=$ctrl.employee_payroll_withholding


         $ctrl.pdf_data.income_taxes=  $ctrl.income_taxes
         $ctrl.pdf_data.deferred_taxes=$ctrl.deferred_taxes
         $ctrl.pdf_data.other_accured_expenses=$ctrl.other_accured_expenses
         $ctrl.pdf_data.capital_leases_current=$ctrl.capital_leases_current
         $ctrl.pdf_data.other_liabilites=$ctrl.other_liabilites
         $ctrl.pdf_data.capital_leases_non_current=$ctrl.capital_leases_non_current
         $ctrl.pdf_data.real_borrowing_table= $ctrl.real_borrowing_table
         $ctrl.pdf_data.capital_purchase= $ctrl.capital_purchase
         $ctrl.pdf_data.total_liabilities=$ctrl.total_liabilities
         $ctrl.pdf_data.total_equity=$ctrl.total_equity
         console.log($ctrl.pdf_data)
      }



       function totals(cash){
        // console.log("started totalss");
        for(var i=0; i <11; i++){
          // $ctrl.total_assets[i] = 0;
          // console.log(cash);
          // console.log(cash[i]);
          // console.log($ctrl.account_receivable[i]);
          // console.log(typeof(cash));
          // console.log(typeof($ctrl.account_receivable[i]));

          //current assets
          $ctrl.total_current_assets[i]+=Number(cash[i]);
          $ctrl.total_current_assets[i]+=Number($ctrl.account_receivable[i]);
          $ctrl.total_current_assets[i]+=Number($ctrl.prepaid_expenses[i]);
          $ctrl.total_current_assets[i]+=Number($ctrl.investment[i]);
          $ctrl.total_current_assets[i]+=Number($ctrl.marketable_livestock[i]);
          $ctrl.total_current_assets[i]+=Number($ctrl.stored_crops_and_feed[i]);
          $ctrl.total_current_assets[i]+=Number($ctrl.purchased_feed[i]);
          $ctrl.total_current_assets[i]+=Number($ctrl.supplies[i]);
          $ctrl.total_current_assets[i]+=Number($ctrl.other_assets[i]);

          //total assets
          $ctrl.total_assets[i]+=Number(cash[i]);
          $ctrl.total_assets[i]+=Number($ctrl.account_receivable[i]);
          $ctrl.total_assets[i]+=Number($ctrl.prepaid_expenses[i]);
          $ctrl.total_assets[i]+=Number($ctrl.investment[i]);
          $ctrl.total_assets[i]+=Number($ctrl.marketable_livestock[i]);
          $ctrl.total_assets[i]+=Number($ctrl.stored_crops_and_feed[i]);
          $ctrl.total_assets[i]+=Number($ctrl.purchased_feed[i]);
          $ctrl.total_assets[i]+=Number($ctrl.supplies[i]);
          $ctrl.total_assets[i]+=Number($ctrl.other_assets[i]);
          $ctrl.total_assets[i]+=Number($ctrl.short_asset[i]);
          $ctrl.total_assets[i]+=Number($ctrl.contracts_and_notes_receivable[i]);
          $ctrl.total_assets[i]+=Number($ctrl.investing_in_cooperatives[i]);
          $ctrl.total_assets[i]+=Number($ctrl.other_intermediate[i]);
          $ctrl.total_assets[i]+=Number($ctrl.real_estate_land[i]);
          $ctrl.total_assets[i]+=Number($ctrl.other_longterm_assets[i]);

          //total current liabilities
          $ctrl.total_current_liabilities[i]+=Number($ctrl.accounts_payable[i]);
          $ctrl.total_current_liabilities[i]+=Number($ctrl.operating_loans[i]);
          $ctrl.total_current_liabilities[i]+=Number($ctrl.current_portion_of_captical_lease[i]);
          $ctrl.total_current_liabilities[i]+=Number($ctrl.current_portion_of_term_debt[i]);
          $ctrl.total_current_liabilities[i]+=Number($ctrl.accrued_interest[i]);
          $ctrl.total_current_liabilities[i]+=Number($ctrl.ad_valorem_taxes[i]);
          $ctrl.total_current_liabilities[i]+=Number($ctrl.employee_payroll_withholding[i]);
          $ctrl.total_current_liabilities[i]+=Number($ctrl.income_taxes[i]);
          $ctrl.total_current_liabilities[i]+=Number($ctrl.other_accured_expenses[i]);
          $ctrl.total_current_liabilities[i]+=Number($ctrl.other_liabilites[i]);

          //total non current liabilities
          $ctrl.total_noncurrent_liabilities[i]+=Number($ctrl.nonreal_borrowing_table[i]);
          $ctrl.total_noncurrent_liabilities[i]+=Number($ctrl.real_borrowing_table[i]);
          $ctrl.total_noncurrent_liabilities[i]+=Number($ctrl.deferred_taxes[i]);

          //total Liabilities
          $ctrl.total_liabilities[i]+=Number($ctrl.total_current_liabilities[i]);
          $ctrl.total_liabilities[i]+=Number($ctrl.total_noncurrent_liabilities[i]);

          //equity
          $ctrl.total_equity[i] = Number($ctrl.total_assets[i]) - Number($ctrl.total_liabilities[i]);
          $ctrl.total_liabilities_equity[i] = Number($ctrl.total_assets[i]) + Number($ctrl.total_liabilities[i]);
        }
        console.log($ctrl.total_liabilities);
        console.log($ctrl.total_equity);
        console.log($ctrl.total_assets);

      }





      async function initialization(first_year,acc) {
        console.log(first_year);
        console.log(acc);
        console.log($ctrl.ad_valorem_taxes);
        console.log($ctrl.accrued_interest);
        acc.sort(function (a, b) {
          return a.year - b.year
        });
        //console.log(acc)
        var i=0;
        $ctrl.supplies[i]= parseFloat(first_year.supplies)
        $ctrl.account_receivable[i]=parseFloat(first_year.account_receivable)
        $ctrl.accounts_payable[i]=parseFloat(first_year.accounts_payable)
        $ctrl.breeding_livestock[i]=parseFloat(first_year.breeding_livestock)
        $ctrl.contracts_and_notes_receivable[i]=parseFloat(first_year.contracts_and_notes_receivable)
        $ctrl.investing_in_cooperatives[i]=parseFloat(first_year.investing_in_cooperatives)
        $ctrl.other_intermediate[i]=parseFloat(first_year.other_intermediate)
        $ctrl.deferred_taxes[i]=parseFloat(first_year.deferred_taxes)
        $ctrl.accrued_interest[i]=parseFloat(first_year.accrued_interest)
        $ctrl.ad_valorem_taxes[i]=$ctrl.ad_valorem_taxes[i]+parseFloat(first_year.valorem_taxes)
        $ctrl.income_taxes[i]=parseFloat(first_year.income_taxes)
        $ctrl.investment[i]=parseFloat(first_year.investment)
        $ctrl.investment_in_capital_leases[i]=parseFloat(first_year.investment_in_capital_leases)
        $ctrl.marketable_livestock[i]=parseFloat(first_year.marketable_livestock)
        $ctrl.other_accured_expenses[i]=parseFloat(first_year.other_accured_expenses)
        $ctrl.other_assets[i]=parseFloat(first_year.other_assets)
        $ctrl.other_liabilites[i]=parseFloat(first_year.other_liabilites)
        $ctrl.other_noncurrent_assets[i]=parseFloat(first_year.other_noncurrent_assets)
        $ctrl.purchased_feed[i]=parseFloat(first_year.purchased_feed)
        $ctrl.real_estate_land[i]=parseFloat(first_year.real_estate_land)
        $ctrl.stored_crops_and_feed[i]=parseFloat(first_year.stored_crops_and_feed)
        $ctrl.prepaid_expenses[i]=parseFloat(first_year.prepaid_expenses);
        $ctrl.employee_payroll_withholding[i]=parseFloat(first_year.employee_payroll_withholding);
        if(acc.length!=0){
        for(var i=1;i<11;i++){
          $ctrl.supplies[i]= parseFloat(first_year.supplies)+parseFloat(acc.slice(0,i).map(a => a.supplies ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.account_receivable[i]=parseFloat(first_year.account_receivable)+parseFloat(acc.slice(0,i).map(a => a.account_receivable ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.accounts_payable[i]=parseFloat(first_year.accounts_payable)+parseFloat(acc.slice(0,i).map(a => a.accounts_payable ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.breeding_livestock[i]=parseFloat(first_year.breeding_livestock)+parseFloat(acc.slice(0,i).map(a => a.breeding_livestock ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.contracts_and_notes_receivable[i]=parseFloat(first_year.contracts_and_notes_receivable)+parseFloat(acc.slice(0,i).map(a => a.contracts_and_notes_receivable ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.investing_in_cooperatives[i]=parseFloat(first_year.investing_in_cooperatives)+parseFloat(acc.slice(0,i).map(a => a.investing_in_cooperatives ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.other_intermediate[i]=parseFloat(first_year.other_intermediate)+parseFloat(acc.slice(0,i).map(a => a.other_intermediate ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.deferred_taxes[i]=parseFloat(first_year.deferred_taxes)+parseFloat(acc.slice(0,i).map(a => a.deferred_taxes ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.accrued_interest[i]=$ctrl.accrued_interest[i]+parseFloat(first_year.accrued_interest)+parseFloat(acc.slice(0,i).map(a => a.accrued_interest ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.ad_valorem_taxes[i]=$ctrl.ad_valorem_taxes[i]+parseFloat(first_year.valorem_taxes)+parseFloat(acc.slice(0,i).map(a => a.valorem_taxes ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.income_taxes[i]=parseFloat(first_year.income_taxes)+parseFloat(acc.slice(0,i).map(a => a.income_taxes ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.investment[i]=parseFloat(first_year.investment)+parseFloat(acc.slice(0,i).map(a => a.investment ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.investment_in_capital_leases[i]=parseFloat(first_year.investment_in_capital_leases)+parseFloat(acc.slice(0,i).map(a => a.investment_in_capital_leases ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.marketable_livestock[i]=parseFloat(first_year.marketable_livestock)+parseFloat(acc.slice(0,i).map(a => a.marketable_livestock ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.other_accured_expenses[i]=parseFloat(first_year.other_accured_expenses)+parseFloat(acc.slice(0,i).map(a => a.other_accured_expenses ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.other_assets[i]=parseFloat(first_year.other_assets)+parseFloat(acc.slice(0,i).map(a => a.other_assets ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.other_liabilites[i]=parseFloat(first_year.other_liabilites)+parseFloat(acc.slice(0,i).map(a => a.other_liabilites ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.other_noncurrent_assets[i]=parseFloat(first_year.other_noncurrent_assets)+parseFloat(acc.slice(0,i).map(a => a.other_noncurrent_assets ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.purchased_feed[i]=parseFloat(first_year.purchased_feed)+parseFloat(acc.slice(0,i).map(a => a.purchased_feed ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.real_estate_land[i]=parseFloat(first_year.real_estate_land)+parseFloat(acc.slice(0,i).map(a => a.real_estate_land ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.stored_crops_and_feed[i]=parseFloat(first_year.stored_crops_and_feed)+parseFloat(acc.slice(0,i).map(a => a.stored_crops_and_feed ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.prepaid_expenses[i]=parseFloat(first_year.prepaid_expenses)+parseFloat( acc.slice(0,i).map(a => a.prepaid_expenses ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )
          $ctrl.employee_payroll_withholding[i]=parseFloat(first_year.employee_payroll_withholding)+parseFloat(acc.slice(0,i).map(a => a.employee_payroll_withholding ).reduce( (a, b) => parseFloat(a) + parseFloat(b), 0)  )

        }}
        if(acc.length==0){
          for(var i=1;i<11;i++){
          $ctrl.supplies[i]= parseFloat(first_year.supplies)
          $ctrl.account_receivable[i]=parseFloat(first_year.account_receivable)
          $ctrl.accounts_payable[i]=parseFloat(first_year.accounts_payable)
          $ctrl.breeding_livestock[i]=parseFloat(first_year.breeding_livestock)
          $ctrl.contracts_and_notes_receivable[i]=parseFloat(first_year.contracts_and_notes_receivable)
          $ctrl.investing_in_cooperatives[i]=parseFloat(first_year.investing_in_cooperatives)
          $ctrl.other_intermediate[i]=parseFloat(first_year.other_intermediate)
          $ctrl.deferred_taxes[i]=parseFloat(first_year.deferred_taxes)
          $ctrl.accrued_interest[i]=parseFloat(first_year.accrued_interest)
          $ctrl.ad_valorem_taxes[i]=$ctrl.ad_valorem_taxes[i]+parseFloat(first_year.valorem_taxes)
          $ctrl.income_taxes[i]=parseFloat(first_year.income_taxes)
          $ctrl.investment[i]=parseFloat(first_year.investment)
          $ctrl.investment_in_capital_leases[i]=parseFloat(first_year.investment_in_capital_leases)
          $ctrl.marketable_livestock[i]=parseFloat(first_year.marketable_livestock)
          $ctrl.other_accured_expenses[i]=parseFloat(first_year.other_accured_expenses)
          $ctrl.other_assets[i]=parseFloat(first_year.other_assets)
          $ctrl.other_liabilites[i]=parseFloat(first_year.other_liabilites)
          $ctrl.other_noncurrent_assets[i]=parseFloat(first_year.other_noncurrent_assets)
          $ctrl.purchased_feed[i]=parseFloat(first_year.purchased_feed)
          $ctrl.real_estate_land[i]=parseFloat(first_year.real_estate_land)
          $ctrl.stored_crops_and_feed[i]=parseFloat(first_year.stored_crops_and_feed)
          $ctrl.prepaid_expenses[i]=parseFloat(first_year.prepaid_expenses)
          $ctrl.employee_payroll_withholding[i]=parseFloat(first_year.employee_payroll_withholding)
        }
        }
        console.log($ctrl.ad_valorem_taxes);
        calculate_account_payable()
        return 0;
      }
      function calculate_account_payable(){
        var calculated_table={}
        calculated_table[0]=get_calculated_data($ctrl.account_receivable)
        calculated_table[1]=get_calculated_data($ctrl.supplies)
        calculated_table[2]=get_calculated_data($ctrl.ad_valorem_taxes)
        calculated_table[2]=get_calculated_data($ctrl.accounts_payable)
        //calculated_table[3]=get_calculated_data($ctrl.breeding_livestock)
        calculated_table[3]=get_calculated_data($ctrl.contracts_and_notes_receivable)
        calculated_table[4]=get_calculated_data($ctrl.deferred_taxes)
        calculated_table[5]=get_calculated_data($ctrl.employee_payroll_withholding)
        calculated_table[6]=get_calculated_data($ctrl.income_taxes)
        //calculated_table[8]=get_calculated_data($ctrl.investing_in_cooperatives)
        calculated_table[7]=get_calculated_data($ctrl.investment)
        //calculated_table[10]=get_calculated_data($ctrl.investment_in_capital_leases)
        calculated_table[8]=get_calculated_data($ctrl.marketable_livestock)
        calculated_table[9]=get_calculated_data($ctrl.other_accured_expenses)
        calculated_table[10]=get_calculated_data($ctrl.other_assets)
        calculated_table[11]=get_calculated_data($ctrl.other_liabilites)
        calculated_table[12]=get_calculated_data($ctrl.prepaid_expenses)
        calculated_table[13]=get_calculated_data($ctrl.purchased_feed)
        //calculated_table[17]=get_calculated_data($ctrl.real_estate_land)
        calculated_table[14]=get_calculated_data($ctrl.stored_crops_and_feed)

        console.log(calculated_table)
        // $ctrl.accounts_payable=[0,0,0,0,0,0,0,0,0,0,0]
        // angular.forEach(calculated_table, function(years, key) {
        //   angular.forEach(years, function(year, key_2) {
        //     // console.log(year)
        //     $ctrl.accounts_payable[key_2]=$ctrl.accounts_payable[key_2]+year
        //   })
        // })
        // angular.forEach($ctrl.accounts_payable, function(number, key) {
        //   if (number>=0){
        //     $ctrl.accounts_payable[key]=0
        //   }
        //   if (number<0){
        //     $ctrl.accounts_payable[key]= -number
        //   }
        //
        // })


      }

      function get_calculated_data(data){
        var calculated = []
        var temp = data[0]
        calculated.push(data[0])
        angular.forEach(data, function(date_of_year, key) {
          if (key!=0){
            temp=temp+date_of_year
            calculated.push(temp)
          }
        })
        return calculated
      }
      // function initialization_acc (acc){
      //   for(var i=0;i<10;i++){
      //   acc[i].supplies= 0
      //   acc.account_receivable[i]=0
      //   acc.accounts_payable[i]=0
      //   acc.breeding_livestock[i]=0
      //   acc.contracts_and_notes_receivable[i]=0
      //   acc.deferred_taxes[i]=0
      //   acc.income_taxes[i]=0
      //   acc.investment[i]=0
      //   acc.investment_in_capital_leases[i]=0
      //   acc.marketable_livestock[i]=0
      //   acc.other_accured_expenses[i]=0
      //   acc.other_assets[i]=0
      //   acc.other_liabilites[i]=0
      //   acc.other_noncurrent_assets[i]=0
      //   acc.purchased_feed[i]=0
      //   acc.real_estate_land[i]=0
      //   acc.stored_crops_and_feed[i]=0
      //   acc.prepaid_expenses[i]=0
      //   acc.employee_payroll_withholding[i]=0
      // }
      // return acc
      // }



      async function calculate_short_other_longterm_assets (scenario_id,first_year,acc){
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
            //console.log(first_year)
            $ctrl.short_asset[0]=parseFloat(first_year.machinery_equipment);
            $ctrl.other_longterm_assets[0]=parseFloat(first_year.other_longterm_assets);
            //console.log(acc)
            for (var i=0;i<10;i++){

              $ctrl.short_asset[i+1]=parseFloat(parseFloat(depreciation_list[i].depreciation)*(parseFloat(depreciation_list[i].depreciation_allocated_to_intermediate_assets)/100))
            }
            for (var i=0;i<10;i++){
              $ctrl.other_longterm_assets[i+1]=parseFloat(parseFloat(depreciation_list[i].depreciation)*(1-(parseFloat(depreciation_list[i].depreciation_allocated_to_intermediate_assets)/100)))
            }

            var asset=[];
            for (var i=1;i<11;i++){
               $ctrl.short_asset[i]=parseFloat($ctrl.short_asset[i-1])-parseFloat($ctrl.short_asset[i])
               $ctrl.other_longterm_assets[i]=parseFloat($ctrl.other_longterm_assets[i-1])-parseFloat($ctrl.other_longterm_assets[i])
               // console.log("Completing: ",i,"th long and short assets");
            }
            //totals($ctrl.other_longterm_assets);

        });
        return $ctrl.short_asset;
      }

      function combinePlans(plans){
          var item_arr = [];

          angular.forEach(plans, function (plan) {
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
        var net_return=0;
        var net_returns_with_inflation=[0,1,2,3,4,5,6,7,8,9,10];
        //console.log(net_returns_with_inflation)
        scenarioService.listPlansByScenario(scenario.id)
        .then(function (plan_response){
          //console.log(plan_response.data)
          for(var year=0;year<11;year++){
            //console.log(plan_response.data.length)
            for (var i=0;i<plan_response.data.length;i++){
              //console.log(1232131231)
              // net_return=sumObjectsByKey(net_return,plan_response.data[i].net_returns_over_time[year])
              if(plan_response.data[i].net_returns_over_time[year] !== undefined){
                net_return += plan_response.data[i].net_returns_over_time[year].return_with_inflation;
                // console.log(typeof(plan_response.data[i].net_returns_over_time[year].return_with_inflation));
                // console.log(typeof(net_return));
              }
            }
            net_returns_with_inflation[year]=net_return;
          }
          console.log(typeof(net_returns_with_inflation));
          return net_returns_with_inflation
          });
      }


      function trans_year_to_item (cashflow){
        var tl={name:"",year_1:0,year_2:0,year_3:0,year_4:0,year_5:0,year_6:0,year_7:0,year_8:0,year_9:0,year_10:0}
        var cashflow_by_item=[];
        var name=[];
        angular.forEach(cashflow,function(cashflow){
            name.push(cashflow.name);
        })
        var unique_name = name.filter( onlyUnique );
        angular.forEach(unique_name,function(unique_name){
            var tl={name:unique_name,year_1:0,year_2:0,year_3:0,year_4:0,year_5:0,year_6:0,year_7:0,year_8:0,year_9:0,year_10:0}
            cashflow_by_item.push(tl);
        })
        angular.forEach(cashflow_by_item,function(cashflow_by_item){
        for (var i=0;i<cashflow.length;i++){
                          if (cashflow[i].name==cashflow_by_item.name){
                            switch(cashflow[i].year){
                              case "1.00":
                              cashflow_by_item.year_1=cashflow[i].total;
                              case "2.00":
                              cashflow_by_item.year_2=cashflow[i].total;
                              case "3.00":
                              cashflow_by_item.year_3=cashflow[i].total;
                              case "4.00":
                              cashflow_by_item.year_4=cashflow[i].total;
                              case "5.00":
                              cashflow_by_item.year_5=cashflow[i].total;
                              case "6.00":
                              cashflow_by_item.year_6=cashflow[i].total;
                              case "7.00":
                              cashflow_by_item.year_7=cashflow[i].total;
                              case "8.00":
                              cashflow_by_item.year_8=cashflow[i].total;
                              case "9.00":
                             cashflow_by_item.year_9=cashflow[i].total;
                              case "10.00":
                              cashflow_by_item.year_10=cashflow[i].total;


                            }
                          }
                        }
          })
          return(cashflow_by_item)
      }


      function proceed()
      {

        //scenarioService.destroyBalanceSheetOutput($ctrl.scenario_id)
        scenarioService.retrieveBalanceSheetOutput($ctrl.scenario_id)
          .then(function(balance_sheet_reponse) {
            console.log(balance_sheet_reponse.data)
            if(balance_sheet_reponse.data.length==0){
              console.log(1)
              scenarioService.createBalanceSheetOutput({"scenario":$ctrl.scenario_id})
                .then(function(response) {
                  create_balance_sheet_output_item(response.data.id)
                })
            }
            else{
              scenarioService.retrieveBalanceSheetOutput($ctrl.scenario_id)
                .then(function(response) {
                  console.log(2)
                  console.log(response.data)
                  scenarioService.destroyBalanceSheetOutput(response.data[0].id)
                    .then(function(response) {
                    scenarioService.createBalanceSheetOutput({"scenario":$ctrl.scenario_id})
                      .then(function(response) {
                        create_balance_sheet_output_item(response.data.id)
                      })
                })
                })
            }
          })


        scenarioService.retrieveBalanceSheet('?scenario=',$ctrl.scenario_id)
        .then(function(balancesheet_response) {
          //console.log(balancesheet_response.data)
          if(balancesheet_response.data.length!=0){
          check_balance_sheet(balancesheet_response.data)
          }
            if(balancesheet_response.data.length==0){
              creat_balancesheet()
          }
        });
        $state.go("financeIncomeStatment", {
          'module': $ctrl.module,
          'scenario': $ctrl.scenario_id,
          'from_scenario':"true"
        });


      }

      function create_balance_sheet_output_item(id){
          // angular.forEach($ctrl.cashflowitem_income, function(row, key) {
          //   Object.keys(row).forEach(function (key, index) {
          //       if(index!==0){
          //         scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":index, "item_name":row.name, "item_number": row[key]})
          //       }
          //     });
          // })
          //
          // angular.forEach($ctrl.cashflowitem_expense, function(row, key) {
          //   Object.keys(row).forEach(function (key, index) {
          //       if(index!==0){
          //         scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":index, "item_name":row.name, "item_number": row[key]})
          //       }
          //     });
          // })

          angular.forEach($ctrl.cash, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"cash", "item_number": value})
          })
          angular.forEach($ctrl.account_receivable, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"account_receivable", "item_number": value})
          })

          angular.forEach($ctrl.prepaid_expenses, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"prepaid_expenses", "item_number": value})
          })

          angular.forEach($ctrl.investment, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"investment", "item_number": value})
          })

          angular.forEach($ctrl.marketable_livestock, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"marketable_livestock", "item_number": value})
          })


          angular.forEach($ctrl.stored_crops_and_feed, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"stored_crops_and_feed", "item_number": value})
          })

          angular.forEach($ctrl.purchased_feed, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"purchased_feed", "item_number": value})
          })

          angular.forEach($ctrl.supplies, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"supplies", "item_number": value})
          })

          angular.forEach($ctrl.other_assets, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"other_assets", "item_number": value})
          })

          angular.forEach($ctrl.short_asset, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"short_asset", "item_number": value})
          })

          angular.forEach($ctrl.contracts_and_notes_receivable, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"contracts_and_notes_receivable", "item_number": value})
          })

          angular.forEach($ctrl.investing_in_cooperatives, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"investing_in_cooperatives", "item_number": value})
          })

          angular.forEach($ctrl.other_intermediate, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"other_intermediate", "item_number": value})
          })

          angular.forEach($ctrl.real_estate_land, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"real_estate_land", "item_number": value})
          })

          angular.forEach($ctrl.other_longterm_assets, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"other_longterm_assets", "item_number": value})
          })

          angular.forEach($ctrl.total_assets, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"total_assets", "item_number": value})
          })

          angular.forEach($ctrl.accounts_payable, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"accounts_payable", "item_number": value})
          })

          angular.forEach($ctrl.operating_loans, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"operating_loans", "item_number": value})
          })

          angular.forEach($ctrl.accrued_interest, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"accrued_interest", "item_number": value})
          })

          angular.forEach($ctrl.ad_valorem_taxes, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"ad_valorem_taxes", "item_number": value})
          })

          angular.forEach($ctrl.employee_payroll_withholding, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"employee_payroll_withholding", "item_number": value})
          })

          angular.forEach($ctrl.income_taxes, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"income_taxes", "item_number": value})
          })

          angular.forEach($ctrl.deferred_taxes, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"deferred_taxes", "item_number": value})
          })

          angular.forEach($ctrl.other_accured_expenses, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"other_accured_expenses", "item_number": value})
          })

          angular.forEach($ctrl.capital_leases_current, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"capital_leases_current", "item_number": value})
          })

          angular.forEach($ctrl.other_liabilites, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"other_liabilites", "item_number": value})
          })

          angular.forEach($ctrl.capital_leases_non_current, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"capital_leases_non_current", "item_number": value})
          })

          angular.forEach($ctrl.nonreal_borrowing_table, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"nonreal_borrowing_table", "item_number": value})
          })

          angular.forEach($ctrl.real_borrowing_table, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"real_borrowing_table", "item_number": value})
          })

          angular.forEach($ctrl.capital_purchase, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"capital_purchase", "item_number": value})
          })

          angular.forEach($ctrl.total_liabilities, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"total_liabilities", "item_number": value})
          })

          angular.forEach($ctrl.total_equity, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"total_equity", "item_number": value})
          })

          angular.forEach($ctrl.total_liabilities_equity, function(value, key) {
              scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"total_liabilities_equity", "item_number": value})
          })

          // angular.forEach($ctrl.ending_cash_balance, function(value, key) {
          //     scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"ending_cash_balance", "item_number": value})
          // })
          //
          // angular.forEach($ctrl.outstanding_credit_line, function(value, key) {
          //     scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"outstanding_credit_line", "item_number": value})
          // })
          // angular.forEach($ctrl.outstanding_short, function(value, key) {
          //     scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"outstanding_short", "item_number": value})
          // })
          // angular.forEach($ctrl.outstanding_nonre, function(value, key) {
          //     scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"outstanding_nonre", "item_number": value})
          // })
          // angular.forEach($ctrl.outstanding_real, function(value, key) {
          //     scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"outstanding_real", "item_number": value})
          // })
          // angular.forEach($ctrl.total_outstanding, function(value, key) {
          //     scenarioService.createBalanceSheetItemOutput({"balance_sheet":id, "year":key, "item_name":"total_outstanding", "item_number": value})
          // })

      }


      function creat_balancesheet(){
        //console.log($ctrl.cash)

        var new_balance_sheet={};
        var i=0;
        //console.log($ctrl.short_asset)
        for(var i=1;i<=10;i++){
          var a={};
          //console.log(i)
          make_balance(a,i);
        }
      }


      function update (){

      }
      function make_balance (balance,key){
            // $ctrl.updated_balance_sheet.user=$ctrl.user.id;
            // $ctrl.updated_balance_sheet.scenario=$ctrl.scenario_id;
            // $ctrl.updated_balance_sheet.year=key;
            // $ctrl.updated_balance_sheet.cash_and_checking=$ctrl.cash[key].toFixed(2);
            // $ctrl.updated_balance_sheet.prepaid_expenses=$ctrl.prepaid_expenses[key].toFixed(2);
            // $ctrl.updated_balance_sheet.marketable_livestock=$ctrl.marketable_livestock[key].toFixed(2);
            // $ctrl.updated_balance_sheet.investment=$ctrl.investment[key].toFixed(2);
            // $ctrl.updated_balance_sheet.account_receivable=$ctrl.account_receivable[key].toFixed(2);
            // $ctrl.updated_balance_sheet.other_assets=$ctrl.other_assets[key].toFixed(2);
            // $ctrl.updated_balance_sheet.stored_crops_and_feed=$ctrl.stored_crops_and_feed[key].toFixed(2);
            // $ctrl.updated_balance_sheet.purchased_feed=$ctrl.purchased_feed[key].toFixed(2);
            // $ctrl.updated_balance_sheet.supplies=$ctrl.supplies[key].toFixed(2);
            // $ctrl.updated_balance_sheet.machinery_equipment=$ctrl.short_asset[key].toFixed(2);
            // $ctrl.updated_balance_sheet.real_estate_land=$ctrl.real_estate_land[key].toFixed(2);
            // $ctrl.updated_balance_sheet.other_longterm_assets=$ctrl.other_longterm_assets[key].toFixed(2);
            // $ctrl.updated_balance_sheet.accounts_payable=$ctrl.accounts_payable[key].toFixed(2);
            // $ctrl.updated_balance_sheet.employee_payroll_withholding=$ctrl.employee_payroll_withholding[key].toFixed(2);
            // $ctrl.updated_balance_sheet.income_taxes=$ctrl.income_taxes[key].toFixed(2);
            // $ctrl.updated_balance_sheet.deferred_taxes=$ctrl.deferred_taxes[key].toFixed(2);
            // $ctrl.updated_balance_sheet.other_accured_expenses=$ctrl.other_accured_expenses[key].toFixed(2);
            // $ctrl.updated_balance_sheet.other_liabilites=$ctrl.other_liabilites[key].toFixed(2);
            balance.user=$ctrl.user.id;
            balance.scenario=$ctrl.scenario_id;
            balance.year=key;
            balance.cash_and_checking=$ctrl.cash[key].toFixed(2);
            balance.prepaid_expenses=$ctrl.prepaid_expenses[key].toFixed(2);
            balance.marketable_livestock=$ctrl.marketable_livestock[key].toFixed(2);
            balance.investment=$ctrl.investment[key].toFixed(2);
            balance.account_receivable=$ctrl.account_receivable[key].toFixed(2);
            balance.other_assets=$ctrl.other_assets[key].toFixed(2);
            balance.stored_crops_and_feed=$ctrl.stored_crops_and_feed[key].toFixed(2);
            balance.purchased_feed=$ctrl.purchased_feed[key].toFixed(2);
            balance.supplies=$ctrl.supplies[key].toFixed(2);
            balance.machinery_equipment=$ctrl.short_asset[key].toFixed(2);
            balance.real_estate_land=$ctrl.real_estate_land[key].toFixed(2);
            balance.other_longterm_assets=$ctrl.other_longterm_assets[key].toFixed(2);
            balance.accounts_payable=$ctrl.accounts_payable[key].toFixed(2);
            balance.employee_payroll_withholding=$ctrl.employee_payroll_withholding[key].toFixed(2);
            balance.income_taxes=$ctrl.income_taxes[key].toFixed(2);
            balance.deferred_taxes=$ctrl.deferred_taxes[key].toFixed(2);
            balance.other_accured_expenses=$ctrl.other_accured_expenses[key].toFixed(2);
            balance.other_liabilites=$ctrl.other_liabilites[key].toFixed(2);
            scenarioService.createBalanceSheet(balance);
            // console.log(balance)

      }
      function check_balance_sheet(old_return){
        old_return.sort(function(a, b) {
          return a.year - b.year;
        });
        //console.log(old_return)
        for(var i=0;i<10;i++){
           (old_return[i],i+1);
        }
      }
      function update_balance(balance,key){
        balance.user=$ctrl.user.id;
        balance.scenario=$ctrl.scenario_id;
        balance.year=key;
        balance.cash_and_checking=$ctrl.cash[key].toFixed(2);
        balance.prepaid_expenses=$ctrl.prepaid_expenses[key].toFixed(2);
        balance.marketable_livestock=$ctrl.marketable_livestock[key].toFixed(2);
        balance.investment=$ctrl.investment[key].toFixed(2);
        balance.account_receivable=$ctrl.account_receivable[key].toFixed(2);
        balance.other_assets=$ctrl.other_assets[key].toFixed(2);
        balance.stored_crops_and_feed=$ctrl.stored_crops_and_feed[key].toFixed(2);
        balance.purchased_feed=$ctrl.purchased_feed[key].toFixed(2);
        balance.supplies=$ctrl.supplies[key].toFixed(2);
        balance.machinery_equipment=$ctrl.short_asset[key].toFixed(2);
        balance.real_estate_land=$ctrl.real_estate_land[key].toFixed(2);
        balance.other_longterm_assets=$ctrl.other_longterm_assets[key].toFixed(2);
        balance.accounts_payable=$ctrl.accounts_payable[key].toFixed(2);
        balance.employee_payroll_withholding=$ctrl.employee_payroll_withholding[key].toFixed(2);
        balance.income_taxes=$ctrl.income_taxes[key].toFixed(2);
        balance.deferred_taxes=$ctrl.deferred_taxes[key].toFixed(2);
        balance.other_accured_expenses=$ctrl.other_accured_expenses[key].toFixed(2);
        balance.other_liabilites=$ctrl.other_liabilites[key].toFixed(2);
        scenarioService.updateBalanceSheet(balance);
        //console.log(balance)
      }

      function calculate_current_leases(lease){
        var annual_payment = lease.annual_payment;
        for(var i=0;i < lease.years_before_leases_expired;i++){

        }
      }
      function payment(rate, num_payments, current_due){

        rate = rate * .01
        // console.log(rate, num_payments, current_due);
        // var top = current_due * rate  * Math.pow(( 1 + rate  ) , ( num_payments ))
        // var bottom =  (Math.pow( ( 1+rate ) , ( num_payments )) - 1 )
        // console.log(top,bottom)
        return current_due * rate  * Math.pow(( 1 + rate  ) , ( num_payments )) / (Math.pow( ( 1+rate ) , ( num_payments )) - 1 );
      }


      function calculate_current_loans(loan){
        var liabilityDue = loan.loan_amount;
        var payment1 = payment(loan.interest_rate,loan.years_of_loan,loan.loan_amount);
        var total_principle = 0;
        var total_interest = 0;
        // console.log(payment1);
        for(var i=0;i<loan.years_of_loan;i++){
          liabilityDue = liabilityDue - payment1 + (liabilityDue * loan.interest_rate * .01)

          var principle = payment1 - (liabilityDue * loan.interest_rate * .01)
          var interest =  (liabilityDue * loan.interest_rate * .01)
          total_principle += principle
          total_interest += interest
          // console.log(i,liabilityDue,principle,interest);
          // liabilityDue = (liabilityDue - (liabilityDue/loan.years_of_loan))*(1+(parseInt(loan.interest_rate)/100))
          // console.log("year: " , i , "amount paid: ",(liabilityDue/loan.years_of_loan), "amount due: ",liabilityDue, "interest_rate: ", loan.interest_rate);
          if(loan.years_of_loan-i <= loan.years_before_loan_matures){
            var j = i - (loan.years_of_loan-loan.years_before_loan_matures);
            // console.log("adding to Liability:",$ctrl.total_liabilities[j], liabilityDue);
            if( j <= 10){
              // $ctrl.total_liabilities[j] += liabilityDue;
              $ctrl.current_portion_of_term_debt[j] += liabilityDue;
            }

            // console.log("New total_liabilities:",$ctrl.total_liabilities[j]);
          }
        }
        // console.log(total_principle,total_interest);
      }




      function back(){
        $state.go("abc", {
          'scenario': $state.params['scenario'],
          'module':$ctrl.module
        });
      }



      function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
      }

      function sumObjectsByKey(...objs) {
        return objs.reduce((a, b) => {
          for (let k in b) {
            if (b.hasOwnProperty(k))
              a[k] = (a[k] || 0) + b[k];
          }
          return a;
        }, {});
      }

    }


  }());
