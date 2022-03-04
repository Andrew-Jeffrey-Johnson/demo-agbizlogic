from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate, force_authenticate, APIClient
from budget.models import *
from budget.views import BudgetViewSet
from university_budget.models import *
from university_budget.views import *
from university_budget.serializers import *
from django.core import serializers
import copy



class UniversityBudgetAPITestCase(APITestCase):
    """ Test suite for the UniversityBudget model REST API.
    """

    def setUp(self):
        """ Set the request factory, viewset, users, and base URL.
        """

        self.factory = APIRequestFactory()

        self.user = User.objects.create(**USER)
        self.user_2 = User.objects.create(**USER_2)


    def test_create_budget(self):
        """ Test creating a Budget from university_budgets.
        """
        module = {'module' : 'profit'}
        university_budget = UniversityBudget.objects.create()

        viewset = UniversityBudgetViewSet.as_view({'post': "create_budget"})
        request = self.factory.post('',module, format='json')
        request.user = self.user
        response = viewset(request, pk = 1)

        self.assertEquals(university_budget.title, response.data['title'])
        # self.assertTrue("(copy of " + university_budget.title + ")" in response.data['notes'])
        self.assertEquals(201, response.status_code)


    def test_create_budget_assigns_source_and_module(self):
        """ Test creating a Budget sets 'source' equal to UniversityBudget id and 'module' equal to "university-budget".
        """

        university_budget = UniversityBudget.objects.create()

        module = {'module' : 'allocate'}
        viewset = UniversityBudgetViewSet.as_view({'post': "create_budget"})
        request = self.factory.post('', module, format='json')
        request.user = self.user
        response = viewset(request, pk = 1)

        budget = Budget.objects.get(id=response.data["id"])

        self.assertEquals(str(0), budget.source)
        self.assertEquals("allocate", budget.module)


    def test_create_budget_with_subitems(self):
        """ Test creates Budget with all the associated IncomeItem and CostItem copies.
        """

        university_budget = UniversityBudget.objects.create()
        incomeItem = UniversityIncomeItem.objects.create(parent_budget = university_budget, **INCOME_ITEM_OUTLINE)
        fixedCostItem = UniversityCostItem.objects.create(parent_budget = university_budget, **FIXED_COST_ITEM_OUTLINE)
        variableCostItem = UniversityCostItem.objects.create(parent_budget = university_budget, **VARIABLE_COST_ITEM_OUTLINE)
        generalCostItem = UniversityCostItem.objects.create(parent_budget = university_budget, **GENERAL_COST_ITEM_OUTLINE)

        module = {'module' : 'profit'}
        viewset = UniversityBudgetViewSet.as_view({'post': "create_budget"})
        request = self.factory.post('', module, format='json')
        request.user = self.user
        response = viewset(request, pk = university_budget.id)

        self.assertEquals(university_budget.title, response.data['title'])
        self.assertEquals(3, len(response.data['cost_items']))
        self.assertEquals(1, len(response.data['income_items']))
        self.assertEquals(201, response.status_code)


    def test_create_budget_does_not_exist(self):
        """ Test returns HTTP 404 and empty object if UniversityBudget object does not exist.
        """

        viewset = UniversityBudgetViewSet.as_view({'post': "create_budget"})
        request = self.factory.post('', format='json')
        request.user = self.user
        response = viewset(request, pk = 500)

        self.assertEquals(404, response.status_code)
        self.assertEquals({"error": "University Budget with given id does not exist"}, response.data)


    def test_list_university_budgets(self):
        """ Test list all objects.
        """

        university_budget_1 = UniversityBudget.objects.create()
        university_budget_2 = UniversityBudget.objects.create()
        university_budget_3 = UniversityBudget.objects.create()

        viewset = UniversityBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        request.user = self.user

        response = viewset(request)

        self.assertEquals(3, len(response.data))
        self.assertEquals(university_budget_1.title, response.data[0]['title'])
        self.assertEquals(university_budget_2.title, response.data[1]['title'])
        self.assertEquals(university_budget_3.title, response.data[2]['title'])


    def test_list_university_budgets_with_subitems(self):
        """ Test lists all objects with associated IncomeItem and CostItem objects.
        """

        university_budget_1 = UniversityBudget.objects.create()
        university_budget_2 = UniversityBudget.objects.create()
        university_budget_3 = UniversityBudget.objects.create()

        incomeItem = UniversityIncomeItem.objects.create(parent_budget = university_budget_1, **INCOME_ITEM_OUTLINE)
        fixedCostItem = UniversityCostItem.objects.create(parent_budget = university_budget_1, **FIXED_COST_ITEM_OUTLINE)
        variableCostItem = UniversityCostItem.objects.create(parent_budget = university_budget_1, **VARIABLE_COST_ITEM_OUTLINE)
        generalCostItem = UniversityCostItem.objects.create(parent_budget = university_budget_3, **GENERAL_COST_ITEM_OUTLINE)

        viewset = UniversityBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(3, len(response.data))
        self.assertEquals(2, len(response.data[0]['cost_items']))
        self.assertEquals(1, len(response.data[0]['income_items']))
        self.assertEquals(1, len(response.data[2]['cost_items']))


    def test_retrieve_university_budget(self):
        """ Test retrieve specific model instance.
        """

        university_budget = UniversityBudget.objects.create()
        viewset = UniversityBudgetViewSet.as_view({'get': "retrieve"})
        request = self.factory.get('', format='json')
        request.user = self.user
        response = viewset(request, pk = university_budget.id)

        self.assertEquals(university_budget.title, response.data['title'])
        self.assertEquals(university_budget.market, response.data['market'])


    def test_retrieve_university_budget_with_subitems(self):
        """ Test retrieve specific model instance includes associated IncomeItem and CostItem objects.
        """

        university_budget = UniversityBudget.objects.create()
        incomeItem = UniversityIncomeItem.objects.create(parent_budget = university_budget, **INCOME_ITEM_OUTLINE)
        fixedCostItem = UniversityCostItem.objects.create(parent_budget = university_budget, **FIXED_COST_ITEM_OUTLINE)
        variableCostItem = UniversityCostItem.objects.create(parent_budget = university_budget, **VARIABLE_COST_ITEM_OUTLINE)
        generalCostItem = UniversityCostItem.objects.create(parent_budget = university_budget, **GENERAL_COST_ITEM_OUTLINE)

        viewset = UniversityBudgetViewSet.as_view({'get': "retrieve"})
        request = self.factory.get('', format='json')
        request.user = self.user
        response = viewset(request, pk = university_budget.id)

        self.assertEquals(university_budget.title, response.data['title'])
        self.assertEquals(3, len(response.data['cost_items']))
        self.assertEquals(1, len(response.data['income_items']))
        self.assertEquals(200, response.status_code)


    def test_list_filter_model_fields(self):
        """ Test list returns objects with only the fields specified in the 'fields' query parameter.

            URL pattern: '/budgets/?fields={comma_seperated_list}'
        """

        number_of_objects = 10
        fields = "enterprise,state,region"

        for i in range(0, number_of_objects):
            university_budget = UniversityBudget.objects.create()

        viewset = UniversityBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=' + fields, format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(number_of_objects, len(response.data))
        for university_budget in response.data:
            self.assertEquals(3, len(university_budget.keys()))
            for key in university_budget.keys():
                self.assertEquals(True, key in fields)




