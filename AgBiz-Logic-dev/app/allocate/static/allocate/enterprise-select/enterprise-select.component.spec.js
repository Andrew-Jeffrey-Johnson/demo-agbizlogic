(function() {
  'use strict';

  describe("Enterprise Select Component", function() {
    var $scope,
        $q,
        $state,
        controller,
        allocateServiceMock,
        commonServiceMock;

    beforeEach(module("allocateModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      commonServiceMock = $injector.get("commonServiceMock");
      allocateServiceMock = $injector.get("allocateServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("enterpriseSelect", {
        commonService: commonServiceMock,
        allocateService: allocateServiceMock
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


      it("calls data service to retrieve user's business data", function() {
        spyOn(allocateServiceMock, "listBusinessData").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listBusinessData).toHaveBeenCalled();
        expect(controller.business_data_list).toBeDefined();
      });


      it("goes to manager state if business data list is empty", function() {
        var fake = $q.when({'data': []});
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue(fake);
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("home");
      });


      it("calls data service to retrieve user's EnterpriseData objects", function() {
        spyOn(allocateServiceMock, "listEnterpriseData").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listEnterpriseData).toHaveBeenCalled();
        expect(controller.enterprise_data_list).toBeDefined();
      });


      it("calls data service to retrieve commodity list", function() {
        spyOn(commonServiceMock, "listCommodities").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.listCommodities).toHaveBeenCalled();
        expect(controller.commodities).toBeDefined();
      });

    });



    describe("addEnterpriseData", function() {

      beforeEach(function() {
        spyOn(allocateServiceMock, "listEnterpriseData").and.callThrough();
        controller.business_data_list = [
          {
            'business_type': "Crop",
          },
        ];
        controller.user = {
          'username': "johncleese",
        };
      });


      it("does nothing if 'enterprise', 'category_1', 'category_2', and 'market' fields are undefined", function() {
        controller.enterprise = {};
        spyOn(allocateServiceMock, "createEnterpriseData").and.callThrough();
        controller.addEnterpriseData();
        $scope.$digest();

        expect(allocateServiceMock.createEnterpriseData).not.toHaveBeenCalled();
      });


      it("calls data service to create new EnterpriseData object", function() {
        controller.enterprise = {
          'enterprise': "Crop",
          'category_1': {'name': "Nut Crops"},
          'category_2': {'name': "Almonds"},
          'market': {'name': "GMO"},
        };
        spyOn(allocateServiceMock, "createEnterpriseData").and.callThrough();
        controller.addEnterpriseData();
        $scope.$digest();

        expect(allocateServiceMock.createEnterpriseData).toHaveBeenCalled();
      });


      it("does not call data service to create new EnterpriseData if 'enterprise_limit' is true", function() {
        controller.enterprise = max_enterprise_list;
        spyOn(allocateServiceMock, "createEnterpriseData").and.callThrough();
        controller.addEnterpriseData();
        $scope.$digest();

        expect(allocateServiceMock.createEnterpriseData).not.toHaveBeenCalled();
      });


      it("sets new enterprise object to empty object", function() {
        controller.enterprise = {
          'enterprise': "Crop",
          'category_1': {'name': "Nut Crops"},
          'category_2': {'name': "Almonds"},
          'market': {'name': "GMO"},
        };
        controller.addEnterpriseData();
        $scope.$digest();

        expect(controller.enterprise).toEqual({});
      });

    });



    describe("removeEnterpriseData", function() {

      beforeEach(function() {
        spyOn(allocateServiceMock, "destroyEnterpriseData").and.callThrough();
        controller.business_data_list = [
          {
            'business_type': "Crop",
          },
        ];
        controller.user = {
          'username': "johncleese",
        };
      });


      it("does nothing if passed enterprise is undefined", function() {
        controller.removeEnterpriseData();
        $scope.$digest();

        expect(allocateServiceMock.destroyEnterpriseData).not.toHaveBeenCalled();
      });


      it("calls data service to destroy given EnterpriseData object", function() {
        controller.removeEnterpriseData(max_enterprise_list[0]);
        $scope.$digest();

        expect(allocateServiceMock.destroyEnterpriseData.calls.argsFor(0)).toContain(max_enterprise_list[0].id);
      });


      it("calls data service to retrieve updated EnterpriseData list", function() {
        spyOn(allocateServiceMock, "listEnterpriseData").and.callThrough();
        controller.removeEnterpriseData(max_enterprise_list[0]);
        $scope.$digest();

        expect(allocateServiceMock.listEnterpriseData).toHaveBeenCalled();
        expect(controller.enterprise_data_list).toBeDefined();
      });


      it("sets 'allowed_enterprises' to contain deleted enterprise's type if number with that type less than limit", function () {
        spyOn(allocateServiceMock, "listEnterpriseData").and.returnValue($q.when({'data': []}));
        controller.removeEnterpriseData(max_enterprise_list[0]);
        $scope.$digest();

        expect(controller.allowed_enterprises[0].business_type).toEqual(max_enterprise_list[0].enterprise);
      });


      it("removes deleted enterprise's type from 'allowed_enterprises' if number with that type is greater than or equal to limit", function () {
        spyOn(allocateServiceMock, "listEnterpriseData").and.returnValue($q.when({'data': max_enterprise_list}));
        controller.removeEnterpriseData(max_enterprise_list[0]);
        $scope.$digest();

        expect(controller.allowed_enterprises.length).toEqual(0);
      });

    });



    describe("back", function() {

      it("goes to business allocate state", function() {
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("businessAllocate");
      });
    });



    describe("saveEnterprises", function() {

      it("does nothing if enterprise data list is empty", function() {
        controller.enterprise_data_list = [];
        controller.saveEnterprises();
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });


      it("goes to enterprise allocate state if enterprise data list is not empty", function() {
        controller.enterprise_data_list = [{}];
        controller.saveEnterprises();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("enterpriseAllocate");
      });
    });

  });

  var max_enterprise_list = [{
    'id': 1,
    'enterprise': "Crop",
    'category_1': {'name': "Nut Crops"},
    'category_2': {'name': "Almonds"},
    'market': {'name': "GMO"},
  },
  {
    'id': 2,
    'enterprise': "Crop",
    'category_1': {'name': "Nut Crops"},
    'category_2': {'name': "Almonds"},
    'market': {'name': "GMO"},
  },
  {
    'id': 3,
    'enterprise': "Crop",
    'category_1': {'name': "Nut Crops"},
    'category_2': {'name': "Almonds"},
    'market': {'name': "GMO"},
  },
  {
    'id': 33,
    'enterprise': "Crop",
    'category_1': {'name': "Nut Crops"},
    'category_2': {'name': "Almonds"},
    'market': {'name': "GMO"},
  },
  {
    'id': 54,
    'enterprise': "Crop",
    'category_1': {'name': "Nut Crops"},
    'category_2': {'name': "Almonds"},
    'market': {'name': "GMO"},
  },
  {
    'id': 98,
    'enterprise': "Crop",
    'category_1': {'name': "Nut Crops"},
    'category_2': {'name': "Almonds"},
    'market': {'name': "GMO"},
  },
  {
    'id': 50,
    'enterprise': "Crop",
    'category_1': {'name': "Nut Crops"},
    'category_2': {'name': "Almonds"},
    'market': {'name': "GMO"},
  },
  {
    'id': 72,
    'enterprise': "Crop",
    'category_1': {'name': "Nut Crops"},
    'category_2': {'name': "Almonds"},
    'market': {'name': "GMO"},
  }];

}());
