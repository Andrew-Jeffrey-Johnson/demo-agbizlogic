"use strict"

var ViewObject = require("../../../../common/static/common/e2e-tests/view-objects/view-object.view-object.js");


class PlanManagerView extends ViewObject {

  constructor() {
    super();
    this.new_plan_button = $('[ng-click="$ctrl.newPlan()"]');
    this.plan_list = element.all(by.css("manager-list-item"));
    this.url = "http://localhost:8000/scenario/#/plan-manager";
  }


  createNewPlan() {
    super.enableAngular();
    this.new_plan_button.click();
  }

}

module.exports = new PlanManagerView();
