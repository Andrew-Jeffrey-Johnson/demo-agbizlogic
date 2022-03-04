'use strict';

class AdminView {

  constructor() {
    // Tell Protractor not to look for AngularJS
    browser.ignoreSynchronization = true;
  }


  /****************************************************************
                       Methods
  ****************************************************************/

  loginValid() {
    browser.get("http://localhost:8000/admin/");
    browser.sleep(2000);
    element(by.id("id_username")).clear().sendKeys("admin");
    element(by.id("id_password")).clear().sendKeys("admin");
    element(by.css("[value='Log in']")).click();
  }


  logout() {
    element(by.css("[href='/admin/logout/']")).click();
  }


  removeTestUser() {
    this.loginValid();
    element.all(by.css("[href='/admin/auth/user/']")).get(1).click();
    element.all(by.css(".action-select")).get(2).click();
    this.selectDropdownByNum(element(by.css("[name='action']")), 1);
    element(by.css("[title='Run the selected action']")).click();
    element(by.css("[type='submit']")).click();
    this.logout();
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

module.exports = new AdminView();
