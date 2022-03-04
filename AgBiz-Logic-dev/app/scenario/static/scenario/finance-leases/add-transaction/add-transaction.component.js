(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller('addTransactionComponentController', addTransactionComponentController);

    /****************************************************************
                         Controller
    ****************************************************************/

    addTransactionComponentController.$inject = [
      '$uibModalInstance',
      '$state',
      '$filter',
      '$uibModal',
      'saveTransaction',
      'updateTransaction',
      'transaction',
      'operation',
      'transaction_type'
    ];

    function addTransactionComponentController(
      $uibModalInstance,
      $state,
      $filter,
      $uibModal,
      saveTransaction,
      updateTransaction,
      transaction,
      operation,
      transaction_type) {
      var vm = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      vm.$onInit = $onInit;
      vm.cancel = cancel;
      vm.proceed = proceed;
      vm.changeValue = changeValue;
      vm.remove = remove;

      // variables
      vm.selected_item;
      vm.transaction = transaction;
      vm.selected_item_list = [];
      vm.transaction_type = transaction_type;


      /****************************************************************
                           Methods
      ****************************************************************/


      function $onInit() {
        console.log(transaction);
      }

      function changeValue() {
        vm.transaction.associate = vm.selected_item.group;
        vm.selected_item_list.push(vm.selected_item);
        vm.transaction.associated_id.push(vm.selected_item.id);
      }


      function remove(index) {
        vm.selected_item_list.splice(index, 1);
      }

      function cancel() {
        $uibModalInstance.dismiss();
      }


      function proceed() {
        if (operation === "new") {
          saveTransaction(vm.transaction);
        } else if (operation === "edit") {
          updateTransaction(vm.transaction);
        }
        $uibModalInstance.close(vm.transaction);
      }



    }
}());
