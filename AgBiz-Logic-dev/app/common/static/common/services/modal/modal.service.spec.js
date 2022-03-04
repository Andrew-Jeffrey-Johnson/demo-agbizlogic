(function() {
  'use strict';

  describe("modalService", function() {
    var $scope,
        $q,
        $uibModal,
        $uibModalInstanceMock,
        modalService;

    beforeEach(module("commonModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector, $rootScope) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $uibModal = $injector.get("$uibModal");
      $uibModalInstanceMock = {
        result: $q.when(),
      };
      modalService = $injector.get("modalService", {
        $uibModal: $uibModal,
      });

      spyOn($uibModal, "open").and.returnValue($uibModalInstanceMock);
    }));




    describe("init", function () {

      it("calls $scope.$on to register event listeners", function () {
        spyOn($scope, "$on").and.returnValue();
        modalService.init();

        expect($scope.$on).toHaveBeenCalled();
      });

    });



    describe("alert", function () {
      var message;

      beforeEach(function() {
        message = "Alert!";
      });


      it("calls $uibModal to open an alert modal if message is not null", function () {
        modalService.alert(message);
        $scope.$digest();

        expect($uibModal.open).toHaveBeenCalled();
      });


      it("passes given message into $uibModal resolve", function () {
        modalService.alert(message);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.message()).toEqual(message);
      });

    });



    describe("error", function () {
      var message;

      beforeEach(function() {
        message = "Error";
      });


      it("calls $uibModal to open an error modal if message is not null", function () {
        modalService.error(message);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.message()).toEqual(message);
      });

    });


    describe("confirm", function () {
      var message,
          confirmCallback,
          denyCallback;

      beforeEach(function() {
        message = "Confirm?";
        confirmCallback = function() { return true; };
        denyCallback = function() { return false; };
      });


      it("calls $uibModal to open a confirm modal if message is not null", function () {
        modalService.confirm(message, confirmCallback, denyCallback);
        $scope.$digest();

        expect($uibModal.open).toHaveBeenCalled();
      });


      it("passes given message into $uibModal resolve", function () {
        modalService.confirm(message, confirmCallback, denyCallback);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.message()).toEqual(message);
      });

    });

  });


}());
