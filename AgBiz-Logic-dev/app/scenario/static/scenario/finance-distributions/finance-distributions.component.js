(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeDistributions", {
      templateUrl: "/static/scenario/finance-distributions/finance-distributions.component.html",
      controller: FinanceDistributionComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceDistributionComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      "$uibModal"
    ];

    function FinanceDistributionComponentController(
      $state,
      $filter,
      commonService,
      scenarioService,
      $uibModal) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.updateDistributions = updateDistributions;
      $ctrl.proceed = proceed;
      $ctrl.back = back;
      $ctrl.itemAttributeMap = itemAttributeMap;
      $ctrl.new;

      // Scenario
      $ctrl.scenario;
      $ctrl.module;
      $ctrl.distributions=[];
      $ctrl.years = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


      /****************************************************************
                           Methods
      ****************************************************************/


       function $onInit() {
         $ctrl.module = $state.params['module'];
         var scenario_id = $state.params['scenario'];
         scenarioService.listDistributions(scenario_id)
         .then(function(distributions_response) {
           $ctrl.distributions = distributions_response.data;
           if($ctrl.distributions.length == 0){
             buildDateWithfresh();
           } else {
             $ctrl.distributions.sort(function (a, b) {
               return a.year - b.year
             });
             console.log($ctrl.distributions)
             numberWithCommas($ctrl.distributions)
           }
         });
       }
       function numberWithCommas(x) {
         angular.forEach(x, function(value, key) {
           value.wages=value.wages.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
           value.contributions=value.contributions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
           value.salaries=value.salaries.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
           value.capital_gains=value.capital_gains.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
           value.tax_rate=value.tax_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
           value.family_withdrawls=value.family_withdrawls.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
         });
       }


       function updateDistributions(distribution){

           distribution.wages=distribution.wages.toString().replace(/[^\d\.\-]/g, "");
           distribution.contributions=distribution.contributions.toString().replace(/[^\d\.\-]/g, "");
           distribution.salaries=distribution.salaries.toString().replace(/[^\d\.\-]/g, "");
           distribution.capital_gains=distribution.capital_gains.toString().replace(/[^\d\.\-]/g, "");
           distribution.tax_rate=distribution.tax_rate.toString().replace(/[^\d\.\-]/g, "");
           distribution.family_withdrawls=distribution.family_withdrawls.toString().replace(/[^\d\.\-]/g, "");
           console.log(distribution)
         scenarioService.updateDistributions(distribution);
       }


      function proceed() {
        var scenario_id = $state.params['scenario'];
        $state.go("financeDepreciation", {
          'module': $ctrl.module,
          'scenario': scenario_id,
        });
      }




      function back() {

        $state.go("scenarioCreate", {
          'scenario': $state.params['scenario'],
          'module':$ctrl.module
          });
      }

      function itemAttributeMap(item) {
        var map = {
          "1": "year_1",
          "2": "year_2",
          "3": "year_3",
          "4": "year_4",
          "5": "year_5",
          "6": "year_6",
          "7": "year_7",
          "8": "year_8",
          "9": "year_9",
          "10": "year_10",
        }
        return map[item];

      }

      function buildDate(){
        var scenario_id = $state.params['scenario'];
        for(var b=1;b<11;b++){
          //console.log("---------")
          //console.log(b)

           //console.log($ctrl.acres_arr[b])
           scenarioService.createDistributions({"year":b ,"scenario":scenario_id});

         }
      }
      function buildDateWithfresh(){
        buildDate();
        location.reload();
      }

    }

}());
