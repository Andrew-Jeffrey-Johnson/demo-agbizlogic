(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("scenarioManager", {
      templateUrl: "/static/scenario/scenario-manager/scenario-manager.component.html",
      controller: ScenarioManagerComponentController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ScenarioManagerComponentController.$inject = [
    '$state',
    '$filter',
    'commonService',
    'scenarioService',
    "$window",
    "$uibModal",
  ];

  function ScenarioManagerComponentController(
    $state,
    $filter,
    commonService,
    scenarioService,
    $window,
    $uibModal) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods Scenario
    $ctrl.$onInit = $onInit;
    $ctrl.addNewScenario = addNewScenario;
    $ctrl.editScenario = editScenario;
    $ctrl.removeScenario = removeScenario;
    $ctrl.viewSummary = viewSummary;
    $ctrl.back = back;

    // Methods Finance Analysis
    $ctrl.analyzeFinanceScenario = analyzeFinanceScenario;
    $ctrl.editfinanceAnalysis = editfinanceAnalysis;
    $ctrl.removefinanceAnalysis = removefinanceAnalysis;
    $ctrl.editCurrentFinanceInfo = editCurrentFinanceInfo;
    $ctrl.makeAccrualAdjustments = makeAccrualAdjustments;

    // Module
    $ctrl.module;
    $ctrl.check=true; // Only allow one model to open at one time

    // Scenarios
    $ctrl.scenario_list;
    $ctrl.financeAnalysis_list;

    // User
    $ctrl.user;

    // Finance
    $ctrl.beginning_balance_sheet_id;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.module = $state.params["module"];
      console.log($ctrl.module);

      commonService.retrieveCurrentUser()
      .then(function(current_user_response) {
        $ctrl.user = current_user_response.data;

        return scenarioService.listScenarios($ctrl.user.username, ["id", "title", "notes", "created_date", "modified_date", "type"])
      })
      .then(function(scenario_list_response) {
        if (scenario_list_response !== undefined &&
            scenario_list_response.data !== undefined) {
          $ctrl.scenario_list = scenario_list_response.data;
          console.log($ctrl.scenario_list)

        }

        if ($ctrl.module === 'finance') {
          scenarioService.listFinanceAnalysis($ctrl.user.username, ["id", "title", "notes","temp", "created_date", "modified_date", "type"])
          .then(function(financeAnalysis_response) {
            if (financeAnalysis_response !== undefined &&
                financeAnalysis_response.data !== undefined) {
              $ctrl.financeAnalysis_list = financeAnalysis_response.data;
              console.log($ctrl.financeAnalysis_list);
              var tempfinanceAnalysis = $ctrl.financeAnalysis_list.filter(function(financeAnalysis){
                return (financeAnalysis.temp === "True");

              });
              angular.forEach(tempfinanceAnalysis, function(financeAnalysis, key){
                console.log(financeAnalysis);
                removefinanceAnalysis(financeAnalysis);

              });
              $ctrl.financeAnalysis_list = $ctrl.financeAnalysis_list.filter(function(financeAnalysis){
                return (financeAnalysis.temp === "False");

              });
              console.log($ctrl.financeAnalysis_list);


            }
          });

          commonService.retrieveCurrentUser()
          .then(function(user_response) {
            if(user_response !== undefined){
              $ctrl.user = user_response.data;
            }
            scenarioService.retrieveBalanceSheet('?username=', $ctrl.user.username)
            .then(function(balancesheet_response) {
              // console.log("Balancesheet", balancesheet_response.data);
              if (balancesheet_response === undefined ||
              balancesheet_response.data.length === 0) {
                if ($ctrl.check==true){
                  openRemindModal("finance");
                }
              }
              if ($ctrl.scenario_list.length<1){
                if ($ctrl.check==true){
                  openRemindModal("scenario");
                }

              }

            });
          });

        }
        checkScenarioByPage($ctrl.scenario_list);
      });

    }

    function checkScenarioByPage(scenario_list){
      //console.log($ctrl.module);
      //console.log(scenario_list);

      if ($ctrl.module=="finance"){
        //filter to finance scenarios
        $ctrl.scenario_list=scenario_list.filter(function(scenario) {
          return scenario.type === "finance"
        });
      }else if ($ctrl.module=="profit"){
        //filter to profit scenarios
        $ctrl.scenario_list=scenario_list.filter(function(scenario) {
          return scenario.type === "profit"
        });
      } else if ($ctrl.module=="scenario") {
        //filter to manager scenarios
        $ctrl.scenario_list=scenario_list.filter(function(scenario) {
          return scenario.type === "manager"
        });
      }

    }

    function addNewScenario(scenario_type) {
      var type="manager"
      if(scenario_type === 'copy'){
        openCopyScenarioModal();
      }
      else if (scenario_type === 'new') {

        if($ctrl.module === undefined){
          $ctrl.module = 'profit';
        }
        if($ctrl.module === 'profit'){
          type="profit"
        }
        if($ctrl.module === 'finance'){
          type="finance"
        }


        var default_scenario = {
          'title': "New Scenario",
          'type': type,
        };
        console.log(default_scenario)
        scenarioService.createScenario(default_scenario)
        .then(function(new_scenario_response) {
          if (new_scenario_response !== undefined &&
              new_scenario_response.data !== undefined &&
              new_scenario_response.data.id !== undefined &&
              new_scenario_response.data.id > 0 &&
              new_scenario_response.data.title !== undefined) {
            $state.go("scenarioCreate", {
              'scenario': new_scenario_response.data.id,
              'module': $ctrl.module,
              'new': scenario_type,
            });
          }
        });
      }
    }


    function editScenario(scenario) {
      console.log("edit scenario");
      console.log($ctrl.module);
      if($ctrl.module === undefined){
        $ctrl.module = 'scenario';
      }
      if (scenario !== undefined &&
          scenario.id !== undefined &&
          scenario.id > 0) {

        //in scenario manager
        if ($ctrl.module=='scenario'){
          $state.go("scenarioSummary", {
            'scenario': scenario.id,
            'module' : $ctrl.module
          });

        //in profit manager
        } else if ($ctrl.module=='profit') {
          $state.go("profitSummary", {
              'scenario': scenario.id,
              'module': $ctrl.module,
              'from_profit':"true",
          });
        //in finance manager
        } else if ($ctrl.module=='finance') {
          $state.go("scenarioCreate", {
            'scenario': scenario.id,
            'module':$ctrl.module
          });
        }
      }
    }

    function removeScenario(scenario) {
      if (scenario !== undefined &&
          scenario.id !== undefined &&
          scenario.id > 0) {
        scenarioService.destroyScenario(scenario.id)
        .then(function(response) {
          return scenarioService.listScenarios($ctrl.user.username);
        })
        .then(function(scenario_list_response) {
          if (scenario_list_response !== undefined &&
              scenario_list_response.data !== undefined) {
            $ctrl.scenario_list = scenario_list_response.data;
          }
        });
      }
    }


    function viewSummary(scenario) {

      if (scenario !== undefined &&
          scenario.id !== undefined) {
            if($ctrl.module!="profit"){
                $state.go("scenarioSummary", {
                    'scenario': scenario.id,
                    'module': $ctrl.module,
                });
            }
            else{
                $state.go("profitSummary", {
                    'scenario': scenario.id,
                    'module': $ctrl.module,
                });
            }
      }

    }

    function back() {
      $window.location.replace("/dashboard");
    }

    function openCopyScenarioModal() {
      $uibModal.open({
        animation: true,
        size: "lg",
        templateUrl: "/static/scenario/scenario-manager/copy-scenario-modal/copy-scenario-modal.html",
        controller: "CopyScenarioModalController",
        controllerAs: "$ctrl",
        resolve: {
          scenario_list: function() {
            return $ctrl.scenario_list;
          },
        },
      });
    }


    /****************************************************************
                    Methods - Finance Analysis
    ****************************************************************/

    function analyzeFinanceScenario() {
      var default_financeAnalysis = {
        'title': "New Finance Analysis",
        'temp' : "True"
      };
      scenarioService.createFinanceAnalysis(default_financeAnalysis)
      .then(function(new_financeAnalysis_response) {
        if (new_financeAnalysis_response !== undefined &&
            new_financeAnalysis_response.data !== undefined &&
            new_financeAnalysis_response.data.id !== undefined &&
            new_financeAnalysis_response.data.id > 0 &&
            new_financeAnalysis_response.data.title !== undefined) {
          $state.go("financeAnalysis", {
            'analysis': new_financeAnalysis_response.data.id,
            'module': $ctrl.module
          });
        }
      });
    }

    function editfinanceAnalysis(financeAnalysis) {
      if (financeAnalysis !== undefined &&
          financeAnalysis.id !== undefined &&
          financeAnalysis.id > 0) {
        $state.go("financeAnalysis", {
          'analysis': financeAnalysis.id,
          'module' : $ctrl.module
        });
      }
    }

    function removefinanceAnalysis(financeAnalysis) {
      if (financeAnalysis !== undefined &&
          financeAnalysis.id !== undefined &&
          financeAnalysis.id > 0) {
        scenarioService.destroyFinanceAnalysis(financeAnalysis.id)
        .then(function(response) {
          return scenarioService.listFinanceAnalysis($ctrl.user.username);
        })
        .then(function(financeanalysis_list_response) {
          if (financeanalysis_list_response !== undefined &&
              financeanalysis_list_response.data !== undefined) {
            $ctrl.financeAnalysis_list = financeanalysis_list_response.data;
          }
        });
      }
    }

    function openRemindModal(type) {
      if (type=="finance"){
        var modal = $uibModal.open({
          animation: true,
          size: "lg",
          templateUrl: "/static/scenario/scenario-manager/finance-setup-modal/finance-setup-modal.html",
          controller: "FinanceSetupModalController",
          controllerAs: "$ctrl"
        });

        var default_beginning_balance_sheet = {
          'user':$ctrl.user.id,
          'year': 0,
        };

        modal.result.then(function() {
          console.log(default_beginning_balance_sheet)
          scenarioService.createBalanceSheet(default_beginning_balance_sheet)
          .then(function(default_beginning_balance_sheet_response) {
            console.log(default_beginning_balance_sheet_response)
            if (default_beginning_balance_sheet_response !== undefined &&
                default_beginning_balance_sheet_response.data !== undefined &&
                default_beginning_balance_sheet_response.data.id !== undefined) {
              $state.go("financeBalanceSheet", {
                'balance-sheet': default_beginning_balance_sheet_response.data.id,
                'module': 'finance',
              });
            }
          });
        });
      }

      if (type=="scenario"){
        var modal = $uibModal.open({
          animation: true,
          size: "lg",
          templateUrl: "/static/scenario/scenario-manager/scenario-setup-modal/scenario-setup-modal.html",
          controller: "ScenarioSetupModalController",
          controllerAs: "$ctrl"
        });
      }

    $ctrl.check=false

    }


    function editCurrentFinanceInfo() {
      $state.go("financeBalanceSheet", {
        'balance-sheet': $ctrl.beginning_balance_sheet_id,
        'module':$ctrl.module
      });
    }

    function makeAccrualAdjustments() {
      $uibModal.open({
        animation: true,
        size: "lg",
        templateUrl: "/static/scenario/scenario-manager/accrual-adjustments-modal/accrual-adjustments-modal.html",
        controller: "AccrualAdjustmentsModalController",
        controllerAs: "$ctrl",
        resolve: {
          scenario_list: function() {
            return $ctrl.scenario_list;
          },
        },
      });
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/
  }

}());
