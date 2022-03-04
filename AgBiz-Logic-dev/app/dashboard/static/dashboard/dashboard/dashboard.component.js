(function() {
  'use strict';

  angular
    .module("dashboardModule")
    .component("dashboard", {
      templateUrl: "/static/dashboard/dashboard/dashboard.component.html",
      controller: DashboardComponentController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  DashboardComponentController.$inject = [
    '$scope',
    '$window',
    'commonService',
    'modalService',
    'dashboardService',
  ];

  function DashboardComponentController(
    $scope,
    $window,
    commonService,
    modalService,
    dashboardService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.proceed = proceed;

    // User data
    $ctrl.user;

    // Next step
    $ctrl.next_step;
    $ctrl.completed_steps = 0;
    $ctrl.next_step_instructions;



    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      commonService.retrieveCurrentUser()
      .then(function(current_user_response) {
        if (current_user_response !== undefined &&
            current_user_response.data !== undefined &&
            current_user_response.data.username !== undefined &&
            current_user_response.data.id !== undefined) {
          $ctrl.user = current_user_response.data;

          return commonService.getNextStep($ctrl.user.username);
        }
        else {
          $window.location.assign("/index/")
        }
      })
      .then(function(next_step_response) {
        if (next_step_response !== undefined &&
            next_step_response.data !== undefined &&
            next_step_response.data.next_step !== undefined) {
          $ctrl.next_step = next_step_response.data.next_step;
          $ctrl.completed_steps = getCompletedSteps($ctrl.next_step, modalService, dashboardService);
          $ctrl.next_step_instructions = getNextStepInstructions();
          //setEventListeners();

        }
        else {
          $window.location.assign("/index/");
        }
      });
    }

    function proceed() {
      if ($ctrl.next_step == "schedule-f") {
        $window.location.assign("/income/");
      }
      else if ($ctrl.next_step == "business-select") {
        $window.location.assign("/allocate/#/business-select")
      }
      else if ($ctrl.next_step == "business-allocate") {
        $window.location.assign("/allocate/#/business-allocate");
      }
      else if ($ctrl.next_step == "enterprise-select") {
        $window.location.assign("/allocate/#/enterprise-select")
      }
      else if ($ctrl.next_step == "enterprise-allocate") {
        $window.location.assign("/allocate/#/enterprise-allocate");
      }
      else if ($ctrl.next_step == "budget-creation") {
        $window.location.assign("/budget/#/budget-manager");
      }
      else if ($ctrl.next_step == "agbiz") {

      }
    }


    /* OLD
    function saveDashboard() {
      var dashboard = calculateDashboard($ctrl.dashboard_config);
      dashboardService.updateDashboard(dashboard)
      .then(function(dashboard_response) {
        $ctrl.dashboard_modified = false;
      });
    }
    */


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Returns the map of next step instructions.
    */
    function getNextStepInstructions() {
      var next_step_instructions = {
        'schedule-f': "Populate <i>AgBiz Logic</i> with income and expense data.",
        'business-select': "Allocate your business income and expenses by category.",
        'business-allocate': "The next step is to allocate your business income and cost information. ",
        'enterprise-select': "Allocate your enterprise income and expenses by category.",
        'enterprise-allocate': "The next step is to allocate your enterprise income and cost information. ",
        'budget-creation': "The next step is to create budgets based on your enterprise allocation data. ",
        'agbiz': "You are now ready to use your Budgets to analyze the impacts of different Scenarios on your investments.",
      };

      return next_step_instructions;
    }


    /*
        Returns the number of completed steps so the UI can display the correct information.
    */
    function getCompletedSteps(next_step, modalService, dashboardService) {
      var completed_steps = 0;

      if (next_step == "schedule-f") {
        completed_steps = 1;
      }
      else if (next_step == "business-select") {
        completed_steps = 2;
      }
      else if (next_step == "business-allocate") {
        completed_steps = 3;
      }
      else if (next_step == "enterprise-select") {
        completed_steps = 4;
      }
      else if (next_step == "enterprise-allocate") {
        completed_steps = 5;
      }
      else if (next_step == "budget-creation") {
        completed_steps = 6;
        modalService.alert("Your first Budgets have been created for you based on your enterprise allocation data.")
      }
      else if (next_step == "agbiz") {
        completed_steps = 7;
        dashboardService.retrieveDashboard()
        .then(function(dashboard_response) {
          if (dashboard_response !== undefined &&
              dashboard_response.data !== undefined) {
            $ctrl.dashboard_config = dashboard_response.data;

            //return dashboardService.setTileGrid($ctrl.dashboard_config, $scope);
          }
        });
      }
      if (completed_steps >= 0 && completed_steps < 7){
        hideSide();

      }
      //console.log(completed_steps);
      return completed_steps;
    }


    /*
        Inspects the DOM and constructs and returns a Dashboard object based on the position of the rendered tiles.
        FIXME: Use a more Angular approach by abstracting away the DOM and only inspecting an object.
        OLD

    function calculateDashboard(dashboard_config) {
      var column_1 = angular.element(document.querySelector("#column-1")).children(),
          column_2 = angular.element(document.querySelector("#column-2")).children();

      angular.forEach(column_1, function(tile_element, row) {
        dashboard_config.tiles.forEach(function(tile) {
          if (tile_element.id.indexOf(tile.tile_type) !== -1) {
            tile.column = 1;
            tile.row = row + 1;
          }
        });
      });

      angular.forEach(column_2, function(tile_element, row) {
        dashboard_config.tiles.forEach(function(tile) {
          if (tile_element.id.indexOf(tile.tile_type) !== -1) {
            tile.column = 2;
            tile.row = row + 1;
          }
        });
      });

      return dashboard_config;
    }
    */


    /*
        OLD
        Sets any event listeners.

    function setEventListeners() {
      $scope.$on("dragEventEnd", function() {
        $ctrl.dashboard_modified = true;
        $scope.$digest();
      });
    }
    */

  }

})();
