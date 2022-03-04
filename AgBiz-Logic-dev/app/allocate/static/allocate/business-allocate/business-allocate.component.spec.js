(function() {
  'use strict';

  describe("Business Allocate Component", function() {
    var $scope,
        $q,
        $state,
        controller,
        allocateServiceMock,
        commonServiceMock,
        modalServiceMock;

    beforeEach(module("allocateModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      commonServiceMock = $injector.get("commonServiceMock");
      allocateServiceMock = $injector.get("allocateServiceMock");
      modalServiceMock = $injector.get("modalServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("businessAllocate", {
        $scope: $scope,
        commonService: commonServiceMock,
        allocateService: allocateServiceMock,
        modalService: modalServiceMock,
      });

      spyOn($state, "go").and.returnValue();
    }));


    describe("$onInit", function() {

      it("calls data service to retrieve current user", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
      });


      it("calls data service to retrieve user's ScheduleF data", function() {
        spyOn(allocateServiceMock, "listScheduleF").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listScheduleF).toHaveBeenCalled();
      });


      it("goes to home state if Schedule F data list is empty", function () {
        spyOn(allocateServiceMock, "listScheduleF").and.returnValue($q.when({'data': []}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("home");
      });


      it("calls data service to retrieve user's business data", function () {
        spyOn(allocateServiceMock, "listBusinessData").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listBusinessData).toHaveBeenCalled();
        expect(controller.business_data_list).toBeDefined();
      });


      it("goes to home state if business data list is empty", function () {
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': []}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("home");
      });


      it("calls data service to convert the Schedule F to Gold Standard", function () {
        spyOn(allocateServiceMock, "convertToGoldStandard").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.convertToGoldStandard).toHaveBeenCalled();
      });


      it("initializes error object using key-value pairs of each source attribute to 'underallocated'", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.errors.length).toEqual(controller.gold_standard_categories.length);
        for (var error in controller.errors) {
          expect(controller.errors[error]).toEqual("underallocated");
        }
      });


      it("calls $scope.$on to subscribe to 'modalConfirmed' event", function () {
        spyOn($scope, "$on").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect($scope.$on.calls.argsFor(0)[0]).toEqual("modalConfirmed");
      });

    });



    describe("updateData", function() {
      var targets,
          business_data_list;

      beforeEach(function() {
        targets = [
          {
            'index': 0,
            'category': "income_sales",
            'value': 1000,
          },
          {
            'index': 1,
            'category': "income_sales",
            'value': 2000,
          }
        ];
        business_data_list = [
          {
            'business_type': "Crop",
            'income_sales': 0,
          },
          {
            'business_type': "Livestock",
            'income_sales': 0,
          }
        ];
      });


      it("sets error flag to equal 'valid' if 'status' argument equals 'valid'", function() {
        controller.updateData(targets, 'valid');
        $scope.$digest();

        expect(controller.errors[targets[0].category]).toContain('valid');
      });


      it("sets error flag to equal 'overallocated' if 'status' argument equals 'overallocated'", function() {
        controller.updateData(targets, 'overallocated');
        $scope.$digest();

        expect(controller.errors[targets[0].category]).toContain('overallocated');
      });


      it("sets error flag to equal 'underallocated' if 'status' argument equals 'underallocated'", function() {
        controller.updateData(targets, 'underallocated');
        $scope.$digest();

        expect(controller.errors[targets[0].category]).toContain('underallocated');
      });


      it("sets status flag to 'error' if at least one error equals 'error'", function() {
        controller.errors = {
          'income_sales': "valid",
          'income_other': "overallocated",
        };
        controller.updateData(targets, 'error');
        $scope.$digest();

        expect(controller.status).toEqual("error");
      });


      it("sets status flag to 'overallocated' if at least one error equals 'overallocated' and none equal 'error'", function() {
        controller.errors = {
          'income_sales': "valid",
          'income_other': "overallocated",
        };
        controller.updateData(targets, 'valid');
        $scope.$digest();

        expect(controller.status).toEqual("overallocated");
      });


      it("sets status flag to 'underallocated' if at least one error equals 'underallocated' and none equal 'error' nor 'overallocated'", function() {
        controller.errors = {
          'income_sales': "valid",
          'income_other': "valid",
        };
        controller.updateData(targets, 'underallocated');
        $scope.$digest();

        expect(controller.status).toEqual("underallocated");
      });


      it("sets status flag to 'valid' if all error equal 'valid'", function() {
        controller.errors = {
          'income_sales': "valid",
          'income_other': "valid",
        };
        controller.updateData(targets, 'valid');
        $scope.$digest();

        expect(controller.status).toEqual("valid");
      });



      it("updates the BusinessData objects with the new data", function() {
        controller.business_data_list = [
          {
            'business_type': "Crop",
            'income_sales': 200,
          }
        ];
        controller.updateData(targets, 'underallocated');
        $scope.$digest();

        expect(controller.business_data_list[0]['income_sales']).toEqual(targets[0]['value']);
      });

    });



    describe("proceed", function () {

      beforeEach(function() {
        spyOn(modalServiceMock, "confirm").and.callThrough();
      });


      it("does nothing if status flag is 'overallocated'", function() {
        controller.status = "overallocated";
        controller.proceed();
        $scope.$digest();

        expect(modalServiceMock.confirm).not.toHaveBeenCalled();
      });


      it("does nothing if status flag is 'error'", function() {
        controller.errors = {
          'income_sales': "error",
        };
        controller.status = "error";
        controller.proceed();
        $scope.$digest();

        expect(modalServiceMock.confirm).not.toHaveBeenCalled();
      });


      it("does not call modal service if 'statement_type' equals 'Income'", function() {
        spyOn(controller, "saveData").and.returnValue();
        controller.status = "valid";
        controller.statement_type = "Income";
        controller.proceed();
        $scope.$digest();

        expect(modalServiceMock.confirm).not.toHaveBeenCalled();
        expect(controller.saveData).toHaveBeenCalled();
      });


      it("calls modal service to confirm the user's actions if 'statement_type' equals 'Expenses'", function () {
        controller.status = "valid";
        controller.statement_type = "Expenses";
        controller.proceed();
        $scope.$digest();

        expect(modalServiceMock.confirm).not.toHaveBeenCalled();
      });

    });



    describe("saveData", function() {
      var business_data_list;

      beforeEach(function() {
        spyOn(allocateServiceMock, "updateBusinessData").and.callThrough();
        spyOn(allocateServiceMock, "markCompleted").and.callThrough();
        business_data_list = [
          {
            'id': 1,
          },
          {
            'id': 2,
          },
        ];
      });


      it("does nothing if status flag is 'overallocated'", function() {
        controller.business_data_list = business_data_list;
        controller.status = "overallocated";
        controller.saveData();
        $scope.$digest();

        expect(allocateServiceMock.updateBusinessData).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });


      it("does nothing if status flag is 'error'", function() {
        controller.business_data_list = business_data_list;
        controller.errors = {
          'income_sales': "error",
        };
        controller.status = "error";
        controller.saveData();
        $scope.$digest();

        expect(allocateServiceMock.updateBusinessData).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });


      it("calls modal service to alert user that there are errors it 'status' is not 'valid' or 'underallocated'", function () {
        spyOn(modalServiceMock, "alert").and.callThrough();
        controller.status = "overallocated";
        controller.statement_type = "Expenses";
        controller.back();
        $scope.$digest();

        expect(modalServiceMock.alert).toHaveBeenCalled();
      });


      it("calls data service to update all business data objects if status is 'valid'", function() {
        controller.business_data_list = business_data_list;
        controller.status = "valid";
        controller.saveData();
        $scope.$digest();

        expect(allocateServiceMock.updateBusinessData.calls.count()).toEqual(controller.business_data_list.length);
      });


      it("calls data service to update all business data objects if status is 'valid'", function() {
        controller.business_data_list = business_data_list;
        controller.status = "underallocated";
        controller.saveData();
        $scope.$digest();

        expect(allocateServiceMock.updateBusinessData.calls.count()).toEqual(controller.business_data_list.length);
      });


      it("sets 'statement_type' attribute to 'Expenses' if currently set to 'Income'", function() {
        controller.business_data_list = business_data_list;
        controller.status = "valid";
        controller.statement_type = "Income";
        controller.saveData();
        $scope.$digest();

        expect(controller.statement_type).toEqual("Expenses")
      });


      it("calls data service to mark each business data as completed", function () {
        controller.business_data_list = business_data_list;
        controller.status = "valid";
        controller.statement_type = "Expenses";
        controller.saveData();
        $scope.$digest();

        expect(allocateServiceMock.markCompleted.calls.count()).toEqual(controller.business_data_list.length);
      });


      it("goes to enterprise select state after updating business data objects if 'statement_type' attribute set to 'Expenses'", function() {
        controller.business_data_list = business_data_list;
        controller.status = "valid";
        controller.statement_type = "Expenses";
        controller.saveData();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("businessSummary");
      });

    });



    describe("back", function() {

      beforeEach(function() {
        spyOn(modalServiceMock, "alert").and.callThrough();
      });


      it("goes to business select state if 'statement_type' equals 'Income'", function() {
        controller.statement_type = "Income";
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("businessSelect");
      });


      it("calls modal service to alert user that there are errors if 'statement_type' equals 'Expenses' and 'status' is not 'valid'", function () {
        controller.status = "overallocated";
        controller.statement_type = "Expenses";
        controller.back();
        $scope.$digest();

        expect(modalServiceMock.alert).toHaveBeenCalled();
      });


      it("does nothing if 'statement_type' equals 'Expenses' and 'status' is not 'valid' or 'underallocated'", function () {
        controller.status = "overallocated";
        controller.statement_type = "Expenses";
        controller.back();
        $scope.$digest();

        expect(controller.statement_type).toEqual("Expenses");
      });



      it("changes 'statement_type' to 'Income' if it currently equals 'Expenses' and 'status' equals 'valid' or 'underallocated'", function () {
        controller.status = "underallocated";
        controller.statement_type = "Expenses";
        controller.back();
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
        expect(controller.statement_type).toEqual("Income");
      });

    });

  });

}());
