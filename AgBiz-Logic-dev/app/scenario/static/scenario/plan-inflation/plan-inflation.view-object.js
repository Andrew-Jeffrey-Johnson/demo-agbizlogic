"use strict";

var ViewObject = require("../../../../common/static/common/e2e-tests/view-objects/view-object.view-object.js");


class PlanInflationView extends ViewObject {

  constructor() {
    super();
    this.proceed_button = element(by.css('[ng-click="$ctrl.proceed()"]'));
    this.back_button = element(by.css('[ng-click="$ctrl.back()"]'));
    this.income_inflation_items = element(by.css('[ng-show="$ctrl.budget_item_type == \'Income\'"]')).all(by.css("inflation-item"));
    this.expenses_inflation_items = element(by.css('[ng-show="$ctrl.budget_item_type == \'Expenses\'"]')).all(by.css("inflation-item"));
    this.previous_budget_button = element(by.css('[ng-click="$ctrl.previousBudget()"]'));
  }


  viewPreviousBudget() {
    this.previous_budget_button.click();
  }

}

module.exports = new PlanInflationView();
