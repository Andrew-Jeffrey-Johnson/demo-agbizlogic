"use strict";

class ViewObject {

  constructor() {
    this.back_button;
    this.proceed_button;
  }


  goHere() {
    this.enableAngular();
    browser.get(this.url);
  }


  back() {
    if (this.back_button !== undefined) {
      this.back_button.click();
    }
  }


  proceed() {
    if (this.proceed_button !== undefined) {
      this.proceed_button.click();
    }
  }


  enableAngular() {
    // Tell Protractor not to look for AngularJS
    browser.ignoreSynchronization = false;
  }


  selectDropdownByNum(select_element, option_num) {
    if (option_num) {
      select_element.all(by.css("option"))
      .then(function(options) {
        options[option_num].click();
      });
    }
  };

}

module.exports = ViewObject;
