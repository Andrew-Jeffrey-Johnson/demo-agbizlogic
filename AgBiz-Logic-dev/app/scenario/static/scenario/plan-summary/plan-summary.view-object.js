"use strict"

var ViewObject = require("../../../../common/static/common/e2e-tests/view-objects/view-object.view-object.js");


class PlanSummaryView extends ViewObject {

    constructor() {
        super();
        this.plan_title = element(by.binding("$ctrl.plan.title"));
        this.plan_notes = element(by.binding("$ctrl.plan.notes"));
        this.plan_budget_list = element(by.repeater("plan_budget in $ctrl.plan.plan_budgets"));
    }


    viewPlanBudgetDetail(index) {
        this.plan_budget_list.then(function(plan_budgets) {
            plan_budgets[index].click();
        });
    }
}

module.exports = new PlanManagerView();
