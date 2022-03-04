(function() {
  'use strict';

  describe("DashboardComponent->climateComponent: climateComponentController", function() {
    var controller,
        climateServiceMock,
        $scope;

    beforeEach(module("dashboardModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      climateServiceMock = $injector.get("climateServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("climate", {
        climateService: climateServiceMock,
      });

    }));


    describe("$onInit", function() {

      it('sets the inactive class to true by default', function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.css_classes['panel-inactive']).toBeTruthy();
      });


      it("should set inactive class based on inactive flag", function() {
        controller.inactive = false;
        controller.$onInit();
        $scope.$digest();

        expect(controller.css_classes['panel-inactive']).toEqual(false);
        expect(controller.is_inactive).toEqual(false);

        controller.inactive = true;
        controller.$onInit();
        $scope.$digest();

        expect(controller.css_classes['panel-inactive']).toEqual(true);
        expect(controller.is_inactive).toEqual(true);
      });


      it("calls climate data service to retrieve most recent climate scenario", function () {
        spyOn(climateServiceMock, "retrieveMostRecentScenario").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(climateServiceMock.retrieveMostRecentScenario).toHaveBeenCalled();
        expect(controller.most_recent_scenario).toBeDefined();
      });


      it("sets 'chart_data' using the retrieved most recent scenario", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.chart_data).toBeDefined();
      });

    });

  });

})();
