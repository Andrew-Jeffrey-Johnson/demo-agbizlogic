from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from budget.models import Budget
from allocate.models import BusinessData, EnterpriseData
from registration.models import ScheduleF
from django.contrib.auth.models import User
from common.views import NextStepView


class NextStepAPITestCase(APITestCase):
    """ Test suite for the /next_step/ REST API endpoint.
    """

    def setUp(self):
        self.user = User.objects.create(**USER)
        self.factory = APIRequestFactory()


    def test_returns_error_if_username_not_in_query_parameters(self):
        """ Test that if there is no 'username' in query parameters, returns error.
        """

        view = NextStepView.as_view()
        request = self.factory.get('', format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(400, response.status_code)
        self.assertEqual({'error': "Username required in query parameter"}, response.data)


    def test_returns_not_found_if_username_does_not_exist(self):
        """ Test that if given username does not match a user, returns error.
        """

        view = NextStepView.as_view()
        request = self.factory.get('?username=banana', format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(404, response.status_code)
        self.assertEqual({'error': "Username does not match any user"}, response.data)


    def test_schedule_f(self):
        """ Test that next_step returns 'schedule-f' if there are no
            scheduleF objects
        """

        view = NextStepView.as_view()
        request = self.factory.get('?username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(response.data, {'next_step': "schedule-f"})


    def test_business_select(self):
        """ Test that next_step returns 'business-select' if there are no
            BusinessData objects but at least 1 ScheduleF object
        """

        ScheduleF.objects.create(user = self.user, **SCHEDULE_F_OUTLINE)

        view = NextStepView.as_view()
        request = self.factory.get('?username=' + self.user.username , format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(response.data, {'next_step': "business-select"})


    def test_business_allocate(self):
        """ Test that next_step returns 'business-allocate' if at least one BusinessData object have 'completed' field
            set to false.
        """

        ScheduleF.objects.create(user = self.user, **SCHEDULE_F_OUTLINE)
        BusinessData.objects.create(user = self.user, completed = True)
        BusinessData.objects.create(user = self.user, completed = False)

        view = NextStepView.as_view()
        request = self.factory.get('?username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(response.data, {'next_step': "business-allocate"})


    def test_enterprise_select(self):
        """ Test that next_step returns 'enterprise-select' if all BusinessData objects have 'completed' field set to
            true.
        """

        ScheduleF.objects.create(user = self.user, **SCHEDULE_F_OUTLINE)
        setGoldStandardFields(BusinessData(user = self.user, completed=True, **BUSINESS_DATA)).save()

        view = NextStepView.as_view()
        request = self.factory.get('?username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(response.data, {'next_step': "enterprise-select"})


    def test_enterprise_allocate(self):
        """ Test that next_step returns 'enterprise-allocate' if sum of EnterpriseData income or expenses does not equal
            its parent BusinessData totals.
        """

        ScheduleF.objects.create(user = self.user, **SCHEDULE_F_OUTLINE)
        setGoldStandardFields(BusinessData(user = self.user, **BUSINESS_DATA)).save()
        enterprise = EnterpriseData(
            user = self.user,
            enterprise = "Livestock",
            category_1 = "Poultry",
            category_2 = "Ostrich")
        setGoldStandardFields(enterprise, 10).save()

        view = NextStepView.as_view()
        request = self.factory.get('?username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(response.data, {'next_step': "enterprise-allocate"})


    def test_budget_creation(self):
        """ Test that next_step returns 'budget-creation' if sum of EnterpriseData income or expenses equals
            its parent BusinessData totals.
        """

        ScheduleF.objects.create(user = self.user, **SCHEDULE_F_OUTLINE)
        BusinessData.objects.create(user = self.user, **BUSINESS_DATA)
        enterprise = EnterpriseData.objects.create(user = self.user, **ENTERPRISE_DATA)

        view = NextStepView.as_view()
        request = self.factory.get('?username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(response.data, {'next_step': "budget-creation"})


    def test_agbiz(self):
        """ Test that next_step returns 'agbiz' if there are Budget objects associated with the request user.
        """

        Budget.objects.create(user = self.user, **BUDGET_OUTLINE)

        view = NextStepView.as_view()
        request = self.factory.get('?username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(response.data, {'next_step': "agbiz"})


# Helper functions

def setGoldStandardFields(allocate_data, difference = 0):
    """ Initializes all of the Gold Standard fields of a BusinessData or EnterpriseData object. Second argument specifies
        how much should be subtracted from each GOLD_STANDARD_DATA field.
    """

    for field in allocate_data._meta.get_fields():
        if field.name in GOLD_STANDARD_DATA and GOLD_STANDARD_DATA[field.name] > difference:
            setattr(allocate_data, field.name, GOLD_STANDARD_DATA[field.name] - difference)

    return allocate_data



# Outlines for creating testing objects

USER = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}

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


GOLD_STANDARD_DATA = {
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
