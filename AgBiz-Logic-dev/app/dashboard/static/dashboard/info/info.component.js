(function() {
  'use strict';

  angular
    .module("dashboardModule")
    .component("info", {
      templateUrl: "/static/dashboard/info/info.component.html",
      controller: InfoController,
      bindings: {
        user: "<",
      },
    });


  /****************************************************************
                         Controller
  ****************************************************************/

  InfoController.$inject = [

  ];

  function InfoController() {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.randomFact = randomFact;

    // Misc
    $ctrl.user;
    $ctrl.random_fact;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.random_fact = $ctrl.randomFact();
    }


    function randomFact() {
      var random_facts = {
        'action-bar': "Many of the common actions you can perform can be found in the \"Quick Actions\" bar above.",
        'combine-budgets': "You can combine two or more Budgets into a single Budget in the Budget Manager.",
        'copy-budget': "You can copy an existing Budget using the Budget Manager",
        'university-budgets': "We have compiled a list of pre-made Budgets (called University Budgets) that you can use" +
                              " to quickly construct Plans and Scenarios without allocating your own data manually.",
        'fullscreen': "You can run your browser in fullscreen mode to get a more immersive experience.",
        'draggable-tiles': "Customize your dashboard! Drag and drop the tiles to make AgBiz work for you.",
      },
      random_number = (Math.random() * 100).toFixed(0) % (Object.keys(random_facts).length - 1);

      return random_facts[Object.keys(random_facts)[random_number]];
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/


  }

}());
