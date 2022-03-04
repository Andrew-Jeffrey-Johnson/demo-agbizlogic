from django.test import TestCase
from django.contrib.auth.models import User
from climate.models import *
from budget.models import *




class ClimateScenarioTestCase(TestCase):
    """ Test suite for ClimateScenario model.
    """

    def setUp(self):
        """ Create test user and data.
        """

        self.user = User.objects.create(**USER_OUTLINE)


    def test_scenario_creation(self):
        """ Test that object can be created.
        """

        scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        scenario_query = ClimateScenario.objects.filter(user=self.user)

        self.assertEqual(1, len(scenario_query))



class ClimateBudgetTestCase(TestCase):
    """ Test suite for ClimateBudget model.
    """

    def setUp(self):
        """ Create user and test data.
        """

        self.user = User.objects.create(**USER_OUTLINE)
        self.climate_scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)


    def test_climate_budget_creation(self):
        """ Test that the object can be created.
        """

        climate_budget = ClimateBudget.objects.create(
            user=self.user,
            budget=self.budget,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )

        budget_query = ClimateBudget.objects.filter(user=self.user)

        self.assertEqual(1, len(budget_query))
        self.assertEqual(0, budget_query[0].position)


    def test_delete_resets_positions(self):
        """ Test that deleting a ClimateBudget will cause any other ClimateBudget objects with the
            same ClimateScenario to have their position updated.
        """

        climate_budget_1 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=True,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_2 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=False,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_3 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=True,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_4 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=False,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_5 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=True,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )

        climate_budget_1.save()
        climate_budget_2.save()
        climate_budget_3.save()
        climate_budget_4.save()
        climate_budget_5.save()

        climate_budget_3.delete()

        climate_budget_1 = ClimateBudget.objects.get(id=climate_budget_1.id)
        climate_budget_2 = ClimateBudget.objects.get(id=climate_budget_2.id)
        climate_budget_4 = ClimateBudget.objects.get(id=climate_budget_4.id)
        climate_budget_5 = ClimateBudget.objects.get(id=climate_budget_5.id)

        self.assertEqual(0, climate_budget_1.position)
        self.assertEqual(1, climate_budget_2.position)
        self.assertEqual(3, climate_budget_4.position)
        self.assertEqual(2, climate_budget_5.position)


    def test_save_sets_position_original(self):
        """ Test that if 'is_original' field is True, the object is saved with the 'position' field as the
            next highest even integer of all ClimateBudget objects with the same ClimateScenario.
        """

        climate_budget_1 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=True,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_2 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=True,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_3 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=True,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )

        climate_budget_1.save()
        climate_budget_2.save()
        climate_budget_3.save()

        self.assertEqual(climate_budget_1.position, 0)
        self.assertEqual(climate_budget_2.position, 2)
        self.assertEqual(climate_budget_3.position, 4)


    def test_save_sets_position_not_original(self):
        """ Test that if 'is_original' field is False, the object is saved with the 'position' field as the
            next highest odd integer of all ClimateBudget objects with the same ClimateScenario.
        """

        climate_budget_1 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=False,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_2 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=False,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_3 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=False,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )

        climate_budget_1.save()
        climate_budget_2.save()
        climate_budget_3.save()

        self.assertEqual(climate_budget_1.position, 1)
        self.assertEqual(climate_budget_2.position, 3)
        self.assertEqual(climate_budget_3.position, 5)


    def test_save_sets_position_mixed(self):
        """ Test position setting using mixed order of saving.
        """

        climate_budget_1 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=True,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_2 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=False,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_3 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=True,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_4 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=False,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_5 = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=True,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )

        climate_budget_1.save()
        climate_budget_2.save()
        climate_budget_3.save()
        climate_budget_4.save()
        climate_budget_5.save()

        self.assertEqual(climate_budget_1.position, 0)
        self.assertEqual(climate_budget_2.position, 1)
        self.assertEqual(climate_budget_3.position, 2)
        self.assertEqual(climate_budget_4.position, 3)
        self.assertEqual(climate_budget_5.position, 4)


    def test_does_not_change_position_on_after_first_save(self):
        """ Test that calling save on a created object does not change the 'position' field.
        """

        climate_budget = ClimateBudget(
            user=self.user,
            budget=self.budget,
            is_original=True,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )

        climate_budget.save()
        climate_budget.save()

        self.assertEqual(0, climate_budget.position)


    def test_net_returns(self):
        """ Test net_returns property.
        """

        climate_budget = ClimateBudget.objects.create(
            user=self.user,
            budget=self.budget,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )

        income_item_1 = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        income_item_2 = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)

        budget_query = ClimateBudget.objects.filter(user=self.user)

        self.assertEqual(self.budget.profit, budget_query[0].net_returns)


    def test_total_yields(self):
        """ Test total_yields property.
        """

        climate_budget = ClimateBudget.objects.create(
            user=self.user,
            budget=self.budget,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )

        income_item_1 = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        income_item_2 = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)

        budget_query = ClimateBudget.objects.filter(user=self.user)

        self.assertEqual(self.budget.total_yields, budget_query[0].total_yields)


    def test_farm_unit(self):
        """ Test the farm_unit property inherits from the associated Budget object.
        """

        climate_budget = ClimateBudget.objects.create(
            user=self.user,
            budget=self.budget,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )

        budget_query = ClimateBudget.objects.filter(user=self.user)

        self.assertEqual(self.budget.farm_unit, budget_query[0].farm_unit)



class ClimateFactorTestCase(TestCase):
    """ Test suite for ClimateFactor model.
    """

    def setUp(self):
        """ Create test data.
        """

        self.user = User.objects.create(**USER_OUTLINE)
        self.climate_scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        self.climate_budget = ClimateBudget.objects.create(
            user=self.user,
            budget=self.budget,
            climate_scenario=self.climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )


    def test_climate_factor_creation(self):
        """ Test that object can be created.
        """

        climate_factor = ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)
        factor_query = ClimateFactor.objects.filter(climate_budget=self.climate_budget)

        self.assertEqual(1, len(factor_query))



# Outlines for test objects

USER_OUTLINE = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
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

BUDGET_OUTLINE = {
    'title': 'Test Climate Budget',
    'notes': "This is a test climate budget for Crop - Cereal Grains - Wheat - Soft White Club",
    'enterprise': 'Crop',
    'descriptor1': 'Cereal Grains',
    'descriptor2': 'Wheat',
    'market': 'GMO',

    'state': 'OR',
    'region': 'Benton County',

    'time_unit': 'years',
    'time_value': 1,
    'farm_unit': 'acres',
    'farm_unit_quantity': 1,
}

CLIMATE_FACTOR_OUTLINE = {
    'name': "Test Climate Factor",
    'state': "OR",
    'region': "Corvallis",
    'user_estimate': 10.0,
}

INCOME_ITEM_OUTLINE = {
    'name': 'Test Income Item',
    'notes': "Test income item notes",

    'farm_unit': 'acres',
    'farm_unit_quantity': 10,
    'sale_unit': 'tons',
    'sale_unit_quantity': 100,
    'return_total': 100.00,
}
