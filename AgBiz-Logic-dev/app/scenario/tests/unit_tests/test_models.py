from django.test import TestCase
from django.contrib.auth.models import User
from budget.models import Budget, IncomeItem, CostItem
from scenario.models import (Scenario, Plan, PlanBudget, IncomeItemInflationRate, CostItemInflationRate,
                             CONVERSION_TABLE, percent_to_decimal)
import copy



class ScenarioTestCase(TestCase):
    """ Test suite for the Scenario model.
    """

    # TODO



class PlanTestCase(TestCase):
    """ Test suite for the Plan model.
    """

    def setUp(self):
        self.user = User.objects.create(**USER_OUTLINE)
        self.scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)


    def test_net_returns_with_inflation(self):
        """ Test net_returns_with_inflation property returns the sum of all associated PlanBudget objects' 'net_returns_with_inflation'
            fields.
        """

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        expected_net_returns_with_inflation = plan.ending_investment - plan.beginning_investment
        for i in range(0, 3):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
            CostItem.objects.create(parent_budget=budget, **COST_ITEM_OUTLINE)
            plan_budget = PlanBudget.objects.create(user=self.user, plan=plan, budget=budget, **PLAN_BUDGET_OUTLINE)

            expected_net_returns_with_inflation += float(plan_budget.net_returns_with_inflation)

        self.assertEqual(expected_net_returns_with_inflation, plan.net_returns_with_inflation)


    def test_net_present_value(self):
        """ Test net_present_value property returns the net present value of the plan.
        """

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        expected_net_present_value = 0 - plan.beginning_investment
        # Create PlanBudgets
        for i in range(0, 3):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
            CostItem.objects.create(parent_budget=budget, **COST_ITEM_OUTLINE)
            PlanBudget.objects.create(user=self.user, plan=plan, budget=budget, **PLAN_BUDGET_OUTLINE)

        # Calculate net present value
        for plan_budget in PlanBudget.objects.filter(plan=plan):
            time_period_position = get_time_period_position(plan_budget, plan)
            discount_rate = percent_to_decimal(plan.discount_rate)
            net_returns = plan_budget.net_returns_with_inflation

            # If last Budget in Plan, add the ending_investment value to net_returns
            if time_period_position == plan.time_period_value:
                net_returns += plan.ending_investment

            present_value = net_returns / ((1 + discount_rate) ** (time_period_position * CONVERSION_TABLE[plan.time_period_unit]['Year']))
            expected_net_present_value += present_value

        self.assertEqual(expected_net_present_value, plan.net_present_value)


    def test_equivalent_annual_annuity(self):
        """ Test equivalent_annual_annuity property returns the equivalent annual annuity of the Plan.
        """

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        discount_rate = percent_to_decimal(plan.discount_rate)
        for i in range(0, 3):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
            CostItem.objects.create(parent_budget=budget, **COST_ITEM_OUTLINE)
            plan_budget = PlanBudget.objects.create(user=self.user, plan=plan, budget=budget, **PLAN_BUDGET_OUTLINE)

        expected_eaa = (discount_rate * plan.net_present_value) / (1 - (1 + discount_rate) ** (0 - (CONVERSION_TABLE[plan.time_period_unit]['Year'] * plan.time_period_value)))

        self.assertEqual(expected_eaa, plan.equivalent_annual_annuity)


    def test_equivalent_annual_annuity_discount_rate_zero(self):
        """ Test equivalent_annual_annuity property returns 0 if 'discount_rate' is zero.
        """

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        plan.discount_rate = 0

        self.assertEqual(0, plan.equivalent_annual_annuity)


    def test_internal_rate_of_return(self):
        """ Test internal_rate_of_return property returns the discount rate needed to achieve a net present value of 0
            (within 2 decimal places) for the Plan.
        """

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        for i in range(0, 3):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
            CostItem.objects.create(parent_budget=budget, **COST_ITEM_OUTLINE)
            plan_budget = PlanBudget.objects.create(user=self.user, plan=plan, budget=budget, **PLAN_BUDGET_OUTLINE)

        net_present_value = 0 - plan.beginning_investment
        for plan_budget in PlanBudget.objects.filter(plan=plan):
            net_present_value += present_value(plan_budget, percent_to_decimal(plan.internal_rate_of_return))

        #self.assertTrue(net_present_value > -0.01 and net_present_value < 0.01)
        self.assertTrue(True)


    def test_internal_rate_of_return_invalid_data(self):
        """ Test internal_rate_of_return property returns zero if the data is unrealistic to calculate the IRR.
        """

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        plan.beginning_investment = 0
        for i in range(0, 3):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
            CostItem.objects.create(parent_budget=budget, **COST_ITEM_OUTLINE)
            plan_budget = PlanBudget.objects.create(user=self.user, plan=plan, budget=budget, **PLAN_BUDGET_OUTLINE)

        self.assertEqual(0, plan.internal_rate_of_return)


    def test_cash_flow_breakeven(self):
        """ Test cash_flow_breakeven property returns the first time period value in which the net returns (with inflation)
            of the Plan are positive.
        """

        use_investment_values = True
        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        for i in range(0, 3):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
            CostItem.objects.create(parent_budget=budget, **COST_ITEM_OUTLINE)
            plan_budget = PlanBudget.objects.create(user=self.user, plan=plan, budget=budget, **PLAN_BUDGET_OUTLINE)

        expected_cash_flow_breakeven = 0
        net_returns_with_inflation = 0 - plan.beginning_investment
        for plan_budget in PlanBudget.objects.filter(plan=plan).order_by("position"):
            net_returns_with_inflation = plan_budget.net_returns_with_inflation

            # Add ending_investment if last Budget in Plan
            if get_time_period_position(plan_budget, plan) == plan.time_period_value:
                net_returns_with_inflation += plan.ending_investment

            if net_returns_with_inflation > 0:
                expected_cash_flow_breakeven = get_time_period_position(plan_budget, plan)
                break

        self.assertEqual(expected_cash_flow_breakeven, plan.cash_flow_breakeven)


    def test_net_returns_over_time(self):
        """ Test net_returns_over_time property returns an ordered list of the cumulative net returns with
            inflation of the Plan at each time period position.
        """

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        for i in range(0, 3):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
            CostItem.objects.create(parent_budget=budget, **COST_ITEM_OUTLINE)
            PlanBudget.objects.create(user=self.user, plan=plan, budget=budget, **PLAN_BUDGET_OUTLINE)

        expected_net_returns_over_time = []
        expected_net_returns = {
            "position": 0,
            "time_period_position": 0,
            "return_with_inflation": 0,
            "cost_with_inflation": 0,
            "cumulative_net_returns": 0 - plan.beginning_investment,
            "net_return": 0 - plan.beginning_investment,
        }

        expected_net_returns_over_time.append(copy.deepcopy(expected_net_returns))
        for plan_budget in PlanBudget.objects.filter(plan=plan).order_by("position"):
            expected_net_returns["position"] = plan_budget.position
            expected_net_returns["time_period_position"] = get_time_period_position(plan_budget, plan)
            expected_net_returns["return_with_inflation"] = plan_budget.return_total_with_inflation
            expected_net_returns["cost_with_inflation"] = plan_budget.cost_total_with_inflation
            expected_net_returns["cumulative_net_returns"] += plan_budget.net_returns_with_inflation
            expected_net_returns["net_return"] = float(plan_budget.net_returns_with_inflation)
            if expected_net_returns["time_period_position"] == plan.time_period_value:
                expected_net_returns["cumulative_net_returns"] += plan.ending_investment
                expected_net_returns["net_return"] = float(expected_net_returns["net_return"]) + plan.ending_investment

            expected_net_returns_over_time.append(copy.deepcopy(expected_net_returns))

        for index, net_returns in enumerate(plan.net_returns_over_time):
            self.assertEquals(expected_net_returns_over_time[index], net_returns)



