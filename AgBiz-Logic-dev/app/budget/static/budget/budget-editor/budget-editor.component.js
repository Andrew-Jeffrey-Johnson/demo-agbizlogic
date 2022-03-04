(function () {
  'use strict';

  angular
    .module("budgetModule")
    .component("budgetEditor", {
      templateUrl: "/static/budget/budget-editor/budget-editor.component.html",
      controller: BudgetEditorController,
      bindings: {
        'budget': "<",
        'discardable': "<",
        'onDiscard': "&",
        'onSave': "&"
      }
    });


  /****************************************************************
   Controller
   ****************************************************************/

  BudgetEditorController.$inject = [
    '$filter',
    '$interval',
    'budgetService',
    'commonService',
    '$uibModal',
    '$q',
    'timeUnits',
    '$rootScope',
    '$state'
  ];

  function BudgetEditorController(
    $filter,
    $interval,
    budgetService,
    commonService,
    $uibModal,
    $q,
    timeUnits,
    $scope,
    $state) {
    var $ctrl = this;

    /****************************************************************
     Bindable Members
     ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.reloadData = reloadData;
    $ctrl.setFlags = setFlags;
    $ctrl.changeBudgetUnit = changeBudgetUnit;
    $ctrl.newIncome = newIncome;
    $ctrl.editIncome = editIncome;
    $ctrl.saveIncome = saveIncome;
    $ctrl.newCost = newCost;
    $ctrl.newGeneralCost = newGeneralCost;
    $ctrl.editCost = editCost;
    $ctrl.editGeneralCost = editGeneralCost;
    $ctrl.saveCost = saveCost;
    $ctrl.updateParent = updateParent;
    $ctrl.removeItem = removeItem;
    $ctrl.updateBudget = updateBudget;
    $ctrl.setCountyOptions = setCountyOptions;
    $ctrl.save = save;
    $ctrl.discard = discard;
    $ctrl.viewBudgetHelp = viewBudgetHelp;
    $ctrl.viewBudgetFormHelp = viewBudgetFormHelp;
    $ctrl.validateBudgetTitle = validateBudgetTitle;
    $ctrl.validateBudgetState = validateBudgetState;
    // Outputs
    $ctrl.onDiscard;
    $ctrl.onSave;

    // Inputs
    $ctrl.budget;
    $ctrl.discardable;
    $ctrl.parentCostTotal;
    $ctrl.general_current_cost_item;
    $ctrl.confirm_income = false;
    $ctrl.confirm_GeneralCost = false;
    $ctrl.confirm_variableCost = false;
    $ctrl.confirm_fixedCost = false;
    $ctrl.edit_item = '';
    $ctrl.university;

    // Misc
    $ctrl.market = [];
    $ctrl.region_data;
    $ctrl.county_options = [];
    $ctrl.cost_categories = [];
    $ctrl.progress = 100;
    $ctrl.time_units = timeUnits;
    $ctrl.budgetTitleArr = [];
    $ctrl.old_title;
    //$ctrl.form.budgetTitle;


    /****************************************************************
     Controller Methods
     ****************************************************************/

    function $onInit() {

      if ($ctrl.budget.id !== undefined && $ctrl.budget.title == undefined) {
        budgetService.retrieveBudget($ctrl.budget.id)
        .then(function(budget_response) {
          if (budget_response != undefined ||
            budget_response.data != undefined ||
            budget_response.data.id != undefined ||
            budget_response.data.id < 1) {
            $ctrl.budget = budget_response.data;
            //console.log($ctrl.budget.farm_unit_quantity)
            $ctrl.budget.farm_unit_quantity = parseFloat($ctrl.budget.farm_unit_quantity);


            $ctrl.old_title = $ctrl.budget.title;
            $ctrl.university = $state.params['university'];
            //$ctrl.form.budgetTitle.$setValidity("unique", true);
            return commonService.listCommodities();

          }
        })
        .then(function(commodities_response) {

          $ctrl.commodities = commodities_response.data;
          if ($ctrl.budget.enterprise == undefined) {
            $ctrl.budget.enterprise = "Crop";
          }
          if ($ctrl.commodities[$ctrl.budget.enterprise].markets == undefined) {
            $ctrl.commodities[$ctrl.budget.enterprise].markets = [];
          }
        angular.forEach($ctrl.commodities[$ctrl.budget.enterprise].markets, function(value, key){
          $ctrl.market.push(value.name);

        });

          return populateDropdowns();

        })
        .then(function(response) {
          if (response !== undefined) {
            $ctrl.budget = setCostItemCostData($ctrl.budget, $ctrl.budget_cost_data);
            $ctrl.setFlags();
            retrieveBudgetNameList();
          }
        });

      }


    }


    function reloadData() {
      startProgress(2);

      budgetService.retrieveBudget($ctrl.budget.id)
        .then(function (budget_response) {
          if (budget_response !== undefined &&
            budget_response.data !== undefined &&
            budget_response.data.title !== undefined) {
            $ctrl.budget = setCostItemCostData(budget_response.data, $ctrl.budget_cost_data);
            $ctrl.setFlags();
            $ctrl.budget.farm_unit_quantity = parseFloat($ctrl.budget.farm_unit_quantity);
          }
        });
    }


    function setFlags() {
      $ctrl.is_cost_general = false;
      $ctrl.is_cost_variable = false;
      $ctrl.is_cost_fixed = false;

      angular.forEach($ctrl.budget.cost_items, function (value, key) {
        switch (value['cost_type']) {
          case "general":
            $ctrl.is_cost_general = true;
            break;
          case "variable":
            $ctrl.is_cost_variable = true;
            break;
          case "fixed":
            $ctrl.is_cost_fixed = true;
            break;
          default:
            break;
        }
      });
    }


    function changeBudgetUnit(budget) {
      if (budget !== undefined && budget.id !== undefined) {
        openBudgetUnitModal(budget);
      }
    }

    function viewBudgetFormHelp() {
      openBudgetFormHelpModal();
    }

    function viewBudgetHelp() {
      openBudgetHelpModal();
    }


    function newIncome() {
      openAddIncomeModal({
        'enterprise': $ctrl.budget.enterprise,
        'farm_unit': $ctrl.budget.farm_unit,
        'farm_unit_quantity': 1,
        'sale_unit_quantity': 1,
        'price_per_sale_unit': 0,
        'return_total': 0,
      }, false);
    }


    function editIncome(income_item) {
      if (income_item !== undefined &&
        income_item.id !== undefined &&
        income_item.return_total !== undefined) {
        openAddIncomeModal(income_item, true);
      }
    }


    function saveIncome(income_item) {
      startProgress(1);

      if (income_item !== undefined && income_item.return_total !== undefined) {
        // Existing object
        if (income_item.id !== undefined) {
          budgetService.updateBudgetItem('income', income_item)
            .then(function (response) {
              $ctrl.reloadData();
            });
        }
        // New object
        else {
          income_item.parent_budget = $ctrl.budget.id;

          budgetService.createBudgetItem("income", income_item)
            .then(function (response) {
              $ctrl.reloadData();
            });
        }
      }
    }


    function newCost(cost_type, general_cost_item) {
      var new_cost_item = {
        'id': general_cost_item.id,
        'parent_budget': $ctrl.budget.id,
        "parent_category": general_cost_item.name,
        "parent_cost_total": parseFloat(general_cost_item.cost_total),
        "name": "",
        "category": "",
        "cost_type": cost_type,
        "unit": "",
        "unit_quantity": 0.00,
        "cost_per_unit": 0.00,
        "cost_total": 0.00,
      };
      // Match the parent cost with a Gold Standard cost object for the dropdown
      var expense_name = checkOtherExpense(general_cost_item, $ctrl.budget_cost_data);
      new_cost_item.gold_standard_category = $filter('filter')($ctrl.budget_cost_data, {'name': expense_name})[0];
      var new_general_cost_item = angular.copy(general_cost_item);

      openAddCostModal(new_cost_item, new_general_cost_item, false);
    }


    function newGeneralCost() {
      var new_general_cost_item = {
        'parent_budget': $ctrl.budget.id,
        'name': "",
        'category': "",
        'sub_category': "",
        'cost_type': "general",
        'unit': ($ctrl.budget.income_items[0] === undefined || $ctrl.budget.income_items[0].farm_unit === undefined) ? "Total" : $ctrl.budget.income_items[0].farm_unit,
        'unit_quantity': 1.00,
        'farm_unit': $ctrl.budget.farm_unit,
        'farm_unit_quantity': 1.00,
        'cost_per_unit': 0.00,
        'cost_per_farm_unit': 0.00,
        'cost_total': 0.00,
      };
      openAddCostModal(new_general_cost_item, {}, false);


    }


    function editCost(cost_item) {
      var new_cost_item = angular.copy(cost_item);
      new_cost_item.original_cost_total = cost_item.cost_total;
      // Match the dropdowns with the cost value
      new_cost_item.gold_standard_category = $filter('filter')($ctrl.budget_cost_data, {'name': cost_item.parent_category})[0];
      var parent_general_cost = angular.copy($filter('filter')($ctrl.budget.cost_items, {'name': cost_item.parent_category})[0]);
      if (parent_general_cost === undefined) {
        parent_general_cost = {
          cost_total: 0.00
        };
      }
      openAddCostModal(new_cost_item, parent_general_cost, true);
    }


    function editGeneralCost(general_cost_item) {
      openAddCostModal(general_cost_item, {}, true);
    }



    function saveCost(cost_item,edited) { // multiple fuctions share one model.
      console.log(cost_item)
      startProgress(1);
      if(edited==2){
        delete cost_item.id;
      }
      $ctrl.general_current_cost_item = cost_item;
      if (cost_item.id !== undefined) {
        budgetService.updateBudgetItem(cost_item.cost_type, cost_item)
          .then(function () {
            $ctrl.reloadData();
          });
      }
      else {
        budgetService.createBudgetItem(cost_item.cost_type, cost_item)
          .then(function () {
            $ctrl.reloadData();
          });
      }
    }

    function updateParent(cost_item, original_cost_total) {
      var parent = null;
      //calculate changes
      var change_cost_total = cost_item.cost_total - original_cost_total;

      if (change_cost_total === 0) {
        return;
      }

      //get parent cost
      angular.forEach($ctrl.budget.cost_items, function (item) {

        if (item.name === cost_item.parent_category && item.cost_type === 'general'&& item.id===cost_item.id) {

          parent = item;
        }
      });

      //remove parent if it goes below 0
      //save/update parent cost item
      if (parent) {
        //update parent cost based on the total changes
        parent.cost_total -= change_cost_total;
        $ctrl.parentCostTotal = parent.cost_total;
        if (parent.cost_total > 0) {
          budgetService.updateBudgetItem(parent.cost_type, parent)
            .then(function () {
              $ctrl.reloadData();
            });
        } else {
          budgetService.destroyBudgetItem(parent.cost_type, parent.id)
            .then(function () {
              $ctrl.reloadData();
            });
        }
      } else {
        //create new parent if change is < 0
        var new_general_cost_item = {
          'parent_budget': cost_item.parent_budget,
          'name': cost_item.parent_category,
          'cost_type': "general",
          'unit': ($ctrl.budget.income_items[0] === undefined || $ctrl.budget.income_items[0].farm_unit === undefined) ? "Total" : $ctrl.budget.income_items[0].farm_unit,
          'unit_quantity': 1.00,
          'farm_unit': $ctrl.budget.farm_unit,
          'farm_unit_quantity': 1.00,
          'cost_per_unit': 0.00,
          'cost_per_farm_unit': 0.00,
          'cost_total': 0.00,
        };

        new_general_cost_item.cost_total -= change_cost_total;
        if (new_general_cost_item.cost_total > 0) {
          budgetService.createBudgetItem(new_general_cost_item.cost_type, new_general_cost_item)
            .then(function () {
              $ctrl.reloadData();
            });
        }
      }

    }


    function removeItem(item_type, cost_item) {
      startProgress(1);

      if(item_type != 'general' && item_type != 'income'){
        var parent = null;
        angular.forEach($ctrl.budget.cost_items, function (item) {
          if (item.name === cost_item.parent_category && item.cost_type === 'general') {
            parent = item;
          }
        });

        if (parent) {
          parent.cost_total = parseFloat(parent.cost_total) + parseFloat(cost_item.cost_total);
          budgetService.updateBudgetItem(parent.cost_type, parent)
            .then(function () {
              $ctrl.reloadData();
            });
        } else {
          var new_general_cost_item = {
            'parent_budget': cost_item.parent_budget,
            'name': cost_item.parent_category,
            'cost_type': "general",
            'unit': ($ctrl.budget.income_items[0] === undefined || $ctrl.budget.income_items[0].farm_unit === undefined) ? "Total" : $ctrl.budget.income_items[0].farm_unit,
            'unit_quantity': 1.00,
            'farm_unit': $ctrl.budget.farm_unit,
            'farm_unit_quantity': $ctrl.budget.farm_unit_quantity,
            'cost_per_unit': 0.00,
            'cost_per_farm_unit': 0.00,
            'cost_total': 0.00,
          };
          new_general_cost_item.cost_total = parseFloat(new_general_cost_item.cost_total) + parseFloat(cost_item.cost_total);
          budgetService.createBudgetItem(new_general_cost_item.cost_type, new_general_cost_item)
            .then(function () {
              $ctrl.reloadData();
            });

        }

      }

      budgetService.destroyBudgetItem(item_type, cost_item.id)
        .then(function () {
          $ctrl.reloadData();
        });
    }

    function updateBudget() {

      if ($ctrl.budget.title !== undefined && !$ctrl.form.budgetTitle.$invalid) {
        startProgress(1);

        budgetService.updateBudget($ctrl.budget)
          .then(function (response) {
            $ctrl.reloadData();
          });
      }
      else {
        console.log("not update");
      }

    }


    function setCountyOptions(us_state, current) {
      var counties = [];
      angular.forEach($ctrl.region_data, function (region) {
        if (region.state == us_state || region.abbreviation == us_state) {
          counties = region.counties;
        }
      });

      //I removed this statment to stop any current region data that is not in the list of state counties from being pushed to the options.

      /*if (current !== undefined && counties.indexOf(current) == -1 && ) {
        counties.push(current);
      }*/
      return counties;
    }




    function validateBudgetTitle(){
      if($ctrl.form.budgetTitle === undefined){
        return
      }
      $ctrl.form.budgetTitle.$setValidity("unique", false);
      if($ctrl.university == 1){

        //Create array to test how many of the same title, used for when
        //you have no budgets and create a new one vs when you already have one
        //created with the same name.

        var duplicateNameArr = $ctrl.budgetTitleArr.filter(function(title){
              return title === $ctrl.budget.title;
        });
        if(duplicateNameArr.length === 1 && $ctrl.budget.title !== "" && $ctrl.budgetTitleArr.length >= 1)
          $ctrl.form.budgetTitle.$setValidity("unique", true);
        else if(duplicateNameArr !== 1  && $ctrl.budget.title !== "" && $ctrl.budget.title !== $ctrl.old_title && $ctrl.budgetTitleArr.indexOf($ctrl.budget.title) === -1)
          $ctrl.form.budgetTitle.$setValidity("unique", true);
      }
      else if($ctrl.university == null && $ctrl.budget.title === $ctrl.old_title ||
              $ctrl.budgetTitleArr.indexOf($ctrl.budget.title) === -1){
        $ctrl.form.budgetTitle.$setValidity("unique", true);
      }
    }

    function validateBudgetState(){
      if($ctrl.form.budgetState === undefined){
        return;
      }
      $ctrl.form.budgetState.$setValidity("unique", false);
      if($ctrl.budget.state.length){
        $ctrl.form.budgetState.$setValidity("unique", true);
      }
      //if the current region is not a county of this state set region to ""
      //console.log("current region:"+$ctrl.budget.region);
      //console.log($ctrl.budget.region.state);
      //setCountyOptions($ctrl.budget.state,$ctrl.budget.region)

    }


    function save() {
      startProgress(1);
      $ctrl.budget.temp = "False"
      $ctrl.onSave({budget: $ctrl.budget});
    }


    function discard() {
      budgetService.destroyBudget($ctrl.budget.id)
        .then(function (response) {
          $ctrl.onDiscard({budget: $ctrl.budget});
        });
    }

    /****************************************************************
     Private Helper Functions
     ****************************************************************/

    /*
        Retrieve necessary data for the budget editor dropdowns. Returns a promise once all requests have been resolved.
    */
    function populateDropdowns() {
      var requests = {
        'cost_categories': budgetService.retrieveBudgetCostCategories($ctrl.budget.enterprise, $ctrl.budget.descriptor1),
        'budget_cost_data': budgetService.retrieveBudgetCostData($ctrl.budget.enterprise),
        'region_data': commonService.retrieveRegionData(),
      };
      return $q.all(requests)
        .then(function (response) {
          $ctrl.cost_categories = response['cost_categories'].data;
          $ctrl.budget_cost_data = response['budget_cost_data'].data;
          $ctrl.region_data = response['region_data'].data;

          return $q.when({});
        });
    }


    /*
        Instantiates and opens a new modal for editing or creating a CostItem.
    */
    function openAddCostModal(cost_item, general_cost_item, editing) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: '/static/budget/budget-editor/add-cost-modal/add-cost-modal.html',
        controller: 'AddCostModalController',
        controllerAs: '$ctrl',
        resolve: {
          saveCost: function () {
            return $ctrl.saveCost;
          },
          updateParent: function () {
            return $ctrl.updateParent;
          },
          cost_categories: function () {
            return $ctrl.cost_categories;
          },
          budget_cost_data: function () {
            return $ctrl.budget_cost_data;
          },
          cost_item: function () {
            return cost_item;
          },
          general_cost_item: function () {
            return general_cost_item;
          },
          editing: function () {
            return editing;
          },
        },
      });
    }


    /*
        Instantiates and opens a new modal for editing or creating an IncomeItem.
    */
    function openAddIncomeModal(income_item, editing) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: '/static/budget/budget-editor/add-income-modal/add-income-modal.html',
        controller: 'AddIncomeModalController',
        controllerAs: '$ctrl',
        resolve: {
          saveIncome: function () {
            return $ctrl.saveIncome;
          },
          income_item: function () {
            return income_item;
          },
          editing: function () {
            return editing;
          },
        },
      });
    }


    /*
        Instantiates and opens a new modal for changing the Budget's farm_unit and farm_unit_quantity.
        Calls controller method to reload budget after the modal is closed.
    */
    function openBudgetUnitModal(budget) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: '/static/budget/budget-editor/budget-unit-modal/budget-unit-modal.html',
        controller: 'BudgetUnitModalController',
        controllerAs: '$ctrl',
        resolve: {
          budget: function () {
            return budget;
          },
        },
      });

      modal.closed.finally(function (result) {
        $ctrl.reloadData();
      });
    }

    function openBudgetHelpModal() {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: '/static/budget/budget-editor/budget-unit-modal/budget-help-modal.html',
      });
    }

    function openBudgetFormHelpModal() {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: '/static/budget/budget-editor/budget-unit-modal/budget-form-help-modal.html',
      });

    }


    function checkOtherExpense(cost_item, budget_cost_data) {
      var expense_name = "Other expense";

      budget_cost_data.forEach(function (cost_data) {
        if (cost_data.name == cost_item.name) {
          expense_name = cost_item.name;
        }
      });

      return expense_name;
    }


    /*
        Adds 'gold_standard_category' attribute containing the associated fixed and variable costs to each general
        CostItem in the given Budget.
    */
    function setCostItemCostData(budget, budget_cost_data) {
      angular.forEach(budget.cost_items, function (cost_item) {
        if (cost_item.cost_type == "general") {
          var expense_name = checkOtherExpense(cost_item, budget_cost_data);
          cost_item.gold_standard_category = $filter('filter')(budget_cost_data, {'name': expense_name})[0];
        }
      });

      return budget;
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
            $ctrl.budgetTitleArr = budget_title_list.map(function(budget){ return budget.title });
            validateBudgetTitle();
          }
        });
      });
    }


    /*
        Faux progress method.  Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function () {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }

  }

})();
