(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeInflation", {
      templateUrl: "/static/scenario/finance-inflation/finance-inflation.component.html",
      controller: InflationComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    InflationComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      '$uibModal',
    ];

    function InflationComponentController(
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
      //$ctrl.saveTransaction = saveTransaction;
      //$ctrl.addTransaction = addTransaction;
      //$ctrl.remove = remove;
      //$ctrl.edit = edit;
      $ctrl.proceed = proceed;
      $ctrl.back = back;
      $ctrl.update = update;

      // Scenario variable
      $ctrl.scenario;
      $ctrl.module;
      $ctrl.futureloans=[];
      $ctrl.titles = [];
      $ctrl.futureloans = [];
      $ctrl.asset_type_list = ["Intermediate Assets", "Long Term Assets - Facilities and Other Improvements", "Long Term Assets - Real Estate"];



      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        var scenario_id = $state.params['scenario'];
        $ctrl.module = $state.params['module'];
        scenarioService.listInflation(scenario_id)
          .then(function(inflation_response) {
            var filters= inflation_response.data.filter(function(scenario){
              return scenario.scenario == scenario_id
            })
            //console.log(filters);
            if(filters.length != 0){
              $ctrl.inflation = filters[0];
              //console.log($ctrl.inflation);
            } else {
              create(scenario_id);
            }

         });

      }

      function create(scenario_id){
        console.log("increate");
        var scenario_id = $state.params['scenario']
        scenarioService.createInflation( {"scenario":scenario_id}  )
        .then(function(){
          scenarioService.listInflation(scenario_id).then(function(inflation_response) {
            console.log(inflation_response);
            var filters= inflation_response.data.filter(function(scenario){
              return scenario.scenario == scenario_id;
            })
            //console.log(filters);
            if(filters.length != 0){
              $ctrl.inflation = filters[0];
              //console.log($ctrl.inflation);
            }
          //  $ctrl.inflation.scenario = $state.params['scenario']
          });
        });
      }


      function remove(transaction_id) {
        scenarioService.destroyInflation(transaction_id);
        $ctrl.inflation = $ctrl.inflation.filter(function(obj){ obj.id !== transaction_id});
        location.reload();
      }


      function update() {
        //console.log("updating");
        scenarioService.updateInflation($ctrl.inflation);
      }

      function proceed() {
        scenarioService.updateInflation($ctrl.inflation);
        $state.go("financeFirstReview", {
          'scenario': $state.params['scenario'],
          'module':$ctrl.module
        });
      }

      function back() {
        scenarioService.updateInflation($ctrl.inflation);
        $state.go("financeDepreciation", {
          'scenario': $state.params['scenario'],
          'module':$ctrl.module
        });
      }


      /****************************************************************
                           Private Helper Functions
      ****************************************************************/






    }

}());
