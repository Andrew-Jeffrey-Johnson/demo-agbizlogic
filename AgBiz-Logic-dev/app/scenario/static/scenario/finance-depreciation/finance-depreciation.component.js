(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeDepreciation", {
      templateUrl: "/static/scenario/finance-depreciation/finance-depreciation.component.html",
      controller: FinanceDepreciationComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceDepreciationComponentController.$inject = [
      '$state',
      '$filter',
      '$q',
      'commonService',
      'scenarioService',
      'budgetService',
      "$uibModal"
    ];

    function FinanceDepreciationComponentController(
      $state,
      $filter,
      $q,
      commonService,
      scenarioService,
      budgetService,
      $uibModal) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.updateDepreciation = updateDepreciation;
      $ctrl.proceed = proceed;
      $ctrl.back = back;

      // Scenario
      $ctrl.scenario_id;
      $ctrl.module;
      //hard code to 10 for now, change after MVP
      $ctrl.years = [1,2,3,4,5,6,7,8,9,10];
      $ctrl.years_length = $ctrl.years.length;
      // variables
      $ctrl.depreciation_arr = [];
      $ctrl.persent;
      $ctrl.depreciation_list=[];
      $ctrl.depreciation=[];



      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        //initialize local and global vars
        $ctrl.scenario_id = $state.params['scenario'];
        $ctrl.module = $state.params['module'];
        //check for existing data
        scenarioService.retrieveDepreciation($ctrl.scenario_id)
        .then(function(depreciation_response){
          if(depreciation_response.data.length == 0){
            //no exisiting data, create new set
            createNewDepreciation();
          } else {
            //set existing data to the depreciation_list
            $ctrl.depreciation_list = depreciation_response.data;
            $ctrl.depreciation_list.sort(function (a, b) {
              return a.year - b.year
            });

            if(depreciation_response.data.length != $ctrl.years_length){
              console.error("wrong number of Depreciations");
              console.log(depreciation_response.data);

              createNewDepreciation();
            }
          }
        });
      }

      function createNewDepreciation(){
        //get depreciation data from all budgets in the scenario
        scenarioService.listDepreciation($ctrl.scenario_id)
        .then(function(response) {
          if (response !== undefined && response.data !== undefined) {
            //if reponse is valid set the array
            $ctrl.depreciation_arr = response.data;
            //for each year create a new depreciation
            angular.forEach($ctrl.years,function (year) {
              var value = $ctrl.depreciation_arr[year-1].toFixed(2);
              scenarioService.createDepreciation({"year":year, "scenario":$ctrl.scenario_id, "depreciation":value});
            });
          }
        });
        //wait for things to resolve then reload
        setTimeout(function(){
            $state.reload();
        }, 2000);
      }

      function updateDepreciation(depreciation){
        scenarioService.updateDepreciation(depreciation);
      }

      function proceed() {
        $state.go("financeInflation", {
          'scenario': $ctrl.scenario_id,
          'module':$ctrl.module
        });
      }

      function back() {
        $state.go("financeDistributions", {
          'scenario': $ctrl.scenario_id,
          'module':$ctrl.module
        });
      }



      /****************************************************************
                           Private Helper Functions
      ****************************************************************/


      function startProgress(num_calls) {
        $ctrl.progress = 0;
        var time_per_call = 500;

        $interval(function() {
          $ctrl.progress++;
        }, ((time_per_call * num_calls) / 100), 100)
      }


    }

}());
