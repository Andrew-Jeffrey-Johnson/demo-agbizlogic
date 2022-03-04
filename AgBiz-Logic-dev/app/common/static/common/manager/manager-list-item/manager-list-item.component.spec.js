(function() {
  'use strict';

  describe("Common: Manager List Item Component", function() {
    var $scope,
        $state,
        component,
        commonServiceMock,
        scenarioServiceMock,
        controller;

    beforeEach(module('scenarioModule'));
    beforeEach(module('commonModule'));
    beforeEach(module('mockModule'));

    beforeEach(inject(function($injector) {
      var $componentController = $injector.get("$componentController");
      $scope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      commonServiceMock = $injector.get("commonServiceMock");
      scenarioServiceMock = $injector.get("scenarioServiceMock");

      controller = $componentController("managerListItem", {
        commonService: commonServiceMock,
        scenarioService:scenarioServiceMock
      });

    }));


    describe("$onInit", function() {

      it("initializes confirm attribute to 0", function() {
        controller.confirm = true;
        controller.$onInit();
        $scope.$digest();

        expect(controller.confirm).toEqual(false);
      });

    });



    describe("$onChanges", function() {

      it("sets confirm attribute to 0", function() {
        controller.confirm = true;
        controller.$onChanges();
        $scope.$digest();

        expect(controller.confirm).toEqual(false);
      });

    });

  });

}());