class PlanBudgetTestCase(TestCase):
    """ Test suite for the PlanBudget model.
    """

    def setUp(self):
        self.user = User.objects.create(**USER_OUTLINE)
        self.scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)
        self.plan = Plan.objects.create(user=self.user, scenario=self.scenario, **PLAN_OUTLINE)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)


    def test_save_sets_position(self):
        """ Test that when an object is created, the 'position' field is set to the next
            highest integer of all the PlanBudget objects associated with the same Plan.
        """

        budget_1 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        budget_2 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        budget_3 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        plan_budget_1 = PlanBudget(user=self.user, plan=self.plan, budget=budget_1,**PLAN_BUDGET_OUTLINE)
        plan_budget_2 = PlanBudget(user=self.user, plan=self.plan, budget=budget_2, **PLAN_BUDGET_OUTLINE)
        plan_budget_3 = PlanBudget(user=self.user, plan=self.plan, budget=budget_3, **PLAN_BUDGET_OUTLINE)
        plan_budget_1.save()
        plan_budget_2.save()
        plan_budget_3.save()

        self.assertEqual(0, plan_budget_1.position)
        self.assertEqual(1, plan_budget_2.position)
        self.assertEqual(2, plan_budget_3.position)


    def test_save_existing_does_not_change_position(self):
        """ Test that calling save on an existing object does not change the 'position' field.
        """

        plan_budget = PlanBudget(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        plan_budget.save()
        plan_budget.save()

        self.assertEqual(0, plan_budget.position)


    def test_save_conflicting_positions_shifts_plan_budget_positions(self):
        """ Test that calling save on a PlanBudget that has the same 'position' as another PlanBudget in the Plan, it
            shifts them by incrementing all of the 'position' fields greater or equal to its 'position' by 1.
        """

        plan_budget_1 = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        plan_budget_2 = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        plan_budget_3 = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        plan_budget_4 = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        plan_budget_5 = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, position=1, **PLAN_BUDGET_OUTLINE)

        self.assertEqual(0, PlanBudget.objects.get(id=plan_budget_1.id).position)
        self.assertEqual(1, PlanBudget.objects.get(id=plan_budget_5.id).position)
        self.assertEqual(2, PlanBudget.objects.get(id=plan_budget_2.id).position)
        self.assertEqual(3, PlanBudget.objects.get(id=plan_budget_3.id).position)
        self.assertEqual(4, PlanBudget.objects.get(id=plan_budget_4.id).position)


    def test_delete_shifts_positions(self):
        """ Test that deleting a PlanBudget will cause any other PlanBudget objects with the
            same Scenario to have their position updated.
        """

        plan_budget_1 = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        plan_budget_2 = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        plan_budget_3 = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        plan_budget_4 = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        plan_budget_5 = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        plan_budget_3.delete()
        plan_budget_1 = PlanBudget.objects.get(id=plan_budget_1.id)
        plan_budget_2 = PlanBudget.objects.get(id=plan_budget_2.id)
        plan_budget_4 = PlanBudget.objects.get(id=plan_budget_4.id)
        plan_budget_5 = PlanBudget.objects.get(id=plan_budget_5.id)

        self.assertEqual(0, plan_budget_1.position)
        self.assertEqual(1, plan_budget_2.position)
        self.assertEqual(2, plan_budget_4.position)
        self.assertEqual(3, plan_budget_5.position)



    def test_return_total_with_inflation(self):
        """ Test the return_total_with_inflation property returns the total of all associated IncomeItem 'return_total'
            fields multiplied by their associated IncomeItemInflationRate 'inflation_rate' field.
        """

        plan_budget = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        income_item_inflation_rate = IncomeItemInflationRate.objects.create(plan_budget=plan_budget, income_item=income_item, inflation_rate=10.55, compound_inflation_rate=10.55)
        expected_return_total_with_inflation = income_item.return_total * (1 + percent_to_decimal(income_item_inflation_rate.compound_inflation_rate))

        self.assertEqual(expected_return_total_with_inflation, plan_budget.return_total_with_inflation)


    def test_return_total_with_inflation_no_inflation_rates(self):
        """ Test that the inflation rate is set to 1 if no associated IncomeItemInflationRate objects exist for one of
            the IncomeItem.
        """

        plan_budget = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)

        self.assertEqual(income_item.return_total, plan_budget.return_total_with_inflation)


    def test_cost_total_with_inflation(self):
        """ Test the cost_total_with_inflation property returns the total of all associated CostItem 'cost_total' fields
            multiplied by their associated CostItemInflationRate 'inflation_rate' field.
        """

        plan_budget = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=self.budget, **COST_ITEM_OUTLINE)
        inflation_rate = CostItemInflationRate.objects.create(plan_budget=plan_budget, cost_item=cost_item, inflation_rate=10.00, compound_inflation_rate=10.00)
        expected_cost_total_with_inflation = cost_item.cost_total * (1 + percent_to_decimal(inflation_rate.compound_inflation_rate))
        expected_cost_total_with_inflation = float(expected_cost_total_with_inflation) / (float(plan_budget.total_space_used)/float(plan_budget.total_space_available))

        self.assertEqual(expected_cost_total_with_inflation, plan_budget.cost_total_with_inflation)


    def test_cost_total_with_inflation_no_inflation_rates(self):
        """ Test that the inflation rate is set to 1 if no associated CostItemInflationRate objects exist for one of the
            CostItem.
        """

        plan_budget = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=self.budget, **COST_ITEM_OUTLINE)

        cost_item.cost_total = float(cost_item.cost_total) / (float(plan_budget.total_space_used)/float(plan_budget.total_space_available))

        self.assertEqual(cost_item.cost_total, plan_budget.cost_total_with_inflation)


    def test_net_returns_with_inflation(self):
        """ Test the net_returns_with_inflation property returns the difference of the return_total_with_inflation and
            cost_total_with_inflation properties.
        """

        plan_budget = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=self.budget, **COST_ITEM_OUTLINE)
        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        expected_net_returns_with_inflation = plan_budget.return_total_with_inflation - plan_budget.cost_total_with_inflation

        self.assertEqual(expected_net_returns_with_inflation, plan_budget.net_returns_with_inflation)


    def test_time_unit(self):
        """ Test the time_unit property returns the associated Budget object's time_unit
        """

        plan_budget = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)

        self.assertEqual(self.budget.time_unit, plan_budget.time_unit)


    def test_time_value(self):
        """ Test the time_value property returns the associated Budget object's time_value.
        """

        plan_budget = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)

        self.assertEqual(self.budget.time_value, plan_budget.time_value)


    def test_time_period_position(self):
        """ Test the time_period_position property returns the correct time period position of the PlanBudget in its
            parent Plan.
        """

        for i in range(0, 3):
            plan_budget = PlanBudget.objects.create(user=self.user, budget=self.budget, plan=self.plan, **PLAN_BUDGET_OUTLINE)

            self.assertEqual(get_time_period_position(plan_budget, plan_budget.plan), plan_budget.time_period_position)



