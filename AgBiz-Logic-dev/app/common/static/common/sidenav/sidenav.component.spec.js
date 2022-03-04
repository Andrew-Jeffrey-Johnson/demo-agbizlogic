(function() {
  'use strict';

  describe("sidenav", function() {
    var controller,
        commonServiceMock,
        $scope,
        $location;

    beforeEach(module("commonModule"));
    beforeEach(module("budgetModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      var $componentController = $injector.get("$componentController");
      $location = $injector.get("$location");
      $scope = $injector.get("$rootScope");
      commonServiceMock = $injector.get("commonServiceMock");

      controller = $componentController("sidenav", {commonService: commonServiceMock});
    }));



    describe("$onInit", function() {

      it("calls $location service to get the URL path", function() {
        spyOn($location, "absUrl").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect($location.absUrl).toHaveBeenCalled();
      });


      it("sets 'disabled' attribute initially to equal true", function() {
        controller.disabled = false;
        controller.$onInit();
        $scope.$digest();

        expect(controller.disabled).toEqual(true);
      });


      it("calls data service to subscribe to $stateChangeSuccess event", function() {
        spyOn(commonServiceMock, "subscribeStateChange").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.subscribeStateChange).toHaveBeenCalled();
      });

    });

  });

})();
