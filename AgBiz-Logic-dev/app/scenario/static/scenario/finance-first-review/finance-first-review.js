(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeFirstReview", {
      templateUrl: "/static/scenario/finance-first-review/finance-first-review.html",
      controller:     FinanceFirstReviewComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceFirstReviewComponentController.$inject = [
      '$state',
      '$filter',
      '$q',
      'commonService',
      'scenarioService',
      'budgetService',
      "$uibModal"
    ];

    function FinanceFirstReviewComponentController(
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
      var plan_number = 1;
      var plan_data = "";
      // Scenario
      $ctrl.scenario;
      $ctrl.module;
      $ctrl.acres_arr=[];
      // variables
      $ctrl.depreciation_arr = [];
      $ctrl.persent;
      $ctrl.depreciation_list=[];
      $ctrl.net_returns=new Array();
      $ctrl.table_distributions=new Array();
      $ctrl.table_income=new Array();
      $ctrl.table_bonuses=new Array();
      $ctrl.family_withdrawls=new Array();
      $ctrl.salaries=new Array();
      $ctrl.table_wages=new Array();
      $ctrl.contributions=new Array();

      $ctrl.depreciation_items=new Array();
      $ctrl.capital_expenditures=new Array();
      $ctrl.replacement_costs=new Array();
      $ctrl.depreciation_items_intermediate = new Array();
      $ctrl.capital_expenditures_intermediate = new Array();
      $ctrl.replacement_costs_intermediate = new Array();
      $ctrl.depreciation_items_long_term = new Array();
      $ctrl.capital_expenditures_long_term = new Array();
      $ctrl.replacement_costs_long_term = new Array();


      $ctrl.current_lease_list = [];
      $ctrl.current_loans_list = [];
      $ctrl.current_loans_list_table = [];
      $ctrl.current_lease_list_table = [];
      $ctrl.scenario_id;



      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        var scenario_id = $state.params['scenario'];
        $ctrl.scenario_id=scenario_id
        $ctrl.module = $state.params["module"];
        console.log(scenario_id)
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

              });

              for (var i=0;i<10; i++){
                //console.log($ctrl.net_returns[i])
                $ctrl.table_income[i]=$ctrl.net_returns[i]-$ctrl.table_distributions[i];
              }
              //console.log($ctrl.table_income)
            }
          })

          commonService.retrieveCurrentUser()
          .then(function(current_user_response) {
            $ctrl.user = current_user_response.data;

            // below the interst payemnt and priciple payment are calculated and then matched up with an array of years.
            // Although every year of the loan has to be calculated, if some of those years are not in the past or are not in the next ten years, then only the relevent years will be displayed
            scenarioService.listCurrentLoans($ctrl.user.username)
            .then(function(current_loans_response) {

              // if the loans are not loaded then non of the calculations will take place
              if (current_loans_response !== undefined &&
                  current_loans_response.data !== undefined) {
                  $ctrl.current_loans_list = current_loans_response.data;


                  //for every loan the user has calculate the years of each loan and match up those years from now to 10 years from now
                  for(var i = 0; i < $ctrl.current_loans_list.length; i++){
                    //variables
                    var calculation = []
                    var amount_left = $ctrl.current_loans_list[i].loan_amount;
                    var annual_payments = $ctrl.current_loans_list[i].loan_amount * ( ($ctrl.current_loans_list[i].interest_rate * .01 * Math.pow( 1 + (.01 * $ctrl.current_loans_list[i].interest_rate) , $ctrl.current_loans_list[i].years_of_loan )) / ( Math.pow( 1 + (.01 * $ctrl.current_loans_list[i].interest_rate) , $ctrl.current_loans_list[i].years_of_loan ) - 1) )
                    var loan_values = [];

                    //console.log("amount_left: " + amount_left + "annual_payment: " + annual_payments );

                    //for each year of the loan calculating the interest payment and priciple payment and updating the amount remaining on the loan
                    for(var j = 0; j < $ctrl.current_loans_list[i].years_of_loan; j++){
                      var temp_interest_payment = amount_left * $ctrl.current_loans_list[i].interest_rate * .01
                      var temp_principle_payment = annual_payments - temp_interest_payment
                      amount_left = amount_left - temp_principle_payment;
                      //each year is an object that holds both interst and principle payment
                      var loan_year = {interest_payment: temp_interest_payment.toFixed(2), principle_payment: temp_principle_payment.toFixed(2), total_payment: annual_payments.toFixed(2)}
                      calculation.push( loan_year );
                    }
                    console.log(calculation);


                    //for each year that is displayed 0 thru 10 match the right calculated year to the matching year
                    for(var j = 0; j < 10; j++){
                      var year_of_calculation = $ctrl.current_loans_list[i].years_of_loan - $ctrl.current_loans_list[i].years_before_loan_matures + j ;
                      if(year_of_calculation >= 0 && year_of_calculation < calculation.length){
                        loan_values.push(calculation[year_of_calculation]);
                      } else {
                        var empty_year = {interest_payment: ' ', principle_payment: ' ', total_payment: ' '};
                        loan_values.push(empty_year);
                      }
                    }


                    //create an object that holds the title of the loan and the years of the loan and add those to a global variable of all loans to be displayed in the html
                    var loan_data = {title: $ctrl.current_loans_list[i].transaction_description, years: loan_values}
                    $ctrl.current_loans_list_table.push(loan_data)
                  }
                  console.log($ctrl.current_loans_list_table);
              }
            });

            scenarioService.listCurrentLease($ctrl.user.username)
            .then(function(current_lease_response) {
              if (current_lease_response !== undefined &&
                  current_lease_response.data !== undefined) {
                  $ctrl.current_lease_list = current_lease_response.data;
                  //console.log($ctrl.current_lease_list );

                  //variables
                  for(var i = 0; i < $ctrl.current_lease_list.length; i++){
                    var lease_values = [];
                    for(var j = 0; j < 10; j++){
                      if(j < $ctrl.current_lease_list[i].years_before_leases_expired){
                        var lease_year = {annual_payment: $ctrl.current_lease_list[i].annual_payment};
                        lease_values.push(lease_year)
                      } else {
                        var empty_year = {annual_payment: ' '};
                        lease_values.push(empty_year)
                      }

                    }

                    var lease_data = {title: $ctrl.current_lease_list[i].financed_through, years: lease_values}
                    $ctrl.current_lease_list_table.push(lease_data)
                    console.log(lease_data);
                  }
              }
            });


          });
          scenarioService.getDepreciation(scenario_id)
          .then(function(depreciation_response){
            //console.log("### RESPONSE HERE", depreciation_response.data);
            $ctrl.depreciation = depreciation_response.data;
            $ctrl.depreciation = depreciation_response.data.filter(function (scenario) {
                return scenario.scenario ==scenario_id;
            })
            //console.log("### Assigned HERE", $ctrl.depreciation);
            $ctrl.depreciation.sort(function (a, b) {
              return a.year - b.year;
            })

            for (var i=0;i<10; i++){
              if ($ctrl.depreciation[i]){
                $ctrl.depreciation_items[i]=  Number($ctrl.depreciation[i].depreciation);
                $ctrl.capital_expenditures[i]= Number($ctrl.depreciation[i].capital_expenditures);
                $ctrl.replacement_costs[i]=Number($ctrl.depreciation[i].replacement_costs);
                $ctrl.depreciation_items_intermediate[i]=Number($ctrl.depreciation[i].depreciation_allocated_to_intermediate_assets / 100 * $ctrl.depreciation_items[i]);
                $ctrl.capital_expenditures_intermediate[i]=Number($ctrl.depreciation[i].capital_expenditures_to_intermediate_assets / 100 * $ctrl.capital_expenditures[i]);
                $ctrl.replacement_costs_intermediate[i]=Number($ctrl.depreciation[i].replacement_costs_for_intermediate_assets / 100 * $ctrl.replacement_costs[i]);
                // console.log($ctrl.depreciation_items[i], ( 1 - ($ctrl.depreciation[i].depreciation_allocated_to_intermediate_assets / 100)));
                $ctrl.depreciation_items_long_term[i]=$ctrl.depreciation_items[i] * ( 1 - ($ctrl.depreciation[i].depreciation_allocated_to_intermediate_assets / 100));
                // console.log($ctrl.capital_expenditures[i], ( 1 - ($ctrl.depreciation[i].capital_expenditures_to_intermediate_assets / 100)));
                $ctrl.capital_expenditures_long_term[i]=$ctrl.capital_expenditures[i] * ( 1 - ($ctrl.depreciation[i].capital_expenditures_to_intermediate_assets / 100));
                $ctrl.replacement_costs_long_term[i]=$ctrl.replacement_costs[i] * ( 1 - ($ctrl.depreciation[i].replacement_costs_for_intermediate_assets / 100));
              }
              else{
                $ctrl.depreciation_items[i]=  -1;
                $ctrl.capital_expenditures[i]= -1;
                $ctrl.replacement_costs[i]=-1;
                $ctrl.depreciation_items_intermediate[i]=-1;
                $ctrl.capital_expenditures_intermediate[i]=-1;
                $ctrl.replacement_costs_intermediate[i]=-1;
                $ctrl.depreciation_items_long_term[i]=-1;
                $ctrl.capital_expenditures_long_term[i]=-1;
                $ctrl.replacement_costs_long_term[i]=-1;
              }

            }
          });


          scenarioService.listDistributions(scenario_id)
            .then(function(distributions_response) {
              // console.log(distributions_response)

              $ctrl.distributions = distributions_response.data;
              //console.log($ctrl.distributions);
              $ctrl.distributions= distributions_response.data.filter(function (scenario) {
                  return scenario.scenario ==scenario_id
              })
            //console.log($ctrl.distributions)


              $ctrl.distributions.sort(function (a, b) {
                return a.year - b.year;
              })

              console.log($ctrl.distributions);
              for (var i=0;i<10; i++){

                if ($ctrl.distributions[i]){
                  $ctrl.table_distributions[i]=Number($ctrl.distributions[i].inflated_wages) +Number($ctrl.distributions[i].inflated_family_withdrawls) +Number($ctrl.distributions[i].inflated_salaries) +Number($ctrl.distributions[i].inflated_bonuses) +Number($ctrl.distributions[i].inflated_contributions)
                  $ctrl.table_wages[i]=Number($ctrl.distributions[i].inflated_wages)
                  $ctrl.table_bonuses[i]=Number($ctrl.distributions[i].inflated_bonuses)
                  $ctrl.family_withdrawls[i]=Number($ctrl.distributions[i].inflated_family_withdrawls)
                  $ctrl.salaries[i]=Number($ctrl.distributions[i].inflated_salaries)
                  $ctrl.contributions[i]=Number($ctrl.distributions[i].inflated_contributions)
                }
                else {
                  $ctrl.table_distributions[i]=-1
                  $ctrl.table_wages[i]= -1
                  $ctrl.table_bonuses[i]=-1
                  $ctrl.family_withdrawls[i]=-1
                  $ctrl.salaries[i]=-1
                  $ctrl.contributions[i]=-1
                }
              }

              //console.log($ctrl.table_income)
              //console.log($ctrl.table_distributions,$ctrl.net_returns)

              //console.log($ctrl.table_wages)
              //console.log($ctrl.table_bonuses)

              //console.log($ctrl.table_distributions)

               });



      }


      function calculatePV(plan_budget, irr, plan) {
        var CONVERSION_TABLE = {
          'Day': {'value': 1, 'Day': 1, 'Week': 0.14, 'Month': 0.03, 'Year': 0.003, 'unit': 'Day', 'n': 365},
          'Week': {'value': 2, 'Day': 7, 'Week': 1, 'Month': 0.25, 'Year': 0.019230769, 'unit': 'Week', 'n': 52},
          'Month': {'value': 3, 'Day': 30, 'Week': 4, 'Month': 1, 'Year': 0.08, 'unit': 'Month', 'n': 12},
          'Year': {'value': 4, 'Day': 365, 'Week': 52, 'Month': 12, 'Year': 1, 'unit': 'Year', 'n': 1},
        };

        var net_returns = plan_budget.net_returns_with_inflation;

        if (plan_budget.time_period_position === plan.time_period_value) {
          net_returns += plan.ending_investment
        }

        var x = 1 + irr;
        var y = (plan_budget.time_period_position * CONVERSION_TABLE[plan_budget.time_unit]['Year']);

        return net_returns / (Math.pow(x, y));

      }


      function proceed() {
        $state.go("financeTransactions", {
          'scenario': $ctrl.scenario_id,
          'module':$ctrl.module
        });
      }

      function back() {
        $state.go("financeInflation", {
          'scenario': $ctrl.scenario_id,
          'module':$ctrl.module
        });
      }



      /****************************************************************
                           Private Helper Functions
      ****************************************************************/


      function startProgress(num_calls) {
        $ctrl.progress = 0;
        var time_per_call = 500;

        $interval(function() {
          $ctrl.progress++;
        }, ((time_per_call * num_calls) / 100), 100)
      }


    }

}());
