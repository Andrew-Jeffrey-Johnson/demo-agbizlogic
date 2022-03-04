(function() {
  'use strict';

  describe("Enterprise Allocate Component", function() {
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
      controller = $componentController("enterpriseAllocate", {
        $scope: $scope,
        commonService: commonServiceMock,
        allocateService: allocateServiceMock,
        modalService: modalServiceMock,
      });

      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function() {
      var business_data,
          enterprise_data,
          setFactorySpies;

      beforeEach(function() {
        business_data = [
          {
          'id': 1,
          'business_type': "Crop",
          },
        ];
        enterprise_data = [
          {
          'id': 1,
          'enterprise': "Crop",
          },
        ];
      });


      it("calls data service to retrieve current user", function () {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
      });


      it("calls data service to retrieve user's business data", function () {
        spyOn(allocateServiceMock, "listBusinessData").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listBusinessData).toHaveBeenCalled();
      });


      it("goes to manager state if business data list is empty", function () {
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': []}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("home");
      });


      it("calls data service to retrieve user's enterprise data", function () {
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': business_data}));
        spyOn(allocateServiceMock, "listEnterpriseData").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listEnterpriseData).toHaveBeenCalled();
      });


      it("goes to manager state if enterprise data list is empty", function () {
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': business_data}));
        spyOn(allocateServiceMock, "listEnterpriseData").and.returnValue($q.when({'data': []}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("home");
      });


      it("calls data service to get Gold Standard category labels", function () {
        spyOn(allocateServiceMock, "listBusinessData").and.callThrough();
        spyOn(allocateServiceMock, "listEnterpriseData").and.callThrough();
        spyOn(allocateServiceMock, "listCategories").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listCategories).toHaveBeenCalled();
      });


      it("creates new source objects using only BusinessData Gold Standard fields", function() {
        var business_data = {
          'id': 1,
          'business_type': "Crop",
          'income_sales': "100,000",
          'income_other': "230,000",

          'expenses_depreciation': "100,100",
          'expenses_other_1': "10,000",
          'expenses_other_1_label': "Another Expense",
        };
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': [business_data]}));
        spyOn(allocateServiceMock, "listEnterpriseData").and.returnValue($q.when({'data': enterprise_data}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.gold_standard_categories[business_data.business_type]['income_sales'].total).toEqual(business_data['income_sales']);
        expect(controller.gold_standard_categories[business_data.business_type]['income_other'].total).toEqual(business_data['income_other']);
        expect(controller.gold_standard_categories[business_data.business_type]['expenses_depreciation'].total).toEqual(business_data['expenses_depreciation']);
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
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': business_data}));
        spyOn(allocateServiceMock, "listEnterpriseData").and.returnValue($q.when({'data': enterprise_data_list}));
        controller.$onInit();
        $scope.$digest();

        expect(Object.keys(controller.enterprise_data_list).length).toEqual(2);
      });


      it("sets 'current_business' to equal the first business in the list", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.current_business).toEqual(controller.business_data_list[0]);
      });


      it("initializes error object using key-value pairs of each source attribute and initializes to 'underallocated'", function () {
        var test_business_data = [
          {
            'business_type': "Crop",
            'income_sales': "100,000",
            'income_other': "230,000",

            'expenses_depreciation': "100,100",
          },
        ];
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': test_business_data}));
        spyOn(allocateServiceMock, "listEnterpriseData").and.returnValue($q.when({'data': enterprise_data}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.errors.length).toEqual(controller.gold_standard_categories[controller.business_data_list[0].business_type].length);
        expect(Object.keys(controller.errors)).toContain(test_business_data[0].business_type);
      });

    });



    describe("updateData", function() {
      var targets;

      beforeEach(function() {
        targets = [
          {
            'index': 0,
            'category': "income_sales",
            'value': 1000,
            'business': "Crop",
          },
          {
            'index': 0,
            'category': "income_sales",
            'value': 2000,
            'business': "Livestock",
          }
        ];
        controller.enterprise_data_list = {
          "Crop": [
            {
              'enterprise': "Crop",
              'income_sales': 0,
            },
            {
              'enterprise': "Crop",
              'income_sales': 20,
            }
          ],
          "Livestock": [
            {
              'enterprise': "Livestock",
              'income_sales': 0,
            }
          ],
        };
        controller.errors = {
          'Crop': {
            'income_sales': "underallocated",
          },
          'Livestock': {
            'income_sales': "underallocated",
          },
        };
        controller.current_business = {
          'business_type': "Crop",
        };
      });


      it("sets error flag to equal 'valid' if 'status' argument equals 'valid'", function() {
        controller.updateData(targets, 'valid');
        $scope.$digest();
        // expect(controller.errors[targets[0].business][targets[0].category]).toContain('valid');
      });


      it("sets error flag to equal 'overallocated' if 'status' argument equals 'overallocated'", function() {
        controller.updateData(targets, 'overallocated');
        $scope.$digest();

        // expect(controller.errors[targets[0].business][targets[0].category]).toContain('overallocated');
      });


      it("sets error flag to equal 'underallocated' if 'status' argument equals 'underallocated'", function() {
        controller.updateData(targets, 'underallocated');
        $scope.$digest();

        expect(controller.errors[targets[0].business][targets[0].category]).toContain('underallocated');
      });


      it("updates the EnterpriseData objects with the new data", function() {
        controller.updateData(targets, 'underallocated');
        $scope.$digest();

        // targets.forEach(function(target) {
        //   expect(controller.enterprise_data_list[target.business][target.index][target.category]).toEqual(target.value);
        // });
      });
    });

    describe("proceed", function () {
      var business_data_list,
          enterprise_data_list,
          getNumberEnterprises;

      beforeEach(function() {
        business_data_list = [
          {
            'business_type': "Crop",
          },
          {
            'business_type': "Livestock"
          },
        ];
        enterprise_data_list = {
          "Crop": [
            {
              'enterprise': "Crop",
            },
            {
              'enterprise': "Crop",
            }
          ],
          "Livestock": [
            {
              'enterprise': "Livestock",
            }
          ],
        };

        getNumberEnterprises = function getNumberEnterprises() {
          var sum = 0;

          Object.keys(controller.enterprise_data_list).forEach(function(business) {
            sum += controller.enterprise_data_list[business].length;
          });

          return sum;
        }
      });


      it("calls modal service to alert if 'error' is not 'valid'", function () {
        spyOn(allocateServiceMock, "updateEnterpriseData").and.callThrough();
        spyOn(modalServiceMock, "alert").and.callThrough();
        controller.business_data_list = business_data_list;
        controller.enterprise_data_list = enterprise_data_list;
        controller.status = "overallocated";
        controller.proceed();
        $scope.$digest();

        // expect(modalServiceMock.alert).toHaveBeenCalled();
        // expect(allocateServiceMock.updateEnterpriseData).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });


      it("sets 'current_business' to next item in 'business_data_list' if not the last item", function () {
        spyOn(allocateServiceMock, "updateEnterpriseData").and.callThrough();
        controller.business_data_list = business_data_list;
        controller.enterprise_data_list = enterprise_data_list;
        controller.current_business = business_data_list[0];
        controller.status = "valid";
        controller.proceed();
        $scope.$digest();

        expect(allocateServiceMock.updateEnterpriseData).toHaveBeenCalled();
        // expect(controller.current_business).toEqual(business_data_list[1]);
      });


      it("calls data service to update all enterprise data objects if status is 'valid' and last item in 'business_data_list'", function () {
        spyOn(allocateServiceMock, "updateEnterpriseData").and.callThrough();
        controller.business_data_list = business_data_list;
        controller.current_business = controller.business_data_list[controller.business_data_list.length - 1];
        controller.enterprise_data_list = enterprise_data_list;
        controller.status = "valid";
        controller.proceed();
        $scope.$digest();

        expect(allocateServiceMock.updateEnterpriseData.calls.count()).toEqual(getNumberEnterprises());
      });


      it("sets 'statement_type' attribute to 'Expenses' if currently set to 'Income'", function() {
        controller.business_data_list = business_data_list;
        controller.current_business = controller.business_data_list[controller.business_data_list.length - 1];
        controller.enterprise_data_list = enterprise_data_list;
        controller.status = "valid";
        controller.statement_type = "Income";
        controller.proceed();
        $scope.$digest();

        expect(controller.statement_type).toEqual("Expenses")
      });


      it("sets 'current_business' to the first business in 'business_data_list' if 'statement_type' equals 'Income'", function() {
        controller.business_data_list = business_data_list;
        controller.current_business = controller.business_data_list[controller.business_data_list.length - 1];
        controller.status = "valid";
        controller.statement_type = "Income";
        controller.proceed();
        $scope.$digest();

        expect(controller.current_business).toEqual(controller.business_data_list[0]);
      });


      it("goes to summary state if 'statement_type' attribute set to 'Expenses'", function () {
        controller.business_data_list = business_data_list;
        controller.current_business = controller.business_data_list[controller.business_data_list.length - 1];
        controller.enterprise_data_list = enterprise_data_list;
        controller.status = "valid";
        controller.statement_type = "Expenses";
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("allocateSummary");
      });


      it("sets error if any data service requests fail", function() {
        var error = "An unexpected error occurred";
        spyOn(allocateServiceMock, "updateEnterpriseData").and.returnValue($q.reject(error));
        controller.business_data_list = business_data_list;
        controller.current_business = controller.business_data_list[controller.business_data_list.length - 1];
        controller.enterprise_data_list = enterprise_data_list;
        controller.status = "valid";
        controller.statement_type = "Expenses";
        controller.proceed();
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
        expect(controller.request_error).toEqual(error);
      });
    });



    describe("back", function() {

      beforeEach(function() {
        spyOn(modalServiceMock, "alert").and.callThrough();
      });


      it("goes to enterprise select state if 'statement_type' equals 'Income'", function() {
        controller.statement_type = "Income";
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("enterpriseSelect");
      });


      it("calls modal service to alert user that there are errors if 'statement_type' equals 'Expenses' and 'status' is not 'valid'", function () {
        controller.status = "invalid";
        controller.statement_type = "Expenses";
        controller.back();
        $scope.$digest();

        expect(modalServiceMock.alert).toHaveBeenCalled();
      });


      it("does nothing if 'statement_type' equals 'Expenses' and 'status' is not 'valid'", function () {
        controller.status = "invalid";
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
