'use strict';

class IndexView {

  constructor() {
    // Tell Protractor not to look for AngularJS
    browser.ignoreSynchronization = true;
  }


  /****************************************************************
                       Methods
  ****************************************************************/

  signUp() {
    element(by.css("[href='/account/']")).click();
  }


  logIn() {
    element(by.css("[href='/login/']")).click();
    element(by.id("id_username")).clear().sendKeys("johncleese");
    element(by.id("id_password")).clear().sendKeys("montypython2");
    element(by.id("login-button")).click();
  }


  logOut() {
    element(by.css(".dropdown-toggle")).click();
    element(by.css("[href='/logout/']")).click();
  }

}

module.exports = new IndexView();
