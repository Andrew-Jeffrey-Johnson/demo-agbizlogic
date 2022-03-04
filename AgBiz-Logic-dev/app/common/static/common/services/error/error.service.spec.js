(function() {
  'use strict';

  describe("errorService", function() {
    var $scope,
        $httpBackend,
        errorService;

    beforeEach(module("commonModule"));

    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get("$httpBackend");
      errorService = $injector.get("errorService");
      $scope = $injector.get("$rootScope");
    }));



    describe("responseError", function () {
      var response;

      beforeEach(function() {
        response = {
          'status': 200,
          'data': {},
        };
        spyOn($scope, "$emit").and.returnValue();
      });


      it("emits 'httpError' event with error if given error response", function () {
        response.status = 404;
        errorService.responseError(response);

        expect($scope.$emit.calls.argsFor(0)[0]).toEqual("httpError");
      });


      it("does nothing if given non-error response", function () {
        response.status = 200;
        errorService.responseError(response);

        expect($scope.$emit).not.toHaveBeenCalled();
      });

    });


  });


}());
