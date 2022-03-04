(function() {
  'use strict';

  angular
    .module('allocateModule')
    .controller('CheckNullModalController', CheckNullModalController);

  CheckNullModalController.$inject = [
    '$uibModalInstance','proceed','statement_type', '$scope'
  ];

  function CheckNullModalController($uibModalInstance,proceed,statement_type,$scope) {

    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/


    $ctrl.submit = submit;
    $ctrl.cancel = cancel;
    $ctrl.statement=statement_type;

    /****************************************************************
                        Controller Methods
    ****************************************************************/
    function submit(){
      $uibModalInstance.dismiss();
      proceed(statement_type)
    }

    function cancel() {
      $uibModalInstance.dismiss();
    }
  }

})();
