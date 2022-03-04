"use strict";

describe("Full Plan Creation", function () {
  var plan_manager_view,
      login_view,
      plan_create_view,
      plan_time_period_view,
      plan_inflation_view;

  beforeEach(function () {
    plan_manager_view = require("../plan-manager/plan-manager.view-object.js");
    plan_create_view = require("../plan-create/plan-create.view-object.js");
    plan_time_period_view = require("../plan-time-period/plan-time-period.view-object.js");
    plan_inflation_view = require("../plan-inflation/plan-inflation.view-object.js");
    login_view = require("../../../../common/static/common/e2e-tests/view-objects/login-view.js");
  });


  it("Plan Manager view displays created Plans", function () {
    login_view.loginValid();
    plan_manager_view.goHere();

    expect(plan_manager_view.plan_list.count()).not.toEqual(0);
  });


  it("New Plan button goes to Plan Create view", function () {
    var url = browser.getCurrentUrl();
    plan_manager_view.createNewPlan();

    expect(plan_create_view.getTitle()).toEqual("");
    expect(plan_create_view.getNotes()).toEqual("      ");
    expect(browser.getCurrentUrl()).not.toEqual(url);
  });


  it("continue button is disabled if no Budgets have been added to Plan", function () {
    expect(plan_create_view.proceed_button.isEnabled()).toBe(false);
  });


  it("can add new Budgets to the Plan", function () {
    plan_create_view.addBudget();

    expect(plan_create_view.budget_list.count()).toEqual(1);
  });


  it("continue button goes to plan time period view", function () {
    var url = browser.getCurrentUrl();
    plan_create_view.proceed();

    expect(browser.getCurrentUrl()).not.toEqual(url);
  });


  it("plan time period view displays all Budgets in the Plan", function () {
    expect(plan_time_period_view.budget_list.count()).toEqual(1);
  });


  it("continue button goes to plan inflation rate view", function () {
    var url = browser.getCurrentUrl();
    plan_time_period_view.proceed();

    expect(browser.getCurrentUrl()).not.toEqual(url);
  });

});
