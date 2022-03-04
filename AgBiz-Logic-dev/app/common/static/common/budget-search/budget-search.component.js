(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("budgetSearch", {
      templateUrl: "/static/common/budget-search/budget-search.component.html",
      controller: BudgetSearchComponentController,
      bindings: {
        'budgetList': "<",
        'onSelect': "&",
      }
    });


  /****************************************************************
                         Controller
  ****************************************************************/

  BudgetSearchComponentController.$inject = [
    "filterFilter",
    "commonService"
  ];

  function BudgetSearchComponentController(
    filterFilter,commonService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;

    $ctrl.onStateChange = getUSStates;

    $ctrl.onRegionChange = getRegions;

    $ctrl.$onChanges = $onChanges;

    // Inputs
    $ctrl.budgetList;



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
    $ctrl.region_list = [];
    $ctrl.region_json_list = [];

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

      // Change Search screen title from "Choose University Budget" to "Choose ABL Library Budget"
      $ctrl.modal_title = "Choose ABL Library Budget";

      commonService.retrieveStateRegionData().then(function(response){
      $ctrl.region_json_list = response.data;
      $ctrl.region_json_list=merge_by_state($ctrl.region_json_list);
      if ($ctrl.budgetList !== undefined &&
          $ctrl.budgetList.length !== undefined &&
          $ctrl.budgetList.length > 0) {
        $ctrl.filtered_budget_list = $ctrl.budgetList;
        $ctrl.us_state_list = getUSStates($ctrl.filtered_budget_list);
      }

    });
    }

    function merge_by_state(data){
      var arr=[];
      var result=[];
      var index;
      console.log(data);
      angular.forEach(data, function(item, key) {
        console.log(item);
        if(!arr.includes(item.state)){
          arr.push(item.state);
          item.region=item.region.filter(function (el) { return el!= "North Coast "});
          item.region=item.region.filter(function (el) { return el!= null});
          result.push(item);
        }
        else{
          index = result.findIndex(x => x.state ===item.state);
          result[index].region=result[index].region.concat(item.region);
          result[index].region = [...new Set(result[index].region)];
          result[index].region=result[index].region.filter(function (el) { return el!= "North Coast " ; });
          result[index].region=result[index].region.filter(function (el) { return el!= null ; });
          console.log(result);
        }
      });
      return result
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
      var us_state_list = $ctrl.region_json_list.map(function(region) {
        return region.state;
      });
      return us_state_list;
    }


    /*
        Returns a list of all the unique regions in the given budet list.
    */
    function getRegions(budget_list) {
          var region_list = $ctrl.region_json_list;

          angular.forEach(region_list, function(region){
              if(region.state == $ctrl.search.state)
              {
                  $ctrl.region_list = region.region;
              }
          });

      }

  }

}());
