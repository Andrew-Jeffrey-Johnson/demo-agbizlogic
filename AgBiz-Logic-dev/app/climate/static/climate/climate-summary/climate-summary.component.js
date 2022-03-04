(function() {
  'use strict';

  angular
    .module("climateModule")
    .component("climateSummary", {
      templateUrl: "/static/climate/climate-summary/climate-summary.component.html",
      controller: ClimateSummaryController,
      bindings: {
        'climate': "<",
      }
    });


  /****************************************************************
                      Controller
  ****************************************************************/

  ClimateSummaryController.$inject = [
    '$scope',
    '$state',
    '$interval',
    'climateService',
    'budgetService'
  ];

  function ClimateSummaryController(
    $scope,
    $state,
    $interval,
    climateService,
    budgetService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.back = back;
    $ctrl.proceed = proceed;
    $ctrl.generatePdf = generatePdf;
    $ctrl.save=save

    // Inputs
    $ctrl.climate;

    // ClimateScenario objects
    $ctrl.climate_scenario;
    $ctrl.climate_scenario_length_text;


    // Chart
    $ctrl.chart_type = 'net_returns';
    $ctrl.chart_data;

    $ctrl.options = {
      legend: {
        display: true,
        labels:{
          padding: 35
        }
      },
      maintainAspectRatio: false,
      scaleBeginAtZero: false,
      responsive: true,
      scales: {
              xAxes: [{
                  ticks: {
                      callback: function(tick) {
                          var characterLimit = 20;
                          if (tick.length >= characterLimit) {
                              return tick.slice(0, tick.length).substring(0, characterLimit - 1).trim() + '...';
                          }
                          return tick;
                      }
                  }
              }],

              yAxes:[{
                      // scaleLabel: function (valuePayload) {
                      //   return parseFloat(valuePayload.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                      scaleLabel: {
                        labelString: "Dollars",
                        display: true
                      },
                      ticks: {
                                  callback: function(value, index, values) {
                                    value = Math.floor(value);
                                   return value.toLocaleString("en-US",{style:"currency", currency:"USD", minimumFractionDigits: 0, maximumFractionDigits: 0,});
                                 }
                              }

                    }]
              },
      multiTooltipTemplate: function(valuePayload) {
        return valuePayload.datasetLabel + ': ' + parseFloat(valuePayload.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");;
      },
      tooltips: {
        callbacks: {
            title: function(tooltipItem){
                return this._data.labels[tooltipItem[0].index];
            }
        }
    }
    };

    // Miscconsole
    $ctrl.progress = 100;
    $ctrl.is_collapsed = false;

    // Errors
    $ctrl.errors = 0;


    /****************************************************************
                         Controller Methods
    ****************************************************************/

    function $onInit() {
      var scenario_id = $state.params['scenario'];

      if (scenario_id === undefined ||
          scenario_id < 1) {
        $state.go("manager");
      }
      else {
        startProgress(1);

        climateService.retrieveScenario(scenario_id)
        .then(function(climate_scenario_response) {
          if (climate_scenario_response === undefined ||
              climate_scenario_response.data === undefined ||
              climate_scenario_response.data.id === undefined ||
              climate_scenario_response.data.id < 1 ||
              climate_scenario_response.data.climate_budgets === undefined) {
            $state.go("manager");
          }
          else if (climate_scenario_response.data.climate_budgets.length < 2) {
            $state.go("create", {'scenario': scenario_id})
          }
          else {
            $ctrl.climate_scenario = climate_scenario_response.data;
            $ctrl.climate_scenario_length_text =
              ($ctrl.climate_scenario.projection_type === "short" ? "seasonal climate forecast." :
              "future climate projection.");
            calculateChange();
            setChartData();

          }
        });
      }
    }


    function back() {
      $state.go("create", {
        'scenario': $ctrl.climate_scenario.id,
      });
    }
    // change climate budgets to allocate budgets and delete climate budgets
    function save(){
      angular.forEach($ctrl.climate_scenario.climate_budgets,function(value,key){
        // console.log(value)
          if(!value['is_original']){
            budgetService.retrieveBudget(value.budget)
            .then(function(reponse) {
              var save_climate_budgets=reponse.data
              save_climate_budgets.module="allocate"
              budgetService.updateBudget(save_climate_budgets)
              .then(function(reponse){
                climateService.destroyBudget(value.id)
              })
            })

          }
      });
      $state.go("manager");
    }


    function proceed() {
      startProgress(1);
      destroyAfterBudgets()
      $state.go("manager");
    }
    //destroy afterBudgets if user go thtough without save
    function destroyAfterBudgets(){

            angular.forEach($ctrl.climate_scenario.climate_budgets,function(value,key){
                if(!value['is_original']){
                  removeBudget(value);
                }
            });

    }

    function removeBudget(climate_budget) {
      startProgress(2);

      budgetService.destroyBudget(climate_budget.budget)
      .then(function() {
        return climateService.retrieveScenario($ctrl.climate_scenario.id);
      })
      .then(function(climate_scenario_response) {
        if (climate_scenario_response !== undefined &&
            climate_scenario_response.data !== undefined &&
            climate_scenario_response.data.id !== undefined &&
            climate_scenario_response.data.id > 0) {
          $ctrl.climate_scenario = climate_scenario_response.data;
          // Check if maximum budgets per scenario has been reached
          if ($ctrl.climate_scenario.climate_budgets.length < $ctrl.max_budgets) {
            $ctrl.budgets_allowed = 1;
          }
          else {
            $ctrl.budgets_allowed = 0;
          }
        }
      });
    }

    function calculateChange(){

      // console.log($ctrl.climate_scenario.climate_budgets);
      $ctrl.climate_scenario.climate_budgets.sort(function (a, b) {
        return a.position - b.position
      });

      //console.log($ctrl.climate_scenario.climate_budgets);
      var prev_returns=0;
      angular.forEach($ctrl.climate_scenario.climate_budgets, function(climate_budget, key) {
        console.log(key)
        if (key%2==0){
          prev_returns = climate_budget.net_returns;
        } else {
          climate_budget.change_net_returns = climate_budget.net_returns - prev_returns;

        }
      });
    }

    function generatePdf() {
      //console.log($ctrl.climate_scenario);
      var scenario_title = $ctrl.climate_scenario.title;
      var note = $ctrl.climate_scenario.note;

      var t = $ctrl.climate_scenario.created_date.split("T");
      var date = t[0].split('-');
      var current_date = new Date().getFullYear()
      // PDF format and styling
      var doc_definition = {
          pageSize: 'A4',
          footer:function(page, pages) {
            return {
              columns: [

                {
                  alignment:'left',
                  text: [
                    {text:"Copyright © " + current_date + " AgBiz Logic. All Rights Reserved. ", italics:true },

                  ]
                },
                {
                  alignment:'right',
                  text: [
                    {text: date[1]+"/"+date[2]+"/"+date[0] + "\t" + " " + " " + " " + " " + " " + " " + " " + " "
                  + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " "
                + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " "
               },
                    { text: page.toString(), italics: true },
                    ' of ',
                    { text: pages.toString(), italics: true }

                  ]

                }

              ],
              margin: [10, 0]
            };
          },
          content: [{ text:scenario_title,  style:'header'}],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              lineHeight:1.5,
              decoration: 'underline',
              alignment : 'center',
            },
            tableHeader: {
        			bold: true,
        			fontSize: 13
        		},
            subheader: {
              bold: true,
              fontSize: 14,
              decoration: 'underline'
            }
          }
      };

      // Budgets in AgBizClimate Scenario
      var sub_title={
          text: [
                'Budgets in Scenario'

              ], style: 'subheader'

        }
      doc_definition.content.push(sub_title,'\n');

      BudgetsInScenario(doc_definition);

      // Climate Variable Summary title and content
      doc_definition.content.push({text: 'Climate Variable Summary', style: 'subheader'}, '\n');
      ClimateVariableSummary(doc_definition);

      // chart
      doc_definition.content.push({text: 'Net Returns', style: 'subheader'}, '\n');
      BarChart(doc_definition);



      var file_name = scenario_title + ".pdf";
      pdfMake.createPdf(doc_definition).download(file_name);
    }

    function formatMoney(number) {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0, style: 'currency', currency: 'USD' }).format(number)
    }

    function BudgetsInScenario(doc_definition) {

      var doc = {
        table: {
          headerRows: 1,
          widths: [350, 'auto', 'auto'],
          body: [
            [{text: 'Title', style: 'tableHeader'},
            {text: 'Impact %', style: 'tableHeader', alignment:'right'},
            {text: 'Net Returns', style: 'tableHeader', alignment:'right'}]
          ]
        },
        layout: {
  				fillColor: function (i, node) {
  					return (i % 2 === 0) ? '#f2f2f2' : null;
  				}
  			}
      };

      // adding rows in table
      // the budgets must already be sorted for this pdf following for loop to work properly as it expects every other budget to be the "after" budget
      $ctrl.climate_scenario.climate_budgets.forEach(function(climate_budget, index) {
        // because the even indexed bugdets are the original budgets, it only runs when intex%2 == 0
        // the odd endexed budgets are created bellow at my other comment


        if (index%2 == 0) {
          if(climate_budget.net_returns>0){
          var budget = [{text: climate_budget.title},
                        '',
                        {text: formatMoney(climate_budget.net_returns), alignment:'right'}];
                      }
          if(climate_budget.net_returns<0){
            var budget = [{text: climate_budget.title},
                          '',
                          {text: formatMoney(climate_budget.net_returns), alignment:'right'}];
          }
          doc.table.body.push(budget);
          // here is where the odd/"after" budgets are inputed into the pdf
          var after_budget = $ctrl.climate_scenario.climate_budgets[index+1];
          if(after_budget.net_returns>0){
          var budget = [{text: after_budget.title},
                        {text: after_budget.user_estimate, alignment:'right'},
                        {text: formatMoney(after_budget.net_returns), alignment:'right'}];
                      }
          if(after_budget.net_returns<0){
            var budget = [{text: after_budget.title},
                          {text: after_budget.user_estimate, alignment:'right'},
                          {text: formatMoney(after_budget.net_returns), alignment:'right'}];
          }
          doc.table.body.push(budget);
        }
      });

      doc_definition.content.push(doc, '\n');

    }

    function ClimateVariableSummary(doc_definition) {
      $ctrl.climate_scenario.climate_budgets.forEach(function(climate_budget, index) {
        if (index%2 == 0) {
          var factors = climate_budget.climate_factors;
          if($ctrl.climate_scenario.projection_type === "short"){

          }
          else{
          doc_definition.content.push({text: ((index/2)+1)+'. '+climate_budget.title});
        }
        if($ctrl.climate_scenario.projection_type === "short"){
          var doc = {
            table: {
              headerRows: 1,
              widths: [400, 100],
              body: [
              ]
            },
            layout: 'lightHorizontalLines'
          };
        }
        else{
          var doc = {
            table: {
              headerRows: 1,
              widths: [400, 100],
              body: [
                [{text: 'Climate Variable', style: 'tableHeader'}, {text: 'Impact %', style: 'tableHeader', alignment:'right'}]
              ]
            },
            layout: 'lightHorizontalLines'
          };
        }

          if($ctrl.climate_scenario.projection_type === "short"){

          }
          else{
            factors.forEach(function(factor){
              var factor_item = [{text: factor.name}, {text: factor.user_estimate+'%', alignment:'right'}];
              doc.table.body.push(factor_item);

            });
          }

          if($ctrl.climate_scenario.projection_type === "short"){
            var after_budget = $ctrl.climate_scenario.climate_budgets[index+1];
            var my_change = [((index/2)+1)+'. '+climate_budget.title+'\n Impact of your change to Seasonal Climate Forecast(six-month):', {text: '\n'+after_budget.user_estimate+'%', alignment:'right'}];
          }else{
            var my_change = ['My Change', {text: climate_budget.user_estimate+'%', alignment:'right'}];
          }
          if($ctrl.climate_scenario.projection_type === "short"){
            doc.table.body.push(my_change);
            doc_definition.content.push(doc, '\n',{canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 } ]},'\n');
          }
          else{
            doc.table.body.push(my_change);
            doc_definition.content.push(doc, '\n');
          }

        }
      });
    }

    function BarChart(doc_definition) {
      var bar_chart = (document.getElementsByClassName("chart chart-bar"))[0].toDataURL("image/png");
      doc_definition.content.push({image: bar_chart, fit: [500, 500]}, '\n');
    }



    /****************************************************************
                        Private Helper Functions
    ****************************************************************/

    function setChartData() {
      $ctrl.chart_data = {
        'net_returns' : {
          'name': "Net Returns - Before and After Considering the Climate Forecast",
          'series': [
            'Before considering the ' + $ctrl.climate_scenario_length_text,
            'After estimating yield changes due to the ' + $ctrl.climate_scenario_length_text
          ],
          'labels': [],
          'data': [
            [],
            []
          ]
        },
          'total_yields': {
          'name': "Total Yields - Before and After Considering the Climate Forecast",
          'series': [
            'Before considering the ' + $ctrl.climate_scenario_length_text,
            'After estimating yield changes due to the ' + $ctrl.climate_scenario_length_text
          ],
          'labels': [],
          'data': [
            [],
            []
          ]
        }
      };

      var climate_budgets_array = $ctrl.climate_scenario.climate_budgets;
      // console.log($ctrl.climate_scenario.climate_budgets);
      climate_budgets_array.sort(function (a, b) {
        return a.position - b.position
      });

      angular.forEach($ctrl.climate_scenario.climate_budgets, function(climate_budget, key) {
        if (climate_budget.is_original) {
          // $ctrl.chart_data['net_returns'].labels.push("Before                                                      After");
          $ctrl.chart_data['net_returns'].labels.push(climate_budget.title.substring());
          $ctrl.chart_data['total_yields'].labels.push(climate_budget.title.substring(0,30));
          $ctrl.chart_data['net_returns'].data[0].push(climate_budget.net_returns);
          $ctrl.chart_data['total_yields'].data[0].push(climate_budget.total_yields);
        }
        else {
          $ctrl.chart_data['net_returns'].data[1].push(climate_budget.net_returns);
          $ctrl.chart_data['total_yields'].data[1].push(climate_budget.total_yields);
        }
      });

      var bar_width = 200,
          num_series = $ctrl.chart_data['net_returns'].data.length,
          dataset_size = $ctrl.chart_data['net_returns'].labels.length;
      //$ctrl.chart.spacing = ($ctrl.chart.width - (bar_width * dataset_size)) / (dataset_size * num_series);
    }


    /*
        Faux progress method. Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function() {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }

    function compare(a,b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }

}


})();
