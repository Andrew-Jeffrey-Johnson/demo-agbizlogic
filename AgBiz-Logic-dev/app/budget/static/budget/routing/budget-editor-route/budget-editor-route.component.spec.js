describe("Route Component: BudgetEditorRoute", function() {
  var controller,
      $scope,
      $state,
      budgetServiceMock;

  beforeEach(module('budgetModule'));
  beforeEach(module('mockModule'));

  beforeEach(inject(function($injector) {
    $scope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    budgetServiceMock = $injector.get("budgetServiceMock");

    var $componentController = $injector.get('$componentController');
    controller = $controller = $componentController('budgetEditorRoute', {
      budgetService: budgetServiceMock,
      $scope: $scope
    });

    spyOn($state, "go").and.returnValue();
    spyOn(budgetServiceMock, "destroyBudget").and.callThrough();
  }));



  describe("$onInit", function() {
    var budget_id;

    it("changes to manager state if no budget id in state query parameters", function() {
      $state.params = {};
      controller.$onInit();
      $scope.$digest();

      expect($state.go.calls.argsFor(0)).toEqual(["budget-manager"]);
    });


    it("initializes budget with budget id in state query parameters", function() {
      budget_id = 4;
      $state.params = {'budget': budget_id};
      controller.$onInit();

      expect(controller.budget.id).toEqual(budget_id);
    });

  });



  describe("onDiscard", function() {
    var budget;

    beforeEach(function() {
      budget = {id: 3};
    });


    it("goes to budget manager state with options", function() {
      controller.onDiscard(budget);
      $scope.$digest();

      expect($state.go.calls.argsFor(0)[0]).toEqual("budget-manager");
    });

  });


  describe("onSave", function() {
    var budget;

    beforeEach(function() {
      budget = {
        id: 2,
        title: "Title",
      };
      spyOn(budgetServiceMock, "updateBudget").and.callThrough();
    });

    it("sets budget's 'source' to 0 if it was not 0", function () {
      budget.source = "7";
      controller.onSave(budget);
      $scope.$digest();

      expect(budgetServiceMock.updateBudget.calls.argsFor(0)[0].source).toEqual("0");
    });


    it("calls data service to update budget", function () {
      controller.onSave(budget);
      $scope.$digest();

      expect(budgetServiceMock.updateBudget.calls.argsFor(0)[0]).toEqual(budget);
    });


    it("goes to budget manager state with options", function() {
      controller.onSave(budget);
      $scope.$digest();

      expect($state.go.calls.argsFor(0)).toEqual(["budget-manager"]);
    });

  });

});
