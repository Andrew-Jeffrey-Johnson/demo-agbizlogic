(function () {
    'use strict';

    angular
        .module("commonModule")
        .component("sidebar", {
            templateUrl: "/static/common/sidebar/sidebar.component.html",
            controller: SidebarComponentController,
        });


    /****************************************************************
     Controller
     ****************************************************************/

    SidebarComponentController.$inject = [
        '$location',
        '$timeout',
        'commonService',
    ];

    function SidebarComponentController(
        $location,
        $timeout,
        commonService) {
        var vm = this;

        /****************************************************************
         Bindable Members
         ****************************************************************/

        // Methods
        vm.$onInit = $onInit;

        // Display
        vm.options = [];
        vm.agbiz_options = [];

        /****************************************************************
         Methods
         ****************************************************************/

        function $onInit() {
            vm.options = [
                {
                  name: "Dashboard",
                  url: "/dashboard/",

                },
                {
                    name: "Your Inventory",
                    url: "/inventory/",

                },
                {
                    name: "Budget Manager",
                    url: "/budget/",
                },
                {
                    name: "Plan Manager",
                    url: "/scenario/#/plan-manager?module=plan",
                },
                {
                    name: "Scenario Manager",
                    url: "/scenario/#/scenario-manager?module=scenario",
                },
            ];

            vm.agbiz_options = [
              {
                  name: "Profit",
                  url: "/scenario/#/scenario-manager?module=profit",
              },
              {
                  name: "Climate",
                  url: "/climate/",
              },
              {
                  name: "Finance",
                  url: "/scenario/#/scenario-manager?module=finance",
              },

            ]

            vm.agbiz_options_soon = [
                {
                    name: "Lease",
                    url: "#",
                },
                {
                    name: "Environment",
                    url: "#",
                },
            ];

        }



        /****************************************************************
         Private Helper Functions
         ****************************************************************/

    }

})();
