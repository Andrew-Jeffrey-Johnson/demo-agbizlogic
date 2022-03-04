from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from climate.models import *
from budget.models import *
from climate.views import *
from django.urls import reverse
import json, copy


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




class ClimateScenarioAPIFunctionalTestCase(APITestCase):
    """ Functional test suite for the ClimateScenario model RESTful API using the client to include routes and viewsets.
    """

    def setUp(self):
        """ Set up and authenticate test user, set URL's.
        """

        self.user = User.objects.create(**USER_OUTLINE)
        self.client.force_authenticate(user=self.user)

        self.list_url = reverse('climate_scenarios-list')


    def test_list(self):
        """ Test list all objects in database.
        """

        scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        response = self.client.get(self.list_url, format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals(1, len(response.data))


    def test_retrieve(self):
        """ Test single object retrieval.
        """

        scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        response = self.client.get(reverse('climate_scenarios-detail', kwargs={'pk': scenario.pk}))

        self.assertEquals(200, response.status_code)
        self.assertEquals(CLIMATE_SCENARIO_OUTLINE['title'], response.data['title'])


    def test_create(self):
        """ Test object creation.
        """

        scenario = copy.deepcopy(CLIMATE_SCENARIO_OUTLINE)

        response = self.client.post(self.list_url, scenario, format='json')

        self.assertEquals(201, response.status_code)
        self.assertEquals(scenario['title'], response.data['title'])


    def test_destroy(self):
        """ Test object destruction.
        """

        scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)

        response = self.client.delete(reverse('climate_scenarios-detail', kwargs={'pk': scenario.pk}))

        self.assertEquals(0, len(ClimateScenario.objects.all()))
        self.assertEquals(204, response.status_code)


    def test_update(self):
        """ Test object updating.
        """

        scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        scenario_updated = copy.deepcopy(CLIMATE_SCENARIO_OUTLINE)
        scenario_updated.update({'title': "New Title"})

        response = self.client.put(reverse('climate_scenarios-detail', kwargs={'pk': scenario.pk}), scenario_updated, format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals(scenario_updated['title'], response.data['title'])



class ClimateBudgetAPIFunctionalTestCase(APITestCase):
    """ Functional test suite for the ClimateScenario model RESTful API using the client to include routes and viewsets.
    """

    def setUp(self):
        """ Set up and authenticate user, URL's, test data.
        """

        self.user = User.objects.create(**USER_OUTLINE)
        self.client.force_authenticate(user=self.user)
        self.scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        self.list_url = reverse('climate_budgets-list')


    def test_list(self):
        """ Test list all objects in database.
        """

        ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        response = self.client.get(self.list_url, format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals(1, len(response.data))


    def test_list_filter_username(self):
        """ Test list filters by username.
        """

        ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        response = self.client.get(self.list_url + "?username=" + self.user.get_username(), format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals(1, len(response.data))


    def test_retrieve(self):
        """ Test single object retrieval.
        """

        climate_budget = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        response = self.client.get(reverse('climate_budgets-detail', kwargs={'pk': climate_budget.pk}))

        self.assertEquals(200, response.status_code)
        self.assertEquals(str(climate_budget.user_estimate), response.data['user_estimate'])


    def test_create(self):
        """ Test object creation.
        """

        climate_budget = copy.deepcopy(CLIMATE_BUDGET_OUTLINE)
        climate_budget.update({'climate_scenario': self.scenario.pk})
        climate_budget.update({'budget': self.budget.id})

        response = self.client.post(self.list_url, climate_budget, format='json')

        self.assertEquals(201, response.status_code)
        self.assertEquals(str(climate_budget['user_estimate']), response.data['user_estimate'])


    def test_destroy(self):
        """ Test object destruction.
        """

        climate_budget = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        response = self.client.delete(reverse('climate_budgets-detail', kwargs={'pk': climate_budget.pk}))

        self.assertEquals(0, len(ClimateBudget.objects.all()))
        self.assertEquals(204, response.status_code)


    def test_update(self):
        """ Test object updating.
        """

        climate_budget = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
        budget_updated = copy.deepcopy(CLIMATE_BUDGET_OUTLINE)
        budget_updated.update({'modeling_estimate': '12.0', 'climate_scenario': self.scenario.pk, 'budget': self.budget.id})

        response = self.client.put(reverse('climate_budgets-detail', kwargs={'pk': climate_budget.pk}), budget_updated, format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals(budget_updated['modeling_estimate'], response.data['modeling_estimate'])


    def test_update_blank(self):
        """ Test updating object with required fields blank returns errors.
        """

        errors = {
            'budget': ['This field is required.'],
            'climate_scenario': ['This field is required.'],
        }

        climate_budget = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        response = self.client.put(reverse('climate_budgets-detail', kwargs={'pk': climate_budget.pk}), format='json')

        self.assertEquals(400, response.status_code)
        self.assertEquals(errors, response.data)



class ClimateFactorAPIFunctionalTestCase(APITestCase):
    """ Functional test suite for the ClimateFactor model RESTful API using the client to include routes and viewsets.
    """

    def setUp(self):
        """ Set up and authenticate user, URL's, test data.
        """

        self.user = User.objects.create(**USER_OUTLINE)
        self.client.force_authenticate(user=self.user)
        self.scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        self.climate_budget = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)

        self.list_url = reverse('climate_factors-list')


    def test_list(self):
        """ Test list all objects in database.
        """

        factor = ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        response = self.client.get(self.list_url, format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals(1, len(response.data))


    def test_list_filter_budget(self):
                """ Test list filters by parent climate budget.
                """

                budget_2 = ClimateBudget.objects.create(user=self.user, budget=self.budget, climate_scenario=self.scenario, **CLIMATE_BUDGET_OUTLINE)
                ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)
                ClimateFactor.objects.create(climate_budget=budget_2, **CLIMATE_FACTOR_OUTLINE)

                response = self.client.get(self.list_url + "?climate_budget=" + str(self.budget.pk), format="json")

                self.assertEqual(200, response.status_code)
                self.assertEqual(1, len(response.data))


    def test_retrieve(self):
        """ Test single object retrieval.
        """

        factor = ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        response = self.client.get(reverse('climate_factors-detail', kwargs={'pk': factor.pk}))

        self.assertEquals(200, response.status_code)
        self.assertEquals(CLIMATE_FACTOR_OUTLINE['name'], response.data['name'])


    def test_create(self):
        """ Test object creation.
        """

        factor = copy.deepcopy(CLIMATE_FACTOR_OUTLINE)
        factor.update({'climate_budget': self.climate_budget.pk})

        response = self.client.post(self.list_url, factor, format='json')

        self.assertEquals(201, response.status_code)
        self.assertEquals(factor['name'], response.data['name'])


    def test_destroy(self):
        """ Test object destruction.
        """

        factor = ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        response = self.client.delete(reverse('climate_factors-detail', kwargs={'pk': factor.pk}))

        self.assertEquals(0, len(ClimateFactor.objects.all()))
        self.assertEquals(204, response.status_code)


    def test_update(self):
        """ Test object updating.
        """

        factor = ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)
        factor_updated = copy.deepcopy(CLIMATE_FACTOR_OUTLINE)
        factor_updated.update({'name': "New Name", 'climate_budget': self.climate_budget.pk})

        response = self.client.put(reverse('climate_factors-detail', kwargs={'pk': factor.pk}), factor_updated, format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals(factor_updated['name'], response.data['name'])


    def test_update_blank(self):
        """ Test updating object with required fields blank returns errors.
        """

        errors = {
            'name': ['This field is required.'],
            'state': ['This field is required.'],
            'user_estimate': ['This field is required.'],
            'climate_budget': ['This field is required.']
        }

        factor = ClimateFactor.objects.create(climate_budget=self.climate_budget, **CLIMATE_FACTOR_OUTLINE)

        response = self.client.put(reverse('climate_factors-detail', kwargs={'pk': factor.pk}), format='json')

        self.assertEquals(400, response.status_code)
        self.assertEquals(errors, response.data)
