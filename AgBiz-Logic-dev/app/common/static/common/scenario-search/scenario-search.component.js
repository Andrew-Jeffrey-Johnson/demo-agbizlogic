(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("scenarioSearch", {
      templateUrl: "/static/common/scenario-search/scenario-search.component.html",
      controller: ScenarioSearchComponentController,
      bindings: {
        'scenarioList': "<",
        'onSelect': "&",
      }
    });


  /****************************************************************
                         Controller
  ****************************************************************/

  ScenarioSearchComponentController.$inject = [
    "filterFilter",
  ];

  function ScenarioSearchComponentController(
    filterFilter) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.$onChanges = $onChanges;

    // Inputs
    $ctrl.scenarioList;
    $ctrl.scenarioList;
    console.log($ctrl.scenarioList);
    //console.log($ctrl.budget_list);

    // Search options
    $ctrl.enterprise_list = [
      {
        'label': "Select",
        'value': "",
      },
      {
        'label': "Crop",
        'value': "Crop",
      },
      {
        'label': "Livestock",
        'value': "Livestock",
      },
    ];
    $ctrl.us_state_list;
    $ctrl.region_list;

    // Filtered budget list
    $ctrl.filtered_budget_list = [];

    // Search object
    $ctrl.search = {
      'title': "",
      'enterprise': $ctrl.enterprise_list[0].value,
      'state': "",
      'region': "",
    };


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.modal_title = "Choose University Scenario";
      if ($ctrl.scenarioList !== undefined &&
          $ctrl.scenarioList.length !== undefined &&
          $ctrl.scenarioList.length > 0) {
        $ctrl.filtered_budget_list = $ctrl.scenarioList;
        //$ctrl.us_state_list = getUSStates($ctrl.scenarioList);
        //$ctrl.region_list = getRegions($ctrl.scenarioList);
      }
    }


    function $onChanges(changes) {
      $ctrl.$onInit();
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Returns a list of all the unique US States in the given budet list.
    */
    function getUSStates(budget_list) {
      var us_state_list = $ctrl.scenarioList.map(function(budget) {
        return budget.state;
      })
      .filter(function(state, index, state_list) {
        return state_list.indexOf(state) == index && state != "";
      });

      return us_state_list;
    }


    /*
        Returns a list of all the unique regions in the given budet list.
    */
    function getRegions(budget_list) {
      var region_list = $ctrl.scenarioList.map(function(budget) {
        return budget.region;
      })
      .filter(function(region, index, region_list) {
        return region_list.indexOf(region) == index && region != "";
      });

      return region_list;
    }
  }

}());
