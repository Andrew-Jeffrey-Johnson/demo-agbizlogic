(function() {
  'use strict';

  describe("AddIncomeModalController", function() {
    var controller,
        $controller,
        $scope,
        $uibModalInstanceMock,
        saveIncomeSpy,
        income_item;

    beforeEach(module('budgetModule'));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $uibModalInstanceMock = {
        dismiss: jasmine.createSpy(),
      };
      saveIncomeSpy = jasmine.createSpy('saveIncomeSpy');
      income_item = {
        'name': 'Test Income Item',
        'notes': "Test income item notes",
        'weight': 5.00,
        'farm_unit': 'Acre',
        'farm_unit_quantity': 10,
        'sale_unit': 'Ton',
        'sale_unit_quantity': 100,
        'price_per_sale_unit': 100.00,
        'return_total': 500000,
      };

      $controller = $injector.get("$controller");
      controller = $controller('AddIncomeModalController', {
        $uibModalInstance: $uibModalInstanceMock,
        saveIncome: saveIncomeSpy,
        income_item: income_item,
        editing: false,
      });
    }));



    describe("$onInit", function () {

      it("initializes 'income_item' to given dependency", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.income_item.name).toEqual(income_item.name);
        expect(controller.income_item.notes).toEqual(income_item.notes);
        expect(controller.income_item.weight).toEqual(Number(income_item.weight).toFixed(2));
        expect(controller.income_item.return_total).toEqual(Number(income_item.return_total).toFixed(2));
      });


      it("sets income item 'weight' to 1 if given dependency is empty object", function () {
        controller = $controller('AddIncomeModalController', {
          $uibModalInstance: $uibModalInstanceMock,
          saveIncome: saveIncomeSpy,
          income_item: {},
          editing: false,
        });
        controller.$onInit();
        $scope.$digest();

        expect(controller.income_item.weight).toEqual(Number(1).toFixed(2));
      });

    });



    describe("cancel", function() {

      it("should call dismiss", function() {
        controller.cancel();

        expect($uibModalInstanceMock.dismiss).toHaveBeenCalled();
      });
    });



    describe("save", function() {
      var income_item;

      beforeEach(function() {
        income_item = {
          'price_per_sale_unit': 2.00,
          'farm_unit_quantity': 10.00,
          'sale_unit_quantity': 100.00,
          'weight': 5,
          'return_total': 0,
        };
      });


      it("does nothing if given false", function() {
        controller.save(false);
        $scope.$digest();

        expect(saveIncomeSpy).not.toHaveBeenCalled();
        expect($uibModalInstanceMock.dismiss).not.toHaveBeenCalled();
      });


      it("sets income item's 'return_total' if given true", function() {
        controller.income_item = income_item;
        var expected_return_total = income_item.price_per_sale_unit *
                                    income_item.weight *
                                    income_item.sale_unit_quantity;
        controller.save(true);
        $scope.$digest();

        expect(saveIncomeSpy.calls.argsFor(0)[0].return_total).toEqual(expected_return_total);
      });


      it("calls dependency injected method to save income item if given true", function() {
        controller.income_item = income_item;
        controller.save(true);
        $scope.$digest();

        expect(saveIncomeSpy).toHaveBeenCalled();
        expect($uibModalInstanceMock.dismiss).toHaveBeenCalled();
      });

    });



    describe("recalculateSaleUnitQuantity", function() {

      it("recalculates the income item's 'sale_unit_quantity'", function() {
        controller.income_item = {
          'sale_unit_quantity': 2.00,
          'price_per_sale_unit': 2.00,
          'return_total': 0,
        };
        controller.recalculateSaleUnitQuantity();

        expect(controller.income_item.sale_unit_quantity).toEqual(controller.income_item.return_total * controller.income_item.price_per_sale_unit);
      });

    });



    describe("recalculatePricePerSaleUnit", function() {

      it("recalculates the income item's 'price_per_sale_unit'", function() {
        controller.income_item = {
          'sale_unit_quantity': 21.00,
          'price_per_sale_unit': 9.00,
          'return_total': 45.90,
        };
        controller.recalculatePricePerSaleUnit();

        expect(controller.income_item.price_per_sale_unit).toEqual(controller.income_item.return_total / controller.income_item.sale_unit_quantity);
      });

    });

  });

})();
