"use strict";

var ViewObject = require("../../../../common/static/common/e2e-tests/view-objects/view-object.view-object.js");


class PlanTimePeriodView extends ViewObject {

  constructor() {
    super();
    this.proceed_button = element(by.css('[ng-click="$ctrl.proceed()"]'));
    this.back_button = element(by.css('[ng-click="$ctrl.back()"]'));
    this.budget_list = element.all(by.repeater("plan_budget in $ctrl.plan.plan_budgets"));
  }

}

module.exports = new PlanTimePeriodView();
