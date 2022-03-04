(function() {
  'use strict';

  describe("BudgetInventoryController", function() {
    var controller,
        $q,
        $state,
        $scope,
        $window,
        $uibModal,
        budgetServiceMock,
        commonServiceMock;

    beforeEach(module('budgetModule'));
    beforeEach(module('commonModule'));
    beforeEach(module('mockModule'));

    beforeEach(inject(function($injector) {
      $state = $injector.get("$state");
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $window = $injector.get("$window");
      $uibModal = $injector.get("$uibModal");
      commonServiceMock = $injector.get("commonServiceMock");
      budgetServiceMock = $injector.get("budgetServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController('manager', {
        commonService: commonServiceMock,
        budgetService: budgetServiceMock,
      });

      spyOn($uibModal, "open").and.returnValue({'result': $q.when()});
      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function() {
      var user;

      beforeEach(function() {
        user = {
          'id': 1,
          'username': "johncleese",
        };
        spyOn(commonServiceMock, "retrieveCurrentUser").and.returnValue($q.when({'data': user}));
      });


      it("calls data service to retrieve the current user", function() {
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
        expect(controller.current_user).toBeDefined();
      });


      it("calls data service to list the current user's budgets if user is defined", function() {
        spyOn(budgetServiceMock, "listBudgets").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(budgetServiceMock.listBudgets).toHaveBeenCalled();
      });


      it("calls data service to retrieve user's budgets with fields necessary fields", function () {
        spyOn(budgetServiceMock, "listBudgets").and.callThrough();
        var fields = "id,title,temp,notes,created_date,modified_date";
        controller.$onInit();
        $scope.$digest();

        expect(budgetServiceMock.listBudgets.calls.argsFor(0)[1]).toEqual(fields);
      });


      it("calls data service to retrieve user's budgets with 'module' equal to 'allocate'", function () {
        spyOn(budgetServiceMock, "listBudgets").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(budgetServiceMock.listBudgets.calls.argsFor(0)[2]).toEqual("allocate");
      });


      it("calls controller method to create university budget if query parameters contain 'view-university-budgets'", function () {
        $state.params = {
          'view-university-budgets': "true",
        };
        spyOn(controller, "newBudget").and.returnValue();
        controller.$onInit();
        $scope.$digest();

        expect(controller.newBudget.calls.argsFor(0)).toEqual(["university"]);
      });


      it("does nothing if query parameters do not contain 'view-university-budgets'", function () {
        $state.params = {};
        controller.$onInit();
        $scope.$digest();

        expect($uibModal.open).not.toHaveBeenCalled();
      });

    });

    describe("restoreBudgets", function() {

      beforeEach(function() {
        spyOn(budgetServiceMock, "generateBudgets").and.callThrough();
      });

      it("calls data service to generate user's budgets", function () {
        controller.restoreBudgets();

        expect(budgetServiceMock.generateBudgets).toHaveBeenCalled();
      });

    });



    describe("newBudget", function() {

      it("calls $uibModal to open new budget modal if given 'new'", function () {
        controller.newBudget('new');
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0]['controller']).toContain("NewBudgetModalController")
      });


      it("calls $uibModal to open copy budget modal if given 'copy'", function () {
        controller.newBudget('copy');
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0]['controller']).toContain("CopyBudgetModalController");
      });


      it("calls $uibModal to open university budget modal if given 'university'", function () {
        controller.newBudget('university');
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0]['controller']).toContain("UniversityBudgetModalController");
      });


      it("calls data service to retrieve university budgets to pass to modal controller if called with 'university'", function () {
        spyOn(budgetServiceMock, "listUniversityBudgets").and.callThrough();
        controller.newBudget('university');
        $scope.$digest();

        expect(budgetServiceMock.listUniversityBudgets).toHaveBeenCalled()
        expect(Object.keys($uibModal.open.calls.argsFor(0)[0]['resolve'])).toContain("university_budget_list");
      });


      it("goes to budget editor state when modal instance is closed", function () {
        controller.newBudget('university');
        $scope.$digest();

        expect($state.go.calls.argsFor(0)[0]).toEqual("budget-editor");
      });


      it("does not call data service to retrieve university budgets if already initialized", function () {
        spyOn(budgetServiceMock, "listUniversityBudgets").and.callThrough();
        controller.university_budget_list = [{}, {}, {}];
        controller.newBudget('university');
        $scope.$digest();

        expect(budgetServiceMock.listUniversityBudgets).not.toHaveBeenCalled();
        expect(Object.keys($uibModal.open.calls.argsFor(0)[0]['resolve'])).toContain("university_budget_list");
      });


      it("calls $uibModal to open combine budgets modal if given 'combine'", function () {
        controller.newBudget('combine');
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0]['controller']).toContain("CombineBudgetsModalController");
      });

    });


    describe("editBudget", function() {
      var budget,
          copied_budget;

      beforeEach(function() {
        budget = {
          'id': 1,
          'title': "Edit Budget",
        };
        copied_budget = {
          'id': 23,
          'title': "Copied Budget",
        };
      });


      it("does nothing if passed invalid budget", function () {
        controller.editBudget();
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });


      it("calls data service to create copy of given budget", function() {
        spyOn(budgetServiceMock, "copyBudgetByID").and.callThrough();
        controller.editBudget(budget);
        $scope.$digest();

        expect(budgetServiceMock.copyBudgetByID.calls.argsFor(0)[0]).toEqual(budget.id);
      });


      it("should change state to budget editor with copied budget id in state parameters", function() {
        spyOn(budgetServiceMock, "copyBudgetByID").and.returnValue($q.when({'data': copied_budget}));
        controller.editBudget(budget);
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["budget-editor", {
          'budget': copied_budget.id,
        }]);
      });

    });



    describe("removeBudget", function() {
      var budget;

      beforeEach(function() {
        controller.current_user = {
          'username': "johncleese",
        };
        budget = {
          'id': 1,
        };
      });


      it("calls data service to destroy given budget", function() {
        spyOn(budgetServiceMock, "destroyBudget").and.callThrough();
        controller.removeBudget(budget);
        $scope.$digest();

        expect(budgetServiceMock.destroyBudget.calls.argsFor(0)).toEqual([budget.id]);
      });


      it("calls data service to list user's budgets with 'budget_fields' argument", function () {
        spyOn(budgetServiceMock, "listBudgets").and.callThrough();
        controller.removeBudget(budget);
        $scope.$digest();

        expect(budgetServiceMock.listBudgets.calls.argsFor(0)[1]).toEqual(controller.budget_fields);
      });


      it("calls data service to retrieve user's budgets with 'module_name' equal to 'allocate'", function () {
        spyOn(budgetServiceMock, "listBudgets").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(budgetServiceMock.listBudgets.calls.argsFor(0)[2]).toEqual("allocate");
      });

    });



    describe("selectBudget", function () {
      var budget;

      beforeEach(function() {
        budget = {
          'id': 43,
        };
      });


      it("sets 'search_budget' to equal 'budget' argument", function () {
        controller.selectBudget(budget);
        $scope.$digest();

        expect(controller.search_budget).toEqual(budget);
      });
    });



    describe("toggleSearch", function () {

      it("sets 'show_search' to false if true", function () {
        controller.show_search = true;
        controller.toggleSearch();
        $scope.$digest();

        expect(controller.show_search).toEqual(false);
      });


      it("sets 'show_search' to true if false", function () {
        controller.show_search = false;
        controller.toggleSearch();
        $scope.$digest();

        expect(controller.show_search).toEqual(true);
      });

    });



    describe("back", function () {

      it("calls $window service to go to dashboard view", function () {
        spyOn($window.location, "replace").and.returnValue();
        controller.back();
        $scope.$digest();

        expect($window.location.replace.calls.argsFor(0)).toEqual(["/dashboard"]);
      });

    });

  });

})();
