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
    .component("scenarioSummary", {
      templateUrl: "/static/scenario/scenario-summary/scenario-summary.component.html",
      controller: ScenarioSummaryComponentController,
      bindings: {
        'plan': '<',
        'onChange': '&',
        'scenario': '<',
      }
    });


  /****************************************************************
   Controller
   ****************************************************************/

  ScenarioSummaryComponentController.$inject = [
    '$state',
    '$q',
    'scenarioService',
    'lineChartColors',
    'commonService',
    '$window',
    '$timeout'
  ];

  function ScenarioSummaryComponentController(
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
    $ctrl.back = back;
    $ctrl.numberWithCommas = numberWithCommas;
    $ctrl.return_dashboard = return_dashboard;
    $ctrl.loadBudget=loadBudget;
    $ctrl.budget_list=null;
    $ctrl.notes=null
    $ctrl.edited;

    // Scenario
    $ctrl.scenario;
    $ctrl.plans;
    $ctrl.module;
    $ctrl.summary_title = "AgBizProfit Analysis";
    $ctrl.checkTitlelength = checkTitlelength;


    // Tabs
    $ctrl.updatePlanValues = updatePlanValues;


    $ctrl.longestTotalPeriod = 0;


    /****************************************************************
     Methods
     ****************************************************************/

    function $onInit() {
      var scenario_id = $state.params['scenario'];
      $ctrl.module = $state.params["module"];
      $ctrl.edited = $state.params["edited"];
      console.log($ctrl.edited);


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
                console.log(plan_response);
                $ctrl.plans = plan_response.data;
                $ctrl.plans.sort(function (a, b) {
                  return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
                });
              });
            }
        });
      }
    }

    function proceed(next_step) {
      if ($ctrl.module === undefined) {
        $ctrl.module = 'manager';
      }
      if(next_step=='edit'){
        $state.go("scenarioCreate", {'scenario': $ctrl.scenario.id, module:$ctrl.module});
      }else if (next_step=='save') {
        $state.go("scenarioManager", {module:$ctrl.module});
      }else if (next_step=='profit') {
        //copy scenario and use copy in profit
        scenarioService.copyScenario($ctrl.scenario)
        .then(function (copy_response){
          //update type and dates
          var scenario_copy = copy_response.data;
          scenario_copy.type = 'profit';
          scenario_copy.modified_date = new Date();
          scenario_copy.created_date = new Date();
          scenarioService.updateScenario(scenario_copy)
          .then(function (update_response){
            var updated_scenario = update_response.data;
            $state.go("scenarioCreate", {'scenario': updated_scenario.id, module:'profit', new:'manager'});
          });
        });
      }else if (next_step=='finance') {
        //copy scenario and use copy in finance
        scenarioService.copyScenario($ctrl.scenario)
        .then(function (copy_response){
          //update type and dates
          var scenario_copy = copy_response.data;
          scenario_copy.type = 'finance';
          scenario_copy.modified_date = new Date();
          scenario_copy.created_date = new Date();
          scenarioService.updateScenario(scenario_copy)
          .then(function (update_response){
            var updated_scenario = update_response.data;
            $state.go("scenarioCreate", {'scenario': updated_scenario.id, module:'finance', new:'manager'});
          });
        });
      }
    }

    function back() {
      if ($ctrl.module === undefined) {
        $ctrl.module = 'manager';
      }
      if($ctrl.edited!="true"){
          console.log(213)
      $state.go("scenarioManager", {'scenario': $ctrl.scenario_id, 'module': $ctrl.module});
    }
      if($ctrl.edited=="true"){
          console.log(23)
            $state.go("scenarioCreate",{'scenario': $ctrl.scenario.id, 'module':$ctrl.module})
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


    /****************************************************************
     Private Helper Functions
     ****************************************************************/

    function loadBudget(plan){
        var list=[]
        console.log(plan)
        angular.forEach(plan.plan_budgets, function (budeget, index) {
        var word=[]
        word= budeget.title+"("+budeget.time_value+budeget.time_unit+")"
         list.push(word)
         $ctrl.notes=plan.notes
         console.log($ctrl.notes)

    });

    $ctrl.budget_list=list;
  }


}

}());
