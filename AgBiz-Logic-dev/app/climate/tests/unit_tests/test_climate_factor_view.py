from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from climate.views import ClimateFactorViewSet
from django.contrib.auth.models import User
from climate.models import ClimateFactor, ClimateBudget, ClimateScenario
from budget.models import Budget
import copy



class ClimateFactorAPITestCase(APITestCase):
    """ Test suite for the ClimateFactor model REST API.
    """

    def setUp(self):
        """ Set up the request factory, viewset, and user.
        """

        self.factory = APIRequestFactory()
        self.climate_factor_view_set = ClimateFactorViewSet.as_view({
            'get': 'list',
            'post': 'create',
            'delete': 'destroy',
            'put': 'update',
        })

        self.user = User.objects.create(**USER_OUTLINE)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        self.scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        self.climate_budget = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)


    def test_list(self):
        """ Test lists all objects in database.
        """

        ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request)

        self.assertEqual(1, len(response.data))


    def test_list_invalid_query_param(self):
        """ Test that supplying an invalid query parameter returns an
            empty queryset.
        """

        ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('?shirt=banana', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(0, len(response.data))


    def test_list_no_fields_parameter_returns_whole_object(self):
        """ Test lists with no fields query parameter supplied returns
            the entire object.
        """

        ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"name\"")
        self.assertContains(response, "\"state\"")
        self.assertContains(response, "\"region\"")
        self.assertContains(response, "\"user_estimate\"")
        self.assertContains(response, "\"climate_budget\"")

        self.assertEquals(200, response.status_code)


    def test_list_fields_returns_only_requested_fields(self):
        """ Test lists with fields query param returns only the requested fields.
        """

        ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('?fields=name,state', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"name\"")
        self.assertContains(response, "\"state\"")
        self.assertNotContains(response, "\"region\"")
        self.assertNotContains(response, "\"user_estimate\"")
        self.assertNotContains(response, "\"climate_budget\"")

        self.assertEquals(200, response.status_code)


    def test_list_fields_returns_ignores_invalid_fields(self):
        """ Test lists with fields query param returns only the requested fields
            while ignoring those not in the model.
        """

        ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('?fields=name,state,banana', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"name\"")
        self.assertContains(response, "\"state\"")
        self.assertNotContains(response, "\"region\"")
        self.assertNotContains(response, "\"user_estimate\"")
        self.assertNotContains(response, "\"climate_budget\"")
        self.assertNotContains(response, "\"banana\"")

        self.assertEquals(200, response.status_code)


    def test_list_fields_returns_only_invalid_fields_returns_whole_object(self):
        """ Test lists with fields query param returns the whole object
            when fields supplied are only those not in the model.
        """

        ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('?fields=banana', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"name\"")
        self.assertContains(response, "\"state\"")
        self.assertContains(response, "\"region\"")
        self.assertContains(response, "\"user_estimate\"")
        self.assertContains(response, "\"climate_budget\"")
        self.assertNotContains(response, "\"banana\"")

        self.assertEquals(200, response.status_code)


    def test_list_fields_returns_only_requested_fields_works_with_budget_query(self):
        """ Test lists with fields query param returns only the requested fields.
        """

        budget_2 = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
        ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)
        ClimateFactor.objects.create(climate_budget=budget_2, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('?fields=name,state&climate_budget=' + str(self.climate_budget.pk), format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"name\"")
        self.assertContains(response, "\"state\"")
        self.assertNotContains(response, "\"region\"")
        self.assertNotContains(response, "\"user_estimate\"")
        self.assertNotContains(response, "\"climate_budget\"")

        self.assertEquals(200, response.status_code)


    def test_list_filter_budget(self):
        """ Test list filters by parent climate budget.
        """

        budget_2 = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
        ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)
        ClimateFactor.objects.create(climate_budget=budget_2, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('?climate_budget=' + str(self.climate_budget.pk), format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request)

        self.assertEqual(1, len(response.data))


    def test_list_filter_budget_does_not_exist(self):
        """ Test list filters by parent climate budget returns empty queryset
            when climate budget does not exist.
        """

        budget_2 = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
        ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)
        ClimateFactor.objects.create(climate_budget=budget_2, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('?climate_budget=' + str(self.climate_budget.pk + budget_2.pk), format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(0, len(response.data))


    def test_list_filter_budget_NaN(self):
        """ Test list filters by parent climate budget returns empty queryset
            when climate budget is Not a Number.
        """

        budget_2 = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
        ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)
        ClimateFactor.objects.create(climate_budget=budget_2, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('?climate_budget=a', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(0, len(response.data))


    def test_create(self):
        """ Test create action.
        """

        # Create a copy of the outline dictionary to send to API for creation.
        new_climate_factor = copy.deepcopy(CLIMATE_FACTOR_OUTLINE)
        new_climate_factor.update({'climate_budget': self.climate_budget.pk})

        request = self.factory.post('', new_climate_factor, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = self.climate_factor_view_set(request)

        self.assertEquals(201, response.status_code)
        self.assertEquals(CLIMATE_FACTOR_OUTLINE['name'], response.data['name'])


    def test_destroy(self):
        """ Test destroy action.
        """

        new_climate_factor = ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.delete('', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request, pk=new_climate_factor.pk)

        self.assertEquals(204, response.status_code)


    def test_update(self):
        """ Test update action.
        """

        new_climate_factor = ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        # Create a copy of the outline dictionary to send to the API to update object
        climate_factor_updated = copy.deepcopy(CLIMATE_FACTOR_OUTLINE)
        climate_factor_updated.update({'climate_budget': self.climate_budget.pk, 'name': "New Name"})

        request = self.factory.put('', climate_factor_updated)
        force_authenticate(request, user=self.user)
        response = self.climate_factor_view_set(request, pk=new_climate_factor.pk)

        self.assertEquals(200, response.status_code)
        self.assertEquals(climate_factor_updated['name'], response.data['name'])



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
