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


      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        var scenario_id = $state.params['scenario'];
        $ctrl.module = $state.params['module'];

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
      }


      function remove(transaction_id, number) {
        console.log(number)
        if (number==1){
          scenarioService.destroyOperatingLoans(transaction_id)
          location.reload();
        }
        if (number==2){
          scenarioService.destroyCapitalPurchases(transaction_id)
          location.reload();
        }
        if (number==3){
          scenarioService.destroyCapitalSales(transaction_id)
          location.reload();
        }
        if (number==4){
          scenarioService.destroyFutureCapitalLeases(transaction_id)
          location.reload();
        }
        if (number==5){
          scenarioService.destroyCashFromAssetLoans(transaction_id)
          location.reload();
        }

      }

      function edit(transaction,number) {
        openAddTransactionModal("edit", transaction,number);
      }


      function proceed() {
        $state.go("financeSummary", {
          'scenario': $state.params['scenario'],
          'module':$ctrl.module,
        });
      }

      function back() {
        $state.go("financeFirstReview", {
          'scenario': $state.params['scenario'],
          'module':$ctrl.module
        });
      }

      /****************************************************************
                           Private Helper Functions
      ****************************************************************/


      function openAddTransactionModal(operation, transaction, number) {
        var modal = $uibModal.open({
          animation: true,
          templateUrl: '/static/scenario/finance-transactions/add-transaction/add-transaction.component.html',
          controller: 'addsTransactionComponentController',
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
            },
            tab_number: function() {
              return number;
            }

          },
        });

          modal.result.then(function(new_transaction) {
            if (operation === "new") {
              console.log(new_transaction)
              // $ctrl.new_transactions.push(new_transaction);
              // console.log($ctrl.new_transactions)
              location.reload();
            } else if (operation === "edit") {
              var index = $ctrl.new_transactions.findIndex((function(obj) {obj.id == new_transaction.id}));
             $ctrl.new_transactions[index] = new_transaction;
             console.log($ctrl.new_transactions[index])
            }
          });
      }

      function saveTransaction(transaction) {
        console.log(transaction)
        scenarioService.createNewTransaction(transaction);
      }

      function updateTransaction(transaction) {
        scenarioService.updateFutureLease(transaction);
      }

    }

}());
