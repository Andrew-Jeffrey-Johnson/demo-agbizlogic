(function() {
  'use strict';

  angular
    .module("allocateModule")
    .component("allocateHome", {
      template: "<div></div>",
      controller: AllocateHomeComponentController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  AllocateHomeComponentController.$inject = [
    '$state',
    '$window',
    'commonService',
  ];

  function AllocateHomeComponentController(
    $state,
    $window,
    commonService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;

    // User
    $ctrl.user;

    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      commonService.retrieveCurrentUser()
      .then(function(user_response) {
        $ctrl.user = user_response.data;

        return commonService.getNextStep($ctrl.user.username);
      })
      .then(function(next_step_response) {
        if (next_step_response !== undefined &&
            next_step_response.data !== undefined &&
            next_step_response.data.next_step !== undefined) {
          var next_step = next_step_response.data.next_step;

          if (next_step === "business-select") {
            $state.go("businessSelect");
          }
          else if (next_step === "business-allocate") {
            $state.go("businessAllocate");
          }
          else if (next_step === "enterprise-select") {
            $state.go("enterpriseSelect");
          }
          else if (next_step === "enterprise-allocate") {
            $state.go("enterpriseAllocate");
          }
          else {
            $window.location.assign("/dashboard/");
          }
        }
      });

    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

  }

}());
