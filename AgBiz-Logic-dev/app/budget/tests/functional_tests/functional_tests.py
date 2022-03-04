from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from budget.models import *
from registration.models import Business, ScheduleF
from allocate.models import *
from django.urls import reverse
import json, copy



class BudgetAPIFunctionalTestCase(APITestCase):
    """ Functional test suite for the Budget model RESTful API using the client to include routes and viewsets.
    """

    def setUp(self):
        """ Set the user, and previous allocation data.
        """

        self.user = User.objects.create(**USER)
        self.client.force_authenticate(user=self.user)

        self.business = Business.objects.create(user=self.user, **BUSINESS_OUTLINE)
        self.schedule_f = ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)


    def test_list_filter_by_module_valid(self):
        """ Test filtering of objects using 'module' URL query parameter returns an array of objects with 'module'
            field value matching the parameter.
        """

        num = 10
        for i in range(0, num):
            Budget.objects.create(user=self.user, module="climate", **BUDGET_OUTLINE)
            Budget.objects.create(user=self.user, module="plan", **BUDGET_OUTLINE)
            Budget.objects.create(user=self.user, module="profit", **BUDGET_OUTLINE)
            Budget.objects.create(user=self.user, module="allocate", **BUDGET_OUTLINE)

        response = self.client.get(reverse('budgets-list'), {'username': self.user.username, 'module': "climate"}, format="json")

        self.assertEquals(200, response.status_code)
        self.assertEquals(num, len(response.data))


    def test_list_filter_by_module_not_found(self):
        """ Test filtering of objects using 'module' URL query parameter returns empty array of objects when 'module'
            field does not match any Budgets.
        """

        num = 10
        for i in range(0, num):
            Budget.objects.create(user=self.user, module="climate", **BUDGET_OUTLINE)
            Budget.objects.create(user=self.user, module="plan", **BUDGET_OUTLINE)
            Budget.objects.create(user=self.user, module="profit", **BUDGET_OUTLINE)
            Budget.objects.create(user=self.user, module="allocate", **BUDGET_OUTLINE)

        response = self.client.get(reverse('budgets-list'), {'username': self.user.username, 'module': "lease"}, format="json")

        self.assertEquals(200, response.status_code)
        self.assertEquals(0, len(response.data))


    def test_retrieve_budget(self):
        """ Test Budget object retrieval.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        response = self.client.get(reverse('budgets-detail', kwargs={'id': budget.pk}), format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals(budget.title, response.data['title'])


    def test_destroy_budget(self):
        """ Test Budget object destruction.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        response = self.client.delete(reverse('budgets-detail', kwargs={'id': budget.pk}))

        self.assertEquals(0, len(Budget.objects.all()))
        self.assertEquals(204, response.status_code)


    def test_create_budget(self):
        """ Test Budget object creation.
        """

        budget = copy.deepcopy(BUDGET_OUTLINE)

        response = self.client.post(reverse('budgets-list'), budget, format='json')

        self.assertEquals(201, response.status_code)
        self.assertEquals(budget['title'], response.data['title'])


    def test_update_budget(self):
        """ Test Budget object updating.

            Needs the entire object to be passed to viewset in order to validate, all fields including the updated ones.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        budget_updated = copy.deepcopy(BUDGET_OUTLINE)
        budget_updated.update({'title': "Updated Title"})

        response = self.client.put(reverse('budgets-detail', kwargs={'id': budget.pk}), budget_updated, format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals(budget_updated['title'], response.data['title'])


    def test_partial_update(self):
        """ Discovered that only the 'title' and 'state' fields are required when sending a PUT request to update.

            Need to investigate further to see why only these fields are required (likely due to 'default' attribute being set), demonstrated below is the functionality.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        response = self.client.put(reverse('budgets-detail', kwargs={'id': budget.pk}), {'title': "updated_budget", 'state': "WA"}, format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals("WA", response.data['state'])
        self.assertEquals(BUDGET_OUTLINE['descriptor2'], response.data['descriptor2'])


    def test_update_budget_blank(self):
        """ Test Budget object update with required fields blank returns errors.
        """

        errors = {
            'title': [u'This field is required.'],
            'state': [u'This field is required.'],
        }

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        response = self.client.put(reverse('budgets-detail', kwargs={'id': budget.pk}), format='json')

        self.assertEquals(400, response.status_code)
        self.assertEquals(errors, response.data)


    def test_generate_budget_with_allocation_data(self):
        """ Test the '/generate' API endpoint creates and returns new budgets when the user has allocation data.
        """

        BusinessData.objects.create(user=self.user, )
        enterprise_data = EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA_2)

        response = self.client.post(reverse('budgets-generate', kwargs={}), format="json")

        self.assertEquals(201, response.status_code)
        self.assertEquals(enterprise_data.category_1 + " - " + enterprise_data.category_2 + " - " + enterprise_data.category_3 + " - " +
            enterprise_data.category_4 + " - " + enterprise_data.category_5 + " - " + enterprise_data.category_6, response.data[0]['title'])
        self.assertEquals("Whole Farm Budget", response.data[1]['title'])
        self.assertEquals(2, len(response.data))


    def test_generate_budget_without_allocation_data(self):
        """ Test the '/generate' API endpoint returns empty array if user does not have allocation data to create any
            budgets with.
        """

        response = self.client.post(reverse('budgets-generate', kwargs={}), format="json")

        self.assertEquals(200, response.status_code)
        self.assertEquals([], response.data)





