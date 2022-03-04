(function() {
  'use strict';

  describe("Accrual Adjustments Modal", function () {
    var controller,
        scenario_list,
        $scope,
        $state,
        scenarioServiceMock,
        commonServiceMock,
        $uibModalInstanceMock;

    beforeEach(module("scenarioModule"));
    beforeEach(module("mockModule"));
    beforeEach(module("commonModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      $uibModalInstanceMock = {
        dismiss: function() {},
        close: function() {},
      };
      scenarioServiceMock = $injector.get("scenarioServiceMock");
      commonServiceMock = $injector.get("commonServiceMock");

      scenario_list = [];
      var $controller = $injector.get("$controller");
      controller = $controller("AccrualAdjustmentsModalController", {
        $uibModalInstance: $uibModalInstanceMock,
        scenarioService: scenarioServiceMock,
        commonService: commonServiceMock,
        scenario_list: scenario_list,
      });

      spyOn($state, "go").and.returnValue();
      spyOn($state, "reload").and.returnValue();
    }));



    describe("$onInit", function () {

      it("initializes 'modal_title'", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.modal_title).toEqual("Choose a Scenario to make accrual adjustments");
      });

    });



    describe("cancel", function () {

      it("calls $uibModalInstance to dismiss modal", function () {
        spyOn($uibModalInstanceMock, "dismiss").and.callThrough();
        controller.cancel();
        $scope.$digest();

        expect($uibModalInstanceMock.dismiss).toHaveBeenCalled();
      });
    });

  });

}());
