"use strict";

var ViewObject = require("../../../../common/static/common/e2e-tests/view-objects/view-object.view-object.js");


class ScenarioCreateView extends ViewObject {

  constructor() {
    super();
    this.proceed_button = element(by.css('[ng-click="$ctrl.proceed()"]'));
    this.back_button = element(by.css('[ng-click="$ctrl.confirm = true"]'));
    this.delete_button = element(by.css('[ng-click="$ctrl.onConfirm()"]'));
    this.plan_list = element.all(by.repeater("item in $ctrl.itemList track by $index"));
    //console.log(this.plan_list);
  }


  back() {
    this.back_button.click();
    this.delete_button.click();
  }

}

module.exports = new ScenarioCreateView();
