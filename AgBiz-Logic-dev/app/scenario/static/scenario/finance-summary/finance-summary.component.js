(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeSummary", {
      templateUrl: "/static/scenario/finance-summary/finance-summary.component.html",
      controller: financeSummaryComponenController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    financeSummaryComponenController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      'budgetService',
      "$uibModal"
    ];

    function financeSummaryComponenController(
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
    $ctrl.future_lease_list=[];
    $ctrl.distributions=[];
    $ctrl.depreciation=[];
    $ctrl.futureloans=[];
    $ctrl.inflation=[];
    $ctrl.scenario;
    $ctrl.collapse_list = []
    $ctrl.back = back;
    $ctrl.user=[];
    $ctrl.proceed = proceed;
    $ctrl.myFunction = myFunction;
    $ctrl.toggleCollapse = toggleCollapse;
    // Scenario variable


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      for (var x in [1,2,3,4,5,6]){
        console.log(x);
        $ctrl.collapse_list[x] = 'false';
      }

      var scenario_id = $state.params['scenario'];
      $ctrl.module = $state.params['module'];

      scenarioService.retrieveScenario(scenario_id)
      .then(function(scenario_response) {
          $ctrl.scenario = scenario_response.data;
          console.log($ctrl.scenario)

      })

      scenarioService.retrieveDepreciation(scenario_id).then(function(depreciation_response){
        //console.log(depreciation_response.data)
        var filters= depreciation_response.data.filter(function (scenario) {
          return scenario.scenario ==scenario_id
        })
        $ctrl.depreciation=filters
        console.log(filters);
        $ctrl.depreciation.sort(function (a, b) {
          return a.year - b.year;
        })
     });

     scenarioService.listDistributions(scenario_id)
        .then(function(distributions_response) {
          console.log(distributions_response)
          $ctrl.distributions = distributions_response.data;
          console.log($ctrl.distributions);
          $ctrl.distributions= distributions_response.data.filter(function (scenario) {
              return scenario.scenario ==scenario_id
          })
          $ctrl.distributions.sort(function (a, b) {
            return a.year - b.year;
          })
          console.log($ctrl.distributions);

      });

      scenarioService.listOperatingLoans(scenario_id).then(function(new_transactions_response) {
        console.log(new_transactions_response.data)
        $ctrl.operating_loans=new_transactions_response.data
      });
      scenarioService.listCapitalPurchases(scenario_id).then(function(new_transactions_response) {
        console.log(new_transactions_response.data)
        $ctrl.capital_purchase=new_transactions_response.data
      });
      scenarioService.listCapitalSales(scenario_id).then(function(new_transactions_response) {
        console.log(new_transactions_response.data)
        $ctrl.capital_sales=new_transactions_response.data
      });
      scenarioService.listFutureCapitalLeases(scenario_id).then(function(new_transactions_response) {
        console.log(new_transactions_response.data)
        $ctrl.capital_leases=new_transactions_response.data

      });
      scenarioService.listCashFromAssetLoans(scenario_id).then(function(new_transactions_response) {
        console.log(new_transactions_response.data)
        $ctrl.cash_from_asset_loan=new_transactions_response.data
      });

    scenarioService.listInflation(scenario_id).then(function(inflation_response) {
        $ctrl.inflation = inflation_response.data.filter(function (temp_inflation) {
          console.log(temp_inflation);
          return temp_inflation.scenario ==scenario_id
        })
        $ctrl.inflation = $ctrl.inflation[0]
        console.log($ctrl.inflation);
    });
    commonService.retrieveCurrentUser().then(function(current_user_response){
      var user = current_user_response.data;
      //console.log("here is the user respon");
      //console.log(current_user_response);
      console.log(user.username);
      scenarioService.listBalanceSheet(user.username, $ctrl.scenario.id, []).then(function(balancesheet_response) {
          $ctrl.balancesheet = balancesheet_response.data;
          //console.log($ctrl.balancesheet);
      });
    })


}


    function toggleCollapse(collapse) {
      console.log(collapse);
      if(collapse === 'false'){
        return 'true';
      }
      else{
        return 'false'
      }
    }

    function myFunction(findclass) {
      var element = document.getElementsByClassName(findclass);
      console.log(element);
      for(var i = 0; i < element.length; i++) {
        element[i].classList.toggle("collapse");
      }
    }

    function back() {
      $state.go("financeTransactions", {
        'scenario': $state.params['scenario'],
        'module':$ctrl.module
      });
    }


    function proceed() {
      $state.go("abc", {
        'scenario': $state.params['scenario'],
        'module':$ctrl.module
      });
    }





}

  }())
