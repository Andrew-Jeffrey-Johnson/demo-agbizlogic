(function () {
  'use strict';

  var app = angular.module("allocateModule");
  app.component("businessAllocate", {
    templateUrl: "/static/allocate/business-allocate/business-allocate.component.html",
    controller: BusinessAllocateComponentController,
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

  BusinessAllocateComponentController.$inject = [
    "$scope",
    "$q",
    "$state",
    "$interval",
    "allocateService",
    "commonService",
    "modalService",
    "$uibModal"
  ];

  function BusinessAllocateComponentController(
    $scope,
    $q,
    $state,
    $interval,
    allocateService,
    commonService,
    modalService, $uibModal) {
    var $ctrl = this;

    /****************************************************************
     Bindable Members
     ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.updateData = updateData;
    $ctrl.proceed = proceed;
    $ctrl.saveData = saveData;
    $ctrl.back = back;
    $ctrl.check_zero_remainders = check_zero_remainders;
    $ctrl.modal_func = modal_func;

    // User
    $ctrl.user;

    // Business data
    $ctrl.business_data_list;
    $ctrl.gold_standard_categories;
    $ctrl.statement_type = "Income";

    // Errors
    $ctrl.errors = {};
    $ctrl.status;

    // values for showing modal
    var income_sale_value = 0;
    var income_agriculture_programs_value = 0;
    var income_cooperative_value = 0;
    var income_custom_hire_value = 0;
    var income_insurance_value = 0;
    var income_other_value = 0;

    var expenses_goods_value = 0;
    var expenses_car_value = 0;
    var expenses_chemicals_value = 0;
    var expenses_conservation_value = 0;
    var expenses_custom_hire_value = 0;
    var expenses_depreciation_value = 0;

    var expenses_employee_benefit_value = 0;
    var expenses_feed_value = 0;
    var expenses_freight_value = 0;
    var expenses_fertilizers_value = 0;
    var expenses_gasoline_value = 0;
    var expenses_insurance_value = 0;

    var expenses_interest_mortgages_value = 0;
    var expenses_labor_value = 0;
    var expenses_land_rent_value = 0;
    var expenses_machinery_rent_value = 0;
    var expenses_pension_value = 0;
    var expenses_property_taxes_value = 0;

    var expenses_seeds_value = 0;
    var expenses_repairs_value = 0;
    var expenses_storage_value = 0;
    var expenses_utilities_value = 0;
    var expenses_supplies_value = 0;
    var expenses_veterinary_value = 0;

    /****************************************************************
     Methods
     ****************************************************************/
    function $onInit() {
      var requests = [];

      commonService.retrieveCurrentUser()
        .then(function (user_response) {
          $ctrl.user = user_response.data;

          requests.push(allocateService.listScheduleF($ctrl.user.username));
          requests.push(allocateService.listBusinessData($ctrl.user.username));

          // Resolve all requests
          return $q.all(requests);
        })
        .then(function (responses, index) {

          var valid = true;
          angular.forEach(responses, function (response) {
            if (response.data === undefined || response.data.length <= 0) {
              valid = false;
              $state.go("home");
            }
          });
          if (valid === true) {
            $ctrl.schedule_f_data = responses[0].data[0];
            $ctrl.business_data_list = responses[1].data;
            $ctrl.business_data_list.sort(function (a, b) {
              return a.business_type.localeCompare(b.business_type);
            });

            return allocateService.convertToGoldStandard($ctrl.schedule_f_data.id);
          }
        })
        .then(function (gold_standard_response) {
          if (gold_standard_response === undefined ||
            gold_standard_response.data === undefined ||
            gold_standard_response.data.length < 1) {
            // $state.go("home");
          }
          else {
            $ctrl.gold_standard_categories = gold_standard_response.data;
            angular.forEach($ctrl.gold_standard_categories, function (category) {

              $ctrl.errors[category.name] = "underallocated";
            });

            $scope.$on("modalConfirmed", function () {
              $ctrl.saveData();
            });
          }
        });
    }

    function updateData(targets, status) {
      $ctrl.errors[targets[0].category] = status;

      // Sets status flag by checking that all elements of error list equal 'valid'
      var is_underallocated = false,
        is_overallocated = false,
        is_error = false;

      angular.forEach($ctrl.errors, function (error, key) {
        if (error == "error") {
          is_error = true;
        }
        else if (error == "valid") {
          $ctrl.status = "valid";
        }
        else if (error == "underallocated") {
          is_underallocated = true;
        }
        else if (error == "overallocated") {
          is_overallocated = true;
        }
      });

      // 'Underallocated' is allowed (it will be allocated to Whole Farm), 'overallocated' and 'error' are not allowed
      if (is_error == true) {
        $ctrl.status = "error";
      }
      else if (is_overallocated == true) {
        $ctrl.status = "overallocated";
      }
      else if (is_underallocated == true) {
        $ctrl.status = "underallocated";
      }
      else {
        $ctrl.status = "valid";
      }

      angular.forEach($ctrl.business_data_list, function (business_data, index) {
        business_data[targets[index]['category']] = targets[index]['value'];
      });
    }

    // function check_zero_remainders() {
    //
    //   if ($ctrl.statement_type == "Income") {
    //
    //     angular.forEach($ctrl.business_data_list, function (value) {
    //
    //       income_sale_value += parseFloat(value.income_sales);
    //       income_agriculture_programs_value += parseFloat(value.income_agriculture_programs);
    //       income_cooperative_value += parseFloat(value.income_cooperative);
    //
    //       income_custom_hire_value += parseFloat(value.income_custom_hire);
    //       income_insurance_value += parseFloat(value.income_insurance);
    //       income_other_value += parseFloat(value.income_other);
    //     });
    //
    //     var value = $ctrl.gold_standard_categories;
    //
    //     if (value.income_sales.total == income_sale_value && value.income_cooperative.total == income_cooperative_value &&
    //       value.income_agriculture_programs.total == income_agriculture_programs_value && value.income_insurance.total == income_insurance_value &&
    //       value.income_custom_hire.total == income_custom_hire_value && value.income_other.total == income_other_value) {
    //       proceed($ctrl.statement_type);
    //
    //       income_sale_value = 0;
    //       income_agriculture_programs_value = 0;
    //       income_cooperative_value = 0;
    //       income_custom_hire_value = 0;
    //       income_insurance_value = 0;
    //       income_other_value = 0;
    //
    //     } else {
    //       modal_func();
    //       income_sale_value = 0;
    //       income_agriculture_programs_value = 0;
    //       income_cooperative_value = 0;
    //       income_custom_hire_value = 0;
    //       income_insurance_value = 0;
    //       income_other_value = 0;
    //     }
    //
    //   } else {
    //     angular.forEach($ctrl.business_data_list, function (value) {
    //
    //       expenses_goods_value += parseFloat(value.expenses_goods);
    //       expenses_car_value += parseFloat(value.expenses_car);
    //       expenses_chemicals_value += parseFloat(value.expenses_chemicals);
    //       expenses_conservation_value += parseFloat(value.expenses_conservation);
    //       expenses_custom_hire_value += parseFloat(value.expenses_custom_hire);
    //       expenses_depreciation_value += parseFloat(value.expenses_depreciation);
    //
    //       expenses_employee_benefit_value += parseFloat(value.expenses_employee_benefit);
    //       expenses_feed_value += parseFloat(value.expenses_feed);
    //       expenses_fertilizers_value += parseFloat(value.expenses_fertilizers);
    //       expenses_freight_value += parseFloat(value.expenses_freight);
    //       expenses_gasoline_value += parseFloat(value.expenses_gasoline);
    //       expenses_insurance_value += parseFloat(value.expenses_insurance);
    //
    //       expenses_interest_mortgages_value += parseFloat(value.expenses_interest_mortgages);
    //       expenses_labor_value += parseFloat(value.expenses_labor);
    //       expenses_land_rent_value += parseFloat(value.expenses_land_rent);
    //       expenses_machinery_rent_value += parseFloat(value.expenses_machinery_rent);
    //       expenses_pension_value += parseFloat(value.expenses_pension);
    //       expenses_property_taxes_value += parseFloat(value.expenses_property_taxes);
    //
    //       expenses_repairs_value += parseFloat(value.expenses_repairs);
    //       expenses_seeds_value += parseFloat(value.expenses_seeds);
    //       expenses_storage_value += parseFloat(value.expenses_storage);
    //       expenses_supplies_value += parseFloat(value.expenses_supplies);
    //       expenses_utilities_value += parseFloat(value.expenses_utilities);
    //       expenses_veterinary_value += parseFloat(value.expenses_veterinary);
    //
    //     });
    //
    //     var value = $ctrl.gold_standard_categories;
    //
    //     if (value.expenses_goods.total == expenses_goods_value && value.expenses_car.total == expenses_car_value && value.expenses_chemicals.total == expenses_chemicals_value &&
    //       value.expenses_conservation.total == expenses_conservation_value && value.expenses_custom_hire.total == expenses_custom_hire_value && value.expenses_depreciation.total == expenses_depreciation_value &&
    //       value.expenses_employee_benefit.total == expenses_employee_benefit_value && value.expenses_feed.total == expenses_feed_value && value.expenses_fertilizers.total == expenses_fertilizers_value &&
    //       value.expenses_freight.total == expenses_freight_value && value.expenses_gasoline.total == expenses_gasoline_value && value.expenses_insurance.total == expenses_insurance_value &&
    //       value.expenses_interest_mortgages.total == expenses_interest_mortgages_value && value.expenses_labor.total == expenses_labor_value && value.expenses_land_rent.total == expenses_land_rent_value &&
    //       value.expenses_machinery_rent.total == expenses_machinery_rent_value && value.expenses_pension.total == expenses_pension_value && value.expenses_property_taxes.total == expenses_property_taxes_value &&
    //       value.expenses_repairs.total == expenses_repairs_value && value.expenses_seeds.total == expenses_seeds_value && value.expenses_storage.total == expenses_storage_value &&
    //       value.expenses_supplies.total == expenses_supplies_value && value.expenses_utilities.total == expenses_utilities_value && value.expenses_veterinary.total == expenses_veterinary_value) {
    //
    //       proceed($ctrl.statement_type)
    //
    //       expenses_goods_value = 0;
    //       expenses_car_value = 0;
    //       expenses_chemicals_value = 0;
    //       expenses_conservation_value = 0;
    //       expenses_custom_hire_value = 0;
    //       expenses_depreciation_value = 0;
    //       expenses_employee_benefit_value = 0;
    //       expenses_feed_value = 0;
    //       expenses_freight_value = 0;
    //       expenses_fertilizers_value = 0;
    //       expenses_gasoline_value = 0;
    //       expenses_insurance_value = 0;
    //       expenses_interest_mortgages_value = 0;
    //       expenses_labor_value = 0;
    //       expenses_land_rent_value = 0;
    //       expenses_machinery_rent_value = 0;
    //       expenses_pension_value = 0;
    //       expenses_property_taxes_value = 0;
    //       expenses_seeds_value = 0;
    //       expenses_repairs_value = 0;
    //       expenses_storage_value = 0;
    //       expenses_utilities_value = 0;
    //       expenses_supplies_value = 0;
    //       expenses_veterinary_value = 0;
    //
    //
    //     } else {
    //
    //       expenses_goods_value = 0;
    //       expenses_car_value = 0;
    //       expenses_chemicals_value = 0;
    //       expenses_conservation_value = 0;
    //       expenses_custom_hire_value = 0;
    //       expenses_depreciation_value = 0;
    //       expenses_employee_benefit_value = 0;
    //       expenses_feed_value = 0;
    //       expenses_freight_value = 0;
    //       expenses_fertilizers_value = 0;
    //       expenses_gasoline_value = 0;
    //       expenses_insurance_value = 0;
    //       expenses_interest_mortgages_value = 0;
    //       expenses_labor_value = 0;
    //       expenses_land_rent_value = 0;
    //       expenses_machinery_rent_value = 0;
    //       expenses_pension_value = 0;
    //       expenses_property_taxes_value = 0;
    //       expenses_seeds_value = 0;
    //       expenses_repairs_value = 0;
    //       expenses_storage_value = 0;
    //       expenses_utilities_value = 0;
    //       expenses_supplies_value = 0;
    //       expenses_veterinary_value = 0;
    //       modal_func();
    //     }
    //   }
    //   console.log($ctrl.gold_standard_categories)
    // }

    //
    // function modal_func() {
    //   $uibModal.open({
    //     animation: true,
    //     templateUrl: '/static/allocate/business-allocate/check-null-modal/checknullmodal.html',
    //     controller: 'CheckNullModalController',
    //     controllerAs: '$ctrl',
    //     resolve: {
    //       proceed: function () {
    //         return $ctrl.proceed;
    //       },
    //       statement_type: function () {
    //         return $ctrl.statement_type
    //       }
    //
    //     }
    //   });
    // }

    function check_zero_remainders() {

      if ($ctrl.statement_type === "Income") {

        angular.forEach($ctrl.business_data_list, function (value) {

          if (value.income_sales === "") {
            value.income_sales = 0;
            income_sale_value += parseFloat(value.income_sales);
          } else {
            income_sale_value += parseFloat(value.income_sales);
          }

          if (value.income_agriculture_programs == "") {
            value.income_agriculture_programs = 0;
            income_agriculture_programs_value += parseFloat(value.income_agriculture_programs);
          } else {
            income_agriculture_programs_value += parseFloat(value.income_agriculture_programs);
          }

          if (value.income_cooperative == "") {
            value.income_cooperative = 0;
            income_cooperative_value += parseFloat(value.income_cooperative);
          } else {
            income_cooperative_value += parseFloat(value.income_cooperative);
          }

          if (value.income_custom_hire == "") {
            value.income_custom_hire = 0;
            income_custom_hire_value += parseFloat(value.income_custom_hire);
          } else {
            income_custom_hire_value += parseFloat(value.income_custom_hire);
          }

          if (value.income_insurance == "") {
            value.income_insurance = 0;
            income_insurance_value += parseFloat(value.income_insurance);
          } else {
            income_insurance_value += parseFloat(value.income_insurance);
          }

          if (value.income_other == "") {
            value.income_other = 0;
            income_other_value += parseFloat(value.income_other);
          } else {
            income_other_value += parseFloat(value.income_other);
          }

        });

        var value = $ctrl.gold_standard_categories;

        if (value.income_sales.total == income_sale_value && value.income_cooperative.total == income_cooperative_value &&
          value.income_agriculture_programs.total == income_agriculture_programs_value && value.income_insurance.total == income_insurance_value &&
          value.income_custom_hire.total == income_custom_hire_value && value.income_other.total == income_other_value) {
          proceed($ctrl.statement_type);

          income_sale_value = 0;
          income_agriculture_programs_value = 0;
          income_cooperative_value = 0;
          income_custom_hire_value = 0;
          income_insurance_value = 0;
          income_other_value = 0;

        } else {
          modal_func();
          income_sale_value = 0;
          income_agriculture_programs_value = 0;
          income_cooperative_value = 0;
          income_custom_hire_value = 0;
          income_insurance_value = 0;
          income_other_value = 0;
        }

      } else {
        angular.forEach($ctrl.business_data_list, function (value) {

          if (value.expenses_goods == "") {
            value.expenses_goods = 0;
            expenses_goods_value += parseFloat(value.expenses_goods);;
          } else {
            expenses_goods_value += parseFloat(value.expenses_goods);;
          }

          if (value.expenses_car == "") {
            value.expenses_car = 0;
            expenses_car_value += parseFloat(value.expenses_car);;
          } else {
            expenses_car_value += parseFloat(value.expenses_car);;
          }

          if (value.expenses_chemicals == "") {
            value.expenses_chemicals = 0;
            expenses_chemicals_value += parseFloat(value.expenses_chemicals);
          } else {
            expenses_chemicals_value += parseFloat(value.expenses_chemicals);
          }

          if (value.expenses_conservation == "") {
            value.expenses_conservation = 0;
            expenses_conservation_value += parseFloat(value.expenses_conservation);
          } else {
            expenses_conservation_value += parseFloat(value.expenses_conservation);
          }

          if (value.expenses_custom_hire == "") {
            value.expenses_custom_hire = 0;
            expenses_custom_hire_value += parseFloat(value.expenses_custom_hire);
          } else {
            expenses_custom_hire_value += parseFloat(value.expenses_custom_hire);
          }

          if (value.expenses_depreciation == "") {
            value.expenses_depreciation = 0;
            expenses_depreciation_value += parseFloat(value.expenses_depreciation);
          } else {
            expenses_depreciation_value += parseFloat(value.expenses_depreciation);
          }

          if (value.expenses_employee_benefit == "") {
            value.expenses_employee_benefit = 0;
            expenses_employee_benefit_value += parseFloat(value.expenses_employee_benefit);
          } else {
            expenses_employee_benefit_value += parseFloat(value.expenses_employee_benefit);
          }

          if (value.expenses_feed == "") {
            value.expenses_feed = 0;
            expenses_feed_value += parseFloat(value.expenses_feed);
          } else {
            expenses_feed_value += parseFloat(value.expenses_feed);
          }

          if (value.expenses_fertilizers == "") {
            value.expenses_fertilizers = 0;
            expenses_fertilizers_value += parseFloat(value.expenses_fertilizers);
          } else {
            expenses_fertilizers_value += parseFloat(value.expenses_fertilizers);
          }

          if (value.expenses_freight == "") {
            value.expenses_freight = 0;
            expenses_freight_value += parseFloat(value.expenses_freight);
          } else {
            expenses_freight_value += parseFloat(value.expenses_freight);
          }

          if (value.expenses_gasoline == "") {
            value.expenses_gasoline = 0;
            expenses_gasoline_value += parseFloat(value.expenses_gasoline);
          } else {
            expenses_gasoline_value += parseFloat(value.expenses_gasoline);
          }

          if (value.expenses_insurance == "") {
            value.expenses_insurance = 0;
            expenses_insurance_value += parseFloat(value.expenses_insurance);
          } else {
            expenses_insurance_value += parseFloat(value.expenses_insurance);
          }

          if (value.expenses_interest_mortgages == "") {
            value.expenses_interest_mortgages = 0;
            expenses_interest_mortgages_value += parseFloat(value.expenses_interest_mortgages);
          } else {
            expenses_interest_mortgages_value += parseFloat(value.expenses_interest_mortgages);
          }

          if (value.expenses_labor == "") {
            value.expenses_labor = 0;
            expenses_labor_value += parseFloat(value.expenses_labor);
          } else {
            expenses_labor_value += parseFloat(value.expenses_labor);
          }

          if (value.expenses_land_rent == "") {
            value.expenses_land_rent = 0;
            expenses_land_rent_value += parseFloat(value.expenses_land_rent);
          } else {
            expenses_land_rent_value += parseFloat(value.expenses_land_rent);
          }

          if (value.expenses_machinery_rent == "") {
            value.expenses_machinery_rent = 0;
            expenses_machinery_rent_value += parseFloat(value.expenses_machinery_rent);
          } else {
            expenses_machinery_rent_value += parseFloat(value.expenses_machinery_rent);
          }

          if (value.expenses_pension == "") {
            value.expenses_pension = 0;
            expenses_pension_value += parseFloat(value.expenses_pension);
          } else {
            expenses_pension_value += parseFloat(value.expenses_pension);
          }

          if (value.expenses_property_taxes == "") {
            value.expenses_property_taxes = 0;
            expenses_property_taxes_value += parseFloat(value.expenses_property_taxes);;
          } else {
            expenses_property_taxes_value += parseFloat(value.expenses_property_taxes);;
          }


          if (value.expenses_repairs == "") {
            value.expenses_repairs = 0;
            expenses_repairs_value += parseFloat(value.expenses_repairs);;
          } else {
            expenses_repairs_value += parseFloat(value.expenses_repairs);;
          }

          if (value.expenses_seeds == "") {
            value.expenses_seeds = 0;
            expenses_seeds_value += parseFloat(value.expenses_seeds);;
          } else {
            expenses_seeds_value += parseFloat(value.expenses_seeds);;
          }

          if (value.expenses_storage == "") {
            value.expenses_storage = 0;
            expenses_storage_value += parseFloat(value.expenses_storage);;
          } else {
            expenses_storage_value += parseFloat(value.expenses_storage);;
          }

          if (value.expenses_supplies == "") {
            value.expenses_supplies = 0;
            expenses_supplies_value += parseFloat(value.expenses_supplies);;
          } else {
            expenses_supplies_value += parseFloat(value.expenses_supplies);;
          }

          if (value.expenses_utilities == "") {
            value.expenses_utilities = 0;
            expenses_utilities_value += parseFloat(value.expenses_utilities);;
          } else {
            expenses_utilities_value += parseFloat(value.expenses_utilities);;
          }

          if (value.expenses_veterinary == "") {
            value.expenses_veterinary = 0;
            expenses_veterinary_value += parseFloat(value.expenses_veterinary);;
          } else {
            expenses_veterinary_value += parseFloat(value.expenses_veterinary);;
          }

        });

        var value = $ctrl.gold_standard_categories;

        if (value.expenses_goods.total == expenses_goods_value && value.expenses_car.total == expenses_car_value && value.expenses_chemicals.total == expenses_chemicals_value &&
          value.expenses_conservation.total == expenses_conservation_value && value.expenses_custom_hire.total == expenses_custom_hire_value && value.expenses_depreciation.total == expenses_depreciation_value &&
          value.expenses_employee_benefit.total == expenses_employee_benefit_value && value.expenses_feed.total == expenses_feed_value && value.expenses_fertilizers.total == expenses_fertilizers_value &&
          value.expenses_freight.total == expenses_freight_value && value.expenses_gasoline.total == expenses_gasoline_value && value.expenses_insurance.total == expenses_insurance_value &&
          value.expenses_interest_mortgages.total == expenses_interest_mortgages_value && value.expenses_labor.total == expenses_labor_value && value.expenses_land_rent.total == expenses_land_rent_value &&
          value.expenses_machinery_rent.total == expenses_machinery_rent_value && value.expenses_pension.total == expenses_pension_value && value.expenses_property_taxes.total == expenses_property_taxes_value &&
          value.expenses_repairs.total == expenses_repairs_value && value.expenses_seeds.total == expenses_seeds_value && value.expenses_storage.total == expenses_storage_value &&
          value.expenses_supplies.total == expenses_supplies_value && value.expenses_utilities.total == expenses_utilities_value && value.expenses_veterinary.total == expenses_veterinary_value) {


          proceed($ctrl.statement_type);

          expenses_goods_value = 0;
          expenses_car_value = 0;
          expenses_chemicals_value = 0;
          expenses_conservation_value = 0;
          expenses_custom_hire_value = 0;
          expenses_depreciation_value = 0;
          expenses_employee_benefit_value = 0;
          expenses_feed_value = 0;
          expenses_freight_value = 0;
          expenses_fertilizers_value = 0;
          expenses_gasoline_value = 0;
          expenses_insurance_value = 0;
          expenses_interest_mortgages_value = 0;
          expenses_labor_value = 0;
          expenses_land_rent_value = 0;
          expenses_machinery_rent_value = 0;
          expenses_pension_value = 0;
          expenses_property_taxes_value = 0;
          expenses_seeds_value = 0;
          expenses_repairs_value = 0;
          expenses_storage_value = 0;
          expenses_utilities_value = 0;
          expenses_supplies_value = 0;
          expenses_veterinary_value = 0;


        } else {

          expenses_goods_value = 0;
          expenses_car_value = 0;
          expenses_chemicals_value = 0;
          expenses_conservation_value = 0;
          expenses_custom_hire_value = 0;
          expenses_depreciation_value = 0;
          expenses_employee_benefit_value = 0;
          expenses_feed_value = 0;
          expenses_freight_value = 0;
          expenses_fertilizers_value = 0;
          expenses_gasoline_value = 0;
          expenses_insurance_value = 0;
          expenses_interest_mortgages_value = 0;
          expenses_labor_value = 0;
          expenses_land_rent_value = 0;
          expenses_machinery_rent_value = 0;
          expenses_pension_value = 0;
          expenses_property_taxes_value = 0;
          expenses_seeds_value = 0;
          expenses_repairs_value = 0;
          expenses_storage_value = 0;
          expenses_utilities_value = 0;
          expenses_supplies_value = 0;
          expenses_veterinary_value = 0;
          modal_func();
        }
      }
    }


    function modal_func(){
      var modal = $uibModal.open({
        animation: true,
        templateUrl: '/static/allocate/business-allocate/check-null-modal/checknullmodal.html',
        controller: 'CheckNullModalController',
        controllerAs: '$ctrl',
        resolve: {
          proceed: function() {
            return $ctrl.proceed;
          },
          statement_type:function(){
            return $ctrl.statement_type
          }

        }
      });
    }

    function proceed(statement_type) {

      if ($ctrl.statement_type == "Expenses" &&
        ($ctrl.status == 'valid' || $ctrl.status == 'underallocated')) {
        //modalService.confirm("Are you sure you are finished with this step? You will not be able to come back.",
        //  "modalConfirmed",
        //  "modalDenied");
        modalService.allocation_next("modalConfirmed");
      }
      else if ($ctrl.statement_type === "Income") {
        $ctrl.saveData();
      }
    }


    function saveData() {
      if ($ctrl.status === 'valid' || $ctrl.status === 'underallocated') {
        startProgress(2);

        var requests = [];

        angular.forEach($ctrl.business_data_list, function (business_data) {
          var business_data_updated = setOtherExpenses($ctrl.gold_standard_categories, business_data);
          requests.push(allocateService.updateBusinessData(business_data_updated));
        });

        // Resolve all requests
        $q.all(requests)
          .then(function (responses) {
            if ($ctrl.statement_type === "Income") {
              $ctrl.statement_type = "Expenses";
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            else if ($ctrl.statement_type === "Expenses") {
              $ctrl.business_data_list.forEach(function (business_data) {
                allocateService.markCompleted(business_data.id);
              });
              $state.go("businessSummary");
            }
          });
      }
      else {
        modalService.alert("There are errors with your allocation data. Please resolve them before proceeding.");
      }
    }


    function back() {
      if ($ctrl.statement_type == "Income") {
        $state.go("businessSelect");
      }
      else if ($ctrl.statement_type == "Expenses" &&
        $ctrl.status != "overallocated" &&
        $ctrl.status != "error") {
        $ctrl.statement_type = "Income";
      }
      else if ($ctrl.statement_type == "Expenses" &&
        $ctrl.status == "overallocated" ||
        $ctrl.status == "error") {
        modalService.alert("There are errors with your allocation data. Please resolve them before going back.");
      }
    }


    /****************************************************************
     Private Helper Functions
     ****************************************************************/

    /*
        Finds 'other expenses' from given gold standard categories and returns a new BusinessData object with correct
        values and labels set.
    */
    function setOtherExpenses(gold_standard_categories, business_data) {
      angular.forEach(business_data, function (value, field) {
        if (field.indexOf("_label") != -1) {
          var expense_field = field.replace("_label", "");

          angular.forEach($ctrl.gold_standard_categories, function (category) {
            if (category.name == expense_field) {
              business_data[field] = category.label;
              if (!category.label.includes("Other Expenses")) {
                category.label = "Other Expenses " + category.label;
                business_data[field] = category.label;
              }

            }
          });
        }
      });

      return business_data;
    }


    /*
        Faux progress method.  Takes the number of async calls in a method and
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
