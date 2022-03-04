(function () {
  'use strict';

  angular
    .module('budgetModule')
    .controller('AddCostModalController', AddCostModalController);

  AddCostModalController.$inject = [
    '$uibModalInstance',
    'saveCost',
    'updateParent',
    'cost_categories',
    'budget_cost_data',
    'cost_item',
    'general_cost_item',
    'editing',
    'modalService',
  ];

  function AddCostModalController(
    $uibModalInstance,
    saveCost,
    updateParent,
    cost_categories,
    budget_cost_data,
    cost_item,
    general_cost_item,
    editing,
    modalService) {
    var vm = this;

    /****************************************************************
     Bindable Members
     ****************************************************************/

    // Methods
    vm.$onInit = $onInit;
    vm.cancel = cancel;
    vm.save = save;
    vm.getTotal = getTotal;

    // Cost item
    vm.cost_item;
    vm.quantity_per_farm_unit;
    vm.sub_name=null; //that is for cost_item if you choose other expense
    // Misc
    vm.parent_cost_total;
    vm.original_cost_total;
    vm.total;


    /****************************************************************
     Controller Methods
     ****************************************************************/

    function $onInit() {
      vm.cost_item = formatFields(cost_item);
      vm.quantity_per_farm_unit = Number(cost_item.unit_quantity / cost_item.farm_unit_quantity).toFixed(2);
      setSubCategory();
      vm.cost_categories = cost_categories;
      vm.budget_cost_data = budget_cost_data;
      vm.editing = editing;
      vm.parent_cost_total = general_cost_item.cost_total;
      vm.cost_item.cost_total = parseFloat(vm.cost_item.cost_total).toFixed(2);
      vm.original_cost_total = vm.cost_item.cost_total;

      vm.total = parseFloat(vm.parent_cost_total) + parseFloat(vm.original_cost_total);
    }

    function cancel() {
      $uibModalInstance.dismiss();
    }


    function save(is_valid) {
      if (is_valid === true) {
        if (vm.cost_item.cost_type === 'general') {
          if(vm.sub_name==null){
          console.log(vm.cost_item)
          saveCost(vm.cost_item,1);

          $uibModalInstance.dismiss();
        }
           if(vm.sub_name!=null){
               vm.cost_item.name="Other Expenses: "+vm.sub_name
               console.log(vm.cost_item)
               saveCost(vm.cost_item,2);
               $uibModalInstance.dismiss();
           }

        }
        else if (vm.cost_item.cost_type === 'variable' || vm.cost_item.cost_type === 'fixed') {
          vm.cost_item.sub_category = vm.cost_item.sub_category.name;
          updateParent(vm.cost_item, vm.original_cost_total);
          saveCost(vm.cost_item,2);
          $uibModalInstance.dismiss();
        }
      }
    }


    /****************************************************************
     Private Helper Functions
     ****************************************************************/

    /*
        Sets the cost item's 'sub_category' to the matching object in the gold standard cost data tree for the
        select dropdown to be initialized correctly.
    */
    function setSubCategory() {
      if (vm.cost_item.cost_type == "fixed") {
        angular.forEach(vm.cost_item.gold_standard_category.fixed_sub_categories, function (category) {
          if (category.name == vm.cost_item.sub_category) {
            vm.cost_item.sub_category = category;
          }
        });
      }
      else if (vm.cost_item.cost_type == "variable") {
        angular.forEach(vm.cost_item.gold_standard_category.variable_sub_categories, function (category) {
          if (category.name == vm.cost_item.sub_category) {
            vm.cost_item.sub_category = category;
          }
        });
      }
    }


    /*
        Format fields correctly and returns formatted cost item.
    */
    function formatFields(cost_item) {
      var formatted_cost_item = angular.copy(cost_item);
      // Parse strings into floats (DRF parses floats as strings for accuracy)
      formatted_cost_item.cost_per_unit = parseFloat(formatted_cost_item.cost_per_unit).toFixed(2);
      formatted_cost_item.cost_per_farm_unit = parseFloat(formatted_cost_item.cost_per_farm_unit).toFixed(2);

      return formatted_cost_item;
    }

    function getTotal(unit_quantity, cost_per_unit) {
      vm.cost_item.cost_total = unit_quantity * cost_per_unit;
      vm.cost_item.cost_total = parseFloat(vm.cost_item.cost_total).toFixed(2);
    }
  }

})();