# Outlines for creating test objects

BUSINESS_DATA = {
    "business_type": "Livestock",
    "income_sales": 1000000,
    "income_cooperative": 0,
    "income_agriculture_programs": 0,
    "income_insurance": 0,
    "income_custom_hire": 500000,
    "income_other": 150000,
    "expenses_goods": 900000,
    "expenses_car": 50000,
    "expenses_chemicals": 10000,
    "expenses_conservation": 10000,
    "expenses_custom_hire": 0,
    "expenses_depreciation": 10000,
    "expenses_employee_benefit": 15000,
    "expenses_feed": 50000,
    "expenses_fertilizers": 0,
    "expenses_freight": 25000,
    "expenses_gasoline": 25000,
    "expenses_insurance": 10000,
    "expenses_interest_mortgages": 0,
    "expenses_labor": 200000,
    "expenses_pension": 100000,
    "expenses_machinery_rent": 0,
    "expenses_land_rent": 0,
    "expenses_repairs": 25000,
    "expenses_seeds": 5000,
    "expenses_storage": 10000,
    "expenses_supplies": 10000,
    "expenses_property_taxes": 30000,
    "expenses_utilities": 10000,
    "expenses_veterinary": 50000,
    "expenses_other_1": 0,
    "expenses_other_2": 0,
    "expenses_other_3": 0,
    "expenses_other_4": 0,
    "expenses_other_5": 0,
    "expenses_other_6": 0
}

ENTERPRISE_DATA = {
    "enterprise": "Livestock",
    "category_1": "Poultry",
    "category_2": "Ostrich",
    "category_3": "",
    "category_4": "",
    "category_5": "",
    "category_6": "",
    "market": "Natural",
    "income_sales": 1000000,
    "income_cooperative": 0,
    "income_agriculture_programs": 0,
    "income_insurance": 0,
    "income_custom_hire": 500000,
    "income_other": 150000,
    "expenses_goods": 900000,
    "expenses_car": 50000,
    "expenses_chemicals": 10000,
    "expenses_conservation": 10000,
    "expenses_custom_hire": 0,
    "expenses_depreciation": 10000,
    "expenses_employee_benefit": 15000,
    "expenses_feed": 50000,
    "expenses_fertilizers": 0,
    "expenses_freight": 25000,
    "expenses_gasoline": 25000,
    "expenses_insurance": 10000,
    "expenses_interest_mortgages": 0,
    "expenses_labor": 200000,
    "expenses_pension": 100000,
    "expenses_machinery_rent": 0,
    "expenses_land_rent": 0,
    "expenses_repairs": 25000,
    "expenses_seeds": 5000,
    "expenses_storage": 10000,
    "expenses_supplies": 10000,
    "expenses_property_taxes": 30000,
    "expenses_utilities": 10000,
    "expenses_veterinary": 50000,
    "expenses_other_1": 0,
    "expenses_other_2": 0,
    "expenses_other_3": 0,
    "expenses_other_4": 0,
    "expenses_other_5": 0,
    "expenses_other_6": 0
}

