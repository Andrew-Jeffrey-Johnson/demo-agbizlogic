(function() {
  'use strict';

  angular
    .module("budgetModule")
    .controller("NewBudgetModalController", NewBudgetModalController);

  NewBudgetModalController.$inject = [
    "filterFilter",
    "budgetService",
    "commonService",
    "$uibModalInstance",
    "$state",
  ];

  function NewBudgetModalController(
    filterFilter,
    budgetService,
    commonService,
    $uibModalInstance,
    $state) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    /****************************************************************
                         Bindable Members
    ****************************************************************/
    // Methods
    vm.$onInit = $onInit;
    vm.addNewBudget = addNewBudget;
    vm.cancel = cancel;
    vm.Validate = Validate;
    vm.validate = true;

    // Modal
    vm.modal_title;

    // University budgets
    vm.budget = new Object();

    vm.budget.title="";


     // Search options
    vm.enterprise_list = [
      {
        'label': "Select",
        'value': "",
      },
      {
        'label': "Crop",
        'value': "Crop",
      },
      {
        'label': "Livestock",
        'value': "Livestock",
      },
      {
        'label': "Nursery",
        'value': "Nursery",
      },
    ];

    vm.enterprise ={};


        // Search object
    vm.search = {
      'title': "",
      'enterprise': vm.enterprise_list[0].value,
      'state': "",
      'region': "",
    };

    // validaty
    vm.budgetTitleArr = [];
    vm.duplicateBudgetTitle = false;




    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      vm.modal_title = "Create New Budget";
      vm.modal_header= "New Budget Creator";
      vm.farm_unit = "Acre";

      commonService.listCommodities().then(function(commodity_response){
        vm.commodities = commodity_response.data;
      });

      retrieveBudgetNameList();
    }



    function addNewBudget() {

     var new_budget = createNewDefaultBudget();


        budgetService.createBudget(new_budget)
        .then(function(new_budget_response) {
          if (new_budget_response !== undefined &&
              new_budget_response.data !== undefined &&
              new_budget_response.data.id !== undefined &&
              new_budget_response.data.id > 0) {
            $state.go("budget-editor", {
              'budget': new_budget_response.data.id,
            }).then(function(){
              $uibModalInstance.close();
              $state.reload();
            })
          }
        });
    }


     /*
        Return a new budget object with default required fields.
    */
    function createNewDefaultBudget() {
      var descriptor1 = '';
      var descriptor2 = '';
      var descriptor3 = '';
      var descriptor4 = '';
      var descriptor5 = '';


      if( vm.enterprise.category_1 !== undefined && vm.enterprise.category_1['name'] !== undefined){
        descriptor1 = vm.enterprise.category_1['name'];
      }
      else{
        descriptor1 = '';
      }

      if(vm.enterprise.category_2 !=undefined && vm.enterprise.category_2.name != undefined){
        descriptor2 = vm.enterprise.category_2.name;
      }
      else{
        descriptor2 = '';
      }

      if(vm.enterprise.category_3 !=undefined && vm.enterprise.category_3.name != undefined){
        descriptor3 = vm.enterprise.category_3.name;
      }
      else{
        descriptor3 = '';
      }

      if(vm.enterprise.category_4 !=undefined && vm.enterprise.category_4.name !=undefined){
        descriptor4 = vm.enterprise.category_4.name;
      }
      else{
        descriptor4 = '';
      }

      if(vm.enterprise.category_5 !=undefined && vm.enterprise.category_5.name != undefined){
        descriptor5 = vm.enterprise.category_5.name;
      }
      else{
        descriptor5 = '';
      }

      var budget = {
        'title': vm.budget.title,
        'state': "OR",
        "enterprise": vm.search.enterprise,
        "market":vm.enterprise.market.name,
        "farm_unit": "Total",
        "farm_unit_quantity": 1,
        "descriptor1": descriptor1,
        "descriptor2": descriptor2,
        "descriptor3": descriptor3,
        "descriptor4": descriptor4,
        "descriptor5": descriptor5,
        "module": "allocate",

      };

      return budget;
    }



    function cancel() {
      $uibModalInstance.dismiss();
    }

    function Validate(){
      vm.duplicateBudgetTitle = duplicateBudgetTitle(vm.budget.title);
      if(vm.budget.title != undefined && vm.budget.title != "" && !vm.duplicateBudgetTitle){
        if(vm.search.enterprise != "" && vm.search.enterprise!= undefined
          && vm.enterprise.category_1 != ""
          && vm.enterprise.category_1 != undefined && vm.enterprise.market != ""
          && vm.enterprise.market != undefined){
          vm.validate = false;
        }
      }else{
        vm.validate = true;
      }
    }



    /****************************************************************
                         Private Helper Functions
    ****************************************************************/


    function duplicateBudgetTitle(title) {
      var budgetTitle = document.getElementsByName("budgetTitle")[0];

      if ( title !== '' && vm.budgetTitleArr.indexOf(title) === -1 ) {
        budgetTitle.style.borderColor = "";
        return false;
      } else {
        budgetTitle.style.borderColor = "red";
        return true;
      }
    }

    function retrieveBudgetNameList() {
      var current_user;

      commonService.retrieveCurrentUser().then(function(response) {
        current_user = response.data;

        budgetService.listBudgets(current_user.username, "title", "allocate")
        .then(function(budget_title_list_response) {
          if (budget_title_list_response !== undefined &&
              budget_title_list_response.data !== undefined) {
            var budget_title_list = budget_title_list_response.data;
            vm.budgetTitleArr = budget_title_list.map(function(budget){ return budget.title });
          }
        });
      });
    }

    }

    }());
