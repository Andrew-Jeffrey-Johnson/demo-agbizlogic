(function () {
  'use strict';

  angular
    .module("scenarioModule")
    .run(function ($rootScope) {
      $rootScope.typeOf = function (value) {
        return typeof value;
      };
    })
    .directive('stringToNumber', function () {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
          ngModel.$parsers.push(function (value) {
            return '' + value;
          });
          ngModel.$formatters.push(function (value) {
            value = parseFloat(value).toFixed(1).toString();

            return parseFloat(value);
          });
        }
      };
    })
    .component("profitSummary", {
      templateUrl: "/static/scenario/profit-summary/profit-summary.component.html",
      controller: ProfitSummaryComponentController,
      bindings: {
        'plan': '<',
        'onChange': '&',
        'scenario': '<',
      }
    });


  /****************************************************************
   Controller
   ****************************************************************/

  ProfitSummaryComponentController.$inject = [
    '$state',
    '$q',
    'scenarioService',
    'lineChartColors',
    'commonService',
    '$window',
    '$timeout'
  ];

  function ProfitSummaryComponentController(
    $state,
    $q,
    scenarioService,
    lineChartColors,
    commonService,
    $window,
    $timeout) {
    var $ctrl = this;

    /****************************************************************
     Bindable Members
     ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.proceed = proceed;
    $ctrl.back_manager = back_manager;
    $ctrl.back = back;
    $ctrl.numberWithCommas = numberWithCommas;
    $ctrl.return_dashboard = return_dashboard;
    $ctrl.expandChart = expandChart;
    $ctrl.shrinkChart = shrinkChart;
    $ctrl.loadBudget=loadBudget;
    $ctrl.budget_list=null;
    $ctrl.notes=null
    $ctrl.edited;

    // Scenario
    $ctrl.scenario;
    $ctrl.plans;
    $ctrl.module;
    $ctrl.from_profit;
    $ctrl.summary_title = "AgBizProfit Analysis";
    $ctrl.checkTitlelength = checkTitlelength;

    // Chart
    var plan_number = 1;
    var plan_data = "";
    $ctrl.title_number = 0;
    $ctrl.selected = false;
    $ctrl.expand = "";


    $ctrl.results_format = "graph";
    $ctrl.current_analysis_type = "net_present_value";
    $ctrl.chart_data;
    $ctrl.chartDataURL = [];
    $ctrl.chart = {
      'width': 1000,
      'spacing': 0,
      'lineChartColors': [],
    };


    $ctrl.line_options = {
      barValueSpacing: $ctrl.chart.spacing,
      maintainAspectRatio: false,
      responsive: true,
      legend: {display: true},
      elements: {line: {fill: false}},
      scales: {
        yAxes: [{
          scaleLabel: {display: true, labelString: "Returns ($)"}
        }
        ],
        xAxes: [{
          scaleLabel: {display: true, labelString: "Time Period (Years)"}

        }]
      }
    };

    $ctrl.net_present_value_options = {
      legend:{display:true, position: 'bottom',fullWidth: true},
      barValueSpacing: $ctrl.chart.spacing,
      maintainAspectRatio: false,
      responsive: true,

      scales: {

              xAxes: [{
                  ticks: {
                      callback: function(tick) {
                          var characterLimit = 10;
                          if (tick.length >= characterLimit) {
                              return tick.slice(0, tick.length).substring(0, characterLimit - 1).trim() + '...';
                          }
                          return tick;
                      }
                  }
              }],
              yAxes:[{

                      scaleLabel:{
                        display:true,
                        labelString:'Returns ($)'
                      }
                    }],

              },
              tooltips: {
                callbacks: {
                    title: function(tooltipItem){
                        return this._data.labels[tooltipItem[0].index];
                    }
                }
            }

                  };

    $ctrl.internal_rate_return_options = {
                      legend:{display:true, position: 'bottom',fullWidth: false},
                      barValueSpacing: $ctrl.chart.spacing,
                      maintainAspectRatio: false,
                      responsive: true,
                    scales: {
                            xAxes: [{
                                ticks: {
                                    callback: function(tick) {
                                        var characterLimit = 10;
                                        if (tick.length >= characterLimit) {
                                            return tick.slice(0, tick.length).substring(0, characterLimit - 1).trim() + '...';
                                        }
                                        return tick;
                                    }
                                }
                            }],
                            yAxes:[
                                  {
                                    scaleLabel:{ display:true, labelString:"Returns ($)"},
                                     ticks: { beginAtZero: true }
                                  }
                                  ],
                            },
                            tooltips: {
                              callbacks: {
                                  title: function(tooltipItem){
                                      return this._data.labels[tooltipItem[0].index];
                                  }
                              }
                          }
                  };

    $ctrl.cash_flow_options = {




      legend:{display:true, position: 'bottom',fullWidth: false},
      barValueSpacing: $ctrl.chart.spacing,
      maintainAspectRatio: false,
      responsive: true,
              scales: {
                      xAxes: [{
                          ticks: {
                              callback: function(tick) {
                                  var characterLimit = 10;
                                  if (tick.length >= characterLimit) {
                                      return tick.slice(0, tick.length).substring(0, characterLimit - 1).trim() + '...';
                                  }
                                  return tick;
                              }
                          }
                      }],
                      yAxes:[
                            {
                             ticks: { beginAtZero: true },
                              scaleLabel:{ display:true, labelString:"Time Period (Years)"}
                            }
                            ]
                      },
                      tooltips: {
                        callbacks: {
                            title: function(tooltipItem){
                                return this._data.labels[tooltipItem[0].index];
                            }
                        }
                    }
            };

    // Tabs
    $ctrl.updatePlanValues = updatePlanValues;


    $ctrl.longestTotalPeriod = 0;


    /****************************************************************
     Methods
     ****************************************************************/

    function $onInit() {
      var scenario_id = $state.params['scenario'];
      $ctrl.module = $state.params["module"];
      $ctrl.edited= $state.params["edited"];
      $ctrl.from_profit=$state.params["from_profit"];
      console.log($ctrl.edited)


      if ($ctrl.module === undefined) {
        $ctrl.module = "profit";
      }
      if (scenario_id === undefined || scenario_id < 1) {
        $state.go("scenarioManager");
      }
      else {
        scenarioService.retrieveScenario(scenario_id)
          .then(function (scenario_response) {
            if (scenario_response !== undefined &&
              scenario_response.data !== undefined) {
              $ctrl.scenario = scenario_response.data;
              scenarioService.listPlansByScenario(scenario_id)
              .then(function (plan_response){
                $ctrl.plans = plan_response.data;
                console.log($ctrl.plans);

                $ctrl.plans.sort(function (a, b) {
                  return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
                });

                calculateIRR($ctrl.scenario, $ctrl.plans);

                $ctrl.chart_data = initializeChartData($ctrl.scenario, $ctrl.plans);
                initializeSummaryView($ctrl.module);
              });
            }
        });
      }
    }

    function back_manager(){
      $state.go("scenarioManager",{module:$ctrl.module})
    }

    function proceed() {
        if ($ctrl.module === undefined) {
          $ctrl.module = 'profit';
        }
        if($ctrl.edited!="true"&& $ctrl.from_profit==undefined){
          //$state.go("scenarioCreate", {'scenario': $ctrl.scenario.id, module:$ctrl.module});
        }
        if($ctrl.edited!="true"&& $ctrl.from_profit=="true"){
          $state.go("scenarioCreate", {'scenario': $ctrl.scenario.id, module:$ctrl.module,"from_profit":true});
        }
        else {
          $state.go("scenarioManager",{module:$ctrl.module})
        }
    }

    function back() {
        if ($ctrl.from_profit=="true"){
            if($ctrl.edited!="true"){
              $state.go("scenarioManager",{'module':$ctrl.module})
            }
            else{
              $state.go("scenarioDiscountRate",{'scenario': $ctrl.scenario.id,'module':$ctrl.module,"from_profit":"true"})
            }
        }
        else if ($ctrl.edited=='false'){
            $state.go("scenarioManager",{'module':$ctrl.module})
        }
        else if ($ctrl.edited=='true'){
        $state.go("scenarioDiscountRate",{'scenario': $ctrl.scenario.id,'module':$ctrl.module})
    }

    }

    function return_dashboard() {
      $window.location.replace("/dashboard");
    }

    function numberWithCommas(x) {
      if (x != null) {
        return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      else {
        return x
      }
    }

    function updatePlanValues(plan) {
      scenarioService.updatePlan(plan)
        .then(function (plan_response){
          if (plan_response !== undefined){
            $state.reload();
          }
        });
    }


    function checkTitlelength(plan) {
      if (plan.length > 31) {
        $ctrl.title_number = parseFloat($ctrl.title_number) + 1;
        return "Plan" + $ctrl.title_number
      }
      return plan
    }

   
    function expandChart(chart_name) {
      if (!$ctrl.selected) {
        $ctrl.selected = true;
      }

      $ctrl.expand = chart_name;
    }

    function shrinkChart() {
      $ctrl.selected = false;
    }

    /****************************************************************
     Private Helper Functions
     ****************************************************************/

    /*
        Sets table data using plans from given 'scenario'.
    */
    function initializeTableData(scenario) {

    }

    /*
        Sets the Angular ChartJS data format based on the plans of the given 'scenario'.
    */
    function initializeChartData(scenario, plans) {


      var net = document.getElementById('net_returns');
      var chart_data = {
        "net_present_value": {
          name: "net_present_value",
          label: "Net Returns and Net Present Value",
          chart_type: "bar",
          series: [
            'Net Returns',
          ],
          labels: [],
          data: [
            [],
            []
          ],
          options:{
            scales: {
                    yAxes:[{

                            scaleLabel:{
                              display:true,
                              labelString:'Returns ($)'
                            }
                          }],
                    xAxes:[{
                      ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                          return '$' + value;
                        }
                      }
    }]
                    }
          }
        },
        "internal_rate_of_return": {
          'name': "internal_rate_of_return",
          'label': "Internal Rate of Return",
          'chart_type': "bar",
          'series': [
            'Internal Rate of Return'
          ],
          'labels': [],
          'data': [
            [],
          ],
          'scales': [],
        },
        "cash_flow_breakeven": {
          'name': "cash_flow_breakeven",
          'label': "Cash Flow Breakeven",
          'chart_type': "bar",
          'series': [
            'Time period that annual returns are greater than annual costs',
            'Time period that annual returns are greater than total costs of all previous years'
          ],
          'labels': [],
          'data': [
            [],
            []
          ],
          'scales': []
        },
        "net_returns": {
          'name': "net_returns",
          'label': "Net Returns",
          'chart_type': "line",
          'series': [],
          'labels': [],
          'data': [],
        },
      };

      if (plans[0] == null) {
        return chart_data;
      }

      var time_period_value = plans[0].time_period_value;
      var time_period_unit = plans[0].time_period_unit;
      var same_time_period_unit_and_value = true;
      var num_periods = 0;

      angular.forEach(plans, function (plan, index) {

        if (same_time_period_unit_and_value &&
          (plan.time_period_value != time_period_value || plan.time_period_unit != time_period_unit)) {
          same_time_period_unit_and_value = false;
        }
      });


      angular.forEach(plans, function (plan, index) {
        plan_data = "Plan" + " " + plan_number
        plan_number = parseFloat(plan_number) + 1


        // Net present value, net returns, and equivalent annual annuity
        chart_data["net_present_value"].labels.push(plan.title);
        if(plan.net_returns_with_inflation == undefined){
          plan.net_returns_with_inflation = 0;
        }
        chart_data["net_present_value"].data[0].push(plan.net_returns_with_inflation.toFixed(2));
        //chart_data["net_present_value"].scales = $ctrl.net_present_value_options.scales;


        if (!same_time_period_unit_and_value) {
          chart_data["net_present_value"].data[1].push(plan.equivalent_annual_annuity.toFixed(2));
          chart_data["net_present_value"].label = "Net Returns and Equivalent Annual Annuity";
          chart_data["net_present_value"].series[1] = "Equivalent Annual Annuity";
        }
        else {
          if(plan.net_present_value == undefined){
            plan.net_present_value = 0;
          }
          chart_data["net_present_value"].data[1].push(plan.net_present_value.toFixed(2));
          chart_data["net_present_value"].series[1] = "Net Present Value";
        }

        // Internal rate of return
        chart_data["internal_rate_of_return"].labels.push(plan.title);
        chart_data["internal_rate_of_return"].data[0].push(plan.internal_rate_of_return);
        chart_data["internal_rate_of_return"].scales = $ctrl.internal_rate_return_options.scales;


        // Cash flows breakeven
        if(plan.cash_flow_breakeven == undefined && plan.cash_flow_total_breakeven == undefined) {
          plan.cash_flow_breakeven = 0;
          plan.cash_flow_total_breakeven = 0;
        }
        chart_data["cash_flow_breakeven"].labels.push(plan.title);
        chart_data["cash_flow_breakeven"].data[0].push(plan.cash_flow_breakeven.toFixed(2));
        chart_data["cash_flow_breakeven"].data[1].push(plan.cash_flow_total_breakeven.toFixed(2));
        chart_data["cash_flow_breakeven"].scales = $ctrl.cash_flow_options.scales;

        // Net returns over time
        chart_data["net_returns"].series.push(plan.title + " (" + plan.time_period_unit + ")");
        if(plan.net_returns_over_time !== undefined){
          var net_returns_over_time = plan.net_returns_over_time.map(function (net_returns) {
            return net_returns.net_return.toFixed(2);
          });


          if (num_periods < net_returns_over_time.length) {
            num_periods = net_returns_over_time.length;
            $ctrl.longestTotalPeriod = index;
          }

          chart_data["net_returns"].data.push(net_returns_over_time);
        }


        plan['totalCashCost'] = totalCashCost(plan);


      });


      for (var i = 0; i < $ctrl.plans[$ctrl.longestTotalPeriod].net_returns_over_time.length; i++) {
        chart_data["net_returns"].labels.push('Period ' + i);
      }


      $ctrl.chart.line_chart_colors = lineChartColors["no_fill"];
      $ctrl.chart.spacing = ($ctrl.chart.width - (200 * chart_data["net_present_value"].labels.length)) /
        (chart_data["net_present_value"].labels.length * chart_data["net_present_value"].data.length);

      return chart_data;
    }

    function updateChartData(plan, index) {
      $ctrl.copied_chart_data_set[0]["net_present_value"].data[0][index] = net_returns_with_inflation(plan);

      //$ctrl.copied_chart_data_set.push();

      initializeChartData($ctrl.scenario, $ctrl.plans);

    }

    function totalCashCost(plan) {
      var min;
      angular.forEach(plan.net_returns_over_time, function (arr) {
        if (min == null) {
          min = arr.cumulative_net_returns;
        }
        else if (min > arr.cumulative_net_returns) {
          min = arr.cumulative_net_returns;
        }
      });
      return Math.abs(min).toFixed(2);
    }

    /*
        Initializes the summary view for the given module.
    */
    function initializeSummaryView(module) {
      if (module !== undefined && module == "profit") {
        $ctrl.summary_title = "AgBizProfit Analysis";
      }
      else if (module !== undefined && module == "lease") {
        $ctrl.summary_title = "AgBizLease Analysis";
      }
      else if (module !== undefined && module == "finance") {
        $ctrl.summary_title = "AgBizFinance Analysis";
      }
      else if (module !== undefined && module == "environment") {
        $ctrl.summary_title = "AgBizEnvironment Analysis";
      }
      else {
        $ctrl.summary_title = "AgBiz Scenario Analysis";
      }
    }

    function net_returns_with_inflation(plan) {
      var net_returns_with_inflation = 0.0;
      if (plan.use_investment_values) {
        net_returns_with_inflation = plan.ending_investment - plan.beginning_investment;
      } else {
        net_returns_with_inflation = 0;
      }

      angular.forEach(plan.plan_budgets, function (plan_budget) {
        net_returns_with_inflation += plan_budget.net_returns_with_inflation;
      });

      return net_returns_with_inflation;
    }

    function calculateIRR(scenario, plans) {
      angular.forEach(plans, function (plan) {
        calculatePlanIRR(plan);
      });
    }

    function calculatePlanIRR(plan) {

      var irr = 1.;
      var prv_irr = 0.;
      var mid_value = 0.5;
      var net_present_value = 0 - plan.beginning_investment;
      var sum = 0;
      var accuracy = .5;

      angular.forEach(plan.plan_budgets, function (plan_budget) {
        net_present_value += calculatePV(plan_budget, mid_value, plan);
      });

      while (Math.abs(net_present_value) >= accuracy) {
        sum += 1;
        if (sum === 500) {
          break;
        }

        if (net_present_value <= -accuracy) {
          irr = mid_value;
          mid_value = prv_irr + (mid_value - prv_irr) / 2;
        }
        else if (net_present_value >= accuracy) {
          prv_irr = mid_value;
          mid_value = mid_value + (irr - mid_value) / 2;
        }

        net_present_value = 0 - plan.beginning_investment;
        angular.forEach(plan.plan_budgets, function (plan_budget) {
          net_present_value += calculatePV(plan_budget, mid_value, plan);
        });
      }
      plan.internal_rate_of_return = parseFloat(mid_value * 100).toFixed(2);
      scenarioService.updatePlan(plan);
    }

    function calculatePV(plan_budget, irr, plan) {
      var CONVERSION_TABLE = {
        'Day': {'value': 1, 'Day': 1, 'Week': 0.14, 'Month': 0.03, 'Year': 0.003, 'unit': 'Day', 'n': 365},
        'Week': {'value': 2, 'Day': 7, 'Week': 1, 'Month': 0.25, 'Year': 0.019230769, 'unit': 'Week', 'n': 52},
        'Month': {'value': 3, 'Day': 30, 'Week': 4, 'Month': 1, 'Year': 0.08, 'unit': 'Month', 'n': 12},
        'Year': {'value': 4, 'Day': 365, 'Week': 52, 'Month': 12, 'Year': 1, 'unit': 'Year', 'n': 1},
      };

      var net_returns = plan_budget.net_returns_with_inflation;

      if (plan_budget.time_period_position === plan.time_period_value) {
        net_returns += plan.ending_investment
      }

      if(plan_budget.time_unit == undefined){
        plan_budget.time_unit = 'Year';
      }

      var x = 1 + irr;
      var y = (plan_budget.time_period_position * CONVERSION_TABLE[plan_budget.time_unit]['Year']);

      return net_returns / (Math.pow(x, y));

    }


    function loadBudget(plan){
        var list=[]
        console.log(plan)
        angular.forEach(plan.plan_budgets, function (budeget, index) {
        var word=[]
        word= budeget.title+"("+budeget.time_value+budeget.time_unit+")"
         list.push(word)
         $ctrl.notes=plan.notes
         console.log($ctrl.notes)

    })

    $ctrl.budget_list=list
    console.log($ctrl.budget_list)

}







}

}());
