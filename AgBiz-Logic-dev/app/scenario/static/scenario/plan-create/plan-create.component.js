(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("planCreate", planCreate());

  function planCreate() {
    var component = {
      templateUrl: "/static/scenario/plan-create/plan-create.component.html",
      controller: PlanCreateComponentController,
    };

    return component;
  }


  /****************************************************************
                       Controller
  ****************************************************************/

  PlanCreateComponentController.$inject = [
    '$scope',
    '$state',
    '$q',
    '$interval',
    '$uibModal',
    'scenarioService',
    'commonService',
    'modalService',
    'budgetService',
  ];

  function PlanCreateComponentController(
    $scope,
    $state,
    $q,
    $interval,
    $uibModal,
    scenarioService,
    commonService,
    modalService,
    budgetService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.updatePlan = updatePlan;
    $ctrl.updatePlanBudgets = updatePlanBudgets;
    $ctrl.addPlanBudget = addPlanBudget;
    $ctrl.addUniversityBudget = addUniversityBudget;
    $ctrl.removePlanBudget = removePlanBudget;
    $ctrl.editBudget = editBudget;
    $ctrl.validatePlanTitle = validatePlanTitle;
    $ctrl.proceed = proceed;
    $ctrl.cancel = cancel;
    $ctrl.save = save;
    $ctrl.is_new = false;

    // User
    $ctrl.user;

    // Plan data
    $ctrl.plan;
    $ctrl.max_budgets = 365;


    // Budget select
    $ctrl.module;
    $ctrl.user_budgets = [];
    $ctrl.university_budget_list = [];
    $ctrl.current_budget;

    // Errors
    $ctrl.budgets_needed = false;
    $ctrl.budgets_allowed = true;

    // title validity
    $ctrl.planTitleArr = [];

    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {

      $ctrl.is_new = $state.params['new'] === "true";

      var plan_id = $state.params['plan'];

      $ctrl.module = $state.params['module'];

      if (plan_id === undefined || plan_id < 1) {


        $state.go("planManager",{module:$ctrl.module});
      }
      else {

        scenarioService.retrievePlan(plan_id, ["id", "title", "notes", "plan_budgets", "created_date", "modified_date"])
        .then(function(plan_response) {
          if (plan_response === undefined ||
              plan_response.data === undefined ||
              plan_response.data.id === undefined ||
              plan_response.data.plan_budgets === undefined) {
            $state.go("planManager",{module:$ctrl.module});
          }
          else {

            $ctrl.plan = sortPlanBudgets(plan_response.data);
            checkErrors();
            if ($ctrl.plan.title === 'New Plan') {
              $ctrl.plan.title = "";
              $ctrl.old_title = "";
              $ctrl.form.name.$setValidity("notempty", false);
              //$ctrl.form.name.$setValidity("unique", true);
            }else {
              $ctrl.old_title = $ctrl.plan.title;
              //$ctrl.form.name.$setValidity("notempty", true);
              //$ctrl.form.name.$setValidity("unique", true);
            }
            return commonService.retrieveCurrentUser();
          }
        })
        .then(function(current_user_response) {
          if (current_user_response === undefined ||
              current_user_response.data === undefined ||
              current_user_response.data.id === undefined ||
              current_user_response.data.id < 0) {

            $state.go("planManager",{module:$ctrl.module});
          }
          else {
            $ctrl.user = current_user_response.data;

            return budgetService.listBudgets($ctrl.user.username);
          }
        })
        .then(function(budget_list_response) {
          if (budget_list_response === undefined ||
              budget_list_response.data === undefined ||
              budget_list_response.data.length < 1) {
            modalService.alert("Error retrieving your budgets. Check to make sure you have budgets in the budget manager.");
            $state.go("planManager",{module : $ctrl.module});
          }
          else {
            $ctrl.user_budgets = budget_list_response.data;
            retrievePlanNameList();

            return budgetService.listUniversityBudgets("id,title,enterprise,state,region");
          }
        })
        .then(function(university_budget_list_response) {
          if (university_budget_list_response !== undefined &&
              university_budget_list_response.data !== undefined &&
              university_budget_list_response.data.length !== undefined &&
              university_budget_list_response.data.length >= 0) {
            $ctrl.university_budget_list = university_budget_list_response.data;
          }
        });
      }

    }
    function save (){
      $state.go("planManager",{module: "plan"});
    }


    function updatePlan(plan) {
      if (plan !== undefined &&
          plan.id !== undefined &&
          plan.title !== undefined && plan.title.length !== 0) {
        scenarioService.updatePlan(plan)
        .then(function(updated_plan_response) {
          if (updated_plan_response !== undefined &&
              updated_plan_response.data !== undefined &&
              updated_plan_response.data.id !== undefined) {
            $ctrl.plan = sortPlanBudgets(updated_plan_response.data);
          }
        });
      }
      else {
        console.log("not updated");
      }
    }


    function updatePlanBudgets(plan_budgets) {
      if (plan_budgets !== undefined && plan_budgets.length > 0) {
        var changed_plan_budgets = plan_budgets.map(function(plan_budget, index) {
          plan_budget.position = index;

          return plan_budget;
        });

        var requests = changed_plan_budgets.map(function(changed_plan_budget) {
          return scenarioService.updatePlanBudget(changed_plan_budget);
        });
        $q.all(requests)
        .then(function(responses) {
          if (responses !== undefined) {
            return scenarioService.retrievePlan($ctrl.plan.id, ["id", "title", "notes", "plan_budgets"]);
          }
        })
        .then(function(plan_response) {
          if (plan_response !== undefined && plan_response.data !== undefined) {
            $ctrl.plan = sortPlanBudgets(plan_response.data);
          }
        });
      }
    }


    function addPlanBudget(budget) {
      if (budget !== undefined &&
          budget.id !== undefined &&
          budget.id > 0 &&
          $ctrl.budgets_allowed === true) {
        startProgress(1);
        $ctrl.is_new = $state.params['new'] === "true";

        scenarioService.generatePlanBudget($ctrl.plan.id, budget.id, $ctrl.module)
        .then(function() {
          return scenarioService.retrievePlan($ctrl.plan.id);
        })
        .then(function(retrieved_plan_response) {
          $ctrl.plan = sortPlanBudgets(retrieved_plan_response.data);

          checkErrors();
        });
      }
    }


    function addUniversityBudget(id) {
      if (id !== undefined && id > 0) {
        budgetService.createFromUniversityBudget(id,$ctrl.module)
        .then(function(budget_response) {
          if (budget_response !== undefined && budget_response.data !== undefined) {
            $ctrl.addPlanBudget(budget_response.data);
          }
        });
      }
    }


    function removePlanBudget(plan_budget) {
      startProgress(1);
$ctrl.is_new = $state.params['new'] === "true";
      budgetService.destroyBudget(plan_budget.budget)
      .then(function() {
        return scenarioService.retrievePlan($ctrl.plan.id);
      })
      .then(function(retrieved_plan_response) {
        $ctrl.plan = sortPlanBudgets(retrieved_plan_response.data);

        checkErrors();
      });
    }


    function editBudget(budget) {
      checkErrors();
      if ($ctrl.budgets_allowed == true &&
          budget !== undefined &&
          budget.id !== undefined &&
          budget.id > 0) {
        startProgress(1);
        $ctrl.is_new = $state.params['new'] === "true";

        scenarioService.generatePlanBudget($ctrl.plan.id, budget.id, $ctrl.module)
        .then(function(new_plan_budget_response) {
          if (new_plan_budget_response !== undefined &&
              new_plan_budget_response.data !== undefined &&
              new_plan_budget_response.data.budget !== undefined &&
              new_plan_budget_response.data.budget > 0) {
            return budgetService.retrieveBudget(new_plan_budget_response.data.id);
          }
        })
        .then(function(budget_response) {
          if (budget_response !== undefined &&
              budget_response.data !== undefined) {
            $state.go("budgetEditor", {'budget': budget_response.data.id});
          }
        });
      }
    }


    function validatePlanTitle() {
      var new_title = $ctrl.plan.title;

      if (new_title !== undefined && new_title.length !== '' && new_title === $ctrl.old_title) {
        $ctrl.form.name.$setValidity("unique", true);
        $ctrl.form.name.$setValidity("notempty", true);
      }
      else if ( new_title !== undefined && new_title.length !== '' && $ctrl.planTitleArr.indexOf(new_title) === -1 ) {
        $ctrl.form.name.$setValidity("unique", true);
        $ctrl.form.name.$setValidity("notempty", true);
      }
      else if ( new_title === undefined || new_title.length === '' ) {
        $ctrl.form.name.$setValidity("notempty", false);
        $ctrl.form.name.$setValidity("unique", true);
      }
      else {
        $ctrl.form.name.$setValidity("notempty", true);
        $ctrl.form.name.$setValidity("unique", false);
      }

      console.log($ctrl.form.$valid);
    }


    function proceed() {
      checkErrors();
        console.log($ctrl.plan.plan_budgets);


      if ($ctrl.budgets_needed === false) {
        startProgress(3);
        $ctrl.new=false;
        console.log($ctrl.new)

        scenarioService.updatePlan($ctrl.plan)
        .then(function() {
          $state.go("planTimePeriod", {'plan': $ctrl.plan.id, 'module': $ctrl.module});
        });
      }
    }


    function cancel() {
      startProgress(1);
      $ctrl.is_new = $state.params['new'] === "true";

      angular.forEach($ctrl.plan.plan_budgets, function(plan_budget) {
        budgetService.destroyBudget(plan_budget.budget);
      });

      scenarioService.destroyPlan($ctrl.plan.id)
      .then(function() {
        $state.go("planManager",{'module':$ctrl.module});
      });
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Checks for errors and if the plan budget list has reached the limit.
    */
    function checkErrors() {
      $ctrl.budgets_needed = false;
      $ctrl.budgets_allowed = true;

      if ($ctrl.plan.plan_budgets !== undefined && $ctrl.plan.plan_budgets.length === 0) {
        $ctrl.budgets_needed = true;
      }
      if ($ctrl.plan.plan_budgets !== undefined && $ctrl.plan.plan_budgets.length >= $ctrl.max_budgets) {
        $ctrl.budgets_allowed = false;
      }
    }


    /*
        Sorts the plan's plan budgets based on their 'position' field.
   */
    function sortPlanBudgets(plan) {
      plan.plan_budgets = plan.plan_budgets.sort(function(first, second) {
        return (first.position > second.position ? 1 : -1);
      });
      return plan;
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
        Faux progress method. Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      // FIXME: Find better way to recalculate sidenav height when new elements are added
      $scope.$emit("$stateChangeSuccess");

      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function() {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }


    function retrievePlanNameList() {
      var plan_title_list;

      scenarioService.listPlans($ctrl.user.username, "all", ["title"])
      .then(function(plan_title_list_response) {
        if (plan_title_list_response !== undefined &&
            plan_title_list_response.data !== undefined) {
          plan_title_list = plan_title_list_response.data;
          $ctrl.planTitleArr = plan_title_list.map(function(plan){ return plan.title });
        }
      });
    }

  }

}());
