from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from climate.views import ClimateBudgetViewSet
from django.contrib.auth.models import User
from climate.models import ClimateFactor, ClimateBudget, ClimateScenario
from budget.models import Budget, IncomeItem, CostItem
import copy



class ClimateBudgetAPITestCase(APITestCase):
    """ Test suite for the ClimateBudget model REST API.
    """

    def setUp(self):
        """ Set up the request factory, viewset, and user.
        """

        self.factory = APIRequestFactory()
        self.climate_budget_view_set = ClimateBudgetViewSet.as_view({
            'get': 'list',
            'post': 'create',
            'delete': 'destroy',
            'put': 'update',
        })

        self.user = User.objects.create(**USER_OUTLINE)
        self.user_2 = User.objects.create(**USER_OUTLINE_2)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        self.scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        self.not_found_response_data = {'detail': "Not found."}


    def test_list(self):
        """ Test lists all objects in database.
        """

        ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEqual(1, len(response.data))

    def test_list_no_fields_parameter_returns_whole_object(self):
        """ Test lists with no fields query parameter supplied returns
            the entire object.
        """

        ClimateBudget.objects.create(user=self.user_2, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"modeling_estimate\"")
        self.assertContains(response, "\"focus_group_estimate\"")
        self.assertContains(response, "\"user_estimate\"")
        self.assertContains(response, "\"budget\"")
        self.assertContains(response, "\"climate_scenario\"")

        self.assertEquals(200, response.status_code)

    def test_list_fields_returns_only_requested_fields(self):
        """ Test lists with fields query param returns only the requested fields.
        """

        ClimateBudget.objects.create(user=self.user_2, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('?fields=modeling_estimate,focus_group_estimate', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"modeling_estimate\"")
        self.assertContains(response, "\"focus_group_estimate\"")
        self.assertNotContains(response, "\"user_estimate\"")
        self.assertNotContains(response, "\"budget\"")
        self.assertNotContains(response, "\"climate_scenario\"")

        self.assertEquals(200, response.status_code)

    def test_list_fields_returns_ignores_invalid_fields(self):
        """ Test lists with fields query param returns only the requested fields
            while ignoring those not in the model.
        """

        ClimateBudget.objects.create(user=self.user_2, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('?fields=modeling_estimate,focus_group_estimate,banana', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"modeling_estimate\"")
        self.assertContains(response, "\"focus_group_estimate\"")
        self.assertNotContains(response, "\"user_estimate\"")
        self.assertNotContains(response, "\"budget\"")
        self.assertNotContains(response, "\"climate_scenario\"")
        self.assertNotContains(response, "\"banana\"")

        self.assertEquals(200, response.status_code)

    def test_list_fields_returns_only_invalid_fields_returns_whole_object(self):
        """ Test lists with fields query param returns the whole object
            when fields supplied are only those not in the model.
        """

        ClimateBudget.objects.create(user=self.user_2, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('?fields=banana', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"modeling_estimate\"")
        self.assertContains(response, "\"focus_group_estimate\"")
        self.assertContains(response, "\"user_estimate\"")
        self.assertContains(response, "\"budget\"")
        self.assertContains(response, "\"climate_scenario\"")
        self.assertNotContains(response, "\"banana\"")

        self.assertEquals(200, response.status_code)


    def test_list_retrieves_climate_factors(self):
        """ Test retrieves associated ClimateFactor objects.
        """

        climate_budget = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
        ClimateFactor.objects.create(climate_budget=climate_budget, **CLIMATE_FACTOR_OUTLINE)

        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEqual(1, len(response.data[0]['climate_factors']))


    def test_list_filter_user(self):
        """ Test filtering of objects using 'username' URL query argument returns an array of objects associated with that user.

            URL pattern: '/budgets/?{filter_field}={field_value}/'.
        """

        # Save objects to test
        ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
        ClimateBudget.objects.create(user=self.user_2, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('?username=' + self.user.get_username(), format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEquals(1, len(response.data))


    def test_list_filter_user_invalid(self):
        """ Test filtering using a username that does not exist returns empty array.
        """

        # Save object to test
        ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('?username=ryan_reynolds', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEquals(0, len(response.data))


    def test_list_filter_scenario(self):
        """ Test filtering using parent climate scenario pk.
        """

        scenario_2 = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
        ClimateBudget.objects.create(user=self.user_2, budget=self.budget, climate_scenario=scenario_2, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('?scenario=' + str(self.scenario.pk), format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEquals(1, len(response.data))

    def test_list_filter_scenario(self):
        """ Test filtering using parent climate scenario pk.
        """

        scenario_2 = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
        ClimateBudget.objects.create(user=self.user_2, budget=self.budget, climate_scenario=scenario_2, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('?fields=modeling_estimate,focus_group_estimate&scenario=' + str(self.scenario.pk), format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertContains(response, "\"modeling_estimate\"")
        self.assertContains(response, "\"focus_group_estimate\"")
        self.assertNotContains(response, "\"user_estimate\"")
        self.assertNotContains(response, "\"budget\"")
        self.assertNotContains(response, "\"climate_scenario\"")

        self.assertEquals(1, len(response.data))

    def test_list_filter_scenario_does_not_exist(self):
        """ Test filtering using parent climate scenario pk that does not exist returns empty queryset.
        """

        scenario_2 = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
        ClimateBudget.objects.create(user=self.user_2, budget=self.budget, climate_scenario=scenario_2, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('?scenario=' + str(self.scenario.pk + scenario_2.pk), format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEquals(0, len(response.data))
        self.assertEquals(200, response.status_code)


    def test_list_filter_scenario_invalid(self):
        """ Test filtering for scenario that does not exist returns empty array.
        """

        ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('?scenario=' + "definitely not a pk", format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEquals(0, len(response.data))
        self.assertEquals(200, response.status_code)


    def test_list_query_invalid(self):
        """ Test filtering using an unsupported query parameter returns empty array.
        """

        # Save objects to test
        ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('?shirt=bananas', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request)

        self.assertEquals(0, len(response.data))


    def test_destroy(self):
        """ Test destroy action.
        """

        # Save object to test
        budget = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.delete('', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request, pk=budget.pk)

        self.assertEquals(204, response.status_code)


    def test_create(self):
        """ Test create action.
        """

        new_climate_budget = copy.deepcopy(CLIMATE_BUDGET_OUTLINE)
        new_climate_budget.update({'climate_scenario': self.scenario.pk})
        new_climate_budget.update({'budget': self.budget.pk})

        request = self.factory.post('', new_climate_budget, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = self.climate_budget_view_set(request)

        self.assertEquals(201, response.status_code)
        self.assertEquals(str(CLIMATE_BUDGET_OUTLINE['user_estimate']), response.data['user_estimate'])
        self.assertEquals(0, response.data['position'])


    def test_update(self):
        """ Test update action.
        """

        # Save object to test
        climate_budget = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        # Create a copy of the outline dictionary to send to the API to update object
        budget_updated = copy.deepcopy(CLIMATE_BUDGET_OUTLINE)
        budget_updated.update({'climate_scenario': self.scenario.pk})
        budget_updated.update({'budget': self.budget.pk})
        budget_updated.update({'user_estimate': "12.0"})

        request = self.factory.put('', budget_updated)
        force_authenticate(request, user=self.user)
        response = self.climate_budget_view_set(request, pk=climate_budget.pk)

        self.assertEquals(200, response.status_code)
        self.assertEquals(budget_updated['user_estimate'], response.data['user_estimate'])


    def test_generate(self):
        """ Test /generate API route.
        """

        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=self.budget, **COST_ITEM_OUTLINE)
        fixed_cost_item = CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)
        general_cost_item = CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)

        payload = {
            'climate_scenario': self.scenario.pk,
            'budget': self.budget.pk,
        }

        viewset = ClimateBudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', payload, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        new_budget = Budget.objects.get(id=response.data['budget'])

        self.assertEqual(201, response.status_code)
        self.assertEqual(self.budget.title, response.data['title'])
        self.assertEqual(self.scenario.id, response.data['climate_scenario'])
        self.assertEqual("climate", new_budget.module)
        self.assertEqual(1, len(ClimateBudget.objects.all()))
        self.assertEqual(2, len(Budget.objects.all()))
        self.assertEqual(2, len(IncomeItem.objects.all()))
        self.assertEqual(6, len(CostItem.objects.all()))


    def test_generate_budget_does_not_exist(self):
        """ Test sending an id of a nonexistent Budget to this endpoint returns HTTP 404.
        """

        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=self.budget, **COST_ITEM_OUTLINE)
        fixed_cost_item = CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)
        general_cost_item = CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)

        payload = {
            'climate_scenario': self.scenario.pk,
            'budget': (self.budget.pk + 1),
        }

        viewset = ClimateBudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', payload, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(404, response.status_code)
        self.assertEqual(self.not_found_response_data, response.data)


    def test_generate_scenario_does_not_exist(self):
        """ Test sending an id of a nonexistent ClimateScenario to this endpoint returns HTTP 404.
        """

        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=self.budget, **COST_ITEM_OUTLINE)
        fixed_cost_item = CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)
        general_cost_item = CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)

        payload = {
            'climate_scenario': (self.scenario.pk + 1),
            'budget': self.budget.pk,
        }

        viewset = ClimateBudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', payload, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(404, response.status_code)
        self.assertEqual(self.not_found_response_data, response.data)


    def test_generate_invalid_payload(self):
        """ Test that sending an invalid payload to this endpoint returns HTTP 400.
        """

        viewset = ClimateBudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(400, response.status_code)
        self.assertEqual({'error': "Invalid payload"}, response.data)


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

CLIMATE_FACTOR_OUTLINE = {
    'name': "Test Climate Factor",
    'state': "OR",
    'region': "Corvallis",
    'user_estimate': 10.0,
}
