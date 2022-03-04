from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from budget.models import Budget, CostItem
from budget.views import VariableCostItemViewSet, FixedCostItemViewSet, GeneralCostItemViewSet
from budget.serializers import CostItemSerializer
from django.contrib.auth.models import User
import copy



class VariableCostItemAPITestCase(APITestCase):
    """ Test suite for the VariableCostItemViewSet and CostItemSerializer.
    """

    def setUp(self):
        """ Set the request factory, viewset, user, and parent budget.
        """

        self.factory = APIRequestFactory()
        self.user = User.objects.create(**USER)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)


    def test_list(self):
        """ Test list action only returns CostItem objects with cost_type = 'variable'.
        """

        CostItem.objects.create(parent_budget=self.budget, **VARIABLE_COST_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)

        viewset = VariableCostItemViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(1, len(response.data))


    def test_create(self):
        """ Test create action.
        """

        new_variable_cost = copy.deepcopy(VARIABLE_COST_ITEM_OUTLINE)
        new_variable_cost.update({'parent_budget': self.budget.pk})

        viewset = VariableCostItemViewSet.as_view({'post': "create"})
        request = self.factory.post('', new_variable_cost, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEquals(201, response.status_code)
        self.assertEquals(VARIABLE_COST_ITEM_OUTLINE['name'], response.data['name'])


    def test_update(self):
        """ Test update action.
        """

        cost_item = CostItem.objects.create(parent_budget=self.budget, **VARIABLE_COST_ITEM_OUTLINE)

        cost_item_updated = copy.deepcopy(VARIABLE_COST_ITEM_OUTLINE)
        cost_item_updated.update({'parent_budget': self.budget.pk, 'name': "New Name"})

        viewset = VariableCostItemViewSet.as_view({'put': "update"})
        request = self.factory.put('', cost_item_updated)
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=cost_item.pk)

        self.assertEquals(200, response.status_code)
        self.assertEquals(cost_item_updated['name'], response.data['name'])


    def test_destroy(self):
        """ Test destroy action.
        """

        cost_item = CostItem.objects.create(parent_budget=self.budget, **VARIABLE_COST_ITEM_OUTLINE)

        viewset = VariableCostItemViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=cost_item.pk)

        self.assertEquals(204, response.status_code)



    class FixedCostItemAPITestCase(APITestCase):
        """ Test suite for the FixedCostItemViewSet and CostItemSerializer.
        """

        def setUp(self):
            """ Set the request factory, viewset, user, and parent budget.
            """

            self.factory = APIRequestFactory()
            self.user = User.objects.create(**USER)
            self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)


        def test_list(self):
            """ Test list action only returns CostItem objects with cost_type = 'fixed'.
            """

            CostItem.objects.create(parent_budget=self.budget, **VARIABLE_COST_ITEM_OUTLINE)
            CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)

            viewset = FixedCostItemViewSet.as_view({'get': "list"})
            request = self.factory.get('', format='json')
            force_authenticate(request, user=self.user)
            response = viewset(request)

            self.assertEquals(1, len(response.data))


        def test_create(self):
            """ Test create action.
            """

            new_fixed_cost = copy.deepcopy(FIXED_COST_ITEM_OUTLINE)
            new_fixed_cost.update({'parent_budget': self.budget.pk})

            viewset = FixedCostItemViewSet.as_view({'post': "create"})
            request = self.factory.post('', new_fixed_cost, format='json')
            force_authenticate(request, user=self.user)
            request.user = self.user
            response = viewset(request)

            self.assertEquals(201, response.status_code)
            self.assertEquals(FIXED_COST_ITEM_OUTLINE['name'], response.data['name'])


        def test_update(self):
            """ Test update action.
            """

            cost_item = CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)
            cost_item_updated = copy.deepcopy(FIXED_COST_ITEM_OUTLINE)
            cost_item_updated.update({'parent_budget': self.budget.pk, 'name': "New Name"})

            viewset = FixedCostItemViewSet.as_view({'put': "update"})
            request = self.factory.put('', cost_item_updated)
            force_authenticate(request, user=self.user)
            response = viewset(request, pk=cost_item.pk)

            self.assertEquals(200, response.status_code)
            self.assertEquals(cost_item_updated['name'], response.data['name'])


        def test_destroy(self):
            """ Test destroy action.
            """

            cost_item = CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)

            viewset = FixedCostItemViewSet.as_view({'delete': "destroy"})
            request = self.factory.delete('', format='json')
            force_authenticate(request, user=self.user)
            response = viewset(request, pk=cost_item.pk)

            self.assertEquals(204, response.status_code)



    class GeneralCostItemTestCase(APITestCase):
        """ Test suite for the GeneralCostItemViewSet and CostItemSerializer.
        """

        def setUp(self):
            """ Set the request factory, viewset, user, and parent budget.
            """

            self.factory = APIRequestFactory()
            self.user = User.objects.create(**USER)
            self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)


        def test_list(self):
            """ Test list action only returns CostItem objects with cost_type = 'general'.
            """

            CostItem.objects.create(parent_budget=self.budget, **VARIABLE_COST_ITEM_OUTLINE)
            CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)

            viewset = GeneralCostItemViewSet.as_view({'get': "list"})
            request = self.factory.get('', format='json')
            force_authenticate(request, user=self.user)
            response = viewset(request)

            self.assertEquals(1, len(response.data))


        def test_create(self):
            """ Test create action.
            """

            new_general_cost = copy.deepcopy(GENERAL_COST_ITEM_OUTLINE)
            new_general_cost.update({'parent_budget': self.budget.pk})

            viewset = GeneralCostItemViewSet.as_view({'post': "create"})
            request = self.factory.post('', new_general_cost, format='json')
            force_authenticate(request, user=self.user)
            request.user = self.user
            response = viewset(request)

            self.assertEquals(201, response.status_code)
            self.assertEquals(GENERAL_COST_ITEM_OUTLINE['name'], response.data['name'])


        def test_update(self):
            """ Test update action.
            """

            cost_item = CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)
            cost_item_updated = copy.deepcopy(GENERAL_COST_ITEM_OUTLINE)
            cost_item_updated.update({'parent_budget': self.budget.pk, 'name': "New Name"})

            viewset = GeneralCostItemViewSet.as_view({'put': "update"})
            request = self.factory.put('', cost_item_updated)
            force_authenticate(request, user=self.user)
            response = viewset(request, pk=cost_item.pk)

            self.assertEquals(200, response.status_code)
            self.assertEquals(cost_item_updated['name'], response.data['name'])


        def test_destroy(self):
            """ Test destroy action.
            """

            cost_item = CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)

            viewset = GeneralCostItemViewSet.as_view({'delete': "destroy"})
            request = self.factory.delete('', format='json')
            force_authenticate(request, user=self.user)
            response = viewset(request, pk=cost_item.pk)

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

VARIABLE_COST_ITEM_OUTLINE = {
    'name': "Test Variable Cost Item",
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
    'category': 'post_harvest',
    'sub_category': 'insurance',
    'cost_type': 'fixed',

    'unit': 'Acre',
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
