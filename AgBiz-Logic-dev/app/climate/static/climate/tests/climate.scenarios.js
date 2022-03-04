(function() {
  'use strict';

  describe("Climate Acceptance Tests", function() {
    var base_url,
        isAngular,
        selectDropdownByNum,
        username,
        password,
        max_budgets,
        select_new_budget_id,
        scenario_list_repeater,
        save_scenario_id,
        save_region_id,
        save_budget_id,
        save_impact_id,
        add_budget_id,
        save_variables_id,
        authenticateUser,
        clean;


    beforeEach(function() {
      base_url = "http://localhost:8000";
      username = "admin";
      password = "admin";
      max_budgets = 5;
      scenario_list_repeater = "scenario in manager.scenario_list";
      save_scenario_id = "scenario-save";
      select_new_budget_id = "select-new-budget";
      save_region_id = "save-region";
      save_impact_id = "save-impact";
      save_budget_id = "back";
      add_budget_id = "add-budget";
      save_variables_id = "save-variables";


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

      // Remove all existing scenarios
      clean = function() {
        authenticateUser();
        browser.get(base_url + "/climate/");
        isAngular(true);
        browser.waitForAngular();

        var list_before = element.all(by.repeater(scenario_list_repeater));
        list_before.count().then(function(count_before) {
          for (var i = 0; i < count_before; i++) {
            element.all(by.buttonText("Remove")).get(0).click();
            element.all(by.buttonText("Confirm")).get(0).click();
            browser.waitForAngular();
          }
        });
      };
    });


    it("should redirect to login page if not authenticated", function() {
      isAngular(false);
      browser.get(base_url + "/climate/");

      expect(browser.driver.getCurrentUrl()).toEqual(base_url + "/accounts/login/?next=/climate/");
    });


    it("should accept valid credentials", function() {
      isAngular(false);
      authenticateUser();
      browser.get(base_url + "/climate/");

      expect(browser.getCurrentUrl()).toEqual(base_url + "/climate/#/manager");
    });



    describe("Scenario Creation", function() {
      var count_before;

      beforeEach(function() {
        clean();
      });


      it("deletes all the scenarios", function() {
        var count_after = element.all(by.repeater(scenario_list_repeater)).count();

        expect(count_after).toEqual(0);
      });


      it("should proceed to next step after submitting form", function() {
        element(by.buttonText("Create New")).click();
        element(by.model("create.scenario.title")).clear().sendKeys("New Scenario");
        element(by.model("create.scenario.notes")).clear().sendKeys("New Scenario Notes");
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Add")).click();
        browser.waitForAngular();

        element(by.buttonText("Continue")).click();
        browser.waitForAngular();

        expect(browser.driver.getCurrentUrl()).toEqual(base_url + "/climate/#/region-select");
      });


      it("should remain on page if invalid form", function() {
        element(by.buttonText("Create New")).click();

        element(by.model("create.scenario.title")).clear().sendKeys("New Scenario");
        element(by.buttonText("Continue")).click();

        expect(browser.driver.getCurrentUrl()).toEqual(base_url + "/climate/#/create");
      });


      it("should hide 'add budget' option when max budgets reached", function() {
        element(by.buttonText("Create New")).click();
        for (i = 0; i < max_budgets; i++) {
          selectDropdownByNum(element(by.model("create.new_budget")), 1);
          element(by.buttonText("Add")).click();
          browser.waitForAngular();
        }
        expect(element(by.buttonText("Add")).isPresent()).toBeFalsy();
      });


      it("should remove budget from list if remove button is clicked", function() {
        element(by.buttonText("Create New")).click();
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Add")).click();
        browser.waitForAngular();
        element.all(by.buttonText("Remove")).get(0).click();
        element.all(by.buttonText("Confirm")).get(0).click();
        browser.waitForAngular();

        expect(element.all(by.repeater("climate_budget in create.scenario.climate_budgets")).count()).toEqual(0);
      });


      it("should display confirmation button for deleting budget from list", function() {
        element(by.buttonText("Create New")).click();
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Add")).click();
        browser.waitForAngular();
        element.all(by.buttonText("Remove")).get(0).click();

        expect(element(by.buttonText("Remove")).isPresent()).toEqual(false);
        expect(element.all(by.buttonText("Confirm")).get(0).isDisplayed()).toEqual(true);
        expect(element(by.buttonText("Cancel")).isPresent()).toEqual(true);
      });


      it("should remove the 'Confirm' button if 'Cancel' is clicked", function() {
        element(by.buttonText("Create New")).click();
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Add")).click();
        browser.waitForAngular();
        element.all(by.buttonText("Remove")).get(0).click();
        element.all(by.buttonText("Cancel")).get(0).click();

        expect(element(by.buttonText("Confirm")).isPresent()).toEqual(false);
        expect(element(by.buttonText("Cancel")).isPresent()).toEqual(false);
        expect(element.all(by.buttonText("Remove")).get(0).isDisplayed()).toEqual(true);
      });


      it("should not save WIP if user returns to manager", function() {
        element(by.buttonText("Create New")).click();
        element(by.model("create.scenario.title")).clear().sendKeys("New Scenario");
        element(by.model("create.scenario.notes")).clear().sendKeys("Notes");

        element(by.buttonText("Back")).click();
        element(by.buttonText("Create New")).click();
        var title = element(by.model("create.scenario.title")).getText();

        expect(title).toEqual("");
      });

    });



    describe("Budget Editor", function() {

      beforeEach(function() {
        clean();
        browser.get(base_url + "/climate/");
        isAngular(true);
        element(by.buttonText("Create New")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Edit")).click();
        browser.waitForAngular();
      });


      it("should add climate to title and notes", function() {
        element(by.id(save_budget_id)).sendKeys(protractor.Key.PAGE_DOWN);
        element(by.id(save_budget_id)).click();
        browser.waitForAngular();
        var new_budget = element.all(by.repeater("climate_budget in create.scenario.climate_budgets")).get(0);
        var new_budget_title = new_budget.element(by.binding("climate_budget.title")).getText();

        expect(new_budget_title).toContain("Climate");
      });

    });



    describe("Region Selection", function() {

      beforeEach(function() {
        clean();
        browser.get(base_url + "/climate/");
        isAngular(true);
        element(by.buttonText("Create New")).click();
        browser.waitForAngular();
        element(by.model("create.scenario.title")).clear().sendKeys("New Scenario");
        element(by.model("create.scenario.notes")).clear().sendKeys("Notes");
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Add")).click();
        browser.waitForAngular();
        element(by.buttonText("Continue")).click();
      });


      it("should not proceed if state is not selected", function() {
        element(by.id(save_region_id)).click();

        expect(browser.driver.getCurrentUrl()).toEqual(base_url + "/climate/#/region-select");
      });


      it("should proceed to next step if state is selected", function() {
        selectDropdownByNum(element(by.model("regionSelect.state")), 1);
        element(by.id(save_region_id)).click();
        browser.waitForAngular();

        expect(browser.driver.getCurrentUrl()).toEqual(base_url + "/climate/#/variable-select");
      });

    });



    describe("Variable Selection", function() {

      beforeEach(function() {
        clean();
        browser.get(base_url + "/climate/");
        isAngular(true);
        element(by.buttonText("Create New")).click();
        browser.waitForAngular();

        element(by.model("create.scenario.title")).clear().sendKeys("New Scenario");
        element(by.model("create.scenario.notes")).clear().sendKeys("Notes");
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Add")).click();
        browser.waitForAngular();
        element(by.buttonText("Continue")).click();

        selectDropdownByNum(element(by.model("regionSelect.state")), 1);
        element(by.id(save_region_id)).click();
        browser.waitForAngular();
      });


      it("should disable the save button if 3 variables are not selected", function() {
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();

        expect(element(by.id(save_variables_id)).getAttribute('disabled')).toEqual('true');
      });


      it("should proceed to next step if 3 variables are selected", function() {
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        element(by.id(save_variables_id)).click();
        browser.waitForAngular();

        expect(browser.driver.getCurrentUrl()).toEqual(base_url + "/climate/#/variable-impact");
      });

    });



    describe("Variable Impact", function() {

      beforeEach(function() {
        clean();
        browser.get(base_url + "/climate/");
        isAngular(true);
        element(by.buttonText("Create New")).click();
        browser.waitForAngular();
        element(by.model("create.scenario.title")).clear().sendKeys("New Scenario");
        element(by.model("create.scenario.notes")).clear().sendKeys("Notes");
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Add")).click();
        browser.waitForAngular();
        element(by.buttonText("Continue")).click();

        selectDropdownByNum(element(by.model("regionSelect.state")), 1);
        element(by.id(save_region_id)).click();
        browser.waitForAngular();

        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        element(by.id(save_variables_id)).click();
        browser.waitForAngular();
      });


      it("should disable continue button if invalid user estimate is entered", function() {
        var input_box = element(by.model("variableImpact.user_estimate"));
        // Too many decimals
        input_box.clear().sendKeys(20.9292);
        expect(element(by.id(save_impact_id)).isEnabled()).toBe(false);

        // Too many integers
        input_box.clear().sendKeys(2000.00);
        expect(element(by.id(save_impact_id)).isEnabled()).toBe(false);

        // Letters present
        input_box.clear().sendKeys("als;djf");
        expect(element(by.id(save_impact_id)).isEnabled()).toBe(false);
      });


      it("should go to the next state with valid input", function() {
        element(by.model("variableImpact.user_estimate")).clear().sendKeys(20.2);
        element(by.id(save_impact_id)).click();
        browser.waitForAngular();

        expect(browser.getCurrentUrl()).toEqual(base_url + "/climate/#/variable-impact");
      });

    });



    describe("Variable Total Impact", function() {
      var input_box,
          continue_button;

      beforeEach(function() {
        input_box = element(by.model("totalImpact.climate_budget.user_estimate"));
        continue_button = element(by.css('[ng-click="totalImpact.saveTotalImpact()"]'));
      });

      beforeEach(function() {
        clean();
        browser.get(base_url + "/climate/");
        isAngular(true);
        element(by.buttonText("Create New")).click();
        browser.waitForAngular();
        element(by.model("create.scenario.title")).clear().sendKeys("New Scenario");
        element(by.model("create.scenario.notes")).clear().sendKeys("Notes");
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Add")).click();
        browser.waitForAngular();
        element(by.buttonText("Continue")).click();

        selectDropdownByNum(element(by.model("regionSelect.state")), 1);
        element(by.id(save_region_id)).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        element(by.id(save_variables_id)).click();
        browser.waitForAngular();

        for (i = 0; i < 3; i++) {
          element(by.model("variableImpact.user_estimate")).clear().sendKeys(20.2);
          element(by.id(save_impact_id)).click();
          browser.waitForAngular();
        }
      });


      it("should disable continue button if invalid user estimate is entered", function() {
        // Too many decimals
        input_box.clear().sendKeys(20.9292);
        expect(continue_button.isEnabled()).toBe(false);

        // Too many integers
        input_box.clear().sendKeys(2000.00);
        expect(continue_button.isEnabled()).toBe(false);

        // Letters present
        input_box.clear().sendKeys("als;djf");
        expect(continue_button.isEnabled()).toBe(false);
      });


      it("should go to the next state with valid input", function() {
        input_box.clear().sendKeys(-22.0);
        continue_button.click();
        browser.waitForAngular();

        expect(browser.getCurrentUrl()).toContain("budget-editor");
      });


      it("should show pop up modal on submit with valid input", function() {
        input_box.clear().sendKeys(-30.2);
        continue_button.click();
        browser.waitForAngular();

        expect(element(by.id("climate_modal")).isDisplayed()).toEqual(true);
      });
    });



    // FIXME: Failing because of Jasmine async timeout
    describe("Budget Editor - Post Climate Impact", function() {

      beforeEach(function() {
        clean();
        browser.get(base_url + "/climate/");
        isAngular(true);
        element(by.buttonText("Create New")).click();
        browser.waitForAngular();

        element(by.model("create.scenario.title")).clear().sendKeys("New Scenario");
        element(by.model("create.scenario.notes")).clear().sendKeys("Notes");
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Add")).click();
        browser.waitForAngular();
        // Add two budgets in order to enter loop
        selectDropdownByNum(element(by.model("create.new_budget")), 1);
        element(by.buttonText("Add")).click();
        browser.waitForAngular();
        element(by.buttonText("Continue")).click();

        selectDropdownByNum(element(by.model("regionSelect.state")), 1);
        element(by.id(save_region_id)).click();
        browser.waitForAngular();

        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        element(by.id(save_variables_id)).click();
        browser.waitForAngular();

        for (i = 0; i < 3; i++) {
          element(by.model("variableImpact.user_estimate")).clear().sendKeys(20.2);
          element(by.id(save_impact_id)).click();
          browser.waitForAngular();
        }

        element(by.model("totalImpact.climate_budget.user_estimate")).clear().sendKeys(20.3);
        element(by.css('[ng-click="totalImpact.saveTotalImpact()"]')).click();
        browser.waitForAngular();
        element(by.id("ok")).click();
      });


      it("should have non budget item fields disabled", function() {
        var fields = [];

        fields.push(element(by.model("budgetEditor.budget.title")));
        fields.push(element(by.model("budgetEditor.budget.state")));
        fields.push(element(by.model("budgetEditor.budget.region")));
        fields.push(element(by.model("budgetEditor.budget.time_value")));
        fields.push(element(by.model("budgetEditor.budget.time_unit")));
        fields.push(element(by.model("budgetEditor.budget.notes")));

        for (i = 0; i < fields.length; i++) {
          expect(fields[i].getAttribute('disabled')).toEqual('true');
        }
      });


      it("should go to next state when submitted with remaining budgets", function() {
        element(by.id(save_budget_id)).sendKeys(protractor.Key.PAGE_DOWN);
        element(by.id(save_budget_id)).click();
        browser.waitForAngular();

        expect(browser.getCurrentUrl()).toContain("variable-select");
      });


      it("should go to summary state if submitted with no remaining budgets", function() {
        element(by.id(save_budget_id)).sendKeys(protractor.Key.PAGE_DOWN);
        element(by.id(save_budget_id)).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        selectDropdownByNum(element(by.id("select-factor")), 1);
        element(by.id("add-factor")).click();
        browser.waitForAngular();
        element(by.id(save_variables_id)).click();
        browser.waitForAngular();
        for (i = 0; i < 3; i++) {
          element(by.model("variableImpact.user_estimate")).clear().sendKeys(20.2);
          element(by.id(save_impact_id)).click();
          browser.waitForAngular();
        }
        element(by.model("totalImpact.climate_budget.user_estimate")).clear().sendKeys(20.3);
        element(by.css('[ng-click="totalImpact.saveTotalImpact()"]')).click();
        browser.waitForAngular();
        element(by.id("ok")).click();
        element(by.id(save_budget_id)).sendKeys(protractor.Key.PAGE_DOWN);
        element(by.id(save_budget_id)).click();
        browser.waitForAngular();

        expect(browser.getCurrentUrl()).toContain("summary");
      });
    });


  });

})();
