(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeLeases", {
      templateUrl: "/static/scenario/finance-leases/finance-leases.component.html",
      controller: FinanceLeasesComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceLeasesComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      "$uibModal",
    ];

    function FinanceLeasesComponentController(
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
      $ctrl.current_lease_list = [];
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

          scenarioService.listCurrentLease($ctrl.user.username)
          .then(function(current_lease_response) {
            if (current_lease_response !== undefined &&
                current_lease_response.data !== undefined) {
                $ctrl.current_lease_list = current_lease_response.data;
                console.log($ctrl.current_lease_list );
            }
          });
        });
      }

      function addTransaction() {
        var new_transaction = {
          "user":$ctrl.user.id,
          "plan" :"",
          "financed_through":"",
          "begin_year":0,
          'annual_payment': 0,
          'year_of_lease': 0,
          'years_before_leases_expired': 0,
          'asset_class': "",

          };
        openAddTransactionModal("new", new_transaction);
        console.log(new_transaction)
      }


      function remove(transaction_id) {
        scenarioService.destroyCurrentLease(transaction_id);
        $ctrl.current_lease_list = $ctrl.current_lease_list.filter(function(obj) {obj.id !== transaction_id});
        location.reload();
      }

      function edit(transaction) {
        openAddTransactionModal("edit", transaction);
      }


      function proceed() {
        //always go back to finance from leases
         $state.go("financeCurrentSummary", {
           'module':'finance'
         });
      }


      function back() {
        $state.go("financeLoans", {
          'module':$ctrl.module
        });
      }

      /****************************************************************
                           Private Helper Functions
      ****************************************************************/


      function openAddTransactionModal(operation, transaction) {
        var modal = $uibModal.open({
          animation: true,
          templateUrl: '/static/scenario/finance-leases/add-transaction/add-transaction.component.html',
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
              $ctrl.current_lease_list.push(new_transaction);
              console.log($ctrl.current_lease_list)
            } else if (operation === "edit") {
              var index = $ctrl.current_lease_list.findIndex((function(obj) {obj.id == new_transaction.id}));
             $ctrl.current_lease_list[index] = new_transaction;
            }
          });
      }

      function saveTransaction(transaction) {
        scenarioService.createCurrentLease(transaction);
      }

      function updateTransaction(transaction) {
        scenarioService.updateCurrentLease(transaction);
      }

    }

}());
