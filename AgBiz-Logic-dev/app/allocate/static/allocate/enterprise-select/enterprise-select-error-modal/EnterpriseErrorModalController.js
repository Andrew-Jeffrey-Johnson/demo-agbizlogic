(function() {
  'use strict';

  angular
    .module('allocateModule')
    .controller('EnterpriseErrorModalController', EnterpriseErrorModalController);

  EnterpriseErrorModalController.$inject = [
    '$uibModalInstance',
    '$state',
    '$interval',
    'enterprises'
  ];

  function EnterpriseErrorModalController(
    $uibModalInstance,
    $state,
    $interval,
    enterprises) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.enterprises = [];


    /****************************************************************
                        Controller Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.enterprises = enterprises;
    }
  }
})();