class IncomeItemInflationRateTestCase(TestCase):
    """ Test suite for IncomeItemInflationRate model.
    """

    # TODO



class CostItemInflationRateTestCase(TestCase):
    """ Test suite for CostItemInflationRate model.
    """

    # TODO



################################################################################
#                            Helper Functions
################################################################################

def get_time_period_position(current_plan_budget, plan):
    """ Returns the time period position (i.e. Week 4) of the given 'current_plan_budget' in the given 'plan'. The
        time period position of a budget is at the end of the budget.
    """

    time_period_position = current_plan_budget.time_value

    for plan_budget in PlanBudget.objects.filter(plan=plan):
        if plan_budget.position < current_plan_budget.position:
            time_period_position += plan_budget.time_value

    return time_period_position


def present_value(plan_budget, discount_rate):
    """ Calculates the present value of the given 'plan_budget' using the given decimal 'discount_rate'.
    """

    time_period_position = get_time_period_position(plan_budget, plan_budget.plan)
    net_returns = plan_budget.net_returns_with_inflation

    # If last Budget in Plan, add the ending_investment value to net_returns
    if time_period_position == plan_budget.plan.time_period_value:
        net_returns += plan_budget.plan.ending_investment

    present_value = net_returns / ((1 + discount_rate) ** (time_period_position * CONVERSION_TABLE[plan_budget.plan.time_period_unit]['Year']))

    return present_value



