from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate, APIClient
from scenario.views import IncomeItemInflationRateViewSet
import copy
from scenario.models import Scenario, Plan, PlanBudget, IncomeItemInflationRate
from budget.models import Budget, IncomeItem
from django.contrib.auth.models import User



class IncomeItemInflationRateAPITestCase(APITestCase):
    """ Test suite for the IncomeItemInflationRate model REST resource.
    """

    def setUp(self):
        self.factory = APIRequestFactory()

        self.user = User.objects.create(**USER_OUTLINE)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        self.income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        self.scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)
        self.plan = Plan.objects.create(user=self.user, scenario=self.scenario, **PLAN_OUTLINE)
        self.plan_budget = PlanBudget.objects.create(user=self.user, plan=self.plan, budget=self.budget, **PLAN_BUDGET_OUTLINE)
        self.plan_budget_2 = PlanBudget.objects.create(user=self.user, plan=self.plan, budget=self.budget, **PLAN_BUDGET_OUTLINE)


    def test_list(self):
        """ Test lists all objects in database.
        """

        for i in range(0, 10):
            income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
            IncomeItemInflationRate.objects.create(
                plan_budget=self.plan_budget,
                income_item=income_item,
                **INCOME_ITEM_INFLATION_RATE_OUTLINE
            )

        viewset = IncomeItemInflationRateViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual(10, len(response.data))


    def test_create(self):
        """ Test save objects.
        """

        new_inflation_rate = copy.deepcopy(INCOME_ITEM_INFLATION_RATE_OUTLINE)
        new_inflation_rate.update({
            'income_item': self.income_item.pk,
            'plan_budget': self.plan_budget.pk,
        })

        viewset = IncomeItemInflationRateViewSet.as_view({'post': "create"})
        request = self.factory.post('', new_inflation_rate, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        items = IncomeItemInflationRate.objects.all()
        self.assertEqual(201, response.status_code)
        self.assertEqual(1, len(items))


    def test_retrieve(self):
        """ Test retrieve single object instance from database.
        """

        income_item_inflation_rate = IncomeItemInflationRate.objects.create(
            plan_budget=self.plan_budget,
            income_item=self.income_item,
            **INCOME_ITEM_INFLATION_RATE_OUTLINE
        )

        viewset = IncomeItemInflationRateViewSet.as_view({'get': "retrieve"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=income_item_inflation_rate.pk)

        self.assertEqual(200, response.status_code)
        self.assertEqual(INCOME_ITEM_INFLATION_RATE_OUTLINE['inflation_rate'], response.data['inflation_rate'])


    def test_update(self):
        """ Test update single instance in database.
        """

        income_item_inflation_rate = IncomeItemInflationRate.objects.create(
            plan_budget=self.plan_budget,
            income_item=self.income_item,
            **INCOME_ITEM_INFLATION_RATE_OUTLINE
        )

        new_inflation_rate = '20.00'
        updated_income_item_inflation_rate = copy.deepcopy(INCOME_ITEM_INFLATION_RATE_OUTLINE)
        updated_income_item_inflation_rate.update({
            'plan_budget': self.plan_budget.pk,
            'income_item': self.income_item.pk,
            'inflation_rate': new_inflation_rate
        })

        viewset = IncomeItemInflationRateViewSet.as_view({'put': "update"})
        request = self.factory.put('', updated_income_item_inflation_rate, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=income_item_inflation_rate.pk)

        self.assertEqual(200, response.status_code)
        self.assertEqual(new_inflation_rate, response.data['inflation_rate'])


    def test_destroy(self):
        """ Test instance is removed from database.
        """

        income_item_inflation_rate = IncomeItemInflationRate.objects.create(
            plan_budget=self.plan_budget,
            income_item=self.income_item,
            **INCOME_ITEM_INFLATION_RATE_OUTLINE
        )

        viewset = IncomeItemInflationRateViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('',  format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=income_item_inflation_rate.pk)

        self.assertEqual(204, response.status_code)
        self.assertEqual(0, len(IncomeItemInflationRate.objects.all()))

    def test_create_set(self):
        """ Test save objects.
        """

        new_inflation_rate = list()

        for i in range(0, 10):
            new_inflation_rate.append(copy.deepcopy(INCOME_ITEM_INFLATION_RATE_OUTLINE))
            new_inflation_rate[i].update({
                'income_item': self.income_item.pk,
                'plan_budget': self.plan_budget.pk,
            })

        viewset = IncomeItemInflationRateViewSet.as_view({'post': "create_set"})
        request = self.factory.post('', new_inflation_rate, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        items = IncomeItemInflationRate.objects.all()
        self.assertEqual(201, response.status_code)
        self.assertEqual(10, len(items))



# Outlines for creating test objects

USER_OUTLINE = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}

USER_OUTLINE_2 = {
    'username':'ryan_reynolds',
    'first_name': 'Ryan',
    'last_name': 'Reynolds',
    'email':'ryan_reynolds@deadpool.com'
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
    'return_total': 100.00,
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

FIXED_COST_ITEM_OUTLINE = {
    'name': "Test Fixed Cost Item",
    'parent_category': "Insurance (other than health)",
    'category': "post_harvest",
    'sub_category': "insurance",
    'cost_type': "fixed",
    'unit': "Acre",
    'unit_quantity': 10,
    'cost_total': 100.00,
    'cost_per_unit': 10.0,
    'cost_per_farm_unit': 100.0
}

GENERAL_COST_ITEM_OUTLINE = {
    'name': "Freight and Trucking",
    'notes': "",
    'parent_category': "",
    'category': "",
    'sub_category': "",
    'cost_type': "general",
    'unit': "Acre",
    'unit_quantity': 1,
    'cost_total': 25000,
    'cost_per_unit': 25000,
    'cost_per_farm_unit': 25000
}

SCENARIO_OUTLINE = {
    'title': "Test Scenario",
    'notes': "Some notes here",
}

PLAN_OUTLINE = {
    'title': "Test Plan",
    'notes': "Some plan notes here",

    'time_period_unit': "Year",
    'time_period_value': 1,

    'discount_rate': 19.0,

    'beginning_investment': 100.00,
    'ending_investment': 200.00,

    'lease_type': "Default",
    'land_market_value': 1000.00,
    'annual_land_rate': 32.0,
    'required_roi': 20.0,
    'investment_inflation': 10.0,
}

PLAN_BUDGET_OUTLINE = {
    'title': "Test Plan Budget",
    'position': 0,

    'space_units': "Acre",
    'total_space_available': 250,
    'total_space_used': 150,
}

INCOME_ITEM_INFLATION_RATE_OUTLINE = {
    'inflation_rate': '10.00',
}

COST_ITEM_INFLATION_RATE_OUTLINE = {
    'inflation_rate': '15.00',
}
