(function() {
  'use strict';

  angular
    .module("allocateModule")
    .component("businessSelect", {
      templateUrl: "/static/allocate/business-select/business-select.component.html",
      controller: BusinessSelectComponentController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  BusinessSelectComponentController.$inject = [
    "$q",
    "$state",
    "$window",
    "allocateService",
    "commonService",
  ];

  function BusinessSelectComponentController(
    $q,
    $state,
    $window,
    allocateService,
    commonService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.submit = submit;
    $ctrl.select = select;
    $ctrl.back = back;

    // User
    $ctrl.user;

    // Business data
    $ctrl.business_data_list;
    $ctrl.business_options = [
      {
        'business_type': "Crop",
        'selected': false,
        'disabled': false,
      },
      {
        'business_type': "Livestock",
        'selected': false,
        'disabled': false,
      },
      {
        'business_type': "Nursery",
        'selected': false,
        'disabled': false,
      },
    ];

    // Flags
    $ctrl.businesses_needed;


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
        $ctrl.business_data_list = business_data_list_response.data;

        angular.forEach($ctrl.business_options, function(business_option) {
          angular.forEach($ctrl.business_data_list, function(business_data) {
            if (business_option.business_type == business_data.business_type) {
              business_option.selected = true;
            }
          });
        });

        checkBusinesses();
      });
    }


    function select(business) {
      if (business.disabled != undefined &&
          business.selected != undefined &&
          business.disabled != true) {
        business.selected = !business.selected;
      }

      checkBusinesses();
    }


    function submit() {
      checkBusinesses();
      if ($ctrl.businesses_needed == false) {
        var requests = [],
            found;

        angular.forEach($ctrl.business_options, function(business) {
          // Create new BusinessData object
          if (business.selected == true && business.disabled == false) {
            found = false;
            angular.forEach($ctrl.business_data_list, function(business_data) {
              if (business.business_type == business_data.business_type) {
                found = true;
              }
            });
            if (found == false) {
              requests.push(allocateService.createBusinessData(business));
            }
          }
          // Destroy existing BusinessData object
          else if (business.selected == false && business.disabled == false) {
            angular.forEach($ctrl.business_data_list, function(business_data) {
              if (business.business_type == business_data.business_type) {
                requests.push(allocateService.destroyBusinessData(business_data.id));
              }
            });
          }
        });

        $q.all(requests)
        .then(function() {
          $state.go("businessAllocate");
        });
      }
    }


    function back() {
      $window.location.assign("/dashboard/");
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Sets flag based on if there are businesses selected.
    */
    function checkBusinesses() {
      $ctrl.businesses_needed = true;

      angular.forEach($ctrl.business_options, function(business) {
        if (business.selected == true) {
          $ctrl.businesses_needed = false;
        }
      });
    }


  }

}());
