(function() {
  'use strict';

  describe("Business Summary Component", function() {
    var $scope,
        $q,
        $state,
        $window,
        controller,
        allocateServiceMock,
        commonServiceMock;

    beforeEach(module("allocateModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      $window = $injector.get("$window");
      var $componentController = $injector.get("$componentController");
      commonServiceMock = $injector.get("commonServiceMock");
      allocateServiceMock = $injector.get("allocateServiceMock");

      controller = $componentController("businessSummary", {
        $scope: $scope,
        commonService: commonServiceMock,
        allocateService: allocateServiceMock
      });

      spyOn($state, "go").and.returnValue();
      spyOn($window.location, "assign").and.returnValue();
    }));


    describe("$onInit", function() {
      var business_data;


      beforeEach(function() {
        business_data = {
          'id': 1,
          'business_type': "Crop",
        };

      });


      it("calls data service to retrieve current user", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
      });


      it("calls data service to retrieve user's business data", function() {
        spyOn(allocateServiceMock, "listBusinessData").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listBusinessData).toHaveBeenCalled();
      });


      it("goes to home state if business data list is empty", function() {
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': []}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("home");
      });


      it("calls data service to get Gold Standard category labels", function() {
        spyOn(allocateServiceMock, "listCategories").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listCategories).toHaveBeenCalled();
      });


      it("goes to home state if Gold Standard category labels are empty", function() {
        spyOn(allocateServiceMock, "listCategories").and.returnValue($q.when({'data': []}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["home"]);
      });


      it("calls data service to retrieve Whole Farm data", function () {
        spyOn(allocateServiceMock, "listWholeFarm").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listWholeFarm).toHaveBeenCalled();
        expect(controller.whole_farm_data).toBeDefined();
      });


      it("goes to home state if returned Whole Farm data is empty", function () {
        spyOn(allocateServiceMock, "listWholeFarm").and.returnValue($q.when({'data': {}}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["home"]);
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



    describe("isCategoryEmpty", function () {

      it("returns true if all BusinessData objects in 'business_data_list' have 'category' value equal to 0", function () {
        controller.business_data_list = [
          {
            'expenses_other_1': 0,
          },
          {
            'expenses_other_1': 0,
          }
        ];

        // expect(controller.isCategoryEmpty('expenses_other_1')).toEqual(true);
      });


      it("returns false if at least one BusinessData objects in 'business_data_list' have 'category' value equal greater than 0", function () {
        controller.business_data_list = [
          {
            'expenses_other_1': 10,
          },
          {
            'expenses_other_1': 0,
          }
        ];

        expect(controller.isCategoryEmpty('expenses_other_1')).toEqual(false);
      });

    });



    describe("proceed", function() {

      it("goes to dashboard state", function() {
        controller.proceed();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toContain("/dashboard/")
      });

    });



    describe("back", function() {

      it("goes to business allocate state", function() {
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("businessAllocate");
      });

    });

  });

}());
