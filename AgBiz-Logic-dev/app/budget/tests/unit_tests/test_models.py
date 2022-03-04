from django.test import TestCase
from django.contrib.auth.models import User
from budget.models import *
from decimal import Decimal



class BudgetTestCase(TestCase):
    """ Test suite for Budget model.
    """

    def setUp(self):
        """ Create test user and data.
        """

        self.user1 = User.objects.create(**USER_1)
        self.user1.set_password("test")
        self.user1.save()


    def test_budget_creation(self):
        """ Test that object can be created.
        """

        Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget_query = Budget.objects.filter(user=self.user1)

        self.assertEqual(1, len(budget_query))


    def test_save_cascades_farm_unit_quantity(self):
        """ Test that calling 'save' on a Budget sets all associated IncomeItem and CostItem objects' 'farm_unit_quantity'
            to match the Budget's 'farm_unit_quantity' value.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=budget, **GENERAL_COST_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=budget, **FIXED_COST_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=budget, **VARIABLE_COST_ITEM_OUTLINE)

        budget.farm_unit_quantity = 13
        budget = budget.save()

        for income_item in IncomeItem.objects.filter(parent_budget=budget):
            self.assertEqual(budget.farm_unit_quantity, income_item.farm_unit_quantity)
        for cost_item in CostItem.objects.filter(parent_budget=budget):
            self.assertEqual(budget.farm_unit_quantity, cost_item.farm_unit_quantity)


    def test_save_cascades_sale_unit_quantity(self):
        """ Test that calling 'save' on a Budget sets all associated IncomeItem and CostItem objects' 'sale_unit_quantity'
            and 'unit_quantity' to match the Budget's 'farm_unit_quantity' value.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=budget, **GENERAL_COST_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=budget, **FIXED_COST_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=budget, **VARIABLE_COST_ITEM_OUTLINE)

        budget.farm_unit_quantity = 13
        budget = budget.save()

        for income_item in IncomeItem.objects.filter(parent_budget=budget):
            self.assertEqual(budget.farm_unit_quantity, income_item.sale_unit_quantity)
        for cost_item in CostItem.objects.filter(parent_budget=budget):
            self.assertEqual(budget.farm_unit_quantity, cost_item.unit_quantity)


    def test_save_cascades_farm_unit(self):
        """ Test that calling 'save' on a Budget sets all associated IncomeItem objects' 'farm_unit'
            to match the Budget's 'farm_unit' value.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)

        budget.farm_unit = "Case"
        budget = budget.save()

        for income_item in IncomeItem.objects.filter(parent_budget=budget):
            self.assertEqual(budget.farm_unit, income_item.farm_unit)


    def test_scale_farm_unit(self):
        """ Test scale_farm_unit method increases the Budget's 'farm_unit_quantity' to the given value, and scales the
            'return_total' or 'cost_total' of any associated IncomeItem or CostItem objects such that the ratio between
            the total and 'farm_unit_quantity' remains the same.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=budget, **GENERAL_COST_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=budget, **FIXED_COST_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=budget, **VARIABLE_COST_ITEM_OUTLINE)

        new_farm_quantity = 20
        budget.scale_farm_unit(new_farm_quantity)

        for income_item in IncomeItem.objects.filter(parent_budget=budget):
            expected_return_total = income_item.sale_unit_quantity * income_item.price_per_sale_unit * income_item.weight

            self.assertEqual(new_farm_quantity, income_item.farm_unit_quantity)
            self.assertEqual(income_item.return_total / new_farm_quantity, income_item.price_per_farm_unit)
            self.assertEqual(expected_return_total, income_item.return_total)
        for cost_item in CostItem.objects.filter(parent_budget=budget):
            expected_cost_total = cost_item.unit_quantity * cost_item.cost_per_unit

            self.assertEqual(new_farm_quantity, cost_item.farm_unit_quantity)
            self.assertEqual(cost_item.cost_total / new_farm_quantity, cost_item.cost_per_farm_unit)
            self.assertEqual(expected_cost_total, cost_item.cost_total)

        self.assertEqual(new_farm_quantity, budget.farm_unit_quantity)


    def test_profit(self):
        """ Test profit property.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget.save()

        income_item = IncomeItem(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        income_item.save()

        cost_item = CostItem.objects.create(parent_budget=budget, **VARIABLE_COST_ITEM_OUTLINE)
        cost_item.save()
        profit = income_item.return_total - cost_item.cost_total

        self.assertEqual(profit, budget.profit)


    def test_total_gross_returns(self):
        """ Test total_gross_returns property.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget.save()

        income_item = IncomeItem(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        income_item.save()

        self.assertEqual(income_item.return_total, budget.total_gross_returns)


    def test_total_costs(self):
        """ Test total_costs property.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget.save()

        cost_item = CostItem.objects.create(parent_budget=budget, **VARIABLE_COST_ITEM_OUTLINE)
        cost_item.save()

        self.assertEqual(cost_item.cost_total, budget.total_costs)


    def test_total_variable_costs(self):
        """ Test total_variable_costs property.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget.save()

        cost_item = CostItem.objects.create(parent_budget=budget, **VARIABLE_COST_ITEM_OUTLINE)
        cost_item.save()

        self.assertEqual(cost_item.cost_total, budget.total_variable_costs)


    def test_total_fixed_costs(self):
        """ Test total_fixed_costs property.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget.save()

        cost_item = CostItem.objects.create(parent_budget=budget, **FIXED_COST_ITEM_OUTLINE)
        cost_item.save()

        self.assertEqual(cost_item.cost_total, budget.total_fixed_costs)


    def test_total_general_costs(self):
        """ Test total_general_costs property.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget.save()

        cost_item = CostItem.objects.create(parent_budget=budget, **GENERAL_COST_ITEM_OUTLINE)
        cost_item.save()

        self.assertEqual(cost_item.cost_total, budget.total_general_costs)


    def test_total_income_less_variable_costs(self):
        """ Test total_income_less_variable_costs property.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget.save()

        income_item = IncomeItem(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        income_item.save()

        cost_item = CostItem.objects.create(parent_budget=budget, **VARIABLE_COST_ITEM_OUTLINE)
        cost_item.save()

        self.assertEqual(budget.total_income_less_variable_costs, income_item.return_total - cost_item.cost_total)


    def test_breakeven_yield(self):
        """ Test breakeven_yield property.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget.save()

        income_item = IncomeItem(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        income_item.save()

        cost_item = CostItem.objects.create(parent_budget=budget, **VARIABLE_COST_ITEM_OUTLINE)
        cost_item.save()

        breakeven_yield = cost_item.cost_total / income_item.price_per_sale_unit

        self.assertEqual(breakeven_yield, budget.breakeven_yield)


    def test_breakeven_price(self):
        """ Test breakeven_price property.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget.save()

        income_item = IncomeItem(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        income_item.save()

        cost_item = CostItem.objects.create(parent_budget=budget, **VARIABLE_COST_ITEM_OUTLINE)
        cost_item.save()

        # Convert inaccurate float to Decimal object for comparison with another Decimal object
        breakeven_price = Decimal(cost_item.cost_total / income_item.sale_unit_quantity).quantize(Decimal('0.01'))

        self.assertEqual(breakeven_price, budget.breakeven_price)


    def test_total_yields(self):
        """ Test total_yields.
        """

        budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        budget.save()

        income_item_1 = IncomeItem(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        income_item_2 = IncomeItem(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        income_item_1.save()
        income_item_2.save()

        self.assertEqual(budget.total_yields, (2 * income_item_1.sale_unit_quantity))



class IncomeItemTestCase(TestCase):
    """ Test suite for IncomeItem model.
    """

    def setUp(self):
        """ Create test user and data.
        """

        self.user1 = User.objects.create(**USER_1)
        self.user1.set_password("test")
        self.user1.save()

        self.budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        self.budget.save()


    def test_income_creation(self):
        """ Test that object can be created.
        """

        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        income_item.save()

        income_item_query = IncomeItem.objects.filter(parent_budget=self.budget)

        # Check that object was saved
        self.assertEqual(1, len(income_item_query))

        # Check field values
        self.assertEqual(income_item.name, income_item_query[0].name)
        self.assertEqual(income_item.farm_unit, income_item_query[0].farm_unit)
        self.assertEqual(income_item.farm_unit_quantity, income_item_query[0].farm_unit_quantity)
        self.assertEqual(income_item.sale_unit, income_item_query[0].sale_unit)
        self.assertEqual(income_item.sale_unit_quantity, income_item_query[0].sale_unit_quantity)
        self.assertEqual(income_item.return_total, income_item_query[0].return_total)


    def test_price_per_farm_unit(self):
        """ Test price_per_farm_unit property.
        """

        income_item = IncomeItem(farm_unit_quantity=100, return_total=200.00)

        self.assertEqual(2.00, income_item.price_per_farm_unit)


    def test_price_per_sale_unit(self):
        """ Test price_per_sale_unit property.
        """

        income_item = IncomeItem(sale_unit_quantity=100, return_total=200.00, weight=2)

        self.assertEqual(1.00, income_item.price_per_sale_unit)



class CostItemTestCase(TestCase):
    """ Test suite for CostItem model.
    """

    def setUp(self):
        """ Create test user and data.
        """

        self.user1 = User.objects.create(**USER_1)
        self.user1.set_password("test")
        self.user1.save()

        self.budget = Budget.objects.create(user=self.user1, **BUDGET_OUTLINE)
        self.budget.save()


    def test_cost_item_creation(self):
        """ Test that the object can be created.
        """

        CostItem.objects.create(parent_budget=self.budget, **VARIABLE_COST_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)

        cost_item_query = CostItem.objects.filter(parent_budget=self.budget)

        self.assertEqual(3, len(cost_item_query))


    def test_save_new_sets_farm_unit_quantity(self):
        """ Test creating a new CostItem sets the 'farm_unit_quantity' to equal the parent Budget's 'farm_unit_quantity'.
        """

        cost_item = CostItem.objects.create(parent_budget=self.budget, **VARIABLE_COST_ITEM_OUTLINE)

        self.assertEqual(self.budget.farm_unit_quantity, cost_item.farm_unit_quantity)


    def test_delete_does_not_create_parent_cost_item_if_general_cost(self):
        """ Test that deleting a CostItem with 'cost_type' equal to 'general' does not create a parent CostItem.
        """

        general_cost_item = CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)
        general_cost_item.delete()
        cost_item_list = CostItem.objects.all()

        self.assertEqual(0, len(cost_item_list))

    def test_cost_per_unit(self):
        """ Test cost_per_unit property.
        """

        cost_item = CostItem(unit_quantity=10, cost_total=100.00)
        self.assertEqual(10.00, cost_item.cost_per_unit)


    def test_cost_per_farm_unit(self):
        """ Test cost_per_farm_unit property.
        """

        cost_item = CostItem(cost_total=20.00, farm_unit_quantity=10)
        self.assertEqual(2.00, cost_item.cost_per_farm_unit)



USER_1 = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}

BUDGET_OUTLINE = {
    'title': 'Test Budget',
    'notes': "This is a test budget for Crop - Cereal Grains - Wheat - Soft White Club",
    'enterprise': 'Crop',
    'descriptor1': 'Cereal Grains',
    'descriptor2': 'Wheat',
    'market': 'GMO',

    'state': 'OR',
    'region': 'Benton County',

    'time_unit': 'Year',
    'time_value': 1,
    'farm_unit': 'Acre',
    'farm_unit_quantity': 1,
}

INCOME_ITEM_OUTLINE = {
    'name': 'Test Income Item',
    'notes': "Test income item notes",

    'farm_unit': 'Acre',
    'farm_unit_quantity': 10,
    'sale_unit': 'Ton',
    'sale_unit_quantity': 100,
    'return_total': 100.00,
}

VARIABLE_COST_ITEM_OUTLINE = {
    'name': "Test Variable Cost Item",
    'category': 'harvest',
    'sub_category': 'labor',
    'cost_type': 'variable',

    'unit': 'Hour',
    'unit_quantity': 10,
    'cost_total': 100.00,
}

FIXED_COST_ITEM_OUTLINE = {
    'name': "Test Fixed Cost Item",
    'category': 'post_harvest',
    'sub_category': 'insurance',
    'cost_type': 'fixed',

    'unit': 'Acre',
    'unit_quantity': 10,
    'cost_total': 100.00,
}

GENERAL_COST_ITEM_OUTLINE = {
    'name': "Test General Cost Item",
    'category': '',
    'sub_category': '',
    'cost_type': 'general',

    'unit': 'Acre',
    'unit_quantity': 10,
    'cost_total': 100.00,
}

CLIMATE_SCENARIO_OUTLINE = {
    'title': "Climate Scenario 1",
    'notes': "Notes about scenario"
}

CLIMATE_BUDGET_OUTLINE = {
    'modeling_estimate': 10.0,
    'focus_group_estimate': 10.0,
    'user_estimate': 10.0,
}
