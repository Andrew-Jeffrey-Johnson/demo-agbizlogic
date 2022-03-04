(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeLoans", {
      templateUrl: "/static/scenario/finance-loans/finance-loans.component.html",
      controller: FinanceLoansComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceLoansComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      '$uibModal'
    ];

    function FinanceLoansComponentController(
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
      //$ctrl.saveTransaction = saveTransaction;
      $ctrl.addTransaction = addTransaction;
      $ctrl.remove = remove;
      $ctrl.edit = edit;
      $ctrl.proceed = proceed;
      $ctrl.back = back;

      // Scenario variable
      $ctrl.scenario;
      $ctrl.module
      $ctrl.titles = [];
      $ctrl.current_loans_list = [];
      $ctrl.asset_type_list = ["Intermediate Assets", "Long Term Assets - Facilities and Other Improvements", "Long Term Assets - Real Estate"];
      $ctrl.steps = ['Beginning Balance Sheet', 'Current Loans', 'Current Capital Leases', 'Current Summary'];


      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        var scenario_id = $state.params['scenario'];
        $ctrl.module = $state.params['module'];

        commonService.retrieveCurrentUser()
        .then(function(current_user_response) {
          $ctrl.user = current_user_response.data;
          console.log($ctrl.user)
          scenarioService.retrieveCurrentLoans('?username=',$ctrl.user.username )
          .then(function(current_loans_response) {
            if (current_loans_response !== undefined &&
                current_loans_response.data !== undefined) {
                  console.log($ctrl.current_loans_list)
                $ctrl.current_loans_list = current_loans_response.data;
                console.log($ctrl.current_loans_list)
            }
          });
        });
      }

      function addTransaction() {
        var new_transaction = {
          'user':$ctrl.user.id,
          'transaction_description':"",
          'loan_amount': '0.00',
          'interest_rate': '0.00',
          'years_of_loan': 0,
          'years_before_loan_matures': 0,
          'asset_type': 0,
        };
        openAddTransactionModal("new", new_transaction);
      }


      function remove(transaction_id) {
        scenarioService.destroyCurrentLoans(transaction_id);
        $ctrl.current_loans_list = $ctrl.current_loans_list.filter(function(obj) {obj.id !== transaction_id});
        location.reload();
      }

      function edit(transaction) {

        openAddTransactionModal("edit", transaction);
        console.log(transaction)

      }


      function proceed() {
        $state.go("financeLeases", {
          'module':$ctrl.module
        });
      }

      function back() {
        // scenarioService.retrieveBalanceSheetBySpecificYear(0)
        // .then(function(beginning_balance_sheet_response) {
        //   if (beginning_balance_sheet_response != undefined &&
        //       beginning_balance_sheet_response.data != undefined &&
        //       beginning_balance_sheet_response.data.id != undefined) {
        //         $state.go("financeBalanceSheet", {
        //           'balance-sheet': beginning_balance_sheet_response.data.id,
        //           'module':$ctrl.module
        //         });
        //       }
        // });
        $state.go("financeBalanceSheet", {
          'module':$ctrl.module
        });
      }


      /****************************************************************
                           Private Helper Functions
      ****************************************************************/


      function openAddTransactionModal(operation, transaction) {
        var modal = $uibModal.open({
          animation: true,
          templateUrl: '/static/scenario/finance-loans/add-transaction/add-transaction.component.html',
          controller: 'addTransactionComponentController',
          controllerAs: '$ctrl',
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
              return 'loans';
            }
          },
        });

          modal.result.then(function(new_transaction) {
            console.log(new_transaction)
            if (operation === "new") {
              $ctrl.current_loans_list.push(new_transaction);
              console.log($ctrl.current_loans_list)
            } else if (operation === "edit") {
              var index = $ctrl.current_loans_list.findIndex((function(obj) {obj.id == new_transaction.id}));
              $ctrl.current_loans_list[index] = new_transaction;

            }
          });
      }

      function saveTransaction(transaction) {
        console.log(transaction)
        scenarioService.createCurrentLoans(transaction);
      }

      function updateTransaction(transaction) {
        console.log(transaction)
        var myNewObject = JSON.parse(angular.toJson(transaction))
        console.log(myNewObject)
        scenarioService.updateCurrentLoans(myNewObject);
      }

    }

}());
