from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from climate.views import ClimateScenarioViewSet
from django.contrib.auth.models import User
from climate.models import ClimateBudget, ClimateScenario
from budget.models import Budget
import copy



class ClimateScenarioAPITestCase(APITestCase):
    """ Test suite for the ClimateScenario model REST API.
    """

    def setUp(self):
        """ Set up the request factory, viewset, and users.
        """

        self.factory = APIRequestFactory()
        self.climate_scenario_view_set = ClimateScenarioViewSet.as_view({
            'get': 'list',
            'post': 'create',
            'delete': 'destroy',
            'put': 'update',
        })

        self.user = User.objects.create(**USER_OUTLINE)
        self.user_2 = User.objects.create(**USER_OUTLINE_2)


    def test_list(self):
        """ Test lists all objects in database.
        """

        ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_scenario_view_set(request)

        self.assertEqual(2, len(response.data))


    def test_list_no_fields_parameter_returns_whole_object(self):
        """ Test lists with no fields query parameter supplied returns
            the entire object.
        """

        ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_scenario_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"notes\"")

        self.assertEquals(200, response.status_code)


    def test_list_fields_returns_only_requested_fields(self):
        """ Test lists with fields query param returns only the requested fields.
        """

        ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        request = self.factory.get('?fields=title', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_scenario_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"title\"")
        self.assertNotContains(response, "\"notes\"")

        self.assertEquals(200, response.status_code)


    def test_list_fields_returns_ignores_invalid_fields(self):
        """ Test lists with fields query param returns only the requested fields
            while ignoring those not in the model.
        """

        ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        request = self.factory.get('?fields=title,banana', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_scenario_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"title\"")
        self.assertNotContains(response, "\"notes\"")
        self.assertNotContains(response, "\"banana\"")

        self.assertEquals(200, response.status_code)


    def test_list_fields_returns_only_invalid_fields_returns_whole_object(self):
        """ Test lists with fields query param returns the whole object
            when fields supplied are only those not in the model.
        """

        ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        request = self.factory.get('?fields=banana', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_scenario_view_set(request)

        self.assertEqual(1, len(response.data))

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"notes\"")

        self.assertNotContains(response, "\"banana\"")

        self.assertEquals(200, response.status_code)


    def test_retrieve_query_user(self):
        """ Test filtering of objects using 'username' URL query argument returns an array of objects associated with that user.

            URL pattern: '/budgets/?{filter_field}={field_value}/'.
        """

        ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        ClimateScenario.objects.create(user=self.user_2, **CLIMATE_SCENARIO_OUTLINE)

        request = self.factory.get('?username=' + self.user.get_username(), format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_scenario_view_set(request)

        self.assertEquals(1, len(response.data))


    def test_retrieve_query_user_does_not_exist(self):
        """ Test filtering using a username that does not exist returns empty array.
        """

        ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        request = self.factory.get('?username=bob', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_scenario_view_set(request)

        self.assertEquals(0, len(response.data))


    def test_retrieve_query_invalid(self):
        """ Test filtering using an unsupported query parameter returns empty array.
        """

        ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        request = self.factory.get('?shirt=bananas', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_scenario_view_set(request)

        self.assertEquals(0, len(response.data))


    def test_retrieve_climate_budgets(self):
        """ Test retrieves associated ClimateBudget objects.
        """

        scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        climate_budget = ClimateBudget.objects.create(user=self.user, budget=budget, climate_scenario=scenario, **CLIMATE_BUDGET_OUTLINE)

        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = self.climate_scenario_view_set(request)

        climate_budget_list = response.data[0]['climate_budgets']

        self.assertEqual(1, len(climate_budget_list))
        self.assertEqual(climate_budget.budget.id, climate_budget_list[0]['id'])


    def test_next_not_last_budget(self):
        """ Test sending POST to '/{scenario_id}/next/' with a ClimateBudget id in the payload returns the
            ClimateBudget with the next highest 'position' and 'is_original' set to True.
        """

        scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        for i in range(0, 9):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            if i % 2 == 0:
                ClimateBudget.objects.create(
                    user=self.user,
                    budget=budget,
                    climate_scenario=scenario,
                    is_original=False,
                    **CLIMATE_BUDGET_OUTLINE
                )
            else:
                ClimateBudget.objects.create(
                    user=self.user,
                    budget=budget,
                    climate_scenario=scenario,
                    is_original=True,
                    **CLIMATE_BUDGET_OUTLINE
                )

        current_climate_budget = ClimateBudget.objects.filter(climate_scenario=scenario, is_original=True)[0]
        next_climate_budget = ClimateBudget.objects.filter(
            climate_scenario=scenario, is_original=True,
            position=current_climate_budget.position + 2
        )[0]

        viewset = ClimateScenarioViewSet.as_view({'post': "next"})
        request = self.factory.post('', {'climate_budget': current_climate_budget.id}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, pk=scenario.pk)

        self.assertEquals(200, response.status_code)
        self.assertEquals(next_climate_budget.id, response.data['id'])
        self.assertEqual(current_climate_budget.position + 2, response.data['position'])


    def test_next_last_budget(self):
        """ Test sending POST to '/{scenario_id}/next/' with a ClimateBudget id in the payload returns the same
            ClimateBudget if it is the last one in the list.
        """

        scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        for i in range(0, 9):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            if i % 2 == 0:
                ClimateBudget.objects.create(
                    user=self.user,
                    budget=budget,
                    climate_scenario=scenario,
                    is_original=False,
                    **CLIMATE_BUDGET_OUTLINE
                )
            else:
                ClimateBudget.objects.create(
                    user=self.user,
                    budget=budget,
                    climate_scenario=scenario,
                    is_original=True,
                    **CLIMATE_BUDGET_OUTLINE
                )

        current_climate_budget = ClimateBudget.objects.filter(climate_scenario=scenario, is_original=True, position=6)[0]

        viewset = ClimateScenarioViewSet.as_view({'post': "next"})
        request = self.factory.post('', {'climate_budget': current_climate_budget.id}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, pk=scenario.pk)

        self.assertEquals(200, response.status_code)
        self.assertEquals(current_climate_budget.id, response.data['id'])
        self.assertEqual(current_climate_budget.position, response.data['position'])


    def test_most_recent_exists(self):
        """ Test sending GET to "/scenarios/most_recent/" returns the most recently updated ClimateScenario for the
            request user.
        """

        for i in range(0, 10):
            ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        climate_scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        viewset = ClimateScenarioViewSet.as_view({'get': "most_recent"})
        request = self.factory.get('/most_recent', format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        for field in CLIMATE_SCENARIO_OUTLINE:
            self.assertTrue(field in response.data)
            self.assertEqual(climate_scenario.__dict__[field], response.data[field])


    def test_most_recent_no_scenarios(self):
        """ Test that if no ClimateScenarios exist, returns empty object with HTTP 200.
        """

        viewset = ClimateScenarioViewSet.as_view({'get': "most_recent"})
        request = self.factory.get('/most_recent', format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual({}, response.data)


    def test_most_recent_incomplete(self):
        """ Test that if any ClimateBudget's 'user_estimate' in the only ClimateScenario equal
            zero and 'is_original' is True, returns empty object.
        """

        scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        for i in range(0, 9):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            if i % 2 == 0:
                ClimateBudget.objects.create(
                    user=self.user,
                    budget=budget,
                    climate_scenario=scenario,
                    is_original=False,
                    **CLIMATE_BUDGET_OUTLINE
                )
            else:
                climate_budget = ClimateBudget(
                    user=self.user,
                    budget=budget,
                    climate_scenario=scenario,
                    is_original=True,
                    **CLIMATE_BUDGET_OUTLINE
                )
                if i == 1:
                    climate_budget.user_estimate = 0
                climate_budget.save()


        viewset = ClimateScenarioViewSet.as_view({'get': "most_recent"})
        request = self.factory.get('/most_recent', format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual({}, response.data)


    def test_most_recent_anonymous_user(self):
        """ Test returns empty object if user is not authenticated.
        """

        viewset = ClimateScenarioViewSet.as_view({'get': "most_recent"})
        request = self.factory.get('/most_recent', format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual({}, response.data)


    def test_most_recent_returns_next_completed_scenario(self):
        """ Test returns the most recently updated ClimateScenario with all associated ClimateBudgets 'user_estimate'
            field not equal to zero.
        """

        scenario_incomplete = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        for i in range(0, 9):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            if i % 2 == 0:
                ClimateBudget.objects.create(
                    user=self.user,
                    budget=budget,
                    climate_scenario=scenario_incomplete,
                    is_original=False,
                    **CLIMATE_BUDGET_OUTLINE
                )
                ClimateBudget.objects.create(
                    user=self.user,
                    budget=budget,
                    climate_scenario=scenario,
                    is_original=False,
                    **CLIMATE_BUDGET_OUTLINE
                )
            else:
                climate_budget = ClimateBudget(
                    user=self.user,
                    budget=budget,
                    climate_scenario=scenario_incomplete,
                    is_original=True,
                    **CLIMATE_BUDGET_OUTLINE
                )
                ClimateBudget.objects.create(
                    user=self.user,
                    budget=budget,
                    climate_scenario=scenario,
                    is_original=True,
                    **CLIMATE_BUDGET_OUTLINE
                )
                if i == 1:
                    climate_budget.user_estimate = 0
                climate_budget.save()

        viewset = ClimateScenarioViewSet.as_view({'get': "most_recent"})
        request = self.factory.get('/most_recent', format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual(scenario.id, response.data['id'])



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
