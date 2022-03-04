(function () {
  'use strict';

  describe("AddCostModalController", function () {
    var controller,
      $scope,
      modalInstanceMock,
      saveCostSpy,
      updateParentSpy,
      cost_categories,
      budget_cost_data,
      cost_item,
      general_cost_item,
      editing;


    beforeEach(module('budgetModule'));

    beforeEach(inject(function ($injector) {
      $scope = $injector.get("$rootScope");
      cost_item = {
        'cost_type': "general",
        'cost_total': 100.00,
        'cost_per_unit': 22.32,
        'cost_per_farm_unit': 54,
        'unit_quantity': 14.00,
      };
      general_cost_item = {
        'cost_type': "general",
        'cost_total': 50.00,
      };
      modalInstanceMock = {
        dismiss: function () {
        },
      };
      saveCostSpy = jasmine.createSpy();
      cost_categories = [
        "plant",
        "pre_plant",
      ];
      budget_cost_data = ['lots', 'of', 'data'];
      editing = false;

      var $controller = $injector.get("$controller");
      controller = $controller('AddCostModalController', {
        $uibModalInstance: modalInstanceMock,
        saveCost: saveCostSpy,
        updateParent: updateParentSpy,
        cost_categories: cost_categories,
        budget_cost_data: budget_cost_data,
        cost_item: cost_item,
        general_cost_item: general_cost_item,
        editing: editing,
      });
    }));


    describe("$onInit", function () {

      it("initializes 'cost_item' to resolved dependency and formats numbers to 2 decimal places", function () {
        controller.quantity_per_farm_unit = 5;
        controller.$onInit();
        $scope.$digest();

        expect(controller.cost_item.cost_type).toEqual(cost_item.cost_type);
        expect(controller.cost_item.cost_per_farm_unit).toEqual(parseFloat(cost_item.cost_per_farm_unit).toFixed(2));
        expect(controller.quantity_per_farm_unit).toEqual(parseFloat(controller.quantity_per_farm_unit).toFixed(2));
        expect(controller.cost_item.cost_per_unit).toEqual(parseFloat(cost_item.cost_per_unit).toFixed(2));
      });


      it("initializes 'budget_cost_data' to resolved dependency", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.budget_cost_data).toEqual(budget_cost_data);
      });


      it("sets 'quantity_per_farm_unit' to equal cost item's 'unit_quantity' divided by 'farm_unit_quantity'", function () {
        controller.$onInit();
        $scope.$digest();
        expect(controller.quantity_per_farm_unit).toEqual(Number(cost_item.unit_quantity / cost_item.farm_unit_quantity).toFixed(2));
      });


      it("initializes 'parent_cost_total' to equal resolved 'general_cost_item' dependency's 'cost_total'", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.parent_cost_total).toEqual(general_cost_item.cost_total);
      });

    });


    describe("cancel", function () {

      it("should call dismiss", function () {
        spyOn(modalInstanceMock, "dismiss");
        controller.cancel();

        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
      });

    });


    // describe("save", function () {
    //   var cost_item;
    //
    //   beforeEach(function () {
    //     cost_item = {
    //       'cost_type': "general",
    //       'farm_unit_quantity': 10.00,
    //       'cost_per_unit': 13.55,
    //     };
    //     controller.quantity_per_farm_unit = 5.00;
    //   });
    //
    //
    //   it("does nothing if given false", function () {
    //     controller.cost_item = {
    //       'cost_type': "general",
    //     };
    //     controller.save(false);
    //     $scope.$digest();
    //
    //     expect(saveCostSpy).not.toHaveBeenCalled();
    //   });
    //
    //
    //   it("sets 'sub_category' to the selected sub category name if given true", function () {
    //     var sub_category = {
    //       'name': "Fuel",
    //       'items': [
    //         {
    //           'name': "Diesel",
    //         },
    //       ],
    //     };
    //     controller.cost_item = {
    //       'cost_type': "variable",
    //       'sub_category': sub_category,
    //     };
    //     controller.save(true);
    //     $scope.$digest();
    //
    //     expect(saveCostSpy.calls.argsFor(0)[0].sub_category).toEqual(sub_category.name);
    //   });
    //
    //
    //   it("calls dependency injected method to save cost item if given true", function () {
    //     controller.cost_item = {
    //       'cost_type': "general",
    //     };
    //     controller.save(true);
    //     $scope.$digest();
    //
    //     expect(saveCostSpy.calls.argsFor(0)).toEqual([controller.cost_item]);
    //   });
    //
    // });

  });

})();
