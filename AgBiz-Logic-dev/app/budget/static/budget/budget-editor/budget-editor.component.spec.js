(function() {
  'use strict';

  describe("BudgetEditorController", function() {
    var controller,
        $scope,
        $q,
        $uibModal,
        budgetServiceMock,
        commonServiceMock,
        budget,
        commodities;

    beforeEach(module('budgetModule'));
    beforeEach(module('mockModule'));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $uibModal = $injector.get("$uibModal");
      $q = $injector.get("$q");
      budgetServiceMock = $injector.get("budgetServiceMock");
      commonServiceMock = $injector.get("commonServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController('budgetEditor', {
        budgetService: budgetServiceMock,
        commonService: commonServiceMock,
        onSave: function() {},
        onDiscard: function() {},
      });

      budget = {
        'id': 1,
        'title': "Budget Title",
        'notes': "",
        'market': "Conventional",
        'enterprise': "Livestock",
        'income_items': [
          {
            'id': 1,
          }
        ],
        'cost_items': [
          {
            'id': 1,
            'cost_type': "general",
            'name': "Chemicals",
            'cost_total': 100.00,
          },
          {
            'id': 2,
            'cost_type': "fixed",
            'cost_total': 50.25,
            'parent_category': "Property Taxes",
          },
          {
            'id': 3,
            'cost_type': "variable",
            'parent_category': "Chemicals",
            'cost_total': 75.50,
          },
        ],
      };

      commodities = {
      	"Crop": {
      		"name": "Crop",
      		"label": "Enterprise Type",
      		"market_label": "Market",
      		"markets": [
      			{
      				"name": "Conventional"
      			}]
          }
        };
      spyOn($uibModal, "open").and.returnValue({'closed': $q.when()});
    }));



    describe("$onInit", function() {
      beforeEach(function() {
        controller.budget = {id: budget.id};
        controller.form = {};
      });

      it("does nothing if 'budget' id is invalid", function() {
        spyOn(budgetServiceMock, "retrieveBudget").and.callThrough();
        controller.budget = {};
        controller.$onInit();
        $scope.$digest();

        expect(budgetServiceMock.retrieveBudget).not.toHaveBeenCalled();
      });


      it("calls data service to retrieve budget", function() {
        spyOn(budgetServiceMock, "retrieveBudget").and.returnValue($q.when({data: budget}));

        controller.$onInit();
        $scope.$digest();

        expect(budgetServiceMock.retrieveBudget.calls.argsFor(0)).toContain(budget.id);
      });


      it("sets 'budget' to equal the retrieved budget", function() {
        spyOn(budgetServiceMock, "retrieveBudget").and.returnValue($q.when({data: budget}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.budget.id).toBeDefined();
      });


      it("should call method to set flags", function() {
        spyOn(budgetServiceMock, "retrieveBudget").and.returnValue($q.when({data: budget}));
        spyOn(controller, "setFlags").and.returnValue();
        controller.$onInit();
        $scope.$digest();

        expect(controller.setFlags).toHaveBeenCalled();
      });


      it("calls data services to populate dropdowns", function() {
        spyOn(budgetServiceMock, "retrieveBudget").and.returnValue($q.when({data: budget}));
        spyOn(budgetServiceMock, "retrieveBudgetCostCategories").and.callThrough();
        spyOn(budgetServiceMock, "retrieveBudgetCostData").and.callThrough();
        spyOn(commonServiceMock, "retrieveRegionData").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(budgetServiceMock.retrieveBudgetCostCategories).toHaveBeenCalled();
        expect(budgetServiceMock.retrieveBudgetCostData).toHaveBeenCalled();
        expect(commonServiceMock.retrieveRegionData).toHaveBeenCalled();
      });


      it("sets 'gold_standard_data' for each cost item with 'cost_type' equal to 'general' in the budget", function() {
        spyOn(budgetServiceMock, "retrieveBudget").and.returnValue($q.when({data: budget}));
        controller.$onInit();
        $scope.$digest();

        controller.budget.cost_items.forEach(function(cost_item) {
          if (cost_item.cost_type == "general") {
            expect(Object.keys(cost_item)).toContain("gold_standard_category");
          }
        });
      });

    });



    describe("reloadData", function() {

      beforeEach(function() {
        spyOn(controller, "setFlags").and.returnValue();
        controller.budget_cost_data = ['lots', 'of', 'data'];
      });


      it("calls the data service to get the current budget", function() {
        controller.budget = budget;
        spyOn(budgetServiceMock, "retrieveBudget").and.callThrough();
        controller.reloadData();
        $scope.$digest();

        expect(budgetServiceMock.retrieveBudget).toHaveBeenCalled();
      });


      it("sets 'budget' to equal the retrieved budget", function() {
        controller.budget = budget;
        controller.reloadData();
        $scope.$digest();

        expect(controller.budget.id).toBeDefined();
      });


      it("calls controller method to reset flags", function() {
        controller.budget = budget;
        controller.reloadData();
        $scope.$digest();

        expect(controller.setFlags).toHaveBeenCalled();
      });


      it("sets 'gold_standard_data' for each cost item with 'cost_type' equal to 'general' in the budget", function() {
        controller.budget = budget;
        controller.reloadData();
        $scope.$digest();

        controller.budget.cost_items.forEach(function(cost_item) {
          if (cost_item.cost_type == "general") {
            expect(Object.keys(cost_item)).toContain("gold_standard_category");
          }
        });
      });

    });



    describe("setFlags", function() {

      beforeEach(function() {
        controller.budget = {};
      });


      it("should reset all flags to 0 if no cost items", function() {
        controller.setFlags();

        expect(controller.is_cost_general).toEqual(false);
        expect(controller.is_cost_variable).toEqual(false);
        expect(controller.is_cost_fixed).toEqual(false);
      });


      it("should set corresponding flags to 1 if there are budget items", function() {
        controller.budget = budget;
        controller.setFlags();
        $scope.$digest();

        expect(controller.is_cost_general).toEqual(true);
        expect(controller.is_cost_fixed).toEqual(true);
        expect(controller.is_cost_variable).toEqual(true);
      });

    });



    describe("changeBudgetUnit", function() {
      var budget;

      beforeEach(function() {
        budget = {
          'id': 32,
          'farm_unit': "Acre",
          'farm_unit_quantity': 10,
        };
        spyOn(controller, "reloadData").and.returnValue();
      });


      it("does nothing if given invalid 'budget'", function() {
        controller.changeBudgetUnit();
        $scope.$digest();

        expect($uibModal.open).not.toHaveBeenCalled();
      });


      it("calls $uibModal if given valid 'budget'", function() {
        controller.changeBudgetUnit(budget);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.budget()).toEqual(budget);
      });

    });



    describe("newIncome", function() {

      beforeEach(function() {
        controller.budget = {};
      });


      it("calls $uibModal service to open income item modal", function() {
        controller.newIncome();
        $scope.$digest();

        expect($uibModal.open).toHaveBeenCalled();
      });


      it("sets 'enterprise' field of new income item to budget's 'enterprise' field", function() {
        controller.budget = {
          'enterprise': "Livestock",
        };
        controller.newIncome();
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.income_item()['enterprise']).toContain(controller.budget.enterprise);
      });


      it("sets 'enterprise' and 'farm_unit', to equal budget's 'enterprise' and 'farm_unit'", function() {
        controller.budget = {
          'enterprise': "Livestock",
          'farm_unit': "Field"
        };
        controller.newIncome();
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.income_item()['enterprise']).toEqual(controller.budget.enterprise);
        expect($uibModal.open.calls.argsFor(0)[0].resolve.income_item()['farm_unit']).toEqual(controller.budget.farm_unit);
      });


      it("sets 'sale_unit_quantity' and 'farm_unit_quantity', to 1", function() {
        controller.budget = {
          'enterprise': "Livestock",
        };
        controller.newIncome();
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.income_item()['farm_unit_quantity']).toEqual(1);
        expect($uibModal.open.calls.argsFor(0)[0].resolve.income_item()['sale_unit_quantity']).toEqual(1);
      });


      it("sets 'price_per_sale_unit' and 'return_total' to 0", function() {
        controller.budget = {
          'enterprise': "Livestock",
        };
        controller.newIncome();
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.income_item()['price_per_sale_unit']).toEqual(0);
        expect($uibModal.open.calls.argsFor(0)[0].resolve.income_item()['return_total']).toEqual(0);
      });

    });



    describe("editIncome", function() {
      var income_item;

      beforeEach(function() {
        controller.budget = budget;
        income_item = {
          'id': 2,
          'name': "Income Item",
          'return_total': 100,
        };
      });


      it("does nothing if given income item is undefined", function() {
        controller.editIncome();
        $scope.$digest();

        expect($uibModal.open).not.toHaveBeenCalled();
      });


      it("calls $uibModal service to open income modal with given income item in resolve", function() {
        controller.editIncome(income_item);
        $scope.$digest();

        expect($uibModal.open).toHaveBeenCalled();
        expect(Object.keys($uibModal.open.calls.argsFor(0)[0].resolve)).toContain('income_item');
      });
    });




    describe("saveIncome", function() {
      var income_item_updated,
          income_item_new;

      beforeEach(function() {
        spyOn(controller, "reloadData").and.returnValue();
        controller.budget = budget;
        income_item_updated = {
          'id': 1,
          'name': "Updated Income Item",
          'return_total': 120.00
        };

        income_item_new = {
          'name': "New Income Item",
          'return_total': 100.00
        };

      });


      it("does nothing if given income item is invalid", function() {
        spyOn(budgetServiceMock, "updateBudgetItem").and.callThrough();
        spyOn(budgetServiceMock, "createBudgetItem").and.callThrough();
        controller.saveIncome();
        $scope.$digest();

        expect(budgetServiceMock.createBudgetItem).not.toHaveBeenCalled();
        expect(budgetServiceMock.updateBudgetItem).not.toHaveBeenCalled();
      });


      it("calls data service to update given income item if it has an id", function() {
        spyOn(budgetServiceMock, "updateBudgetItem").and.callThrough();
        controller.saveIncome(income_item_updated);
        $scope.$digest();

        expect(budgetServiceMock.updateBudgetItem).toHaveBeenCalled();
      });


      it("calls data service to create income item if given item does not have an id", function() {
        spyOn(budgetServiceMock, "createBudgetItem").and.callThrough();
        controller.saveIncome(income_item_new);
        $scope.$digest();

        expect(budgetServiceMock.createBudgetItem).toHaveBeenCalled();
      });
    });



    describe("newCost", function() {
      var cost_type,
          general_cost_item,
          default_cost_item;

      beforeEach(function() {
        controller.budget = {};
        general_cost_item = {
            'name': "Chemicals",
            'cost_total': 100.00,
        };
        cost_type = "general";
        default_cost_item = {
          "parent_category": "",
          "parent_cost_quantity": 0,
          "name": "",
          "category": "",
          "cost_type": cost_type,
          "unit": "",
          "unit_quantity": 0.00,
          "cost_per_unit": 0.00,
          "cost_total": 0.00,
        };
        controller.budget_cost_data = [
          {
            "name": "Chemicals",
            "sub_categories": [
              {
                "name": "Herbicide",
                "items": [
                  "Axial XL"
                ]
              }
            ],
            "units": [
              "Acres"
            ]
          }
        ];
      });


      it("calls $uibModal service to open new cost modal", function() {
        controller.newCost(cost_type, general_cost_item);
        $scope.$digest();

        expect($uibModal.open).toHaveBeenCalled();
      });


      it("passes a new cost item with default attributes to modal instance", function() {
        controller.newCost(cost_type, general_cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.cost_item).toBeDefined();
      });


      it("passes 'cost_categories' to modal instance", function() {
        controller.newCost(cost_type, general_cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.cost_item).toBeDefined();
      });


      it("passes 'budget_cost_data' to modal instance", function() {
        controller.newCost(cost_type, general_cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.budget_cost_data).toBeDefined();
      });


      it("initializes a new general cost item using a copy of given general cost item", function() {
        controller.newCost(cost_type, general_cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.general_cost_item).toBeDefined();
      });
    });



    describe("newGeneralCost", function() {
      var new_general_cost;

      beforeEach(function() {
        controller.budget = budget;

        new_general_cost = {
          'parent_budget': controller.budget.id,
          'name': "",
          'category': "",
          'sub_category': "",
          'cost_type': "general",
          'unit': (controller.budget.income_items[0].farm_unit === undefined) ? "Total" : controller.budget.income_items[0].farm_unit,
          'unit_quantity': 1.00,
          'farm_unit': controller.budget.farm_unit,
          'farm_unit_quantity': 1.00,
          'cost_per_unit': 0.00,
          'cost_per_farm_unit': 0.00,
          'cost_total': 0.00,
        };
        controller.budget_cost_data = [
          {
            "name": "Chemicals",
            "sub_categories": [
              {
                "name": "Herbicide",
                "items": [
                  "Axial XL"
                ]
              }
            ],
            "units": [
              "Acres"
            ]
          }
        ];
      });


      it("calls $uibModal service to open new cost modal", function() {
        controller.newGeneralCost();
        $scope.$digest();

        expect($uibModal.open).toHaveBeenCalled();
      });


      it("passes controller 'saveCost' method to modal instance", function() {
        controller.newGeneralCost();
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.saveCost()).toEqual(controller.saveCost);
      });


      it("passes 'cost_categories' to modal instance", function() {
        controller.newGeneralCost();
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.cost_categories()).toEqual(controller.cost_categories);
      });


      it("passes 'budget_cost_data' to modal instance", function() {
        controller.newGeneralCost();
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.budget_cost_data()).toEqual(controller.budget_cost_data);
      });


      it("create a new cost item with set default attributes and pass to modal instance", function() {
        controller.newGeneralCost();
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.cost_item()).toEqual(new_general_cost);
      });


      it("passes empty parent general cost item to modal instance", function() {
        controller.newGeneralCost();
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.general_cost_item()).toEqual({});
      });

    });



    describe("editCost", function() {
      var cost_item;

      beforeEach(function() {
        cost_item = {
          'id': 1,
          'name': "Updated Cost Item",
          'parent_category': "Chemicals",
          'category': 'post_harvest',
          'sub_category': 'Herbicide',
          'cost_type': 'fixed',

          'unit': 'acres',
          'unit_quantity': 10,
          'cost_total': 100.00,
        };
        controller.budget_cost_data = [
          {
            "name": "Chemicals",
            "variable_sub_categories": [
              {
                "name": "Herbicide",
                "items": [
                  "Axial XL"
                ]
              }
            ],
            "units": [
              "Acres"
            ]
          }
        ];
        controller.budget = budget;
        controller.cost_categories = ["Plant", "Pre-Plant"];
      });


      it("calls $uibModal service to open new cost modal", function() {
        controller.editCost(cost_item);
        $scope.$digest();

        expect($uibModal.open).toHaveBeenCalled();
      });


      it("passes controller 'saveCost' method to modal instance", function() {
        controller.editCost(cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.saveCost()).toEqual(controller.saveCost);
      });


      it("passes 'cost_categories' to modal instance", function() {
        controller.editCost(cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.cost_categories()).toEqual(controller.cost_categories);
      });


      it("passes 'budget_cost_data' to modal instance", function() {
        controller.editCost(cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.budget_cost_data()).toEqual(controller.budget_cost_data);
      });


      it("passes given 'cost_item' to modal instance with additional fields of 'original_cost_total' and 'gold_standard_category'", function() {
        controller.editCost(cost_item);
        $scope.$digest();

        cost_item.original_cost_total = cost_item.cost_total;
        cost_item.gold_standard_category = controller.budget_cost_data[0];

        expect($uibModal.open.calls.argsFor(0)[0].resolve.cost_item()).toEqual(cost_item);
      });


      it("passes parent general cost item to modal instance", function() {
        controller.editCost(cost_item);
        $scope.$digest();

        var parent_cost_item;
        controller.budget.cost_items.forEach(function(item) {
          if (item.cost_type == "general" && item.name == cost_item.parent_category) {
            parent_cost_item = item;
          }
        });

        expect($uibModal.open.calls.argsFor(0)[0].resolve.general_cost_item()).toEqual(parent_cost_item);
      });

    });



    describe("editGeneralCost", function() {
      var general_cost_item;

      beforeEach(function() {
        general_cost_item = {
          'id': 2,
          'cost_total': 12.00,
        };
      });


      it("calls $uibModal service to open new cost modal", function() {
        controller.editGeneralCost(general_cost_item);
        $scope.$digest();

        expect($uibModal.open).toHaveBeenCalled();
      });


      it("passes controller 'saveCost' method to modal instance", function() {
        controller.editGeneralCost(general_cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.saveCost()).toEqual(controller.saveCost);
      });


      it("passes 'cost_categories' to modal instance", function() {
        controller.editGeneralCost(general_cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.cost_categories()).toEqual(controller.cost_categories);
      });


      it("passes 'budget_cost_data' to modal instance", function() {
        controller.editGeneralCost(general_cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.budget_cost_data()).toEqual(controller.budget_cost_data);
      });


      it("should create a new cost item and set default attributes", function() {
        controller.editGeneralCost(general_cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.cost_item()).toEqual(general_cost_item);
      });


      it("passes empty parent cost item to modal instance", function() {
        controller.editGeneralCost(general_cost_item);
        $scope.$digest();

        expect($uibModal.open.calls.argsFor(0)[0].resolve.general_cost_item()).toEqual({});
      });

    });



    describe("saveCost", function() {
      var cost_item_updated,
          cost_item_new,
          general_cost_item;

      beforeEach(function() {
        controller.budget = budget;
        spyOn(budgetServiceMock, "updateBudgetItem").and.callThrough();
        spyOn(budgetServiceMock, "createBudgetItem").and.callThrough();
        spyOn(budgetServiceMock, "destroyBudgetItem").and.callThrough();
        spyOn(controller, "reloadData").and.returnValue();
        cost_item_updated = {
          'id': 1,
          'parent_budget': controller.budget.id,
          'name': "Updated Cost Item",
          'parent_category': "Chemicals",
          'cost_type': "variable",
          'cost_total': 10.00,
          'original_cost_total': 15.00,
        };
        cost_item_new = {
          'name': "New Cost Item",
          'parent_category': "Chemicals",
          'cost_type': "variable",
          'sub_category': {
            'name': "Herbicide"
          },
          'unit': "acres",
          'cost_total': 10.00,
          'original_cost_total': 5.00,
        };
        general_cost_item = {
          'id': 12,
          'parent_budget': controller.budget.id,
          'name': cost_item_new.parent_category,
          'category': "",
          'sub_category': "",
          'cost_type': "general",
          'unit': cost_item_new.unit,
          'unit_quantity': 4.00,
          'cost_per_unit': 15.00,
          'cost_total': 60.00,
        };
      });


      it("calls data service to update cost item if given item has an id", function() {
        controller.saveCost(cost_item_updated);
        $scope.$digest();

        expect(budgetServiceMock.updateBudgetItem).toHaveBeenCalled();
      });


      it("calls data service to create new cost item if given item does not have an id", function() {
        controller.saveCost(cost_item_new);
        $scope.$digest();

        expect(budgetServiceMock.createBudgetItem.calls.argsFor(0)[1].cost_total).toEqual(cost_item_new.cost_total);
      });

    });



    describe("removeItem", function() {
      var cost_item,
          income_item;

      beforeEach(function() {
        controller.budget = budget;
        spyOn(budgetServiceMock, "createBudgetItem").and.callThrough();
        spyOn(budgetServiceMock, "updateBudgetItem").and.callThrough();
        spyOn(budgetServiceMock, "destroyBudgetItem").and.callThrough();
        spyOn(controller, "reloadData").and.returnValue();
      });


      it("calls data service to destroy given income item", function() {
        var number_of_items = controller.budget.income_items.length;
        income_item = controller.budget.income_items[0];
        controller.removeItem("income", income_item);
        $scope.$digest();

        expect(budgetServiceMock.destroyBudgetItem).toHaveBeenCalled();
      });


      it("calls data service to destroy given variable cost item", function() {
        cost_item = controller.budget.cost_items[2];
        controller.removeItem(cost_item.cost_type, cost_item);
        $scope.$digest();

        expect(budgetServiceMock.destroyBudgetItem).toHaveBeenCalled();
      });


      it("calls data service to destroy given fixed cost item", function() {
        cost_item = controller.budget.cost_items[1];
        controller.removeItem(cost_item.cost_type, cost_item);
        $scope.$digest();

        expect(budgetServiceMock.destroyBudgetItem).toHaveBeenCalled();
      });


      it("calls data service to destroy given general cost item", function() {
        cost_item = controller.budget.cost_items[0];
        controller.removeItem(cost_item.cost_type, cost_item);
        $scope.$digest();

        expect(budgetServiceMock.destroyBudgetItem).toHaveBeenCalled();
      });


      it("calls reloadData()", function() {
        controller.removeItem("income", income_item);
        $scope.$digest();

        expect(controller.reloadData).toHaveBeenCalled();
      });
    });



    describe("updateBudget", function() {

      beforeEach(function() {
        controller.budget = budget;
        controller.form = {};
        controller.form.budgetTitle = controller.budget.title;
        spyOn(controller, "reloadData").and.returnValue();
      });


      it("does not update if budget.title is undefined", function() {
        controller.budget = {};
        controller.updateBudget();

        expect(controller.budget.title).toEqual(undefined);
      });


      it("updates budget attributes if defined", function() {
        controller.budget = angular.copy(budgetServiceMock.budgets[0]);
        controller.budget.title = 'new title';
        spyOn(budgetServiceMock, "updateBudget").and.callThrough();
        controller.updateBudget();
        $scope.$digest();

        expect(budgetServiceMock.updateBudget).toHaveBeenCalled();
      });


      it("calls reloadData()", function() {
        controller.budget = angular.copy(budgetServiceMock.budgets[0]);
        controller.updateBudget();
        $scope.$digest();

        expect(controller.reloadData).toHaveBeenCalled();
      });

    });



    xdescribe("scaleFarmUnitQuantity", function() {

      beforeEach(function() {
        controller.budget = {
          'id': 32,
        };
        spyOn(budgetServiceMock, "scaleFarmUnitQuantity").and.callThrough();
        spyOn(controller, "reloadData").and.returnValue();
      });


      it("does nothing if given invalid input", function() {
        controller.scaleFarmUnitQuantity();
        $scope.$digest();

        expect(budgetServiceMock.scaleFarmUnitQuantity).not.toHaveBeenCalled();
      });


      it("calls data service to scale the budget's farm unit quantity", function() {
        var new_farm_unit_quantity = 20;
        controller.scaleFarmUnitQuantity(new_farm_unit_quantity);
        $scope.$digest();

        expect(budgetServiceMock.scaleFarmUnitQuantity.calls.argsFor(0)).toEqual([controller.budget.id, new_farm_unit_quantity]);
      });


      it("calls controller method to reload budget", function() {
        var new_farm_unit_quantity = 20;
        controller.scaleFarmUnitQuantity(new_farm_unit_quantity);
        $scope.$digest();

        expect(controller.reloadData).toHaveBeenCalled();
      });

    });



    describe("setCountyOptions", function() {

      beforeEach(function() {
        controller.region_data = [
          {
            "state": "Oregon",
            "counties": [
              'Washington',
              'Linn'
            ]
          },
          {
            "state": "Arizona",
            "counties": [
              'Gila',
              'Yuma'
            ]
          }
        ];
      });


      it("returns county option list of the matching 'state' in region data", function() {
        var county_options = controller.setCountyOptions("Oregon");
        $scope.$digest();

        expect(county_options).toEqual(controller.region_data[0].counties);
      });


      it("Doesn't allow noncounty 'current' argument to the returned county list", function() {
        var current = "Eastern";
        var county_options = controller.setCountyOptions("Oregon", current);
        //console.log(county_options);
        $scope.$digest();

        expect(county_options).not.toContain(current);
      });

    });



    describe("save", function() {

      beforeEach(function () {
        controller.budget = budget;
        spyOn(budgetServiceMock, "updateBudget").and.callThrough();
        controller.onSave = jasmine.createSpy('onSaveSpy');
      });


      it("calls output method with 'budget'", function() {
        controller.save();
        $scope.$digest();

        expect(controller.onSave.calls.argsFor(0)).toEqual([{budget: controller.budget}]);
      });

    });



    describe("discard", function() {

      beforeEach(function() {
        spyOn(budgetServiceMock, "destroyBudget").and.callThrough();
        controller.onDiscard = jasmine.createSpy('onDiscardSpy');
        controller.budget = {id: 43};
      });


      it("calls data service to destroy current budget", function() {
        controller.discard();
        $scope.$digest();

        expect(budgetServiceMock.destroyBudget.calls.argsFor(0)[0]).toEqual(controller.budget.id);
      });


      it("calls output method with 'budget'", function() {
        controller.discard();
        $scope.$digest();

        expect(controller.onDiscard.calls.argsFor(0)).toEqual([{budget: controller.budget}]);
      });

    });

  });

})();
