(function() {
  'use strict';

  describe("Dashboard Component", function() {
    var controller,
        commonServiceMock,
        modalServiceMock,
        dashboardServiceMock,
        $window,
        $state,
        $q,
        $scope;

    beforeEach(module("dashboardModule"));
    beforeEach(module("commonModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      $window = $injector.get("$window");
      commonServiceMock = $injector.get("commonServiceMock");
      dashboardServiceMock = $injector.get("dashboardServiceMock");
      modalServiceMock = $injector.get("modalServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("dashboard", {
        commonService: commonServiceMock,
        dashboardService: dashboardServiceMock,
        modalService: modalServiceMock,
      });

    }));



    describe("$onInit", function() {
      var user;

      beforeEach(function() {
        user = {
          'id': 23,
          'username': "johncleese",
        };
        spyOn($window.location, "assign").and.returnValue();
      });


      it("initializes 'next_step_instructions'", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.next_step_instructions).toBeDefined();
      });


      it("initializes 'completed_steps' to 0", function () {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.returnValue($q.when({'data': {}}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.completed_steps).toEqual(0);
      });


      it("calls data service to retrieve current user", function () {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.returnValue($q.when({'data': user}));
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
        expect(controller.user).toEqual(user);
      });


      it("calls $window service to go to index page if retrieved current user is invalid", function () {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.returnValue($q.when({'data': {}}));
        controller.$onInit();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/index/"]);
      });


      it("calls data service to get next step with current user's username", function () {
        var next_step = {'next_step': "agbiz"};
        spyOn(commonServiceMock, "getNextStep").and.callThrough($q.when({'data': next_step}));
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.getNextStep.calls.argsFor(0)).toEqual([controller.user.username]);
        expect(controller.next_step).toEqual(next_step.next_step);
      });


      it("calls $window service to go to index page if retrieved next step is invalid", function () {
        spyOn(commonServiceMock, "getNextStep").and.returnValue($q.when({'data': {}}));
        controller.$onInit();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/index/"]);
      });


      it("calls data service to retrieve dashboard configuration if 'next_step' equals 'agbiz'", function () {
        spyOn(dashboardServiceMock, "retrieveDashboard").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(dashboardServiceMock.retrieveDashboard).toHaveBeenCalled();
        expect(controller.dashboard_config).toBeDefined();
      });

    });



    describe("proceed", function() {

      beforeEach(function() {
        spyOn($window.location, "assign").and.returnValue();
      });


      it("calls $window service to change to Schedule F when it is the next step", function() {
        controller.next_step = "schedule-f";
        controller.proceed();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toContain("/income/");
      });


      it("calls $window service to change to business select when it is the next step", function() {
        controller.next_step = "business-select";
        controller.proceed();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/allocate/#/business-select"]);
      });


      it("calls $window service to change to business allocate when it is the next step", function() {
        controller.next_step = "business-allocate";
        controller.proceed();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/allocate/#/business-allocate"]);
      });


      it("calls $window service to change to enterprise select when it is the next step", function() {
        controller.next_step = "enterprise-select";
        controller.proceed();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/allocate/#/enterprise-select"]);
      });


      it("calls $window service to change to enterprise allocate when it is the next step", function() {
        controller.next_step = "enterprise-allocate";
        controller.proceed();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/allocate/#/enterprise-allocate"]);
      });


      it("calls $window service to change to budget creation when it is the next step", function() {
        controller.next_step = "budget-creation";
        controller.proceed();
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/budget/#/budget-manager"]);
      });

    });

  });

})();
