"use strict";

var ViewObject = require("../../../../common/static/common/e2e-tests/view-objects/view-object.view-object.js");


class PlanCreateView extends ViewObject {

  constructor() {
    super();
    this.title = element(by.model("$ctrl.plan.title"));
    this.notes = element(by.model("$ctrl.plan.notes"));
    this.budget_select = element(by.model("$ctrl.budget"));
    this.budget_list = element.all(by.css("manager-list-item"));
    this.proceed_button = element(by.css('[ng-click="$ctrl.proceed()"]'));
    this.back_button = element(by.css('[ng-click="$ctrl.back()"]'));
  }


  getTitle() {
    return this.title.getText();
  }


  setTitle(new_title) {
    this.title.sendKeys(new_title);
  }


  getNotes() {
    return this.notes.getText();
  }


  setNotes(new_notes) {
    this.notes.sendKeys(new_notes);
  }


  addBudget() {
    super.selectDropdownByNum(this.budget_select, 1);
    element(by.css('[ng-click="$ctrl.onAdd({item: $ctrl.new_budget})"]')).click();
  }

}

module.exports = new PlanCreateView();
