from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate, APIClient
from scenario.views import ScenarioViewSet
import copy
from scenario.models import Scenario, Plan
from django.contrib.auth.models import User



class ScenarioAPITestCase(APITestCase):
    """ Test suite for the Scenario model REST resource.
    """

    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create(**USER_OUTLINE)
        self.user2 = User.objects.create(**USER_OUTLINE_2)


    def test_list(self):
        """ Test list all objects in database.
        """

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "list"})
        request = self.factory.get('', format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual(number_of_objects, len(response.data))


    def test_list_with_user_parameter(self):
        """ Test listing only objects relating to a single user.
        """

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user2, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(number_of_objects, len(response.data))


    def test_list_with_user_parameter_does_not_exist(self):
        """ Test suppling nonexistant username returns empty
            queryset.
        """

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user2, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=bob', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(0, len(response.data))


    def test_list_with_invalid_query_parameter_returns_empty_list(self):
        """ Test that supplying an invalid query parameter returns an empty list.
        """

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "list"})
        request = self.factory.get('?shirt=banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(0, len(response.data))
        self.assertEquals(200, response.status_code)


    def test_list_field_parameter_returns_only_requested_fields(self):
        """ Test that requesting a subset of the fields via the fields
            query param returns those fields and only those fields.
        """

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertNotContains(response, "\"notes\"")


        self.assertEquals(200, response.status_code)
        self.assertEqual(number_of_objects, len(response.data))


    def test_list_field_parameter_returns_ignores_invalid_fields(self):
        """ Test that requesting a subset of the fields via the fields
            query param returns those fields and only those fields
            while ignoring fields not in the model.
        """

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title,banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertNotContains(response, "\"notes\"")
        self.assertNotContains(response, "\"banana\"")

        self.assertEquals(200, response.status_code)
        self.assertEqual(number_of_objects, len(response.data))


    def test_list_no_field_parameter_returns_complete_object(self):
        """ Test that request with no fields parameter returns a complete object.
        """

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"notes\"")

        self.assertEquals(200, response.status_code)
        self.assertEqual(number_of_objects, len(response.data))


    def test_list_only_invalid_field_parameter_returns_complete_object(self):
        """ Test that request with only invalid fields specified returns a complete object.
        """

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"notes\"")

        self.assertEquals(200, response.status_code)
        self.assertEqual(number_of_objects, len(response.data))


    def test_list_field_parameter_returns_with_username(self):
        """ Test that requesting a subset of the fields via the fields
            query param returns those fields and only those fields
            works correctly when also filtered by username.
        """

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        number_of_objects = 100

        for i in range(0, number_of_objects):
            Scenario.objects.create(user = self.user2, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title&username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertNotContains(response, "\"notes\"")

        self.assertEquals(200, response.status_code)
        self.assertEqual(number_of_objects, len(response.data))


    def test_create(self):
        """ Test save object in database.
        """

        new_scenario = copy.deepcopy(SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'post': "create"})
        request = self.factory.post('', new_scenario, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(201, response.status_code)
        self.assertEqual(new_scenario['title'], response.data['title'])
        self.assertEqual(1, len(Scenario.objects.all()))


    def test_retrieve(self):
        """ Test retrieve specific instance from database.
        """

        scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "retrieve"})
        request = self.factory.get('', format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=scenario.pk)

        self.assertEqual(200, response.status_code)
        self.assertEqual(scenario.title, response.data['title'])


    def test_retrieve_gets_related_plans(self):
        """ Test retrieving a specific instance also retrieves the related plans by default.
        """

        scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)
        for i in range(0, 3):
            Plan.objects.create(user=self.user, scenario=scenario, **PLAN_OUTLINE)

        viewset = ScenarioViewSet.as_view({'get': "retrieve"})
        request = self.factory.get('', format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=scenario.pk)

        self.assertEqual(200, response.status_code)
        self.assertEqual(len(Plan.objects.filter(scenario=scenario)), len(response.data['plans']))


    def test_update(self):
        """ Test update specific instance.
        """

        scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)

        new_title = "Updated Scenario Title"
        updated_scenario = copy.deepcopy(SCENARIO_OUTLINE)
        updated_scenario.update({'title': new_title})

        viewset = ScenarioViewSet.as_view({'put': "update"})
        request = self.factory.put('', updated_scenario, format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=scenario.pk)

        self.assertEqual(200, response.status_code)
        self.assertEqual(new_title, response.data['title'])


    def test_destroy(self):
        """ Test remove instance from database.
        """

        scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)

        viewset = ScenarioViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('', format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=scenario.pk)

        self.assertEqual(204, response.status_code)
        self.assertEqual(0, len(Scenario.objects.all()))


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

COST_ITEM_OUTLINE = {
    'name': "Test Cost Item",
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
    'category': "post_harvest",
    'sub_category': "insurance",
    'cost_type': "fixed",
    'unit': "acres",
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
    'unit': "acres",
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

    'time_period_unit': "years",
    'time_period_value': 1,

    'discount_rate': 19.0,

    'beginning_investment': 100.00,
    'ending_investment': 200.00,
    'use_investment_values': True,

    'lease_type': "Default",
    'land_market_value': 1000.00,
    'annual_land_rate': 32.0,
    'required_roi': 20.0,
    'investment_inflation': 10.0,
}

PLAN_BUDGET_OUTLINE = {
    'title': "Test Plan Budget",
    'position': 0,

    'space_units': "acres",
    'total_space_available': 250,
    'total_space_used': 150,
}

INCOME_ITEM_INFLATION_RATE_OUTLINE = {
    'inflation_rate': '10.00',
}

COST_ITEM_INFLATION_RATE_OUTLINE = {
    'inflation_rate': '15.00',
}
