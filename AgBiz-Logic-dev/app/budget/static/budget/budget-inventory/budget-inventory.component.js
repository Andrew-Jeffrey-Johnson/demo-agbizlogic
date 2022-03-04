(function() {
  'use strict';

  angular
    .module("budgetModule")
    .component("budgetInventory", {
      templateUrl: "/static/budget/budget-inventory/budget-inventory.component.html",
      controller: BudgetInventoryController
    });



  /****************************************************************
                        Controller
  ****************************************************************/

  BudgetInventoryController.$inject = [
    "$state",
    "$interval",
    "$filter",
    "$window",
    "$uibModal",
    "budgetService",
    "commonService",
    "$http","$scope"
  ];

  function BudgetInventoryController(
    $state,
    $interval,
    $filter,
    $window,
    $uibModal,
    budgetService,
    commonService,
    $http,$scope) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.newBudget = newBudget;
    $ctrl.editBudget = editBudget;
    $ctrl.removeBudget = removeBudget;
    $ctrl.selectBudget = selectBudget;
    $ctrl.toggleSearch = toggleSearch;
    $ctrl.back = back;

    // User
    $ctrl.current_user;

    // Budget lists
    $ctrl.budget_list = [];
    $ctrl.university_budget_list = [];

    // Other
    $ctrl.budget_fields = "id,title,notes,enterprise,state,region,created_date,modified_date,income_items,cost_items,farm_unit_quantity,farm_unit,time_unit,time_value,total_variable_costs,total_fixed_costs,market";
    $ctrl.show_search = false;
    $ctrl.default_module_name = "allocate";
    $ctrl.loading = false;
    /****************************************************************
                      Methods
    ****************************************************************/

    function $onInit() {


      commonService.retrieveCurrentUser()
      .then(function(response) {
        $ctrl.current_user = response.data;

        return budgetService.generateBudgets();
      })
      .then(function() {
        return budgetService.listBudgets($ctrl.current_user.username, $ctrl.budget_fields, $ctrl.default_module_name);
      })
      .then(function(budget_list_response) {
        if (budget_list_response !== undefined &&
            budget_list_response.data !== undefined) {

        $ctrl.budget_list = budget_list_response.data;

          if ($state.params["view-university-budgets"] !== undefined &&
              $state.params["view-university-budgets"] === "true") {
            $ctrl.newBudget("university");
          }
        }

      });
    }

    function newBudget(budget_type) {
      if (budget_type === 'new') {

        openNewBudgetModal();
      }
      else if (budget_type === 'copy') {
        openCopyBudgetModal();
      }
      else if (budget_type === 'university') {
        if ($ctrl.university_budget_list.length == 0) {
          budgetService.listUniversityBudgets("id,title,enterprise,state,region")
          .then(function(university_budget_list_response) {
            if (university_budget_list_response !== undefined &&
                university_budget_list_response.data !== undefined &&
                university_budget_list_response.data.length !== undefined &&
                university_budget_list_response.data.length >= 0) {
              $ctrl.university_budget_list = university_budget_list_response.data;

              openUniversityBudgetModal($ctrl.university_budget_list);
            }
          });
        }
        else {
          openUniversityBudgetModal($ctrl.university_budget_list);
        }
      }
      else if (budget_type === 'combine') {
        openCombineBudgetsModal();
      }
    }


    function editBudget(budget) {
      if (budget !== undefined &&
          budget.id !== undefined &&
          budget.id > 0) {
        $ctrl.loading = true;

        budgetService.copyBudgetByID(budget.id)
        .then(function(copied_budget_response) {
          if (copied_budget_response !== undefined &&
              copied_budget_response.data !== undefined &&
              copied_budget_response.data.id !== undefined) {

            return budgetService.updateBudget(copied_budget_response.data);
          }
        })
        .then(function(updated_budget_response) {
          $ctrl.loading = false;

          if (updated_budget_response !== undefined) {
            $state.go("budget-editor", {
              'budget': updated_budget_response.data.id,
            });
          }
        });
      }
    }


    function removeBudget(budget) {
      if (budget !== undefined &&
          budget.id !== undefined) {
        startProgress(1);

        budgetService.destroyBudget(budget.id)
        .then(function() {
          return budgetService.listBudgets($ctrl.current_user.username, $ctrl.budget_fields, $ctrl.default_module_name);
        })
        .then(function(budget_list_response) {
          if (budget_list_response !== undefined &&
              budget_list_response.data !== undefined) {
            $ctrl.budget_list = budget_list_response.data;
          }
        });
      }
    }


    function selectBudget(budget) {
      if (budget !== undefined &&
          budget.id !== undefined &&
          budget.id > 0) {
        $ctrl.search_budget = budget;
      }
    }


    function toggleSearch() {
      $ctrl.show_search = !$ctrl.show_search;
    }


    function back() {
      $window.location.replace("/dashboard");
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Creates an instance of budget copy modal and opens it.
    */
    function openCopyBudgetModal() {
      $uibModal.open({
        animation: true,
        size: "lg",
        templateUrl: "/static/budget/budget-manager/copy-budget-modal/copy-budget-modal.html",
        controller: "CopyBudgetModalController",
        controllerAs: "$ctrl",
        resolve: {
          budget_list: function() {
            return $ctrl.budget_list;
          },
        },
      });
    }

     function openNewBudgetModal() {
      $uibModal.open({
        animation: true,
        size: "lg",
        templateUrl: "/static/budget/budget-manager/new-budget-modal/new-budget-modal.html",
        controller: "NewBudgetModalController",
        controllerAs: "$ctrl",
      });
    }


    /*
        Creates an instance of budget combine modal and opens it.
    */
    function openCombineBudgetsModal() {
      $uibModal.open({
        animation: true,
        size: "lg",
        templateUrl: "/static/budget/budget-manager/combine-budgets-modal/combine-budgets-modal.html",
        controller: "CombineBudgetsModalController",
        controllerAs: "$ctrl",
        resolve: {
          'budget_list': function() {
            return $ctrl.budget_list;
          },
        },
      });
    }


    /*
        Creates an instance of university budget modal and opens it. Is passed a list of university budgets.
    */
    function openUniversityBudgetModal(university_budget_list) {
      var modal_instance = $uibModal.open({
        animation: true,
        size: "lg",
        templateUrl: "/static/budget/budget-manager/university-budget-modal/university-budget-modal.html",
        controller: "UniversityBudgetModalController",
        controllerAs: "$ctrl",
        resolve: {
          'university_budget_list': function() {
            return university_budget_list;
          },
        },
      });

      modal_instance.result.then(function(new_budget_id) {
        $state.go("budget-editor", {
          'budget': new_budget_id,
        });
      });
    }


    /*
        Return a new budget object with default required fields.
    */
    function createNewDefaultBudget() {
      var budget = {
        'title': "New Budget",
        'state': "OR",
        "enterprise": "Crop"
      };

      return budget;
    }


    /*
        Faux progress method.  Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function() {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }

  }

})();
