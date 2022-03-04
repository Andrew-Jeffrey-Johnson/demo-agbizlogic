'use strict';

class SignupView {

  constructor() {
    // Tell Protractor not to look for AngularJS
    browser.ignoreSynchronization = true;
  }


  /****************************************************************
                       Methods
  ****************************************************************/

  getCurrentStep() {
    var step = protractor.promise.defer();

    element(by.id("id_step1-username")).isPresent()
    .then(function(element_present) {
      if (element_present == true) {
        step.fulfill(1);
      }
    });
    element(by.id("id_step2-name")).isPresent()
    .then(function(element_present) {
      if (element_present == true) {
        step.fulfill(2);
      }
    });
    element(by.id("terms-link")).isPresent()
    .then(function(element_present) {
      if (element_present == true) {
        step.fulfill(3);
      }
    });

    return step.promise;
  }


  completeFirstStepValid() {
    element(by.id("id_step1-username")).clear().sendKeys("johncleese");
    element(by.id("id_step1-first_name")).clear().sendKeys("John");
    element(by.id("id_step1-last_name")).clear().sendKeys("Cleese");
    element(by.id("id_step1-email")).clear().sendKeys("johncleese@holygrail.com");
    element(by.id("id_step1-password1")).clear().sendKeys("montypython2");
    element(by.id("id_step1-password2")).clear().sendKeys("montypython2");

    element(by.css("[value='Continue']")).click();
  }


  completeSecondStepValid() {
    element(by.id("id_step2-name")).clear().sendKeys("Monty Python and the Flying Circus");
    element(by.id("id_step2-address1")).clear().sendKeys("NonsenseLand");
    element(by.id("id_step2-zipcode")).clear().sendKeys("97331");
    this.selectDropdownByNum(element(by.id("id_step2-industry")), 1);
    this.selectDropdownByNum(element(by.id("id_step2-primary_business")), 1);
    element(by.id("id_step2-city")).clear().sendKeys("Corvallis");
    this.selectDropdownByNum(element(by.id("id_step2-state")), 1);

    element(by.css("[value='Continue']")).sendKeys(protractor.Key.PAGE_DOWN);
    element(by.css("[value='Continue']")).click();
  }


  completeThirdStepValid() {
    browser.sleep(100);
    element(by.css("[value='Create account']")).sendKeys(protractor.Key.PAGE_DOWN);
    element(by.css("[value='Create account']")).click();
  }


  completeAllStepsValid() {
    browser.get("http://localhost:8000/account/");
    this.completeFirstStepValid();
    this.completeSecondStepValid();
    this.completeThirdStepValid();
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


module.exports = new SignupView();
