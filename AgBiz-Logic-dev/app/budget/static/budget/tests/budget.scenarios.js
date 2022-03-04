(function() {
  'use strict';

  describe("Budget Acceptance Tests", function() {
    var base_url,
        isAngular,
        selectDropdownByNum,
        authenticateUser,
        username,
        password;


    beforeEach(function() {
      base_url = "http://localhost:8000";
      username = "admin";
      password = "admin";



      // Pass false to test non-AngularJS pages
      isAngular = function(flag) {
        browser.ignoreSynchronization = !flag;
      };

      // Select option from dropdown element
      selectDropdownByNum = function(element, option_num) {
        if (option_num) {
          var options = element.all(by.tagName("option")).then(function(options) {
            options[option_num].click();
          });
        }
      };

      // Authenticate user
      authenticateUser = function() {
        isAngular(false);
        browser.get(base_url + "/login/");

        element(by.name("username")).clear().sendKeys(username);
        element(by.name("password")).clear().sendKeys(password);
        element(by.id("login-button")).click();
      };

    });

    beforeEach(function() {
      authenticateUser();
      browser.get(base_url + "/budget/");
      isAngular(true);
      browser.waitForAngular();
    });



    describe("Budget Manager", function() {

      it("should bring user to manager page", function() {
        expect(browser.getCurrentUrl()).toContain("budget-manager");
      });

    });



    describe("Budget Editor", function() {

      it("should bring user to budget editor page", function() {
        element.all(by.buttonText("Edit")).get(0).click();

        expect(browser.getCurrentUrl()).toContain("budget-editor");
      });
    });


  });


}());
