(function() {
  'use strict';

  describe("Common: Manager List Component", function() {
    var $scope,
        controller;

    beforeEach(module("commonModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("managerList", {});
    }));



    describe("$onInit", function() {

      it("sets 'height' to 'small' if undefined", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.height).toEqual("small");
      });


      it("initializes 'showNotes' to true if undefined", function () {
        controller.showNotes = undefined;
        controller.$onInit();
        $scope.$digest();

        expect(controller.showNotes).toBe(true);
      });


      it("initializes 'showDate' to false if undefined", function () {
        controller.showDate = undefined;
        controller.$onInit();
        $scope.$digest();

        expect(controller.showDate).toEqual(false);
      });


      it("initializes 'ordered' to false if undefined", function() {
        controller.ordered = undefined;
        controller.$onInit();
        $scope.$digest();

        expect(controller.ordered).toBe(false);
      });

    });



    describe("$onChanges", function() {

      it("sets 'height' to 'small' if undefined", function() {
        controller.$onChanges();
        $scope.$digest();

        expect(controller.height).toEqual("small");
      });


      it("initializes 'showNotes' to true if undefined", function () {
        controller.showNotes = undefined;
        controller.$onChanges();
        $scope.$digest();

        expect(controller.showNotes).toBe(true);
      });


      it("initializes 'showDate' to false if undefined", function () {
        controller.showDate = undefined;
        controller.$onChanges();
        $scope.$digest();

        expect(controller.showDate).toEqual(false);
      });

    });



    describe("onShiftUp", function() {
      var item,
          item_list;

      beforeEach(function() {
        item_list = [
          {'id': 3}, {'id': 42},
        ];
        item = item_list[1];
        controller.itemList = item_list;
        controller.onOrderChange = jasmine.createSpy('onOrderChangeSpy');
      });


      it("does nothing if given item is invalid", function() {
        controller.onShiftUp();
        $scope.$digest();

        expect(controller.itemList).toEqual(item_list);
        expect(controller.onOrderChange).not.toHaveBeenCalled();
      });


      it("does nothing if given index is at the first position in 'itemList' array", function() {
        controller.onShiftUp({item: controller.itemList[0]});
        $scope.$digest();

        expect(controller.itemList).toEqual(item_list);
        expect(controller.onOrderChange).not.toHaveBeenCalled();
      });


      it("moves given item one position up in the 'itemList' array", function() {
        controller.onShiftUp({item: item});
        $scope.$digest();

        expect(controller.itemList[0]).toEqual(item);
      });


      it("calls given output callback event", function() {
        controller.onShiftUp({item: item});
        $scope.$digest();

        expect(controller.onOrderChange.calls.argsFor(0)[0].items).toEqual(controller.itemList);
      });

    });



    describe("onShiftDown", function() {
      var item,
          item_list;

      beforeEach(function() {
        item_list = [
          {'id': 3}, {'id': 42},
        ];
        item = item_list[0];
        controller.itemList = item_list;
        controller.onOrderChange = jasmine.createSpy('onOrderChangeSpy');
      });


      it("does nothing if given item is invalid", function() {
        controller.onShiftDown();
        $scope.$digest();

        expect(controller.itemList).toEqual(item_list);
        expect(controller.onOrderChange).not.toHaveBeenCalled();
      });


      it("does nothing if given index is at the last position in 'itemList' array", function() {
        controller.onShiftDown({item: controller.itemList[controller.itemList.length - 1]});
        $scope.$digest();

        expect(controller.itemList).toEqual(item_list);
        expect(controller.onOrderChange).not.toHaveBeenCalled();
      });


      it("moves given item one position down in the 'itemList' array", function() {
        controller.onShiftDown({item: item});
        $scope.$digest();

        expect(controller.itemList[1]).toEqual(item);
      });


      it("calls given output callback event", function() {
        controller.onShiftDown({item: item});
        $scope.$digest();

        expect(controller.onOrderChange.calls.argsFor(0)[0].items).toEqual(controller.itemList);
      });

    });

  });

}());
