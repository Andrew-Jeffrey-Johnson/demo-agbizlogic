"use strict";

var ViewObject = require("../../../../common/static/common/e2e-tests/view-objects/view-object.view-object.js");


class ConfirmButtonView extends ViewObject {

  constructor() {
    this.initial_button = $('[ng-click="$ctrl.confirm = true"]');
    this.confirm_button = $('[ng-click="$ctrl.onConfirm()"]');
    this.cancel_button = $('[ng-click="$ctrl.confirm = false"]');
  }


  isDisabled() {

  }


  clickInitial() {
    this.initial_button.click();
  }


  clickConfirm() {
    this.confirm_button.click();
  }


  clickCancel() {
    this.cancel_button.click();
  }
}

module.exports = ConfirmButtonView;