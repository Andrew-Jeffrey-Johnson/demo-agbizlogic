(function() {
  'use strict';

  angular
    .module("climateModule")
    .component("climateVariableImpact", {
      templateUrl: "/static/climate/climate-variable-impact/climate-variable-impact.component.html",
      controller: ClimateVariableImpactController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ClimateVariableImpactController.$inject = [
    '$scope',
    '$state',
    '$interval',
    'climateService'
  ];

  function ClimateVariableImpactController(
    $scope,
    $state,
    $interval,
    climateService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    var factor_unit = {
      "Warm Days Frequency": "Days",
      "Coldest Night Temperature": "Degrees Fahrenheit",
      "Evaporation": "Inches",
      "First Fall Freeze": "Days",
      "Growing Degree Days Total (Base 32°F)": "Days",
      "Growing Degree Days Total (Base 37.4°F)": "Days",
      "Growing Degree Days Total (Base 41°F)": "Days",
      "Growing Degree Days Total (Base 50°F)": "Days",
      "Growing Degree Days Total (Base 50°F)/10C": "Days",
      "Hottest Day Temperature": "Degrees Fahrenheit",
      "Last Spring Freeze": "Days",
      "Potential Evapotranspiration (Spring)": "Inches",
      "Precipitation": "Inches",
      "Snow Water Equivalent (April 1)": "Inches",
      "Maximum Temperature": "Degrees Fahrenheit",
      "Mean Temperature": "Degrees Fahrenheit",
      "Minimum Temperature": "Degrees Fahrenheit",
      "Total Soil Moisture (Spring)": "Inches",
      "Chilling Hours Accumulation (32–45°F; Nov–Mar)":"Hours",
      "Chilling Hours Total (32–45°F; Nov–Mar)":"Hours",
      "Cold Snap Event Frequency":"Number of Events",
      "Diurnal Temperature Range":"Degrees Fahrenheit",
      "Frost Days Frequency":"Mean Number of Days",
      "Growing Degree Days Accumulation (Base 50°F)":"Number of Days",
      "Growing Season Length":"Days",
      "Heat Wave Event Frequency":"Number of Events",
      "Heavy Precipitation Event Frequency":"Mean Number of Days",
      "Longest Dry Spell Length":"Days",
      "Longest Wet Spell Length":"Days",
      "Tropical Nights Frequency":"Mean Number of Days"
        }

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.back = back;
    $ctrl.proceed = proceed;
    $ctrl.showChart = showChart;
    $ctrl.replace = replace;
    $ctrl.updateFactor = updateFactor;

    // ClimateScenario objects
    $ctrl.climate_scenario;
    $ctrl.climate_budget;
    $ctrl.current_factor;
    $ctrl.num_required_variables = 3;
    $ctrl.checked_variables = [];

    // Chart
    $ctrl.projection_data;
    //$ctrl.options;
    $ctrl.colors = ["rgba(255,0,0,0.5)","rgba(0,255,0,0.3)","rgba(80,9,251,0.3)","rgba(243,247,35,0.5)","rgba(247,35,211,0.5)"]
    $ctrl.options = {
    //   legend: {
    //   display: true,
    //   position: 'bottom',
    //   labels: {
    //     fontColor: "#000080",
    //   }
    // },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: ""
          },
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Climate Projections'
          }
        }]
      },


      scaleLabel: function (valuePayload) {
        var value = valuePayload.value.toString();
        if( valuePayload.value > 999 ) {
          value = value.split(/(?=(?:...)*$)/);
          value = value.join(',');
        }
        return value;
      },
      multiTooltipTemplate: function(valuePayload) {
        return valuePayload.datasetLabel + ': ' + parseFloat(valuePayload.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");;
      }
    };


    $ctrl.options_line = {

      legend: {
      display: true,
      position: 'bottom',
      labels: {
        fontColor: "#000080",
      }
    },

      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: ""
          },
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Climate Projections'
          }
        }]
      },
      elements: {
        line: {
              fill: false
          }
      },
      scaleLabel: function (valuePayload) {
        var value = valuePayload.value.toString();
        if( valuePayload.value > 999 ) {
          value = value.split(/(?=(?:...)*$)/);
          value = value.join(',');
        }
        return value;
      },
      multiTooltipTemplate: function(valuePayload) {
        return valuePayload.datasetLabel + ': ' + parseFloat(valuePayload.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");;
      }
    };

    /****************************************************************
                         Controller Methods
    ****************************************************************/

    function $onInit() {

      var scenario_id = $state.params['scenario'],
          climate_budget = $state.params['climate_budget'];

      if (scenario_id === undefined ||
          scenario_id < 1 ||
          climate_budget === undefined ||
          climate_budget < 1) {
        $state.go("manager");
      }
      else {
        startProgress(1);

        climateService.retrieveScenario(scenario_id)
        .then(function(climate_scenario_response) {
          if (climate_scenario_response === undefined ||
              climate_scenario_response.data === undefined ||
              climate_scenario_response.data.id === undefined ||
              climate_scenario_response.data.id < 1) {
            $state.go("manager");
          }
          else {
            $ctrl.climate_scenario = climate_scenario_response.data;

            return climateService.retrieveBudget(climate_budget);
          }
        })
        .then(function(climate_budget_response) {
          if (climate_budget_response === undefined ||
              climate_budget_response.data === undefined ||
              climate_budget_response.data.id === undefined ||
              climate_budget_response.data.id < 1 ||
              climate_budget_response.data.climate_factors === undefined ||
              climate_budget_response.data.climate_factors.length < $ctrl.num_required_variables) {
            $state.go("manager");
          }
          else {
            $ctrl.climate_budget = climate_budget_response.data;
            $ctrl.current_factor = $ctrl.climate_budget.climate_factors[0];

            showChart($ctrl.current_factor);
            return climateService.retrieveFactor($ctrl.current_factor.id);
          }
        });
        /*.then(function(factor_response) {
          if (factor_response === undefined ||
              factor_response.data === undefined ||
              factor_response.data.id === undefined ||
              factor_response.data.id < 1) {
            $state.go("manager");
          }
          else {
            $ctrl.current_factor = factor_response.data;
            $ctrl.options['scales']['yAxes'][0]['scaleLabel']['labelString'] = factor_unit[$ctrl.current_factor.name];


            return climateService.retrieveFactorProjections($ctrl.current_factor);
          }
        })
        .then(function(projection_data_response) {
          if (projection_data_response === undefined ||
              projection_data_response.data === undefined) {
            $state.go("manager");
          }
          else {
            $ctrl.projection_data = projection_data_response.data;
          }
        });*/
      }
    }


    function showChart(factor) {
      $ctrl.current_factor = factor;
      if ($ctrl.checked_variables.indexOf(factor.name) === -1) {
        $ctrl.checked_variables.push(factor.name);
      }


      if(factor.name !== 'Climate Focus Groups' && factor.name !== 'Crop Models') {
        climateService.retrieveFactor($ctrl.current_factor.id)
        .then(function(factor_response) {
          if (factor_response === undefined ||
              factor_response.data === undefined ||
              factor_response.data.id === undefined ||
              factor_response.data.id < 1) {
            $state.go("manager");
          }
          else {
            $ctrl.current_factor = factor_response.data;
            $ctrl.options['scales']['yAxes'][0]['scaleLabel']['labelString'] = factor_unit[$ctrl.current_factor.name];

            return climateService.retrieveFactorProjections($ctrl.current_factor);
          }
        })
        .then(function(projection_data_response) {
          if (projection_data_response === undefined ||
              projection_data_response.data === undefined) {
            $state.go("manager");
          }
          else {
            $ctrl.projection_data = projection_data_response.data;
            console.log($ctrl.projection_data)
            //$ctrl.projection_data.data=[1,2,3]
            if ($ctrl.projection_data.chart_type=="bar"){
                $ctrl.projection_data.data=[$ctrl.projection_data.data[0][0],$ctrl.projection_data.data[0][1],$ctrl.projection_data.data[0][2]]
            }
        }

        });
      }
    }

    function replace(str) {
      var new_str = str;
      var end = str.indexOf("(");

      if (end !== -1) {
        new_str = str.slice(0,end);
      }
      return new_str.replace("/", "-");
    }

    function updateFactor() {
      if ($ctrl.current_factor.user_estimate!=undefined){
        climateService.updateFactor($ctrl.current_factor);
      }
    }
    function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

    function back() {
      $state.go("variableSelect", {
        'scenario': $ctrl.climate_scenario.id,
        'climate_budget': $ctrl.climate_budget.id,
        'state': $state.params['state'],
        'region': $state.params['region'],
      });
    }


    function proceed() {
      //startProgress(1);

      $state.go("totalImpact", {
        'scenario': $ctrl.climate_scenario.id,
        'climate_budget': $ctrl.climate_budget.id,
        'state': $state.params['state'],
        'region': $state.params['region'],
      });

      /*climateService.updateFactor($ctrl.current_factor)
      .then(function() {
        // Find the next factor in the list
        var next_factor = $ctrl.current_factor;
        $ctrl.climate_budget.climate_factors.forEach(function(climate_factor, index) {

          if (climate_factor.id == $ctrl.current_factor.id &&
              index + 1 < $ctrl.climate_budget.climate_factors.length) {
                next_factor = $ctrl.climate_budget.climate_factors[index + 1];

            //return climateService.retrieveFactor(next_factor.id);
          }
        });

        //return climateService.retrieveFactor(next_factor.id);

        // if (next_factor.id == $ctrl.current_factor.id) {
        if (next_factor.name === "Climate Focus Groups" || next_factor.name === "Crop Models" ) {
          $state.go("totalImpact", {
            'scenario': $ctrl.climate_scenario.id,
            'climate_budget': $ctrl.climate_budget.id,
            'state': $state.params['state'],
            'region': $state.params['region'],
          });
        }
        else {
          return climateService.retrieveFactor(next_factor.id);
        }
      })
      .then(function(factor_response) {
        if (factor_response !== undefined &&
            factor_response.data !== undefined &&
            factor_response.data.id !== undefined &&
            factor_response.data.id > 0) {
          $ctrl.current_factor = factor_response.data;
          $ctrl.options['scales']['yAxes'][0]['scaleLabel']['labelString'] = factor_unit[$ctrl.current_factor.name];

          $ctrl.current_factor.user_estimate = 0.0;
          document.body.scrollTop = document.documentElement.scrollTop = 0;

          return climateService.retrieveFactorProjections($ctrl.current_factor);
        }
      })
      .then(function(projection_data_response) {
        if (projection_data_response !== undefined &&
            projection_data_response.data !== undefined) {
          $ctrl.projection_data = projection_data_response.data;
        }
      });*/
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

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

  }

})();
