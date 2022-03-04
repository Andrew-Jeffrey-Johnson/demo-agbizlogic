'use strict';

class IncomeView {

  constructor() {
    // Tell Protractor not to look for AngularJS
    browser.ignoreSynchronization = true;

    this.summary_net_returns = element(by.id("id_step4-net_returns"));
  }


  /****************************************************************
                       Methods
  ****************************************************************/

  chooseScheduleF() {
    element.all(by.css(".icons")).get(0).click();
    element(by.css("[value='Continue']")).click();
  }


  chooseImportData() {
    element.all(by.css(".icons")).get(1).click();
    element(by.css("[value='Continue']")).click();
  }


  chooseYear() {
    this.selectDropdownByNum(element(by.id("id_step1-year")), 1);
    element(by.css("[type='submit']")).click();
  }


  completeScheduleFIncomeValid() {
    element(by.id("id_step2-gross_income")).clear().sendKeys(2000);
    element(by.css("[type='submit']")).click();
  }


  completeScheduleFExpensesValid() {
    element(by.id("id_step3-total_expenses")).sendKeys(protractor.Key.PAGE_DOWN);
    element(by.id("id_step3-total_expenses")).clear().sendKeys(100);
    element(by.css("[type='submit']")).click();
  }


  completeScheduleFSummary() {
    element(by.css("[type='submit']")).sendKeys(protractor.Key.PAGE_DOWN);
    element.all(by.css("[type='submit']")).get(1).click();
    browser.sleep(5000);
  }


  /****************************************************************
                       Private Helper Functions
  ****************************************************************/

  // Select option from dropdown element
  selectDropdownByNum(element, option_num) {
    if (option_num) {
      var options = element.all(by.tagName("option")).then(function(options) {
        options[option_num].click();
      });
    }
  }

}

module.exports = new IncomeView();
