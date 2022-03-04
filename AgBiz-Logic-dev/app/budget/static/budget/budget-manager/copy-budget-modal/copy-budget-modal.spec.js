(function() {
  'use strict';

  describe("Copy Budget Modal", function () {
    var controller,
        budget_list,
        $scope,
        $state,
        budgetServiceMock,
        commonServiceMock,
        $uibModalInstanceMock;

    beforeEach(module("budgetModule"));
    beforeEach(module("commonModule"));

    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      $uibModalInstanceMock = {
        dismiss: function() {},
        close: function() {},
      };
      budgetServiceMock = $injector.get("budgetServiceMock");
      commonServiceMock = $injector.get("commonServiceMock");

      budget_list = [];
      var $controller = $injector.get("$controller");
      controller = $controller("CopyBudgetModalController", {
        $uibModalInstance: $uibModalInstanceMock,
        budgetService: budgetServiceMock,
        commonService: commonServiceMock,
        budget_list: budget_list,
      });

      spyOn($state, "go").and.returnValue();
      spyOn($state, "reload").and.returnValue();
    }));



    describe("$onInit", function () {

      it("initializes 'budget_list' to equal 'budget_list' dependency", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.budget_list).toEqual(budget_list);
      });


      it("initializes 'budget' and 'copy_budget' to empty object", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.budget).toEqual(new Object());
        expect(controller.copy_budget).toEqual(new Object());
      });


      it("initializes 'modal_title'", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.modal_title).toEqual("Choose Budget to copy");
      });

    });



    describe("selectBudget", function () {
      var budget;

      beforeEach(function() {
        budget = {
          'id': 43,
          'title': "Some Budget",
        };
      });


      it("sets 'budget' to equal given budget argument", function () {
        controller.selectBudget(budget);
        $scope.$digest();

        expect(controller.budget).toEqual(budget);
      });

    });



    describe("addNewBudget", function() {
      var budget;

      beforeEach(function() {
        budget = {
          'id': 45,
          'title': "Copy Budget",
        };
      });


      // it("calls data service to copy given budget", function() {
      //   spyOn(budgetServiceMock, "copyBudget").and.callThrough();
      //   controller.budget = budget;
      //   controller.addNewBudget(controller.budget);
      //   $scope.$digest();
      //
      //   expect(budgetServiceMock.copyBudget.calls.argsFor(0)[0]).toEqual(controller.budget);
      //   expect(controller.copy_budget).toBeDefined();
      // });
      //
      //
      // it("calls $uibModalInstance to close modal", function () {
      //   spyOn($uibModalInstanceMock, "close").and.callThrough();
      //   controller.budget = budget;
      //   controller.addNewBudget(controller.budget);
      //   $scope.$digest();
      //
      //   expect($uibModalInstanceMock.close).toHaveBeenCalled();
      // });
      //
      //
      // it("calls method to reload state", function() {
      //   controller.budget = budget;
      //   controller.addNewBudget(controller.budget);
      //   $scope.$digest();
      //
      //   expect($state.reload).toHaveBeenCalled();
      // });

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