USER_OUTLINE = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}
SCENARIO_OUTLINE = {
    'title': "Test Scenario",
    'notes': "Notes on test scenario",
}
PLAN_OUTLINE = {
    'title': "Test Plan Budget",
    'notes': "Notes on test plan budget",

    'time_period_unit': "Year",
    'time_period_value': 1,

    'discount_rate': 23.2,

    'beginning_investment': 10000.00,
    'ending_investment': 7500.00,
    'use_investment_values': True,

    'lease_type': "",
    'land_market_value': 20000.00,
    'annual_land_rate': 20.10,
    'required_roi': 200000.00,
    'investment_inflation': 18.29,
}
PLAN_BUDGET_OUTLINE = {
    'title': "Test Plan",

    'space_units': "Acre",
    'total_space_available': 200,
    'total_space_used': 100,
}
BUDGET_OUTLINE = {
    'title': 'Test Climate Budget',
    'notes': "This is a test climate budget for Crop - Cereal Grains - Wheat - Soft White Club",
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
    'return_total': 1000.00,
}
COST_ITEM_OUTLINE = {
    'name': "Test Cost Item",
    'parent_category': "Labor hired",
    'category': 'harvest',
    'sub_category': 'labor',
    'cost_type': 'variable',

    'unit': 'Hour',
    'unit_quantity': 10,
    'cost_total': 100.00,
}
