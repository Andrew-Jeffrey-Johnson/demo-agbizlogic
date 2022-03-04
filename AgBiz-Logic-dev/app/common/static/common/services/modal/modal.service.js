(function() {
  'use strict';

  angular
    .module("commonModule")
    .factory("modalService", modalServiceFactory);

  modalServiceFactory.$inject = [
    "$rootScope",
    "$uibModal",
  ];

  function modalServiceFactory(
    $scope,
    $uibModal) {
    var modalService = {
      init: init,
      alert: alert,
      confirm: confirm,
      displayConfirmation: displayConfirmation,
      error: error,
      allocation_next:allocation_next
    };

    init();

    return modalService;


    /****************************************************************
                         Methods
    ****************************************************************/

    function init() {
      $scope.$on("httpError", function(event, data) {
        error(data);
      });
    }


    function alert(message) {
      $uibModal.open({
        animation: true,
        size: "md",
        templateUrl: "/static/common/services/modal/alert-modal.html",
        controller: AlertModalController,
        controllerAs: "$ctrl",
        resolve: {
          'message': function() {
            return message;
          },
        },
      });
    }


    function confirm(message, confirm_event, deny_event) {
      var modalInstance = $uibModal.open({
        animation: true,
        size: "md",
        templateUrl: "/static/common/services/modal/confirm-modal.html",
        controller: ConfirmModalController,
        controllerAs: "$ctrl",
        resolve: {
          'message': function() {
            return message;
          }
        }
      });

      // Broadcast given events based on result of modal
      modalInstance.result
      .then(function() {
        $scope.$broadcast(confirm_event);
      }, function() {
        $scope.$broadcast(deny_event);
      });

      $scope.$broadcast(confirm_event);
    }


    function allocation_next(confirm_event){
        $scope.$broadcast(confirm_event);
    }



    function displayConfirmation(message) {
      var modalInstance = $uibModal.open({
        animation: true,
        size: "md",
        templateUrl: "/static/common/services/modal/confirm-modal.html",
        controller: ConfirmModalController,
        controllerAs: "$ctrl",
        resolve: {
          'message': function() {
            return message;
          }
        }
      });

      return modalInstance.result;
    }


    function error(message) {
      $uibModal.open({
        animation: true,
        size: "md",
        templateUrl: "/static/common/services/modal/error-modal.html",
        controller: ErrorModalController,
        controllerAs: "$ctrl",
        resolve: {
          'message': function() {
            return message;
          }
        }
      });
    }


    /****************************************************************
                         Modal Controllers
    ****************************************************************/

    AlertModalController.$inject = [
      "message",
      "$uibModalInstance",
    ];

    function AlertModalController(
      message,
      $uibModalInstance) {
      var $ctrl = this;

      $ctrl.$onInit = function() {
        $ctrl.message = message;
      };


      $ctrl.ok = function() {
        $uibModalInstance.dismiss("cancel");
      };
    }



    ConfirmModalController.$inject = [
      "message",
      "$uibModalInstance",
    ];

    function ConfirmModalController(
      message,
      $uibModalInstance) {
      var $ctrl = this;

      $ctrl.$onInit = function() {
        $ctrl.message = message;
      };


      $ctrl.confirm = function() {
        $uibModalInstance.close("confirmed");
      };


      $ctrl.deny = function() {
        $uibModalInstance.dismiss("denied");
      };
    }



    ErrorModalController.$inject = [
      "message",
      "$uibModalInstance",
    ];

    function ErrorModalController(
      message,
      $uibModalInstance) {
      var $ctrl = this;

      $ctrl.$onInit = function() {
        $ctrl.message = message;
      };


      $ctrl.ok = function() {
        $uibModalInstance.dismiss("cancel");
      };
    }
  }

}());
