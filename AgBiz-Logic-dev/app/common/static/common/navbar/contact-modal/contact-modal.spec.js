(function() {
  'use strict';

  describe("ContactModalController", function() {
    var controller,
        $scope,
        commonServiceMock,
        modalInstanceMock;

    beforeEach(module('commonModule'));
    beforeEach(module('mockModule'));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      commonServiceMock = $injector.get("commonServiceMock");
      modalInstanceMock = {
        dismiss: jasmine.createSpy("dismissSpy").and.returnValue(),
      }

      var $controller = $injector.get("$controller");
      controller = $controller('ContactModalController', {
        $uibModalInstance: modalInstanceMock,
        commonService: commonServiceMock,
      });

    }));



    describe("$onInit", function () {

      it("initializes 'confirm' to false", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.confirm).toBe(false);
      });

    });



    describe("send", function () {
      var message;

      it("calls data service to send contact email if form is valid", function () {
        message = {
          'subject': "My Complaint",
          'message': "Needs moar explosions",
        };
        controller.message.subject = message['subject'];
        controller.message.message = message['message'];
        controller.form['$invalid'] = false;
        spyOn(commonServiceMock, "sendSupportMessage").and.callThrough();
        controller.send();
        $scope.$digest();

        expect(commonServiceMock.sendSupportMessage.calls.argsFor(0)).toEqual([message]);
      });


      it("calls $uibModalInstance to close the modal", function () {
        message = {
          'subject': "My Complaint",
          'message': "Needs moar explosions",
        };
        controller.message.subject = message['subject'];
        controller.message.subject = message['message'];
        controller.form['$invalid'] = false;
        controller.send();
        $scope.$digest();

        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
      });


      it("does nothing if form is invalid", function () {
        spyOn(commonServiceMock, "sendSupportMessage").and.callThrough();
        controller.form.$invalid = true;
        controller.send();
        $scope.$digest();

        expect(commonServiceMock.sendSupportMessage).not.toHaveBeenCalled();
      });

    });



    describe("cancel", function() {

      it("should call dismiss", function() {
        controller.cancel();

        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
      });

    });

  });

})();
