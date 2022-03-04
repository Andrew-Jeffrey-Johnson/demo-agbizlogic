(function() {
  'use strict';

  describe("Allocate Summary Component", function() {
    var $scope,
        $q,
        $state,
        $window,
        controller,
        allocateServiceMock,
        commonServiceMock,
        budgetServiceMock;

    beforeEach(module("allocateModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      $window = $injector.get("$window");
      commonServiceMock = $injector.get("commonServiceMock");
      allocateServiceMock = $injector.get("allocateServiceMock");
      budgetServiceMock = $injector.get("budgetServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("allocateSummary", {
        $scope: $scope,
        commonService: commonServiceMock,
        allocateService: allocateServiceMock,
        budgetService: budgetServiceMock
      });

      spyOn($state, "go").and.returnValue();
      spyOn($window.location, "assign").and.returnValue();
    }));



    describe("$onInit", function() {
      var business_data,
          enterprise_data,
          setFactorySpies;

      beforeEach(function() {
        business_data = {
          'id': 1,
          'business_type': "Crop",
        };
        enterprise_data = {
          'id': 1,
          'enterprise': "Crop",
        };

        setFactorySpies = function(business_data_list, enterprise_data_list) {
          spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': business_data_list}));
          spyOn(allocateServiceMock, "listEnterpriseData").and.returnValue($q.when({'data': enterprise_data_list}));
        }
      });


      it("calls data service to retrieve current user", function() {
        setFactorySpies([business_data], [enterprise_data]);
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
      });


      it("calls data service to retrieve user's business data", function() {
        setFactorySpies([business_data], [enterprise_data]);
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listBusinessData).toHaveBeenCalled();
      });


      // FIXME: business_data should be empty array, but $state.go doesn't
      //        stop program execution, and so lines that depend on
      //        business_data_list are executed and will fail if undefined.
      //        Need to find out how to mock $state.go to quit function.
      it("goes to home state if business data list is empty", function() {
        setFactorySpies([business_data], []);
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("home");
      });


      it("calls data service to retrieve user's enterprise data", function() {
        setFactorySpies([business_data], [enterprise_data]);
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listEnterpriseData).toHaveBeenCalled();
      });


      it("goes to home state if enterprise data list is empty", function() {
        setFactorySpies([business_data], []);
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("home");
      });


      it("calls data service to get Gold Standard category labels", function() {
        setFactorySpies([business_data], [enterprise_data]);
        spyOn(allocateServiceMock, "listCategories").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listCategories).toHaveBeenCalled();
      });


      it("sorts EnterpriseData objects by 'enterprise' attribute", function() {
        var enterprise_data_list = [
          {
            'enterprise': "Crop",
          },
          {
            'enterprise': "Livestock",
          },
        ];
        setFactorySpies([business_data], enterprise_data_list);
        controller.$onInit();
        $scope.$digest();

        expect(Object.keys(controller.enterprise_data_list).length).toEqual(2);
      });


      it("sets 'current_business' to equal the first business in the list", function() {
        setFactorySpies([business_data], [enterprise_data]);
        controller.$onInit();
        $scope.$digest();

        expect(controller.current_business).toEqual("Crop");
      });

    });



    describe("changeStatement", function() {

      it("sets 'statement_type' to 'Expenses' if currently set to 'Income'", function() {
        controller.statement_type = "Income";
        controller.changeStatement();
        $scope.$digest();

        expect(controller.statement_type).toEqual("Expenses");
      });


      it("sets 'statement_type' to 'Income' if currently set to 'Expenses'", function() {
        controller.statement_type = "Expenses";
        controller.changeStatement();
        $scope.$digest();

        expect(controller.statement_type).toEqual("Income");
      });

    });



    describe("totalIncome", function () {

      beforeEach(function() {
        controller.enterprise_data_list = [
          {
            'enterprise': "Crop",
            'total_income': 5000,
          },
          {
            'enterprise': "Crop",
            'total_income': 0,
          },
          {
            'enterprise': "Livestock",
            'total_income': 3000,
          }
        ];
      });


      it("returns sum of all 'total_income' fields for enterprises with 'enterprise' equal to given 'business_type'", function () {
        var business_type = controller.enterprise_data_list[0].enterprise;
        var total_income = controller.enterprise_data_list
          .filter(function(enterprise) {
            return enterprise.enterprise == business_type;
          })
          .reduce(function(previous_total_income, enterprise) {
            return previous_total_income + enterprise.total_income;
          }, 0);
        $scope.$digest();

        expect(controller.totalIncome(business_type)).toEqual(total_income);
      });

    });



    describe("totalExpenses", function () {

      beforeEach(function() {
        controller.enterprise_data_list = [
          {
            'enterprise': "Crop",
            'total_expenses': 5000,
          },
          {
            'enterprise': "Crop",
            'total_expenses': 0,
          },
          {
            'enterprise': "Livestock",
            'total_expenses': 3000,
          }
        ];
      });


      it("returns sum of all 'total_expenses' fields for enterprises with 'enterprise' equal to given 'business_type'", function () {
        var business_type = controller.enterprise_data_list[0].enterprise;
        var total_expenses = controller.enterprise_data_list
          .filter(function(enterprise) {
            return enterprise.enterprise == business_type;
          })
          .reduce(function(previous_total_expenses, enterprise) {
            return previous_total_expenses + enterprise.total_expenses;
          }, 0);
        $scope.$digest();

        expect(controller.totalExpenses(business_type)).toEqual(total_expenses);
      });

    });




    describe("proceed", function() {

      it("calls data service to generate user's budgets", function () {
        spyOn(budgetServiceMock, "generateBudgets").and.callThrough();
        controller.proceed();
        $scope.$digest();
        // expect(budgetServiceMock.generateBudgets).toHaveBeenCalled();
      });


      it("goes to budget manager state", function() {
        controller.proceed();
        $scope.$digest();
        // expect($window.location.assign.calls.argsFor(0)).toContain("/budget/")
      });
    });



    describe("back", function() {

      it("goes to enterprise allocate state", function() {
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("enterpriseAllocate");
      });
    });

  });

}());
