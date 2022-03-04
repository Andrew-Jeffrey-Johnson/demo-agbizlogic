(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("navbar", {
      templateUrl: "/static/common/navbar/navbar.component.html",
      controller: NavbarController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  NavbarController.$inject = [
    '$scope',
    '$location',
    '$uibModal',
    'commonService',
    'configService',
  ];

  function NavbarController(
    $scope,
    $location,
    $uibModal,
    commonService,
    configService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.openContactModal = openContactModal;

    // User
    $ctrl.current_user;
    $ctrl.is_authenticated = false;

    $ctrl.hideSide = hideSide();

    // Feature locking
    $ctrl.locked_features = ['Lease', 'Environment', 'Finance'];
    $ctrl.options = [
      {
        name: "Climate",
        url: "/climate/",
        active: false,
        display: true,
        disabled: false,
      },
      {
        name: "Profit",
        url: "/scenario/#/scenario-manager?module=profit",
        active: false,
        display: true,
        disabled: false,
      },
      {
        name: "Lease",
        url: "/scenario/#/scenario-manager?module=lease",
        active: false,
        display: false,
        disabled: true,
      },
      {
        name: "Finance",
        url: "/scenario/#/scenario-manager?module=finance",
        active: false,
        display: false,
        disabled: true,
      },
      {
        name: "Environment",
        url: "/scenario/#/scenario-manager?module=environment",
        active: false,
        display: false,
        disabled: true,
      },
    ];


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      commonService.retrieveCurrentUser()
      .then(function(response) {
        if (response !== undefined &&
            response.data !== undefined &&
            response.data.username !== undefined) {
          $ctrl.current_user = response.data;
          $ctrl.is_authenticated = true;

          return configService.retrieveConfig();
        }
      })
      .then(function(config) {
        if (config !== undefined &&
            config.environment !== undefined &&
            config.environment !== 'prod') {
          if (config.environment !== 'prod') {
            $ctrl.locked_features = [];
          }
          setActive();
          setDisplay();
        }
      });
    }


    function openContactModal() {
      $uibModal.open({
        animation: true,
        size: "md",
        templateUrl: "/static/common/navbar/contact-modal/contact-modal.html",
        controller: "ContactModalController",
        controllerAs: "$ctrl",
      });
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Match URL path to option and set active to true.
    */
    function setActive() {
      var url = $location.absUrl().split("/")[3];
      angular.forEach($ctrl.options, function(option) {
        if (option.name.toLowerCase() == url) {
          option.active = true;
        }
      });
    }


    function setDisplay() {
      commonService.getNextStep($ctrl.current_user.username)
      .then(function(response) {
        if (response.data.next_step === 'agbiz') {
          angular.forEach($ctrl.options, function(option) {
            option.display = true;
            if ($ctrl.locked_features.indexOf(option.name) == -1) {
              option.disabled = false;
            }
          });
        }
      });
    }

    function hideSide() {

    }

  }

})();
