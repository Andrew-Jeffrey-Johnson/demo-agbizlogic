(function() {
  'use strict';

  describe("Allocate Item Component", function() {
    var $scope,
        $q,
        $window,
        $state,
        commonServiceMock,
        controller;

    beforeEach(module("allocateModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      $window = $injector.get("$window");
      commonServiceMock = $injector.get("commonServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("allocateHome", {
        commonService: commonServiceMock,
      });

      spyOn($state, "go").and.returnValue();
      spyOn($window.location, "assign").and.returnValue();
    }));


    describe("$onInit", function() {
      var next_step;

      beforeEach(function() {
        next_step = {
          'next_step': "",
        };
      });


      it("calls data service to get the current user", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
      });


      it("calls data service to get next step for current user", function () {
        spyOn(commonServiceMock, "getNextStep").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.getNextStep).toHaveBeenCalled();
      });


      it("goes to business allocate state if 'next_step' equals 'business-allocate'", function () {
        next_step.next_step = "business-allocate";
        spyOn(commonServiceMock, "getNextStep").and.returnValue($q.when({'data': next_step}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["businessAllocate"]);
      });


      it("goes to enterprise select state if 'next_step' equals 'enterprise-select'", function () {
        next_step.next_step = "enterprise-select";
        spyOn(commonServiceMock, "getNextStep").and.returnValue($q.when({'data': next_step}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["enterpriseSelect"]);
      });


      it("goes to enterprise allocate state if 'next_step' equals 'enterprise-allocate'", function () {
        next_step.next_step = "enterprise-allocate";
        spyOn(commonServiceMock, "getNextStep").and.returnValue($q.when({'data': next_step}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["enterpriseAllocate"]);
      });


      it("goes to dashboard view if 'next_step' equals does not equal one of the above", function() {
        next_step.next_step = "agbiz";
        spyOn(commonServiceMock, "getNextStep").and.returnValue($q.when({'data': next_step}));
        controller.$onInit();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/dashboard/"]);
      });

    });

  });

}());