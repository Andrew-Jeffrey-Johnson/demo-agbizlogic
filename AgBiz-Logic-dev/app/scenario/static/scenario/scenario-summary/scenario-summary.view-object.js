"use strict"

var ViewObject = require("../../../../common/static/common/e2e-tests/view-objects/view-object.view-object.js");


class ScenarioSummaryView extends ViewObject {

  constructor() {
    super();
    this.proceed_button = $('[ng-click="$ctrl.proceed()"]');
    this.back_button = $('[ng-click="$ctrl.back()"]');
    this.plan_list = element(by.repeater("plan in $ctrl.plans"));
    this.scenario_title = element(by.binding("$ctrl.scenario.title"));
    this.chart_title = element(by.binding("$ctrl.chart_data[$ctrl.current_analysis_type].label"));
    this.profit_chart_tabs = element(by.repeater("analysis_type in $ctrl.chart_data"));
    this.module_selectors = {
      'profit': $('[ui-sref="module: \'profit\'"]'),
      'lease': $('[ui-sref="module: \'lease\'"]'),
      'finance': $('[ui-sref="module: \'finance\'"]'),
      'environment': $('[ui-sref="module: \'environment\'"]'),
    };
    this.loading_spinner = $('md-progress-circular');
    this.url = "http://localhost:8000/scenario/#/scenario-summary";
  }


  getScenarioTitle() {
    return this.scenario_title.getText();
  }


  getChartName() {
    return this.chart_title.getText();
  }
}

module.exports = new ScenarioSummaryView();
