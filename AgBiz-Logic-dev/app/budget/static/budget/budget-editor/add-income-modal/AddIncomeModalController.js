(function() {
  'use strict';

  angular
    .module('budgetModule')
    .controller('AddIncomeModalController', AddIncomeModalController);

  AddIncomeModalController.$inject = [
    '$uibModalInstance',
    'saveIncome',
    'income_item',
    'editing',
    'cropSaleUnits',
    'wholefarmSaleUnits',
    'livestockSaleUnits',
    'nurserySaleUnits'
  ];

  function AddIncomeModalController(
    $uibModalInstance,
    saveIncome,
    income_item,
    editing,
    cropSaleUnits,
    wholefarmSaleUnits,
    livestockSaleUnits,
    nurserySaleUnits) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    vm.$onInit = $onInit;
    vm.cancel = cancel;
    vm.save = save;
    vm.recalculateSaleUnitQuantity = recalculateSaleUnitQuantity;
    vm.recalculatePricePerSaleUnit = recalculatePricePerSaleUnit;

    // Income item
    vm.income_item;

    // Form
    vm.sale_unit_options;


    /****************************************************************
                        Controller Methods
    ****************************************************************/

    function $onInit() {
      vm.income_item = angular.copy(clean(income_item));
      vm.income_item.weight = Number(vm.income_item.weight).toFixed(2);
      vm.income_item.price_per_sale_unit = Number(vm.income_item.price_per_sale_unit).toFixed(2);
      vm.income_item.return_total = Number(vm.income_item.return_total).toFixed(2);
      vm.editing = editing;
      vm.sale_unit_options = setSaleUnits(income_item);
    }


    function cancel() {
      $uibModalInstance.dismiss();
    }


    function save(is_valid) {
      if (is_valid == true) {
        vm.income_item.return_total = 1*(vm.income_item.price_per_sale_unit *
                                      vm.income_item.weight *
                                      vm.income_item.sale_unit_quantity).toFixed(2);
        saveIncome(vm.income_item);
        $uibModalInstance.dismiss();
      }
    }


    function recalculateSaleUnitQuantity() {
      vm.income_item.sale_unit_quantity = vm.income_item.return_total / vm.income_item.price_per_sale_unit;
    }


    function recalculatePricePerSaleUnit() {
      vm.income_item.price_per_sale_unit = vm.income_item.return_total / vm.income_item.sale_unit_quantity;
    }


    /****************************************************************
                        Private Helper Functions
    ****************************************************************/

    function clean(income_item) {
      if (income_item !== undefined &&
          income_item.price_per_sale_unit !== undefined &&
          income_item.return_total !== undefined) {
        income_item.price_per_sale_unit = parseFloat(income_item.price_per_sale_unit);
        income_item.return_total = parseFloat(income_item.return_total);
      }

      if (income_item.weight === undefined) {
        income_item.weight = 1;
      }

      return income_item;
    }


    function setSaleUnits(income_item) {
      var sale_units = '';
      if (income_item.enterprise == 'Crop') {
        sale_units = cropSaleUnits;
      }
      else if (income_item.enterprise == 'Whole Farm') {
        sale_units = wholefarmSaleUnits;
      }
      else if (income_item.enterprise == 'Livestock') {
        sale_units = livestockSaleUnits;
      }
      else if(income_item.enterprise=='Nursery'){
        sale_units = nurserySaleUnits;
      }
      return sale_units;
    }

  }

})();
