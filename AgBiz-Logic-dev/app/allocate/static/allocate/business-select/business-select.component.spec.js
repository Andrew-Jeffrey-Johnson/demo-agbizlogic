(function() {
  'use strict';

  describe("Business Select Component", function() {
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

      controller = $componentController("businessSelect", {commonService: commonServiceMock, allocateService: allocateServiceMock});

      // Catch state change
      spyOn($state, "go").and.returnValue();
      spyOn($window.location, "assign").and.returnValue();
    }));


    describe("$onInit", function() {
      var business_data_list;

      it("calls data service to get the current user", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
      });


      it("calls data service to get list of user's business data", function() {
        spyOn(allocateServiceMock, "listBusinessData").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(allocateServiceMock.listBusinessData).toHaveBeenCalled();
      });


      it("sets 'selected' attribute of any businesses returned by data service", function() {
        business_data_list = [
          {
            'business_type': "Crop"
          }
        ];
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': business_data_list}));
        controller.$onInit();
        $scope.$digest();

        angular.forEach(controller.business_options, function(business_option) {
          angular.forEach(business_data_list, function(business_data) {
            if (business_option.business_type == business_data.business_type) {
              expect(business_option.selected).toEqual(true);
            }
          });
        });
      });


      it("sets businesses_needed flag if no businesses are selected", function () {
        spyOn(allocateServiceMock, "listBusinessData").and.returnValue($q.when({'data': []}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.businesses_needed).toEqual(true);
      });
    });



    describe("select", function() {
      var business;

      beforeEach(function() {
        business = {
          'selected': false,
          'disabled': false,
        };
      });


      it("sets 'selected' attribute to true if false", function() {
        controller.select(business);
        $scope.$digest();

        expect(business.selected).toEqual(true);
      });


      it("sets 'selected' attribute to false if true", function() {
        business.selected = true;
        controller.select(business);
        $scope.$digest();

        expect(business.selected).toEqual(false);
      });


      it("sets 'selected' attribute to false if 'disabled' attribute is true", function() {
        business.disabled = true;
        controller.select(business);
        $scope.$digest();

        expect(business.selected).toEqual(false);
      });


      it("sets businesses_needed flag if no businesses are selected", function() {
        business.selected = true;
        controller.select(business);
        $scope.$digest();

        expect(controller.businesses_needed).toEqual(true);
      });
    });



    describe("submit", function() {

      beforeEach(function() {
        controller.business_options = [];
        spyOn(allocateServiceMock, "createBusinessData").and.callThrough();
        spyOn(allocateServiceMock, "destroyBusinessData").and.callThrough();
      });


      it("does not call data service to create new business data objects that are already in business data list", function() {
        controller.business_data_list = [
          {
            'id': 1,
            'business_type': "Livestock"
          }
        ];
        controller.business_options = [
          {
            'business_type': "Livestock",
            'selected': true,
            'disabled': false,
          },
        ];
        controller.submit();
        $scope.$digest();

        expect(allocateServiceMock.createBusinessData).not.toHaveBeenCalled();
      });


      it("calls data service to create selected business data objects", function() {
        controller.business_options = [
          {
            'business_type': "Crop",
            'selected': true,
            'disabled': false,
          },
        ];
        controller.submit();
        $scope.$digest();

        expect(allocateServiceMock.createBusinessData.calls.argsFor(0)[0]).toEqual(controller.business_options[0]);
        expect(allocateServiceMock.createBusinessData.calls.count()).toEqual(controller.business_options.length);
      });


      it("calls data service to destroy any business data objects that are not selected but in business data list", function() {
        controller.business_data_list = [
          {
            'id': 1,
            'business_type': "Livestock"
          }
        ];
        controller.business_options = [
          {
            'business_type': "Crop",
            'selected': true,
            'disabled': false,
          },
          {
            'business_type': "Livestock",
            'selected': false,
            'disabled': false,
          },
        ];
        controller.submit();
        $scope.$digest();

        expect(allocateServiceMock.destroyBusinessData).toHaveBeenCalled();
      });


      it("goes to business allocate state if there are selected businesses", function() {
        controller.business_options = [
          {
            'business_type': "Crop",
            'selected': true,
            'disabled': false,
          },
        ];
        controller.submit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("businessAllocate");
      });


      it("does not go to business allocate state if there are not selected businesses", function() {
        controller.business_options = [
          {
            'business_type': "Crop",
            'selected': false,
            'disabled': false,
          },
        ];
        controller.submit();
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });
    });



    describe("back", function() {

      it("goes to dashboard view", function() {
        controller.back();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toContain("/dashboard/");
      });
    });

  });

}());
