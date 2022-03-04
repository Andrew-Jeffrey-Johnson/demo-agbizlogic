(function() {
  'use strict';

  describe("Combine Budgets Modal", function () {
    var controller,
        budget_list,
        $scope,
        $state,
        $q,
        budgetServiceMock,
        $uibModalInstanceMock;

    beforeEach(module("budgetModule"))
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      $q = $injector.get("$q");
      $uibModalInstanceMock = {
        dismiss: function() {},
        close: function() {},
      };
      budgetServiceMock = $injector.get("budgetServiceMock");

      budget_list = [];
      var $controller = $injector.get("$controller");
      controller = $controller("CombineBudgetsModalController", {
        $uibModalInstance: $uibModalInstanceMock,
        budgetService: budgetServiceMock,
        budget_list: budget_list,
      });

      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function () {

      it("sets 'combine_limit' to 5", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.combine_limit).toEqual(5);
      });


      it("initializes 'budget_list' to equal passed dependency", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.budget_list).toEqual(budget_list);
      });

    });



    describe("addBudgetToCombine", function () {
      var budget;

      beforeEach(function() {
        budget = {
          'id': 42,
          'title': "Some Budget",
        };
      });


      it("pushes 'budget' to 'combine_budget_list' length is less than 'combine_limit'", function () {
        controller.budget = budget;
        controller.combine_budget_list = [{}, {}, {}];
        var length_before = controller.combine_budget_list.length;
        controller.addBudgetToCombine(controller.budget);
        $scope.$digest();

        expect(controller.combine_budget_list).toContain(budget);
        expect(controller.combine_budget_list.length).toEqual(length_before + 1);
      });


      it("does nothing if 'combine_budget_list' length is greater than or equal to 'combine_limit'", function () {
        controller.budget = budget;
        controller.combine_budget_list = [{}, {}, {}, {}, {}];
        controller.addBudgetToCombine(controller.budget);
        $scope.$digest();

        expect(controller.combine_budget_list).not.toContain(budget);
        expect(controller.combine_budget_list.length).toEqual(5);
      });
    });



    describe("removeBudgetToCombine", function () {
      var combine_budget_list;

      beforeEach(function() {
        combine_budget_list = [
          {
            'id': 22,
          },
          {
            'id': 98,
          },
          {
            'id': 2,
          },
        ];
      });


      it("removes given budget from 'combine_budget_list'", function () {
        var budget = combine_budget_list[0],
            length_before = combine_budget_list.length;
        controller.combine_budget_list = combine_budget_list;
        controller.removeBudgetToCombine(budget);
        $scope.$digest();

        expect(controller.combine_budget_list.length).toEqual(length_before - 1);
        expect(controller.combine_budget_list).not.toContain(budget);
      });
    });



    describe("addNewBudget", function() {
      var combine_budget_list;

      beforeEach(function() {
        combine_budget_list = [
          {
            'id': 21,
          },
          {
            'id': 43,
          },
        ];
      });


      it("calls data service to combine 'combine_budget_list'", function () {
        spyOn(budgetServiceMock, "combineBudgets").and.callThrough();
        controller.combine_budget_list = combine_budget_list;
        controller.addNewBudget();
        $scope.$digest();

        expect(budgetServiceMock.combineBudgets).toHaveBeenCalled();
      });


      it("does nothing if returned budget is invalid", function () {
        spyOn($uibModalInstanceMock, "close").and.callThrough();
        spyOn(budgetServiceMock, "combineBudgets").and.returnValue($q.when({'data': {}}));
        controller.combine_budget_list = combine_budget_list;
        controller.addNewBudget();
        $scope.$digest();

        expect($uibModalInstanceMock.close).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });


      it("calls $uibModalInstance to close modal", function () {
        spyOn($uibModalInstanceMock, "close").and.callThrough();
        controller.combine_budget_list = combine_budget_list;
        controller.addNewBudget();
        $scope.$digest();

        expect($uibModalInstanceMock.close).toHaveBeenCalled();
      });


      it("goes to budget editor state with new budget id in state parameters", function () {
        controller.combine_budget_list = combine_budget_list;
        controller.addNewBudget();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(['budget-editor', {
          'budget': controller.new_budget.id,
        }]);
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
