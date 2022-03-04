(function() {
  'use strict';

  describe("Allocate Item Component", function() {
    var $scope,
        controller;

    beforeEach(module("allocateModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("allocateItem", {});

      controller.onChange = function(targets, status) {};
      spyOn(controller, "onChange").and.returnValue();
    }));



    describe("$onInit", function() {
      var business_targets,
          source;

      beforeEach(function() {
        business_targets = [
          {
            'business_type': "Crop",
            'income_sales': 2000,
            'income_other': 0,
          },
          {
            'business_type': "Livestock",
            'income_sales': 3000,
            'income_other': 0,
          },
        ];
        source = {
          'name': "income_sales",
          'type': "income",
          'total': 200000,
        };
        spyOn(controller, "recalculateFor").and.returnValue();
      });


      it("initializes 'method' to 'currency' if 'source.type' is 'income'", function() {
        controller.source = source;
        controller.$onInit();
        $scope.$digest();

        expect(controller.method).toEqual('currency');
      });


      it("initializes 'method' to 'percentage' if 'source.type' is 'expense'", function() {
        controller.source = source;
        source.type = "expense";
        controller.$onInit();
        $scope.$digest();

        expect(controller.method).toEqual('percentage');
      });


      it("sets target objects to correspond only to the source", function() {
        controller.source = source;
        controller.targets = business_targets;
        controller.$onInit();
        $scope.$digest();

        controller.targets.forEach(function(target) {
          expect(target.category).toEqual(controller.source.name);
        });
      });


      it("sets target objects 'currency' attribute to equal the value corresponding to the source name", function() {
        controller.source = source;
        controller.targets = business_targets;
        controller.$onInit();
        $scope.$digest();

        controller.targets.forEach(function(target, index) {
          expect(target.currency).toEqual(business_targets[index][controller.source.name]);
        });

      });

      it("calls controller method to recalculate for percentage", function() {
        controller.source = source;
        controller.targets = business_targets;
        controller.$onInit();
        $scope.$digest();

        expect(controller.recalculateFor.calls.argsFor(0)).toContain("percentage");
      });

    });



    // TODO: Use random testing to verify calculations
    describe("recalculateFor", function() {

      it("calculates each target's 'currency' value when called with 'currency' argument", function() {
        controller.source = {
          'total': 2000,
        };
        controller.targets = [
          {
            'currency': 0,
            'percentage': 25,
          },
          {
            'currency': 0,
            'percentage': 50,
          }
        ];
        controller.recalculateFor('currency');
        $scope.$digest();

        controller.targets.forEach(function(target) {
          expect(target.currency).toEqual((target.percentage / 100) * controller.source.total);
        });
      });


      it("calculates each target's 'percentage' value when called with 'percentage' argument", function() {
        controller.source = {
          'total': 2000,
        };
        controller.targets = [
          {
            'currency': 500,
            'percentage': 0,
          },
          {
            'currency': 1000,
            'percentage': 0,
          }
        ];
        controller.recalculateFor('percentage');
        $scope.$digest();

        controller.targets.forEach(function(target) {
          expect(target.percentage).toEqual((target.currency / controller.source.total) * 100);
        });
      });


      it("calculates the remainder based on the source and target amounts", function() {
        controller.source = {
          'total': 2000,
        };
        controller.targets = [
          {
            'currency': 500,
            'percentage': 25
          },
          {
            'currency': 1000,
            'percentage': 50,
          }
        ];
        var expected_remainder = controller.source.total;
        controller.targets.forEach(function(target) {
          expected_remainder -= target.currency;
        });
        controller.recalculateFor('currency');
        $scope.$digest();

        expect(controller.remainder.value).toEqual(expected_remainder);
      });


      it("calculates remainder to be 0 if percentages add to 100", function() {
        controller.source = {
          'total': 2005,
        };
        controller.targets = [
          {
            'currency': 500,
            'percentage': 50
          },
          {
            'currency': 1000,
            'percentage': 50,
          }
        ];
        controller.recalculateFor('currency');
        $scope.$digest();

        expect(controller.remainder.value).toEqual(0);
      });


      it("sets remainder status to valid if value equals 0", function() {
        controller.source = {
          'total': 2000,
        };
        controller.targets = [
          {
            'currency': 1000,
            'percentage': 0
          },
          {
            'currency': 1000,
            'percentage': 0,
          }
        ];
        controller.recalculateFor('percentage');
        $scope.$digest();

        expect(controller.remainder.status).toEqual("valid");
      });


      it("sets remainder status to underallocated if value is greater than 0", function() {
        controller.source = {
          'total': 2000,
        };
        controller.targets = [
          {
            'currency': 200,
            'percentage': 0
          },
          {
            'currency': 200,
            'percentage': 0,
          }
        ];
        controller.recalculateFor('percentage');
        $scope.$digest();

        expect(controller.remainder.status).toEqual("underallocated");
      });


      it("sets remainder status to overallocated if value is less 0", function() {
        controller.source = {
          'total': 2000,
        };
        controller.targets = [
          {
            'currency': 2000,
            'percentage': 0
          },
          {
            'currency': 1000,
            'percentage': 0,
          }
        ];
        controller.recalculateFor('percentage');
        $scope.$digest();

        expect(controller.remainder.status).toEqual("overallocated");
      });


      it("calls controller bound output method with target 'currency' values", function() {
        controller.source = {
          'total': 2000,
        };
        controller.targets = [
          {
            'currency': 2000,
            'percentage': 0
          },
          {
            'currency': 1000,
            'percentage': 0,
          }
        ];
        controller.recalculateFor('percentage');
        $scope.$digest();

        expect(controller.onChange.calls.argsFor(0)[0]['targets'][0].value).toEqual(controller.targets[0].currency);
      });


      it("calls controller bound output method with remainder status", function() {
        controller.source = {
          'total': 2000,
        };
        controller.targets = [
          {
            'currency': 2000,
            'percentage': 0
          },
          {
            'currency': 2000,
            'percentage': 0,
          }
        ];
        controller.recalculateFor('percentage');
        $scope.$digest();

        expect(controller.onChange.calls.argsFor(0)[0]['status']).toEqual(controller.remainder.status);
      });


      it("calls controller bound output method with the target's index", function() {
        controller.source = {
          'total': 2000,
        };
        controller.targets = [
          {
            'index': 0,
            'currency': 1000,
            'percentage': 0
          },
          {
            'index': 1,
            'currency': 1000,
            'percentage': 0,
          }
        ];
        controller.recalculateFor('percentage');
        $scope.$digest();

        expect(controller.onChange.calls.argsFor(0)[0]['targets'][0].index).toEqual(0);
      });

    });

  });

}());
