(function() {
  'use strict';

  var app = angular.module("allocateModule");
  app.component("allocateSummary", {
      templateUrl: "/static/allocate/allocate-summary/allocate-summary.component.html",
      controller: AllocateSummaryComponentController,
    });

  /*
   *  OrderObjectBy:  Convert json style data to array
   *                  since default orderBy in AngularJs
   *                  only support data in array, but not
   *                  json.
   *
   *  arguments: items   -- json data
   *             field   -- sort by {field}
   *             reverse -- true: descending, false: ascending
   */

  app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if(reverse) filtered.reverse();
      return filtered;
    };
  });

  /****************************************************************
                       Controller
  ****************************************************************/

  AllocateSummaryComponentController.$inject = [
    "$scope",
    "$q",
    "$state",
    "$interval",
    "$window",
    "allocateService",
    "commonService",
    "budgetService",
  ];

  function AllocateSummaryComponentController(
    $scope,
    $q,
    $state,
    $interval,
    $window,
    allocateService,
    commonService,
    budgetService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.changeStatement = changeStatement;
    $ctrl.totalIncome = totalIncome;
    $ctrl.totalExpenses = totalExpenses;
    $ctrl.proceed = proceed;
    $ctrl.back = back;

    // Allocate data
    $ctrl.business_data_list;
    $ctrl.enterprise_data_list;
    $ctrl.gold_standard_categories;
    $ctrl.statement_type = "Income";
    $ctrl.business_index;

    // Tabs
    $ctrl.current_business;

    // Misc
    $ctrl.user;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      startProgress(2);

      var requests = [],
          response_objects = [];

      commonService.retrieveCurrentUser()
      .then(function(user_response) {
        $ctrl.user = user_response.data;

        requests.push(allocateService.listCategories());
        requests.push(allocateService.listBusinessData($ctrl.user.username));
        requests.push(allocateService.listEnterpriseData($ctrl.user.username));

        // Resolve all requests
        $q.all(requests)
        .then(function(responses, index) {
          angular.forEach(responses, function(response, request) {
            response_objects.push(response.data.length);

            // If either BusinessData or EnterpriseData is missing, change state
            if (response.data == undefined || response.data.length <= 0) {
              $state.go("home");
            }
          });

          $ctrl.gold_standard_categories = setOtherExpensesLabels(responses[0].data, responses[2].data[0]);
          $ctrl.business_data_list = responses[1].data;
          $ctrl.enterprise_data_list = responses[2].data;
          $ctrl.current_business = $ctrl.business_data_list[0].business_type;

          $ctrl.business_index = $ctrl.business_data_list.indexOf($ctrl.current_business) + 1;
        });
      });
    }


    function changeStatement() {
      $ctrl.statement_type == "Income" ? $ctrl.statement_type = "Expenses" : $ctrl.statement_type = "Income";
    }


    function totalIncome(business_type) {
      return $ctrl.enterprise_data_list
        .filter(function(enterprise) {
          return enterprise.enterprise == business_type;
        })
        .reduce(function(previous_total_income, enterprise) {
          return previous_total_income + enterprise.total_income;
      }, 0);
    }


    function totalExpenses(business_type) {
      return $ctrl.enterprise_data_list
        .filter(function(enterprise) {
          return enterprise.enterprise == business_type;
        })
        .reduce(function(previous_total_expenses, enterprise) {
          return previous_total_expenses + enterprise.total_expenses;
      }, 0);
    }


    function proceed() {

      if (typeof ($ctrl.business_data_list) !== "undefined"){
        if ($ctrl.business_index === $ctrl.business_data_list.length - 1 && $ctrl.statement_type === "Expenses"){
          budgetService.generateBudgets().then(function() {
            $window.location.assign("/budget/");
          });
        }
        else if ($ctrl.business_index < $ctrl.business_data_list.length - 1 && $ctrl.statement_type === "Expenses") {
          $ctrl.business_index++;
          $ctrl.current_business = $ctrl.business_data_list[$ctrl.business_index].business_type;
          $ctrl.statement_type = "Income";

          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
        else{
          $ctrl.statement_type = "Expenses";
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
      }

    }


    function back() {
      $state.go("enterpriseAllocate");
    }



    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Set 'other expenses' field names to their labels. Returns a new gold standard categories object.
    */
    function setOtherExpensesLabels(gold_standard_categories, enterprise_data) {
      angular.forEach(enterprise_data, function(value, field) {
        if (field.indexOf("_label") != -1 && value !== "") {
          var expense_field = field.replace("_label", "");

          gold_standard_categories[value] = gold_standard_categories[expense_field];
          gold_standard_categories[value].label = "Other Expenses: " + value;
          delete gold_standard_categories[expense_field];
        }
      });

      return gold_standard_categories;
    }

    /*
        Faux progress method.  Takes the number of async calls in a method and
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

}());
