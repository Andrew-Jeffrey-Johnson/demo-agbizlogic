(function() {
  'use strict';

  describe("BudgetUnitModal", function() {
    var controller,
        $controller,
        $scope,
        $uibModalInstanceMock,
        budgetServiceMock,
        cropFarmUnits,
        livestockFarmUnits,
        budget;

    beforeEach(module('commonModule'));
    beforeEach(module('budgetModule'));
    beforeEach(module('mockModule'));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $uibModalInstanceMock = {
        dismiss: jasmine.createSpy('dismissSpy'),
      };
      budgetServiceMock = $injector.get("budgetServiceMock");
      cropFarmUnits = $injector.get("cropFarmUnits");
      livestockFarmUnits = $injector.get("livestockFarmUnits");
      budget = {
        'id': 43,
        'enterprise': "Crop",
        'farm_unit': "Acre",
        'farm_unit_quantity': 10,
        'sale_unit_quantity': 20,
      };

      $controller = $injector.get("$controller");
      controller = $controller('BudgetUnitModalController', {
        $uibModalInstance: $uibModalInstanceMock,
        budgetService: budgetServiceMock,
        budget: budget,
      });
    }));



    describe("$onInit", function() {

      it("initializes 'confirm_save' to false", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.confirm_save).toBe(false);
      });


      it("sets 'new_farm_unit' to equal budget's 'farm_unit'", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.new_farm_unit).toEqual(budget.farm_unit);
      });


      it("sets 'farm_unit' to equal budget's 'farm_unit'", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.farm_unit).toEqual(budget.farm_unit);
      });


      it("sets 'farm_unit_quantity' to equal budget's 'farm_unit_quantity'", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.farm_unit_quantity).toEqual(budget.farm_unit_quantity);
      });


      it("sets 'farm_unit_options' to dependency-injected cropFarmUnits if budget's 'enterprise' is 'Crop'", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.farm_unit_options).toEqual(cropFarmUnits);
      });


      it("sets 'farm_unit_options' to dependency-injected livestockFarmUnits if budget's 'enterprise' is 'Livestock'", function() {
        budget.enterprise = "Livestock";
        controller = $controller('BudgetUnitModalController', {
          $uibModalInstance: $uibModalInstanceMock,
          budget: budget,
        });
        controller.$onInit();
        $scope.$digest();

        expect(controller.farm_unit_options).toEqual(livestockFarmUnits);
      });

    });



    describe("cancel", function() {

      it("calls $uibModalInstance to dismiss modal", function() {
        controller.cancel();
        $scope.$digest();

        expect($uibModalInstanceMock.dismiss).toHaveBeenCalled();
      });

    });



    describe("save", function() {

      beforeEach(function() {
        controller.scale_factor = 10;
        spyOn(budgetServiceMock, "scaleFarmUnitQuantity").and.callThrough();
        spyOn(budgetServiceMock, "updateBudget").and.callThrough();
      });


      it("does nothing if 'is_new_unit' is true and 'scale_type' is undefined", function() {
        controller.is_new_unit = true;
        controller.save();
        $scope.$digest();

        expect(budgetServiceMock.updateBudget).not.toHaveBeenCalled();
        expect(budgetServiceMock.scaleFarmUnitQuantity).not.toHaveBeenCalled();
      });


      it("calls data service to update budget if 'is_new_unit' is true and 'scale_type' is valid", function() {
        controller.is_new_unit = true;
        controller.new_farm_unit = "Sq. Feet";
        controller.scale_type = "smaller";
        controller.save();
        $scope.$digest();

        expect(budgetServiceMock.updateBudget.calls.argsFor(0)[0].id).toEqual(budget.id);
        expect(budgetServiceMock.updateBudget.calls.argsFor(0)[0].farm_unit).toEqual(controller.new_farm_unit);
      });


      it("multiplies 'farm_unit_quantity' by 'scale_factor' if 'scale_type' equals 'smaller'", function() {
        controller.is_new_unit = true;
        controller.new_farm_unit = "Sq. Feet";
        controller.scale_type = "smaller";
        controller.scale_factor = 40;
        var expected_farm_unit_quantity = controller.scale_factor * budget.farm_unit_quantity;
        controller.save();
        $scope.$digest();

        expect(budgetServiceMock.updateBudget.calls.argsFor(0)[0].farm_unit_quantity).toEqual(expected_farm_unit_quantity);
      });


      it("divides 'farm_unit_quantity' by 'scale_factor' if 'scale_type' equals 'larger'", function() {
        controller.is_new_unit = true;
        controller.new_farm_unit = "Field";
        controller.scale_type = "larger";
        controller.scale_factor = 40;
        var expected_farm_unit_quantity = budget.farm_unit_quantity / controller.scale_factor;
        controller.save();
        $scope.$digest();

        expect(budgetServiceMock.updateBudget.calls.argsFor(0)[0].farm_unit_quantity).toEqual(expected_farm_unit_quantity);
      });


      it("calls $uibModalInstance to dismiss modal after updating budget", function() {
        controller.is_new_unit = true;
        controller.new_farm_unit = "Sq. Feet";
        controller.scale_type = "smaller";
        controller.scale_factor = 40;
        controller.save();
        $scope.$digest();

        expect($uibModalInstanceMock.dismiss).toHaveBeenCalled();
      });


      it("calls data service to scale farm unit quantity if 'is_new_unit' is false and 'new_farm_unit_quantity' is greater than 0", function() {
        controller.new_farm_unit_quantity = 100.00;
        controller.save();
        $scope.$digest();

        expect(budgetServiceMock.scaleFarmUnitQuantity.calls.argsFor(0)[0]).toEqual(budget.id);
        expect(budgetServiceMock.scaleFarmUnitQuantity.calls.argsFor(0)[1]).toEqual(controller.new_farm_unit_quantity);
      });


      it("calls $uibModalInstance to dismiss modal after scaling farm unit quantity", function() {
        controller.new_farm_unit_quantity = 100.00;
        controller.save();
        $scope.$digest();

        expect($uibModalInstanceMock.dismiss).toHaveBeenCalled();
      });

    });

  });

})();