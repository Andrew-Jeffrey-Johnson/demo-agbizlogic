(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("sidenav", {
      templateUrl: "/static/common/sidenav/sidenav.component.html",
      controller: SidenavComponentController,
    });


  /****************************************************************
                         Controller
  ****************************************************************/

  SidenavComponentController.$inject = [
    '$location',
    '$timeout',
    'commonService',
  ];

  function SidenavComponentController(
    $location,
    $timeout,
    commonService) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    vm.$onInit = $onInit;
    vm.setHeight = setHeight;

    // Display
    vm.options = [];
    vm.show = false;
    vm.disabled;
    vm.height;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      vm.options = [
        {
          name: " Dashboard",
          url: "/dashboard/",
          active: false
        },
        {
          name: "Climate",
          url: "/climate/",
          active: false
        },
        {
          name: "Profit",
          url: "/scenario/",
          active: false
        },
        {
          name: "Lease",
          url: "/soon/",
          active: false
        },
        {
          name: "Finance",
          url: "/soon/",
          active: false
        },
        {
          name: "Environment",
          url: "/soon/",
          active: false
        },
      ];

      setActive();
      setHeight();

      // Subscribe to $stateChangeSuccess event using service
      commonService.subscribeStateChange(setHeight);
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Match URL path to option and set active to true.
    */
    function setActive() {
      var url = $location.absUrl().split("/")[3];

      angular.forEach(vm.options, function(option) {
        if (option.name.toLowerCase() == url) {
          option.active = true;
        }
      });
    }


    /*
        Sets the component's height to equal the current page height. Disables, shrinks,
        and hides the component during resizing to wait until Angular renders the page.
        FIXME: Uses a manual timeout period, should be waiting until AngularJS renders page.
    */
    function setHeight() {
      vm.disabled = true;
      vm.height = "0px";
      vm.show = false;
      $timeout(function() {
        var height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight,
                              document.documentElement.scrollHeight, document.documentElement.offsetHeight, window.innerHeight);
        vm.height = height - 51 + "px";
      }, 2000)
      .then(function() {
        vm.disabled = false;
      });
    }
  }

})();
