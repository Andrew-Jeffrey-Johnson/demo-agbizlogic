from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from budget.models import Budget, IncomeItem
from budget.views import IncomeItemViewSet
from budget.serializers import IncomeItemSerializer
from django.contrib.auth.models import User
import copy


class IncomeItemAPITestCase(APITestCase):
    """ Test suite for the IncomeItemViewSet and IncomeItemSerializer.
    """

    def setUp(self):
        """ Set the request factory, viewset, user, and parent budget.
        """

        self.factory = APIRequestFactory()
        self.user = User.objects.create(**USER)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)


    def test_list(self):
        """ Test list action.
        """

        IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)

        viewset = IncomeItemViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(1, len(response.data))


    def test_create(self):
        """ Test create action.
        """

        new_income = copy.deepcopy(INCOME_ITEM_OUTLINE)
        new_income.update({'parent_budget': self.budget.pk})

        viewset = IncomeItemViewSet.as_view({'post': "create"})
        request = self.factory.post('', new_income, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEquals(201, response.status_code)
        self.assertEquals(INCOME_ITEM_OUTLINE['name'], response.data['name'])


    def test_create_blank(self):
        """ Test that API returns errors when given no data for object creation.
        """

        errors = {
            'parent_budget': [u'This field is required.'],
            'name': [u'This field is required.'],
            'return_total': [u'This field is required.'],
        }

        viewset = IncomeItemViewSet.as_view({'post': "create"})
        request = self.factory.post('', format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEquals(400, response.status_code)
        self.assertEquals(errors, response.data)


    def test_create_invalid(self):
        """ Test that API returns errors when given invalid data for object creation.
        """

        errors = {
            'parent_budget': [u'Incorrect type. Expected pk value, received unicode.'],

            'farm_unit': [u'"12" is not a valid choice.'],
            'farm_unit_quantity': [u'A valid number is required.'],
            'sale_unit': [u'"13" is not a valid choice.'],
            'sale_unit_quantity': [u'A valid number is required.'],
            'return_total': [u'A valid number is required.'],
        }

        bad_income = {
            'parent_budget': "my budget",
            'name': "Can't make this invalid",

            'farm_unit': 12,
            'farm_unit_quantity': "eleventy-three",
            'sale_unit': 13,
            'sale_unit_quantity': "definitely not 3",
            'return_total': "Forty-something",
        }

        viewset = IncomeItemViewSet.as_view({'post': "create"})
        request = self.factory.post('', bad_income, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEquals(400, response.status_code)
        self.assertEquals(errors, response.data)


    def test_update(self):
        """ Test update action.
        """

        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)

        income_item_updated = copy.deepcopy(INCOME_ITEM_OUTLINE)
        income_item_updated.update({'parent_budget': self.budget.pk, 'name': "New Name"})

        viewset = IncomeItemViewSet.as_view({'put': "update"})
        request = self.factory.put('', income_item_updated)
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=income_item.pk)

        self.assertEquals(200, response.status_code)
        self.assertEquals(income_item_updated['name'], response.data['name'])


    def test_destroy(self):
        """ Test destroy action.
        """

        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)

        viewset = IncomeItemViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=income_item.pk)

        self.assertEquals(204, response.status_code)



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

    'time_unit': 'Year',
    'time_value': 1,
    'farm_unit': 'Acre',
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

    'time_unit': 'Year',
    'time_value': 1,
    'farm_unit': "Acre",
    'farm_unit_quantity': 1
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