ENTERPRISE_DATA_2 = {
    "enterprise": "Television",
    "category_1": "British",
    "category_2": "Comedy",
    "category_3": "Montey Python",
    "category_4": "Skit",
    "category_5": "Vikings",
    "category_6": "Spam Song",
    "market": "Natural",
    "income_sales": 1000000,
    "income_cooperative": 0,
    "income_agriculture_programs": 0,
    "income_insurance": 0,
    "income_custom_hire": 500000,
    "income_other": 150000,
    "expenses_goods": 900000,
    "expenses_car": 50000,
    "expenses_chemicals": 10000,
    "expenses_conservation": 10000,
    "expenses_custom_hire": 0,
    "expenses_depreciation": 10000,
    "expenses_employee_benefit": 15000,
    "expenses_feed": 50000,
    "expenses_fertilizers": 0,
    "expenses_freight": 25000,
    "expenses_gasoline": 25000,
    "expenses_insurance": 10000,
    "expenses_interest_mortgages": 0,
    "expenses_labor": 200000,
    "expenses_pension": 100000,
    "expenses_machinery_rent": 0,
    "expenses_land_rent": 0,
    "expenses_repairs": 25000,
    "expenses_seeds": 5000,
    "expenses_storage": 10000,
    "expenses_supplies": 10000,
    "expenses_property_taxes": 30000,
    "expenses_utilities": 10000,
    "expenses_veterinary": 50000,
    "expenses_other_1": 0,
    "expenses_other_2": 0,
    "expenses_other_3": 0,
    "expenses_other_4": 0,
    "expenses_other_5": 0,
    "expenses_other_6": 0
}

USER = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}

ENTERPRISE_OUTLINE_1 = {
    'enterprise': "Crop",
    'category_1': "Cereal Grains",
    'category_2': "Wheat",
    'market': "GMO"
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
BUSINESS_OUTLINE = {
    'name': "Flying Circus",
    'address1': "Somewhere in England",
    'address2': "Somewhere in...",
    'zipcode': "80085",
    'city': "Don't know",
    'state': "Louisiana",
    'industry': "Comedy",
    'primary_business': "Making funnies",
    'secondary_business': "World Domination",
}
SCHEDULE_F_OUTLINE = {
    'line_1_a': "350,000",
    'line_1_b': "50,000",
    'line_1_c': "300,000",
    'line_2': "3,500,000",
    'line_3_a': "3,000",
    'line_3_b': "1,500",
    'line_4_a': "60,000",
    'line_4_b': "60,000",
    'line_5_a': "0",
    'line_5_b': "0",
    'line_5_c': "0",
    'line_6_a': "200,000",
    'line_6_b': "200,000",
    'line_6_d': "0",
    'line_7': "150,000",
    'line_8': "12,500",
    'gross_income': "4,224,000",
    'line_10': "10,000",
    'line_11': "160,000",
    'line_12': "25,000",
    'line_13': "20,000",
    'line_14': "250,000",
    'line_15': "300,000",
    'line_16': "13,000",
    'line_17': "75,000",
    'line_18': "28,000",
    'line_19': "100,000",
    'line_20': "50,000",
    'line_21_a': "300,000",
    'line_21_b': "50,000",
    'line_22': "200,000",
    'line_23': "15,000",
    'line_24_a': "52,000",
    'line_24_b': "150,000",
    'line_25': "30,000",
    'line_26': "60,000",
    'line_27': "25,000",
    'line_28': "10,000",
    'line_29': "9,000",
    'line_30': "40,000",
    'line_31': "40,000",
    'line_32_a': "10,000",
    'line_32_b': "50,000",
    'total_expenses': "2,072,000",
    'net_profit': "2,152,000",
    'other_expense_1': "miscellaneous",
    'other_expense_2': "Other miscellaneous",
}
