(function() {
  'use strict';

  describe("University Budget Modal", function () {
    var controller,
        $q,
        $scope,
        $state,
        university_budget_list,
        budgetServiceMock,
        $uibModalInstanceMock;

    beforeEach(module("budgetModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $q = $injector.get("$q");
      $scope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      $uibModalInstanceMock = {
        dismiss: function() {},
        close: function() {},
      };
      budgetServiceMock = $injector.get("budgetServiceMock");

      university_budget_list = [
        {
          'id': 23,
          'title': "University Budget 23",
        },
        {
          'id': 42,
          'title': "University Budget 42",
        },
      ];
      var $controller = $injector.get("$controller");
      controller = $controller("UniversityBudgetModalController", {
        $uibModalInstance: $uibModalInstanceMock,
        budgetService: budgetServiceMock,
        university_budget_list: university_budget_list,
      });

      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function () {


      it("initializes 'modal_title'", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.modal_title).toEqual("Choose <i>ABL</i> Library Budget");
      });


      it("initializes 'university_budget' to empty object", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.university_budget).toEqual(new Object());
      });


      it("initializes 'university_budget_list' to passed dependency", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.university_budget_list).toEqual(university_budget_list);
      });

    });



    describe("addNewBudget", function() {

      it("does nothing if given university budget is invalid", function () {
        spyOn(budgetServiceMock, "createFromUniversityBudget").and.callThrough();
        controller.addNewBudget({});
        $scope.$digest();

        expect(budgetServiceMock.createFromUniversityBudget).not.toHaveBeenCalled();
      });


      it("calls data service to create new budget from using given university budget id", function () {
        spyOn(budgetServiceMock, "createFromUniversityBudget").and.callThrough();
        controller.addNewBudget(university_budget_list[0]);
        $scope.$digest();

        expect(budgetServiceMock.createFromUniversityBudget.calls.argsFor(0)).toEqual([university_budget_list[0].id]);
      });


      it("calls $uibModalInstance to close modal if data service returns new budget", function () {
        spyOn($uibModalInstanceMock, "close").and.callThrough();
        spyOn(budgetServiceMock, "createFromUniversityBudget").and.callThrough();
        controller.addNewBudget(university_budget_list[0]);
        $scope.$digest();

        expect($uibModalInstanceMock.close).toHaveBeenCalled();
      });


      it("calls $uibModalInstance to close modal and pass new budget id", function () {
        spyOn(budgetServiceMock, "createFromUniversityBudget").and.returnValue($q.when({'data': university_budget_list[0]}));
        spyOn($uibModalInstanceMock, "close").and.callThrough();
        controller.addNewBudget(university_budget_list[0]);
        $scope.$digest();

        expect($uibModalInstanceMock.close.calls.argsFor(0)).toEqual([university_budget_list[0].id]);
      });


      it("does not call $uibModalInstance to close modal if data service returns invalid response", function () {
        spyOn($uibModalInstanceMock, "close").and.callThrough();
        spyOn(budgetServiceMock, "createFromUniversityBudget").and.returnValue($q.when({'data': {}}));
        controller.addNewBudget(university_budget_list[0]);
        $scope.$digest();

        expect($uibModalInstanceMock.close).not.toHaveBeenCalled();
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


      it("sets 'university_budget' to equal given budget argument", function () {
        controller.selectBudget(budget);
        $scope.$digest();

        expect(controller.university_budget).toEqual(budget);
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
