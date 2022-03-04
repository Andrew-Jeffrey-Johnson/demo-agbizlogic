(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .controller('addsTransactionComponentController', addsTransactionComponentController);

    /****************************************************************
                         Controller
    ****************************************************************/

    addsTransactionComponentController.$inject = [
      '$uibModalInstance',
      '$state',
      '$filter',
      '$uibModal',
      'saveTransaction',
      'updateTransaction',
      'transaction',
      'operation',
      'transaction_type',
      'tab_number',
      'scenarioService',
    ];

    function addsTransactionComponentController(
      $uibModalInstance,
      $state,
      $filter,
      $uibModal,
      saveTransaction,
      updateTransaction,
      transaction,
      operation,
      transaction_type,
      tab_number,
      scenarioService) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.cancel = cancel;
      //$ctrl.proced = proced;
      $ctrl.changeValue = changeValue;
      $ctrl.remove = remove;
      $ctrl.tab_number;
      // $ctrl.pro = pro;
      // variables
      $ctrl.selected_item;
      $ctrl.transaction = transaction;
      $ctrl.selected_item_list = [];
      $ctrl.transaction_type = transaction_type;
      $ctrl.type=1 ;  //define which type of new transaction in tab
      $ctrl.proceed=proceed;
      $ctrl.financed_from;


      /****************************************************************
                           Methods
      ****************************************************************/


      function $onInit() {
        console.log($ctrl.transaction)
        $ctrl.tab_number=tab_number;
        console.log(tab_number)
        console.log($ctrl.transaction.asset_class)
        change_number_to_string();

      }
      function change_number_to_string(){
        console.log($ctrl.transaction.select_year)
        console.log($ctrl.transaction.select_year!==null)
        if($ctrl.transaction.select_year!==null){
          $ctrl.transaction.select_year=String($ctrl.transaction.select_year)
        }
        if($ctrl.transaction.select_beginning_year!==null){
          $ctrl.transaction.select_beginning_year=String($ctrl.transaction.select_beginning_year)
        }
        if($ctrl.transaction.years_of_interest!==null){
          $ctrl.transaction.years_of_interest=String($ctrl.transaction.years_of_interest)
        }
        // if($ctrl.transaction.number_month!==null){
        //   $ctrl.transaction.number_month=String($ctrl.transaction.number_month)
        // }
      }

      function changeValue() {
        $ctrl.transaction.associate = $ctrl.selected_item.group;
        $ctrl.selected_item_list.push($ctrl.selected_item);
        $ctrl.transaction.associated_id.push($ctrl.selected_item.id);
      }


      function remove(index) {
        $ctrl.selected_item_list.splice(index, 1);
      }

      function cancel() {
        $uibModalInstance.dismiss();
      }


      function proceed() {
       if (operation === "new") {
         if ($ctrl.type==1){
           console.log($ctrl.transaction);
           var transaction={scenario:parseInt($ctrl.transaction.scenario), select_year:parseInt($ctrl.transaction.select_year),
             financed_through:$ctrl.transaction.financed_through,
             loan_amount:$ctrl.transaction.loan_amount, interest_rate:$ctrl.transaction.interest_rate,
             number_month:$ctrl.transaction.number_of_months_to_borrow}
           console.log(transaction);
           scenarioService.createOperatingLoans(transaction)
           .then(function(new_transaction_response) {
             console.log(new_transaction_response);
             $uibModalInstance.close();
           });
         }
       if ($ctrl.type==2){
         console.log($ctrl.transaction)
         var transaction={scenario:$ctrl.transaction.scenario, financed_from:$ctrl.transaction.financed_from,
           financed_through:$ctrl.transaction.financed_through,
           select_beginning_year:Number($ctrl.transaction.select_beginning_year),
           purchase_price:$ctrl.transaction.purchase_price,
           trade_in_value:$ctrl.transaction.trade_in_value,
           down_payment:$ctrl.transaction.down_payment,
           percent_financed:$ctrl.transaction.percent_financed,
           interest_rate:$ctrl.transaction.interest_rate,
           years_of_loan:$ctrl.transaction.years_of_loan,
           years_of_interest:$ctrl.transaction.years_of_interest_only_payment,
           asset_class:$ctrl.transaction.asset_type}
         console.log(transaction)
         scenarioService.createCapitalPurchases(transaction)
         .then(function(new_transaction_response) {
           console.log(new_transaction_response);
           $uibModalInstance.close();
         });
       }
        else if ($ctrl.type==3){
         console.log($ctrl.transaction)
         var transaction={scenario:$ctrl.transaction.scenario,
           sold_through:$ctrl.transaction.sold_through,
           select_year:$ctrl.transaction.select_year,
           sale_price:$ctrl.transaction.sale_price,
           asset_class:$ctrl.transaction.asset_type}
         console.log(transaction)
         scenarioService.createCapitalSales(transaction)
         .then(function(new_transaction_response) {
           console.log(new_transaction_response);
           $uibModalInstance.close();
         });
       }
       else if ($ctrl.type==4){
         console.log($ctrl.transaction)
         var transaction={scenario:$ctrl.transaction.scenario,
           financed_through:$ctrl.transaction.financed_through,
           select_year:$ctrl.transaction.select_year,
           down_payment:$ctrl.transaction.down_payment,
           annual_payment:$ctrl.transaction.annual_payment,
           year_of_lease:$ctrl.transaction.year_of_lease,
           asset_class:$ctrl.transaction.asset_class}
         console.log(transaction)
         scenarioService.createFutureCapitalLeases(transaction)
         .then(function(new_transaction_response) {
           console.log(new_transaction_response);
           $uibModalInstance.close();
         });
       }
       else if ($ctrl.type==5){
         console.log($ctrl.transaction)
         var transaction={scenario:$ctrl.transaction.scenario,
           financed_through:$ctrl.transaction.financed_through,
           select_year:$ctrl.transaction.select_year,
           loan_amount:$ctrl.transaction.loan_amount,
           interest_rate:$ctrl.transaction.interest_rate,
           years_of_loan:$ctrl.transaction.year_of_loan}
         console.log(transaction)
         scenarioService.createCashFromAssetLoans(transaction)
         .then(function(new_transaction_response) {
           console.log(new_transaction_response);
           $uibModalInstance.close();
         });
       }
       //$uibModalInstance.close();
      }
      else if (operation === "edit") {
        if($ctrl.tab_number==1){
          scenarioService.updateOperatingLoans($ctrl.transaction)
          .then(function(edit_transaction_response) {
            console.log(edit_transaction_response);
            $uibModalInstance.close();
          });
        }
        if($ctrl.tab_number==2){
          scenarioService.updateCapitalPurchases($ctrl.transaction)
          .then(function(edit_transaction_response) {
            console.log(edit_transaction_response);
            $uibModalInstance.close();
          });
        }
        if($ctrl.tab_number==3){
          scenarioService.updateCapitalSales($ctrl.transaction)
          .then(function(edit_transaction_response) {
            console.log(edit_transaction_response);
            $uibModalInstance.close();
          });
        }
        if($ctrl.tab_number==4){
          scenarioService.updateFutureCapitalLeases($ctrl.transaction)
          .then(function(edit_transaction_response) {
            console.log(edit_transaction_response);
            $uibModalInstance.close();
          });
        }
        if($ctrl.tab_number==5){
          scenarioService.updateCashFromAssetLoans($ctrl.transaction)
          .then(function(edit_transaction_response) {
            console.log(edit_transaction_response);
            $uibModalInstance.close();
          });
        }
      }
    }



    }

}());
