from django.urls import reverse
from django.forms import modelformset_factory
from django.forms.models import BaseModelFormSet
from budget.views import *
from allocate.models import *
from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User, AnonymousUser


class BudgetHomeViewTestCase(TestCase):
    """ Test suite for BudgetInitialView.
    """

    def setUp(self):
        """ Set the request factory and user.
        """

        self.factory = RequestFactory()
        self.user = User.objects.create(**USER)
        self.budget_home_view = BudgetHomeView.as_view()


    def test_request_denies_anonymous(self):
        """ Test that users who are not logged in are redirected.
        """

        # Create an EnterpriseData object to avoid redirection
        BusinessData.objects.create(user=self.user, **BUSINESS_OUTLINE_1)
        enterprise = EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)

        # GET
        request = self.factory.get(reverse('budget_home'))
        request.user = AnonymousUser()
        response = self.budget_home_view(request)

        self.assertEquals(302, response.status_code)

        # POST
        request = self.factory.post(reverse('budget_home'))
        request.user = AnonymousUser()
        response = self.budget_home_view(request)

        self.assertEquals(302, response.status_code)


    def test_request_accepts_user(self):
        """ Test that logged in users are allowed.
        """

        # Create an EnterpriseData object to avoid redirection
        BusinessData.objects.create(user=self.user, **BUSINESS_OUTLINE_1)
        enterprise = EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)

        request = self.factory.get(reverse('budget_home'))
        request.user = self.user
        response = self.budget_home_view(request)

        self.assertEquals(200, response.status_code)


    def test_POST_method_not_allowed(self):
        """ Test POST method returns HTTP 405 response.
        """

        # Create an EnterpriseData object to avoid redirection
        BusinessData.objects.create(user=self.user, **BUSINESS_OUTLINE_1)
        enterprise = EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)

        request = self.factory.post(reverse('budget_home'))
        request.user = self.user
        response = self.budget_home_view(request)

        self.assertEquals(405, response.status_code)



# Dictionaries used to create test objects

USER = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}

BUSINESS_OUTLINE_1 = {
    'business_type': "Crop",

    'income_sales': 200,

    'expenses_goods': 100,
    'expenses_car': 100,
}

ENTERPRISE_OUTLINE_1 = {
    'enterprise': "Crop",
    'category_1': "Cereal Grains",
    'category_2': "Wheat",
    'market': "GMO",

    'income_sales': 100,

    'expenses_goods': 50,
    'expenses_car': 50,
}

ENTERPRISE_OUTLINE_2 = {
    'enterprise': "Crop",
    'category_1': "Cereal Grains",
    'category_2': "Barley",
    'market': "Conventional",

    'income_sales': 100,

    'expenses_goods': 50,
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
    'notes': "Test cost item notes",
    'category': 'harvest',
    'sub_category': 'labor',
    'cost_type': 'variable',

    'unit': 'hours',
    'unit_quantity': 10,
    'price_per_unit': 2.00
}
