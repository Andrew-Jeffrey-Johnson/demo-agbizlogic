(function() {
  'use strict';

  describe("NavbarController", function() {
    var $scope,
        $q,
        $uibModal,
        commonServiceMock,
        configServiceMock,
        controller;

    beforeEach(module('commonModule'));
    beforeEach(module('mockModule'));

    beforeEach(inject(function($injector) {
      var $componentController = $injector.get("$componentController");
      configServiceMock = $injector.get('configServiceMock');
      commonServiceMock = $injector.get("commonServiceMock");
      $scope = $injector.get("$rootScope");
      $uibModal = $injector.get("$uibModal");
      $q = $injector.get("$q");

      controller = $componentController("navbar", {
        commonService: commonServiceMock,
        configService: configServiceMock,
      });
    }));



    describe("$onInit", function() {

      it("initializes authentication flag to false", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.returnValue($q.when({'data': {}}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.is_authenticated).toBe(false);
      });


      it("calls data service to retrieve current user", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
      });


      it("binds current user and set flag if authenticated", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(controller.current_user.username).toBeDefined();
        expect(controller.is_authenticated).toEqual(true);
      });


      it("sets flag if not authenticated", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.returnValue($q.when({'data': {}}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.current_user).not.toBeDefined();
        expect(controller.is_authenticated).toEqual(false);
      });


      it("calls config service to retrieve application configuration", function() {
        spyOn(configServiceMock, "retrieveConfig").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(configServiceMock.retrieveConfig).toHaveBeenCalled();
      });


      it("disables certain options if retrieved config's 'environment' is 'prod'", function() {
        spyOn(configServiceMock, "retrieveConfig").and.returnValue($q.when({'environment': "prod"}));
        controller.$onInit();
        $scope.$digest();

        controller.options.forEach(function(option) {
          if (controller.locked_features.indexOf(option.name) != -1) {
            expect(option.disabled).toEqual(true);
          }
        });
      });


      it("sets 'locked_features' to empty array if retrieved config's 'environment' is not 'prod'", function() {

      });


      it("sets 'locked_features' to include Profit, Lease, Finance, and Environment if 'environment' is 'prod'", function() {

      });


      it("enables all options if retrieved config's 'environment' is not 'prod'", function() {
        controller.$onInit();
        $scope.$digest();

        controller.options.forEach(function(option) {
          expect(option.disabled).toBe(false);
        });
      });

    });



    describe("openContactModal", function () {

      beforeEach(function() {
        spyOn($uibModal, "open").and.returnValue();
      });


      it("calls $uibModal service to open contact modal", function () {
        controller.openContactModal();
        $scope.$digest();

        expect($uibModal.open).toHaveBeenCalled();
      });

    });

  });

})();
