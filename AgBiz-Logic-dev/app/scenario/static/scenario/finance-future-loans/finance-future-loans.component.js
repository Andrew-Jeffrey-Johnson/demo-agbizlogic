(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeFutureLoans", {
      templateUrl: "/static/scenario/finance-future-loans/finance-future-loans.component.html",
      controller: FinanceTransactionComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceTransactionComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      '$uibModal',
    ];

    function FinanceTransactionComponentController(
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
      $ctrl.module;
      $ctrl.futureloans=[];
      $ctrl.titles = [];
      $ctrl.futureloans = [];
      $ctrl.asset_type_list = ["Intermediate Assets", "Long Term Assets - Facilities and Other Improvements", "Long Term Assets - Real Estate"];



      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        var scenario_id = $state.params['scenario'];
        $ctrl.module = $state.params['module'];
        console.log(scenario_id);
        scenarioService.listFutureLoans().then(function(future_loans_response) {
          var filters= future_loans_response.data.filter(function (scenario) {
            return scenario.scenario ==scenario_id
          })
          console.log(filters);
         if (filters.length === 0){
           console.log(689)
           $ctrl.futureloans.scenario = scenario_id;
          // scenarioService.createFamilyWithdrawls($ctrl.familyWithdrawals);
          // location.reload();//need to be fixed later this fuction makesure function scenarioService.retrieveFamiyWithdrawlsBySpecificScenario to retrieve the new data.
           }
         })

     scenarioService.listFutureLoans()
       .then(function(future_loans_response) {
         var filters= future_loans_response.data.filter(function (scenario) {
           return scenario.scenario ==scenario_id;
         });

                $ctrl.futureloans = filters;
                console.log( $ctrl.futureloans);

          });

      }

      function addTransaction() {
        var new_transaction = {
          'scenario':$state.params['scenario'],
          'transaction_description': "",
          'loan_amount': 0,
          'interest_rate': 0,
          'years_of_loan': 0,
          'years_before_loan_matures': 0,
          'asset_type': 1,
        };
        openAddTransactionModal("new", new_transaction);
        console.log(new_transaction);
      }


      function remove(transaction_id) {
        scenarioService.destroyFutureLoans(transaction_id);
        $ctrl.futureloans = $ctrl.futureloans.filter(function(obj){ obj.id !== transaction_id});
        location.reload();
      }

      function edit(transaction) {
        openAddTransactionModal("edit", transaction);
      }


      function proceed() {
        $state.go("financeFutureLeases", {
          'scenario': $state.params['scenario'],
          'module':$ctrl.module
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


      function openAddTransactionModal(operation, transaction) {
        var modal = $uibModal.open({
          animation: true,
          templateUrl: '/static/scenario/finance-future-loans/add-transaction/add-transaction.component.html',
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
              return 'future_transaction';
            }
          },
        });

          modal.result.then(function(new_transaction) {
            if (operation === "new") {
              $ctrl.futureloans.push(new_transaction);
              console.log($ctrl.futureloans)
            } else if (operation === "edit") {

              var index = $ctrl.futureloans.findIndex((function(obj){ obj.id == new_transaction.id}));
              $ctrl.futureloans[index] = new_transaction;

            }
          });
      }

      function saveTransaction(transaction) {
        scenarioService.createFutureLoans(transaction);
      }

      function updateTransaction(transaction) {
        console.log(transaction)
        
        scenarioService.updateFutureLoans(transaction);
      }

    }

}());