# Dictionaries used to create test objects

USER = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}

USER_2 = {
    'username':'terrygillam',
    'first_name': 'Terry',
    'last_name': 'Gillam',
    'email':'terrygillam@holygrail.com'
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

    'time_unit': 'years',
    'time_value': 1,
    'farm_unit': 'acres',
    'farm_unit_quantity': 1,
}

BUDGET_OUTLINE_2 = {
    'title': 'Test Budget 2',
    'notes': "This is a test budget for Crop - Cereal Grains - Wheat",
    'enterprise': 'Crop',
    'descriptor1': 'Cereal Grains',
    'descriptor2': 'Wheat',
    'market': 'GMO',

    'state': 'OR',
    'region': 'Benton County',

    'time_unit': 'years',
    'time_value': 1,
    'farm_unit': "acres",
    'farm_unit_quantity': 1
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

VARIABLE_COST_ITEM_OUTLINE = {
    'name': "Test Variable Cost Item",
    'parent_category': "Labor hired",
    'category': 'harvest',
    'sub_category': 'labor',
    'cost_type': 'variable',

    'unit': 'hours',
    'unit_quantity': 10,
    'cost_total': 100.00,
}

FIXED_COST_ITEM_OUTLINE = {
    'name': "Test Fixed Cost Item",
    'parent_category': "Insurance (other than health)",
    'category': 'post_harvest',
    'sub_category': 'insurance',
    'cost_type': 'fixed',

    'unit': 'acres',
    'unit_quantity': 10,
    'cost_total': 100.00,
}

GENERAL_COST_ITEM_OUTLINE = {
    'name': "Test General Cost Item",
    'parent_category': "",
    'category': '',
    'sub_category': '',
    'cost_type': 'general',

    'unit': 'acres',
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

PLAN_OUTLINE = {
    'title': "Test Plan Budget",
    'notes': "Notes on test plan budget",

    'time_period_unit': "years",
    'time_period_value': 2,

    'discount_rate': 23.22,

    'beginning_investment': 10000.00,
    'ending_investment': 300000.00,

    'lease_type': "",
    'land_market_value': 20000.00,
    'annual_land_rate': 20.10,
    'required_roi': 200000.00,
    'investment_inflation': 18.29,
}

PLAN_BUDGET_OUTLINE = {
    'title': "Test Plan",

    'space_units': "acres",
    'total_space_available': 200,
    'total_space_used': 100,
}
