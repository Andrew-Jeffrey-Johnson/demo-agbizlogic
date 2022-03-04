(function() {
  'use strict';

  angular
    .module('commonModule')
    .controller('ContactModalController', ContactModalController);

  ContactModalController.$inject = [
    '$uibModalInstance',
    'commonService',
  ];

  function ContactModalController(
    $uibModalInstance,
    commonService) {
    var vm = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    vm.$onInit = $onInit;
    vm.send = send;
    vm.cancel = cancel;

    // Form
    vm.form = {
      '$invalid': true,
      'subject': "",
      'message': "",
    };
    vm.message = {};
    vm.confirm;


    /****************************************************************
                        Controller Methods
    ****************************************************************/

    function $onInit() {
      vm.confirm = false;
    }


    function send() {
      if (vm.form.$invalid == false) {
        var message = {
          'subject': vm.message.subject,
          'message': vm.message.message,
        };
        commonService.sendSupportMessage(message)
        .then(function(response) {
          $uibModalInstance.dismiss();
        });
      }
    }


    function cancel() {
      $uibModalInstance.dismiss();
    }

    /****************************************************************
                        Private Helper Functions
    ****************************************************************/


  }

})();
