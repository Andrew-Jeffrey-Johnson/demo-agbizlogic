"use strict";

var ViewObject = require("../../../../../common/static/common/e2e-tests/view-objects/view-object.view-object.js");
var ConfirmButtonView = require("../../../../../common/static/common/confirm-button/confirm-button.view-object");


class BudgetUnitModalView extends ViewObject {

  constructor() {
    super();
    this.back_button = $('[ng-click="$ctrl.cancel()"]');
    this.save_button = new ConfirmButtonView();
    this.farm_unit_quantity = by.binding("$ctrl.farm_unit_quantity");
    this.farm_unit = by.binding("$ctrl.farm_unit");
    this.new_farm_unit_select = by.binding("$ctrl.new_farm_unit");
    this.new_farm_unit_quantity_input = by.binding("$ctrl.new_farm_unit_quantity");
  }


  save() {
    this.save_button.clickInitial();
    this.save_button.clickInitial();
  }
}

module.exports = new BudgetUnitModalView();
