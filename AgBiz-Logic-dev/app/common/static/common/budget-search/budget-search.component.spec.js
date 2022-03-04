(function() {

  describe("Budget Search Component", function () {
    var controller,
        $scope,
        $httpBackend,
        url_base_state_region_data,
        commonServiceMock;

    beforeEach(module("commonModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $httpBackend = $injector.get("$httpBackend");
      commonServiceMock = $injector.get("commonServiceMock");
      var $componentController = $injector.get("$componentController");
      controller = $componentController("budgetSearch", { commonService: commonServiceMock
});
    }));



    describe("$onInit", function () {

      beforeEach(function() {

        url_base_state_region_data = "/static/common/json/University_budget_for_State_Regions.json";


        controller.region_json_list_mock= [
          {
              "region": [
                  "Northern", 
                  "Southcentral", 
                  "Southeastern", 
                  "Southeastern Dryland", 
                  "Southwestern"
              ], 
              "state": "ID"
          }, 
          {
              "region": [
                  "East Central", 
                  "South East", 
                  "South RRV", 
                  "North RRV", 
                  "South Central", 
                  "North East", 
                  "North Central", 
                  "North West", 
                  "South West"
              ], 
              "state": "ND"
          }, 
          {
              "region": [
                  "Willamette Valley", 
                  "North Central", 
                  "Eastern", 
                  "South Central", 
                  "Klamath Basin Area", 
                  "Christmas Valley Area", 
                  "South Western", 
                  "Central"
              ], 
              "state": "OR"
          }
      ]
        
        controller.budgetList = [
          {
            'id': 1,
            'title': "My Budget",
            'module': "allocate",
            'state': "OR",
            'region': "Beaverton",
          },
          {
            'id': 43,
            'title': "My Budget (Climate)",
            'module': "climate",
            'state': "WA",
            'region': "Walla Walla",
          },
          {
            'id': 12,
            'title': "My Budget (Plan)",
            'module': "plan",
            'state': "MI",
            'region': "Midland",
          },
          {
            'id': 65,
            'title': "My Budget (Profit)",
            'module': "profit",
            'state': "",
            'region': "",
          },
          {
            'id': 87,
            'title': "Some Really Cool Budget",
            'module': "allocate",
            'state': "WI",
            'region': "Nowhere",
          },
        ];
      });


      it("initializes 'enterprise_list' to list of user's enterprises", function () {
        spyOn(commonServiceMock,"retrieveStateRegionData").and.callThrough();

        var enterprise_list = [
          {
            'label': "Select",
            'value': "",
          },
          {
            'label': "Crop",
            'value': "Crop",
          },
          {
            'label': "Livestock",
            'value': "Livestock",
          },
        ];
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveStateRegionData).toHaveBeenCalled();
        expect(controller.enterprise_list).toEqual(enterprise_list);
      });


      it("initializes 'filtered_budget_list' to equal component input 'budgetList'", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.filtered_budget_list).toEqual(controller.budgetList);
      });


      it("initializes the 'search' object to defaults", function () {
        var search = {
          'title': "",
          'enterprise': "",
          'state': "",
          'region': "",
        };

        controller.$onInit();
        $scope.$digest();

        expect(controller.search).toEqual(search);
      });


      it("initializes 'us_state_list' to contain all the unique states in 'budgetList'", function () {
        var us_state_list = controller.region_json_list_mock.map(function(region) {
        return region.state;
      });
        controller.$onInit();
        $scope.$digest();

        expect(controller.us_state_list).toEqual(us_state_list);
      });


      it("initializes 'us_state_list' to not include blank states", function () {
        var us_state_list = controller.region_json_list_mock.map(function(region) {
        return region.state;
      });

        controller.$onInit();
        $scope.$digest();

        expect(controller.us_state_list).toEqual(us_state_list);
      });


      it("initializes 'region_list' to contain all the unique regions in 'budgetList'", function () {
        
        var region_list = controller.region_json_list_mock;
        
        controller.$onInit();
        $scope.$digest();

        expect(controller.region_json_list).toEqual(region_list);
      });


      it("initializes 'region_list' to not include blank regions", function () {
        var region_list = controller.budgetList.map(function(budget) {
          return budget.region;
        })
        .filter(function(region, index, region_list) {
          return region_list.indexOf(region) == index && region != "";
        });
        controller.$onInit();
        $scope.$digest();

        expect(controller.region_list).not.toContain("");
      });

    });



    describe("$onChanges", function () {

      it("calls controlller '$onInit' method", function () {
        spyOn(controller, "$onInit").and.returnValue();
        controller.$onChanges();
        $scope.$digest();

        expect(controller.$onInit).toHaveBeenCalled();
      });
    });

  });

}());
