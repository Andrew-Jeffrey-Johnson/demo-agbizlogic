(function() {
  'use strict';

  var app = angular.module("allocateModule");
  app.component("enterpriseAllocate", {
      templateUrl: "/static/allocate/enterprise-allocate/enterprise-allocate.component.html",
      controller: EnterpriseAllocateComponentController,
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

    EnterpriseAllocateComponentController.$inject = [
      "$scope",
      "$q",
      "$state",
      "$interval",
      "allocateService",
      "commonService",
      "modalService",
    ];

    function EnterpriseAllocateComponentController(
      $scope,
      $q,
      $state,
      $interval,
      allocateService,
      commonService,
      modalService) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.updateData = updateData;

      $ctrl.selectCurrent = selectCurrent;

      $ctrl.proceed = proceed;
      $ctrl.back = back;

      // Business data
      $ctrl.business_data_list;
      $ctrl.enterprise_data_list;
      $ctrl.gold_standard_categories = {};
      $ctrl.statement_type = "Income";
      $ctrl.business_index = 0;

      // Tabs
      $ctrl.current_business;

      // Misc
      $ctrl.user;

      // Errors
      $ctrl.errors = {};
      $ctrl.request_error;
      $ctrl.status = new Array();


      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        commonService.retrieveCurrentUser()
        .then(function(user_response) {
          $ctrl.user = user_response.data;

          return allocateService.listBusinessData($ctrl.user.username);
        })
        .then(function(business_data_list_response) {
          if (business_data_list_response === undefined ||
              business_data_list_response.data === undefined ||
              business_data_list_response.data.length < 1) {
            $state.go("home");
          }
          else {
            $ctrl.business_data_list = removeTotals(business_data_list_response.data);

            for (var i = 0; i < $ctrl.business_data_list.length; i++){
              $ctrl.status[i] = "invalid";
            }

            return allocateService.listEnterpriseData($ctrl.user.username);
          }
        })
        .then(function(enterprise_data_list_response) {
          if (enterprise_data_list_response === undefined ||
              enterprise_data_list_response.data === undefined ||
              enterprise_data_list_response.data.length < 1) {
            $state.go("home");
          }
          else {
            $ctrl.enterprise_data_list = removeTotals(enterprise_data_list_response.data);

            return allocateService.listCategories();
          }
        })
        .then(function(categories_response) {
          if (categories_response === undefined ||
              categories_response.data === undefined ||
              categories_response.length < 1) {
            $state.go("home");
          }
          else {
            $ctrl.gold_standard_categories = categories_response.data;
            businessDataToGoldStandard();
            sortEnterprises();
            $ctrl.current_business = $ctrl.business_data_list[0];

            // Set default error map
            angular.forEach($ctrl.gold_standard_categories, function(categories, business) {
              var business_errors = {};
              angular.forEach(categories, function(category) {
                if (category.total <= 0) {
                  business_errors[category.name] = "valid";
                }
                else if (category.total > 0) {
                  business_errors[category.name] = "underallocated";
                }
              });
              $ctrl.errors[business] = business_errors;
            });
          }
        });
      }

      function selectCurrent(business) {
        $ctrl.current_business = business;
        $ctrl.business_index = $ctrl.business_data_list.indexOf($ctrl.current_business);

        refreshCheck($ctrl.business_data_list.length);
      }

      function updateData(targets, status) {

        if (typeof ($ctrl.business_data_list) != "undefined"){
          if (targets !== undefined &&
            targets.length > 0) {

            $ctrl.errors[targets[0].business][targets[0].category] = status;

            refreshCheck($ctrl.business_data_list.length);

            // Iterates over targets and assigns new value to corresponding element in enterprise data list using
            // controller's current business and target's index and category properties to locate.
            angular.forEach(targets, function(target) {
              $ctrl.enterprise_data_list[target.business][target.index][target.category] = target['value'];
            });
          }
        }
      }


      function proceed() {
        var sum = 0;

        if (typeof ($ctrl.business_data_list) !== "undefined"){
          for (var i = 0; i < $ctrl.business_data_list.length; i++) {
            if ($ctrl.status[i] === "invalid"){

              // TODO: Doesn't solve the problem that switching to the tab after clicking 'ok' in alert
              modalService.alert("All remainder values in "+$ctrl.business_data_list[i].business_type+" must be zero in order to continue.");

              // Switch to the tab that is not allocated
              if ($ctrl.business_index !== -1 && $ctrl.business_index <= $ctrl.business_data_list.length - 1) {
                $ctrl.current_business = $ctrl.business_data_list[i];
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }
              break;
            }
            else{
              sum++;
            }
          }

          if (sum === $ctrl.business_data_list.length){

            startProgress(2);

            var requests = [];
            angular.forEach($ctrl.enterprise_data_list, function(enterprises) {
              angular.forEach(enterprises, function(enterprise_data) {
                var enterprise_data_updated = setOtherExpenses($ctrl.gold_standard_categories[enterprise_data.enterprise], enterprise_data);
                requests.push(allocateService.updateEnterpriseData(enterprise_data_updated));
              });
            });

            // Resolve all requests
            $q.all(requests)
            .then(function(responses) {
              if ($ctrl.statement_type === "Income") {
                $ctrl.statement_type = "Expenses";
                $ctrl.current_business = $ctrl.business_data_list[0];
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }
              else if ($ctrl.statement_type === "Expenses") {
                $state.go("allocateSummary");
              }
            }, function(response) {
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
              $ctrl.request_error = response;
            });
          }
        }
      }


      function back() {
        if ($ctrl.statement_type == "Income") {
          $state.go("enterpriseSelect");
        }
        else if ($ctrl.statement_type == "Expenses" &&
                 $ctrl.status != "invalid") {
          $ctrl.statement_type = "Income";
        }
        else if ($ctrl.statement_type == "Expenses" &&
                 $ctrl.status == "invalid") {
           modalService.alert("There are errors with your allocation data. Please resolve them before going back.");
        }
      }


      /****************************************************************
                           Private Helper Functions
      ****************************************************************/

      /*
          Removes the 'total_income' and 'total_expenses' fields from all objects in the given list.
          Returns the modified list of objects. This prevents issues with creating allocateItem
          components from the totals fields.
      */
      function removeTotals(allocate_data_list) {
        if (allocate_data_list !== undefined && allocate_data_list.length > 0) {
          allocate_data_list.forEach(function(enterprise_data) {
            delete enterprise_data["total_income"];
            delete enterprise_data["total_expenses"];
          });
        }

        return allocate_data_list;
      }

      /*
          Creates new source objects using only BusinessData Gold Standard fields.
      */
      function businessDataToGoldStandard() {
        var new_categories = {};

        $ctrl.business_data_list.forEach(function(business) {
          var new_source = angular.copy($ctrl.gold_standard_categories);

          angular.forEach(business, function(value, field) {
            // Set 'other expenses' labels and values
            if (field.indexOf("_label") != -1 && value !== "") {
              var expense_field = field.replace("_label", "");

              new_source[value] = new_source[expense_field];
              new_source[value].total = business[expense_field];
              new_source[value].label = value;
              delete new_source[expense_field];
            }
            else if (field != 'business_type' &&
                field != 'id' &&
                field != "$$hashKey" &&
                field.indexOf("other_") == -1) {
              new_source[field].total = value;
            }
          });

          new_categories[business.business_type] = angular.copy(new_source);
        });

        $ctrl.gold_standard_categories = new_categories;
      }


      /*
          Finds 'other expenses' from given gold standard categories and returns a new EnterpriseData object with correct
          values and labels set.
      */
      function setOtherExpenses(gold_standard_categories, enterprise_data) {
        angular.forEach(enterprise_data, function(value, field) {
          if (field.indexOf("_label") != -1) {
            var expense_field = field.replace("_label", "");

            angular.forEach(gold_standard_categories, function(data, category) {
              if (data.name == expense_field) {
                enterprise_data[field] = category;
              }
            });
          }
        });

        return enterprise_data;
      }


      /*
          Sorts EnterpriseData objects by 'enterprise' attribute.
      */
      function sortEnterprises() {
        var new_enterprise_data_list = {};
        angular.forEach($ctrl.enterprise_data_list, function(enterprise) {
          if (new_enterprise_data_list[enterprise.enterprise] == undefined) {
            new_enterprise_data_list[enterprise.enterprise] = [];
          }

          new_enterprise_data_list[enterprise.enterprise].push(enterprise);
        });

        $ctrl.enterprise_data_list = new_enterprise_data_list;
      }


      /*
          Faux progress method. Takes the number of async calls in a method and
          increments progress to 100 according to time estimate (time_per_call * num_calls).
      */
      function startProgress(num_calls) {
        $ctrl.progress = 0;
        var time_per_call = 500;

        $interval(function() {
          $ctrl.progress++;
        }, ((time_per_call * num_calls) / 100), 100)
      }


      /*
          Recheck the status of whether all elements are allocated
       */
      function refreshCheck(list_length) {

        for (var i = 0; i < list_length; i++) {
          // Sets status flag by checking that all elements of error list equal 'valid' for the given statement type
          $ctrl.status[i] = "valid";
          angular.forEach($ctrl.errors[$ctrl.business_data_list[i].business_type], function(error, category) {

          if (category.indexOf($ctrl.statement_type.toLowerCase()) != -1 && error != 'valid') {
            $ctrl.status[i] = "invalid";
          }
          });
        }
      }

    }


}());
