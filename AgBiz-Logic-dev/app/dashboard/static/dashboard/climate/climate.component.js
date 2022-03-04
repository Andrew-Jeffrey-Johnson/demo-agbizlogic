(function() {
  'use strict';

  angular
    .module("dashboardModule")
    .component("climate", {
      templateUrl: "/static/dashboard/climate/climate.component.html",
      controller: ClimateComponentController,
      controllerAs: "$ctrl",
      bindings: {
        inactive: '<',
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ClimateComponentController.$inject = [
    'climateService',
  ];

  function ClimateComponentController(climateService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;

    // Inputs
    $ctrl.inactive;

    // Chart data
    $ctrl.most_recent_scenario;
    $ctrl.chart_data;

    // Misc
    $ctrl.is_inactive;
    $ctrl.css_classes = {
      'panel': true,
      'panel-primary': true,
      'panel-inactive': true,
    };

    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      updateCSS();

      climateService.retrieveMostRecentScenario()
      .then(function(climate_scenario_response) {
        if (climate_scenario_response !== undefined &&
            climate_scenario_response.data !== undefined &&
            climate_scenario_response.data.id !== undefined &&
            climate_scenario_response.data.id > 0) {
          $ctrl.most_recent_scenario = climate_scenario_response.data;
          $ctrl.chart_data = getChartData($ctrl.most_recent_scenario);
        }
      });
    }



    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Disables the component using CSS depending on the input binding from parent component.
        Default is inactive.
    */
    function updateCSS() {
      if ($ctrl.inactive === undefined) {
        $ctrl.is_inactive = true;
      }
      else {
        $ctrl.is_inactive = $ctrl.inactive;
      }
      $ctrl.css_classes['panel-inactive'] = $ctrl.is_inactive;
    }
  }


  /*
      Returns the chart display data in AngularChartJS format.
  */
  function getChartData(climate_scenario) {
    var chart_data = {
      'net_returns' : {
        'name': "Net Returns - Before and After Considering Climate Change Impacts",
        'series': [
          'Before considering climate change impacts',
          'After estimating yield changes due to climate change'
        ],
        'labels': [],
        'data': [
          [],
          []
        ]
      },
        'total_yields': {
        'name': "Total Yields - Before and After Considering Climate Change Impacts",
        'series': [
          'Before considering climate change impacts',
          'After estimating yield changes due to climate change'
        ],
        'labels': [],
        'data': [
          [],
          []
        ]
      },
    };

    angular.forEach(climate_scenario.climate_budgets, function(climate_budget, key) {
      if (climate_budget.is_original) {
        chart_data['net_returns'].labels.push(climate_budget.title.substring(0,20));
        chart_data['total_yields'].labels.push(climate_budget.title.substring(0,20));
        chart_data['net_returns'].data[0].push(climate_budget.net_returns);
        chart_data['total_yields'].data[0].push(climate_budget.total_yields);
      }
      else {
        chart_data['net_returns'].data[1].push(climate_budget.net_returns);
        chart_data['total_yields'].data[1].push(climate_budget.total_yields);
      }
    });

    return chart_data;
  }

})();
