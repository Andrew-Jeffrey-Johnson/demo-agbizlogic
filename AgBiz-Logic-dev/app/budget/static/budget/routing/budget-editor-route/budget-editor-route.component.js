(function () {
    'use strict';

    angular
        .module('budgetModule')
        .component('budgetEditorRoute', {
            templateUrl: "/static/budget/routing/budget-editor-route/budget-editor-route.component.html",
            controller: BudgetEditorRouteComponentController
        });


    /****************************************************************
     Controller
     ****************************************************************/

    BudgetEditorRouteComponentController.$inject = [
        '$scope',
        '$state',
        'budgetService',
    ];

    function BudgetEditorRouteComponentController(
        $scope,
        $state,
        budgetService) {
        var $ctrl = this;

        /****************************************************************
         Bindable Members
         ****************************************************************/

        // Methods
        $ctrl.$onInit = $onInit;
        $ctrl.onDiscard = onDiscard;
        $ctrl.onSave = onSave;

        // Budget
        $ctrl.id;

        // Routing
        $ctrl.expected_change = false;


        /****************************************************************
         Controller Methods
         ****************************************************************/

        function $onInit() {
            if ($state.params["budget"] === undefined || $state.params["budget"] < 1) {
                $ctrl.expected_change = true;
                $state.go("budget-manager");
            }
            else {
                $ctrl.budget = {
                    id: $state.params["budget"]
                };
                $scope.$on("$stateChangeStart", function (event) {
                    if ($ctrl.expected_change == false) {
                        event.preventDefault();
                        budgetService.retrieveBudget($ctrl.budget.id)
                            .then(function (budget_response) {
                                if (budget_response !== undefined &&
                                    budget_response.data !== undefined &&
                                    budget_response.data.source !== undefined &&
                                    budget_response.data.source != "0") {
                                    return budgetService.destroyBudget($ctrl.budget.id);
                                }
                            })
                            .then(function (response) {
                                if (response !== undefined) {
                                    $ctrl.expected_change = true;
                                    $state.go('budget-manager');
                                }
                            });
                    }
                });
            }
        }


        function onDiscard(budget) {
            $ctrl.expected_change = true;
            $state.go('budget-manager');
        }


        function onSave(budget) {
            $ctrl.expected_change = true;
            if (budget.source !== undefined && budget.source !== "0") {
                var old_id = budget.id;
                budget.id = parseInt(budget.source);
                budget.source = "0";
                budget.modified_date = new Date();

                budgetService.updateBudget(budget)
                    .then(function (response) {
                        var update_budget = response.data;
                        console.log(update_budget);
                        // the budget.id is changed, so the income/cost items of update_budget are different to budget
                        // remove the items of update_budget, then add new items from budget
                        angular.forEach(update_budget.income_items, function (incomeItem) {
                            budgetService.destroyBudgetItem("income", incomeItem.id);
                        });

                        angular.forEach(update_budget.cost_items, function (costItem) {
                            budgetService.destroyBudgetItem(costItem.cost_type, costItem.id);
                        });

                        angular.forEach(budget.income_items, function (incomeItem) {
                            incomeItem.parent_budget = update_budget.id;
                            budgetService.createBudgetItem("income", incomeItem);
                        });

                        angular.forEach(budget.cost_items, function (costItem) {
                            costItem.parent_budget = update_budget.id;
                            budgetService.createBudgetItem(costItem.cost_type, costItem);
                        });
                        budgetService.destroyBudget(old_id);
                    }).then(function () {
                    $state.go('budget-manager')
                });
            }
            else {
                budgetService.updateBudget(budget)
                    .then(function (response) {
                        $state.go('budget-manager');
                    });
            }
        }
    }

})();
