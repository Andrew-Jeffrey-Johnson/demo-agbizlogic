(function () {
  'use strict';

  var app = angular.module("allocateModule");
  app.component("businessSummary", {
    templateUrl: "/static/allocate/business-summary/business-summary.component.html",
    controller: BusinessSummaryComponentController,
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

  app.filter('orderObjectBy', function () {
    return function (items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function (item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if (reverse) filtered.reverse();
      return filtered;
    };
  });


  /****************************************************************
   Controller
   ****************************************************************/

  BusinessSummaryComponentController.$inject = [
    "$scope",
    "$state",
    "$interval",
    "$window",
    "allocateService",
    "commonService",
  ];

  function BusinessSummaryComponentController(
    $scope,
    $state,
    $interval,
    $window,
    allocateService,
    commonService) {
    var $ctrl = this;

    /****************************************************************
     Bindable Members
     ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.changeStatement = changeStatement;
    $ctrl.getLabel = getLabel;
    $ctrl.isCategoryEmpty = isCategoryEmpty;
    $ctrl.proceed = proceed;
    $ctrl.back = back;

    // Allocate data
    $ctrl.business_data_list;
    $ctrl.whole_farm_data;
    $ctrl.gold_standard_categories;
    $ctrl.statement_type = "Income";

    // Tabs
    $ctrl.current_business;

    // Misc
    $ctrl.user;


    /****************************************************************
     Methods
     ****************************************************************/

    function $onInit() {
      startProgress(2);

      commonService.retrieveCurrentUser()
        .then(function (user_response) {
          if (user_response !== undefined &&
            user_response.data !== undefined &&
            user_response.data.id !== undefined) {
            $ctrl.user = user_response.data;

            return allocateService.listCategories();
          }
          else {
            $state.go("home");
          }
        })
        .then(function (categories_response) {
          if (categories_response === undefined ||
            categories_response.data === undefined ||
            categories_response.data.length <= 0) {
            $state.go("home");
          }
          else {
            $ctrl.gold_standard_categories = categories_response.data;
            return allocateService.listBusinessData($ctrl.user.username);
          }
        })
        .then(function (business_data_list_response) {
          if (business_data_list_response === undefined ||
            business_data_list_response.data === undefined ||
            business_data_list_response.data.length <= 0) {
            $state.go("home")
          }
          else {
            $ctrl.business_data_list = business_data_list_response.data;
            return allocateService.listWholeFarm($ctrl.user.username);
          }
        })
        .then(function (whole_farm_response) {
          if (whole_farm_response !== undefined &&
            whole_farm_response.data !== undefined &&
            Object.keys(whole_farm_response.data).length > 0) {
            $ctrl.whole_farm_data = whole_farm_response.data;
          }
          else {
            $state.go("home");
          }
        });
    }


    function changeStatement() {
      $ctrl.statement_type == "Income" ? $ctrl.statement_type = "Expenses" : $ctrl.statement_type = "Income";
    }


    function getLabel(gold_standard_category) {
      var label = gold_standard_category.label;

      if (gold_standard_category.name.indexOf("other") != -1) {
        label = $ctrl.business_data_list[0][gold_standard_category.name + "_label"];
      }

      return label;
    }


    function isCategoryEmpty(category) {
      var empty;
      if ($ctrl.business_data_list === undefined) {
        empty = true;
      }
      else {
        $ctrl.business_data_list.forEach(function (business_data) {
          if (business_data[category] !== 0) {
            empty = false;
          }
        });
      }

      return empty;
    }


    function proceed() {
      $window.location.assign("/dashboard/");
    }


    function back() {
      $state.go("businessAllocate");
    }


    /****************************************************************
     Private Helper Functions
     ****************************************************************/

    /*
        Faux progress method. Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function () {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }

  }

}());
