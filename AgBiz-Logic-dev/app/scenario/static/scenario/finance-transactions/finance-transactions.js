(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeTransactions", {
      templateUrl: "/static/scenario/finance-transactions/finance-transactions.component.html",
      controller: FinanceTransactionsComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceTransactionsComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      "$uibModal",
    ];

    function FinanceTransactionsComponentController(
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
      $ctrl.addTransaction = addTransaction;
      $ctrl.remove = remove;
      $ctrl.edit = edit;
      $ctrl.proceed = proceed;
      $ctrl.back = back;

      // Scenario variable
      $ctrl.scenario;
      $ctrl.module
      $ctrl.titles = [];
      $ctrl.new_transactions = [];
      $ctrl.operating_loans=[];
      $ctrl.capital_purchase=[];
      $ctrl.capital_sales=[];
      $ctrl.capital_leases=[];
      $ctrl.cash_from_asset_loan=[];


      $ctrl.asset_type_list = ["Intermediate Assets", "Long Term Assets - Facilities and Other Improvements", "Long Term Assets - Real Estate"];
      $ctrl.steps = ['Distributions Contributions and Tax Rates', 'Depreciations', 'Future Loans','Future Leases',"Future Finance Transactions"];


      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        console.log(123)
        var scenario_id = $state.params['scenario'];
        $ctrl.module = $state.params['module'];



        scenarioService.listNewTransactions(scenario_id).then(function(future_leases_response) {
          console.log(future_leases_response)
          var filters= future_leases_response.data.filter(function (scenario) {
            return scenario.scenario ==scenario_id
          })
          $ctrl.new_transactions=filters
          console.log($ctrl.new_transactions)
          var i;
          for (i=0;i<$ctrl.new_transactions.length;i++){
            if ($ctrl.new_transactions[i].financed_through!="" && $ctrl.new_transactions[i].loan_amount!=0 && $ctrl.new_transactions[i].interest_rate!=0 &&$ctrl.new_transactions[i].number_of_months_to_borrow!=0){
              $ctrl.operating_loans.push($ctrl.new_transactions[i]);
              continue;
            }
            else if ($ctrl.new_transactions[i].financed_through!="" && $ctrl.new_transactions[i].years_of_loan!=0 && $ctrl.new_transactions[i].interest_rate!=0 &&$ctrl.new_transactions[i].years_of_interest_only_payment!=0){
              $ctrl.capital_purchase.push($ctrl.new_transactions[i]);
              continue;
            }
            else if ($ctrl.new_transactions[i].sold_through!="" &&$ctrl.new_transactions[i].sale_price!=0){
              $ctrl.capital_sales.push($ctrl.new_transactions[i]);
              continue;
            }
            else if($ctrl.new_transactions[i].down_payment!=0 && $ctrl.new_transactions[i].annual_payment!=0){
              $ctrl.capital_leases.push($ctrl.new_transactions[i]);
              continue;
            }
            else{
              $ctrl.cash_from_asset_loan.push($ctrl.new_transactions[i]);
            }
            console.log($ctrl.cash_from_asset_loan)


          }
          // scenarioService.createFamilyWithdrawls($ctrl.familyWithdrawals);
          // location.reload();//need to be fixed later this fuction makesure function scenarioService.retrieveFamiyWithdrawlsBySpecificScenario to retrieve the new data.

         })

      }

      function addTransaction() {
        var new_transaction = {

          "scenario":$state.params['scenario'],

          "financed_through":"",
          "select_year":0,
          "loan_amount":0,
          "select_beginning_year":0,
          "down_payment":0,
          'annual_payment': 0,
          'year_of_lease': 0,
          "interest_rate":0,
          "number_of_months_to_borrow":0,
          "purchase_price":0,
          "trade_in_value":0,
          "percent_financed":0,
          "years_of_loan":0,
          "years_of_interest_only_payment":0,
          "asset_type":1,
          "sold_through":"",
          "sale_price":0,
          "year_of_loan":0,
          //"type":0,


          };
        openAddTransactionModal("new", new_transaction);
        console.log(new_transaction)
      }


      function remove(transaction_id) {
        scenarioService.destrroyNewTransaction(transaction_id);
        $ctrl.new_transactions = $ctrl.new_transactions.filter(function(obj) {obj.id !== transaction_id});
        location.reload();
      }

      function edit(transaction) {
        openAddTransactionModal("edit", transaction);
      }


      function proceed() {
        console.log(123456)
        $state.go("financeSummary", {
          'scenario': $state.params['scenario'],
          'module':$ctrl.module,
        });
      }

      function back() {
        $state.go("financeFutureLoans", {
          'scenario': $state.params['scenario'],
          'module':$ctrl.module,
        });
      }

      /****************************************************************
                           Private Helper Functions
      ****************************************************************/


      function openAddTransactionModal(operation, transaction) {
        var modal = $uibModal.open({
          animation: true,
          templateUrl: '/static/scenario/finance-transactions/add-transaction/add-transaction.component.html',
          controller: 'addTransactionComponentController',
          controllerAs: '$ctrl',
          windowClass :'width: 100px',
          resolve: {
            saveTransaction: function() {
              return saveTransaction;
            },
            updateTransaction: function() {
              return updateTransaction;
            },
            transaction: function() {
              return transaction;
            },
            operation: function() {
              return operation;
            },
            transaction_type: function() {
              return 'leases';
            }
          },
        });

          modal.result.then(function(new_transaction) {
            if (operation === "new") {
              console.log(new_transaction)
              $ctrl.new_transactions.push(new_transaction);
              console.log($ctrl.new_transactions)
              location.reload();
            } else if (operation === "edit") {
              var index = $ctrl.new_transactions.findIndex((function(obj) {obj.id == new_transaction.id}));
             $ctrl.new_transactions[index] = new_transaction;
             console.log($ctrl.new_transactions[index])
            }
          });
      }

      function saveTransaction(transaction) {
        scenarioService.createNewTransaction(transaction);
      }

      function updateTransaction(transaction) {
        scenarioService.updateFutureLease(transaction);
      }

    }

}());
