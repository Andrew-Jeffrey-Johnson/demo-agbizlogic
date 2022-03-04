'use strict';

class LoginView {

  constructor() {

  }


  loginValid() {
    // Tell Protractor not to look for AngularJS
    browser.ignoreSynchronization = true;
    
    browser.get("/login");
    element(by.id("id_username")).clear().sendKeys("admin");
    element(by.id("id_password")).clear().sendKeys("admin");
    element(by.id("login-button")).click();
  }
}

module.exports = new LoginView();
