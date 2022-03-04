'use strict';

class DashboardView {

  constructor() {
    // Tell Protractor to look for AngularJS
    browser.ignoreSynchronization = false;
  }


  /****************************************************************
                       Methods
  ****************************************************************/

  goToIncome() {
    element(by.css("[href='/income/']")).click();
  }

}

module.exports = new DashboardView();
