(function() {
  'use strict';

  describe("Full run test, from account creation to budget creation", function() {
    var base_url,
        indexView,
        adminView,
        signupView,
        loginView,
        incomeView,
        dashboardView;

    beforeAll(function() {
      base_url = "http://localhost:8000/";
      indexView = require('./view-objects/index-view.js');
      adminView = require('./view-objects/admin-view.js');
      signupView = require('./view-objects/signup-view')
      loginView = require('./view-objects/login-view.js');
      incomeView = require('./view-objects/income-view.js');
      dashboardView = require('./view-objects/dashboard-view.js');
    });



    describe("Account Creation", function() {

      beforeAll(function() {
        browser.get(base_url);
      });


      afterAll(function() {
        // Remove test user
        adminView.removeTestUser();
      });


      it("should navigate to sign up view when 'Sign up' button is clicked from index", function() {
        indexView.signUp();

        expect(browser.getCurrentUrl()).toContain("account")
      });


      it("should proceed to second step with valid input", function() {
        signupView.completeFirstStepValid();

        expect(signupView.getCurrentStep()).toEqual(2);
      });


      it("should proceed to the third step with valid input", function() {
        signupView.completeSecondStepValid();

        expect(signupView.getCurrentStep()).toEqual(3);
      });


      it("should go to dashboard after summary step", function() {
        signupView.completeThirdStepValid();

        expect(browser.getCurrentUrl()).toContain("dashboard");
      });


      it("should return to index after logging out", function() {
        browser.get(base_url);
        indexView.logOut();

        expect(browser.getCurrentUrl()).toContain("index");
      });


      it("should go to dashboard after logging in", function() {
        indexView.logIn();

        expect(browser.getCurrentUrl()).toContain("dashboard");
      });

    });



    describe("Income Collection", function() {

      beforeAll(function() {
        browser.get(base_url);
        // Create new test user
        signupView.completeAllStepsValid();
        indexView.logOut();
      });


      afterAll(function() {
        // Remove test user
        adminView.removeTestUser();
      });


      it("should be able to navigate to income select view from dashboard", function() {
        indexView.logIn();
        dashboardView.goToIncome();

        expect(browser.getCurrentUrl()).toContain("income");
      });


      it("should display Form 1040 year selection if option is selected", function() {
        incomeView.chooseScheduleF();

        expect(browser.getCurrentUrl()).toContain("form1040");
      });


      it("should display income form after valid year is chosen", function() {
        incomeView.chooseYear();

        expect(element(by.id("id_step2-gross_income")).isPresent()).toEqual(true);
      });


      it("should display expenses form after valid input for income form", function() {
        incomeView.completeScheduleFIncomeValid();

        expect(element(by.id("id_step3-total_expenses")).isPresent()).toEqual(true);
      });


      it("should display summary page after valid input for expenses", function() {
        incomeView.completeScheduleFExpensesValid();

        expect(incomeView.summary_net_returns.isPresent()).toEqual(true);
      });


      it("should return to dashboard after completing all steps", function() {
        incomeView.completeScheduleFSummary();

        expect(browser.getCurrentUrl()).toContain("dashboard");
      });


      it("should display file upload selection if option is selected", function() {
        browser.get(base_url + "income");
        incomeView.chooseImportData();

        expect(browser.getCurrentUrl()).toContain("upload");
      });

    });

  });

}());
