(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeFutureLeases", {
      templateUrl: "/static/scenario/finance-future-leases/finance-future-leases.component.html",
      controller: FinanceFutureLeasesComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceFutureLeasesComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      "$uibModal",
    ];

    function FinanceFutureLeasesComponentController(
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
      $ctrl.future_lease_list = [];
      $ctrl.asset_type_list = ["Intermediate Assets", "Long Term Assets - Facilities and Other Improvements", "Long Term Assets - Real Estate"];

      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        var scenario_id = $state.params['scenario'];
        $ctrl.module = $state.params['module'];



        scenarioService.listFutureLeases().then(function(future_leases_response) {
          var filters= future_leases_response.data.filter(function (scenario) {
            return scenario.scenario ==scenario_id
          })
          $ctrl.future_lease_list=filters
          console.log(filters)
          // scenarioService.createFamilyWithdrawls($ctrl.familyWithdrawals);
          // location.reload();//need to be fixed later this fuction makesure function scenarioService.retrieveFamiyWithdrawlsBySpecificScenario to retrieve the new data.

         })

      }

      function addTransaction() {
        var new_transaction = {

          "scenario":$state.params['scenario'],
          "financed_through":"",
          "begin_year":0,
          "down_payment":0,
          'annual_payment': 0,
          'year_of_lease': 0,

          };
        openAddTransactionModal("new", new_transaction);
        console.log(new_transaction)
      }


      function remove(transaction_id) {
        scenarioService.destroyFutureLease(transaction_id);
        $ctrl.future_lease_list = $ctrl.future_lease_list.filter(function(obj) {obj.id !== transaction_id});
        location.reload();
      }

      function edit(transaction) {
        openAddTransactionModal("edit", transaction);
      }


      function proceed() {
        $state.go("financeTransactions", {
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
              return 'leases';
            }
          },
        });

          modal.result.then(function(new_transaction) {
            if (operation === "new") {
              console.log(new_transaction)
              $ctrl.future_lease_list.push(new_transaction);
              console.log($ctrl.future_lease_list)
            } else if (operation === "edit") {
              var index = $ctrl.future_lease_list.findIndex((function(obj) {obj.id == new_transaction.id}));
             $ctrl.future_lease_list[index] = new_transaction;
             console.log($ctrl.future_lease_list[index])
            }
          });
      }

      function saveTransaction(transaction) {
        scenarioService.createFutureLease(transaction);
      }

      function updateTransaction(transaction) {
        scenarioService.updateFutureLease(transaction);
      }

    }

}());
