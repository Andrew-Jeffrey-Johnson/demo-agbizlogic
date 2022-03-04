from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate, APIClient
from scenario.views import PlanViewSet
import copy
from scenario.models import *



class PlanAPITestCase(APITestCase):
    """ Test suite for the Plan model REST resource.
    """

    def setUp(self):
        self.factory = APIRequestFactory()

        self.user = User.objects.create(**USER_OUTLINE)
        self.user2 = User.objects.create(**USER_OUTLINE_2)


    def test_list(self):
        """ Test lists all objects in database.
        """

        Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(1, len(response.data))


    def test_list_with_user_parameter(self):
        """ Tests listing only objects relating to a single user.
        """

        Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        Plan.objects.create(user=self.user2, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(1, len(response.data))
        self.assertEquals(200, response.status_code)


    def test_list_with_user_parameter_does_not_exist(self):
        """ Tests supplying username on nonexistant user returns
            empty queryset.
        """

        Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        Plan.objects.create(user=self.user2, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=bob', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(0, len(response.data))
        self.assertEquals(200, response.status_code)


    def test_list_with_invalid_query_parameter_returns_empty_list(self):
        """ Tests that supplying an invalid query parameter returns an empty list.
        """

        Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?shirt=banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(0, len(response.data))
        self.assertEquals(200, response.status_code)


    def test_list_field_parameter_returns_only_requested_fields(self):
        """ Test that requesting a subset of the fields via the fields
            query param returns those fields and only those fields.
        """

        Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title,discount_rate', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"discount_rate\"")
        self.assertNotContains(response, "\"notes\"")
        self.assertNotContains(response, "\"time_period_unit\"")
        self.assertNotContains(response, "\"time_period_value\"")
        self.assertNotContains(response, "\"beginning_investment\"")
        self.assertNotContains(response, "\"ending_investment\"")
        self.assertNotContains(response, "\"lease_type\"")
        self.assertNotContains(response, "\"land_market_value\"")
        self.assertNotContains(response, "\"annual_land_rate\"")
        self.assertNotContains(response, "\"required_roi\"")
        self.assertNotContains(response, "\"investment_inflation\"")

        self.assertEquals(200, response.status_code)


    def test_list_field_parameter_returns_ignores_invalid_fields(self):
        """ Test that requesting a subset of the fields via the fields
            query param returns those fields and only those fields
            while ignoring fields not in the model.
        """

        Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title,discount_rate,banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"discount_rate\"")
        self.assertNotContains(response, "\"notes\"")
        self.assertNotContains(response, "\"time_period_unit\"")
        self.assertNotContains(response, "\"time_period_value\"")
        self.assertNotContains(response, "\"beginning_investment\"")
        self.assertNotContains(response, "\"ending_investment\"")
        self.assertNotContains(response, "\"lease_type\"")
        self.assertNotContains(response, "\"land_market_value\"")
        self.assertNotContains(response, "\"annual_land_rate\"")
        self.assertNotContains(response, "\"required_roi\"")
        self.assertNotContains(response, "\"investment_inflation\"")
        self.assertNotContains(response, "\"banana\"")

        self.assertEquals(200, response.status_code)


    def test_list_no_field_parameter_returns_complete_object(self):
        """ Test that request with no fields parameter returns a complete object.
        """

        Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"discount_rate\"")
        self.assertContains(response, "\"notes\"")
        self.assertContains(response, "\"time_period_unit\"")
        self.assertContains(response, "\"time_period_value\"")
        self.assertContains(response, "\"beginning_investment\"")
        self.assertContains(response, "\"ending_investment\"")
        self.assertContains(response, "\"lease_type\"")
        self.assertContains(response, "\"land_market_value\"")
        self.assertContains(response, "\"annual_land_rate\"")
        self.assertContains(response, "\"required_roi\"")
        self.assertContains(response, "\"investment_inflation\"")

        self.assertEquals(200, response.status_code)


    def test_list_only_invalid_field_parameter_returns_complete_object(self):
        """ Test that request with only invalid fields specified returns a complete object.
        """

        Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"discount_rate\"")
        self.assertContains(response, "\"notes\"")
        self.assertContains(response, "\"time_period_unit\"")
        self.assertContains(response, "\"time_period_value\"")
        self.assertContains(response, "\"beginning_investment\"")
        self.assertContains(response, "\"ending_investment\"")
        self.assertContains(response, "\"lease_type\"")
        self.assertContains(response, "\"land_market_value\"")
        self.assertContains(response, "\"annual_land_rate\"")
        self.assertContains(response, "\"required_roi\"")
        self.assertContains(response, "\"investment_inflation\"")

        self.assertEquals(200, response.status_code)


    def test_list_field_parameter_returns_with_username(self):
        """ Test that requesting a subset of the fields via the fields
            query param returns those fields and only those fields
            works correctly when also filtered by username.
        """

        Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        Plan.objects.create(user=self.user2, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title,discount_rate&username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"discount_rate\"")
        self.assertNotContains(response, "\"notes\"")
        self.assertNotContains(response, "\"time_period_unit\"")
        self.assertNotContains(response, "\"time_period_value\"")
        self.assertNotContains(response, "\"beginning_investment\"")
        self.assertNotContains(response, "\"ending_investment\"")
        self.assertNotContains(response, "\"lease_type\"")
        self.assertNotContains(response, "\"land_market_value\"")
        self.assertNotContains(response, "\"annual_land_rate\"")
        self.assertNotContains(response, "\"required_roi\"")
        self.assertNotContains(response, "\"investment_inflation\"")

        self.assertEquals(1, len(response.data))
        self.assertEquals(200, response.status_code)


    def test_list_filtered_by_parent_scenario(self):
        """ Test that filtering using scenario query param returns only Plan objects associated with that Scenario.
        """

        scenario1 = Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)
        scenario2 = Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        plan1 = Plan.objects.create(user = self.user, scenario = scenario1, **PLAN_OUTLINE)
        plan2 = Plan.objects.create(user = self.user, scenario = scenario2, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?scenario=' + str(scenario1.pk), format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(1, len(response.data))


    def test_list_filtered_by_parent_scenario_does_not_exist(self):
        """ Test that filtering using scenario query param returns
            an empty query set when the specified scenario does not exist.
        """

        scenario1 = Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)
        scenario2 = Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        plan1 = Plan.objects.create(user = self.user, scenario = scenario1, **PLAN_OUTLINE)
        plan2 = Plan.objects.create(user = self.user, scenario = scenario2, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?scenario=' + str(scenario1.pk + scenario2.pk), format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(0, len(response.data))


    def test_list_filtered_by_parent_scenario_NaN(self):
        """ Test that filtering using scenario query param returns
            an empty query set when the specified scenario is Not a Number.
        """

        scenario1 = Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)
        scenario2 = Scenario.objects.create(user = self.user, **SCENARIO_OUTLINE)

        plan1 = Plan.objects.create(user = self.user, scenario = scenario1, **PLAN_OUTLINE)
        plan2 = Plan.objects.create(user = self.user, scenario = scenario2, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?scenario=a', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(0, len(response.data))


    def test_list_filter_by_module(self):
        """ Test filtering of objects using 'module' URL query parameter returns an array of objects with 'module'
            field value matching the parameter.
        """

        num = 10
        for i in range(0, num):
            Plan.objects.create(user=self.user, module="profit", **PLAN_OUTLINE)
            Plan.objects.create(user=self.user, module="lease", **PLAN_OUTLINE)
            Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=' + self.user.username + '&module=original', data=None)
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual(num, len(response.data))


    def test_create(self):
        """ Test save object in database.
        """

        viewset = PlanViewSet.as_view({'post': "create"})
        request = self.factory.post('', PLAN_OUTLINE, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        plans = Plan.objects.all()

        self.assertEquals(201, response.status_code)
        self.assertEqual(1, len(plans))


    def test_retrieve(self):
        """ Test retrieve single object instance from database.
        """

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "retrieve"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=plan.id)

        self.assertEqual(200, response.status_code)
        self.assertEqual(plan.title, response.data['title'])


    def test_update(self):
        """ Test update single instance in database.
        """

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        updated_plan = copy.deepcopy(PLAN_OUTLINE)
        updated_plan.update({'title': "Updated Plan Title"})

        viewset = PlanViewSet.as_view({'put': "update"})
        request = self.factory.put('', updated_plan)
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=plan.id)

        self.assertEqual(200, response.status_code)
        self.assertNotEqual(plan.title, response.data['title'])


    def test_destroy(self):
        """ Test destroy instance from database.
        """

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=plan.id)

        self.assertEqual(204, response.status_code)
        self.assertEqual(0, len(PlanBudget.objects.all()))

    def test_copy_valid(self):
        """ Test the detail route '/copy/' creates and returns a copy of the Plan.
        """

        num = 3
        scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)
        original_plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        for i in range(0, num):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            PlanBudget.objects.create(user=self.user, plan=original_plan, budget=budget, **PLAN_BUDGET_OUTLINE)

        viewset = PlanViewSet.as_view({'post': "copy"})
        request = self.factory.post('', {"scenario": scenario.id}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, pk=original_plan.pk)

        self.assertEqual(201, response.status_code)
        self.assertEqual(original_plan.title + " (" + scenario.title + ")", response.data["title"])
        self.assertNotEqual(original_plan.id, response.data["id"])
        self.assertEqual(1, response.data["scenario"])


    def test_copy_sets_source_and_module(self):
        """ Test the newly created Plan has 'module' set to 'copy' and 'source' set to the id of the copied Plan.
        """

        scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)
        original_plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'post': "copy"})
        request = self.factory.post('', {"scenario": scenario.id}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, pk=original_plan.pk)
        copy_plan = Plan.objects.get(id=response.data["id"])

        self.assertEqual("copy", copy_plan.module)
        self.assertEqual(original_plan.id, int(copy_plan.source))


    def test_copy_does_not_exist(self):
        """ Test request to copy a resource that does not exist returns error and HTTP 404.
        """

        scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)

        viewset = PlanViewSet.as_view({'post': "copy"})
        request = self.factory.post('', {"scenario": scenario.id}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, pk=323)

        self.assertEqual(404, response.status_code)
        self.assertEqual({"error": "Plan does not exist"}, response.data)


    def test_copy_no_scenario(self):
        """ Test request to copy a resource without 'scenario' in payload returns 201 created.
        """

        original_plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'post': "copy"})
        request = self.factory.post('', {"scenario": -1}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, pk=original_plan.pk)

        self.assertEqual(201, response.status_code)


    def test_copy_scenario_does_not_exist(self):
        """ Test request to copy a resource with nonexistant 'scenario' in payload returns 404.
        """

        original_plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        viewset = PlanViewSet.as_view({'post': "copy"})
        request = self.factory.post('', {"scenario": 43}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, pk=original_plan.pk)

        self.assertEqual(404, response.status_code)


    def test_copy_with_plan_budgets(self):
        """ Test the detail route '/copy/' creates and returns a copy of the Plan with copies of associated PlanBudget
            objects and their Budget, IncomeItem, and CostItem objects.
        """

        num = 3
        original_plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        scenario = Scenario.objects.create(user=self.user, **SCENARIO_OUTLINE)
        for i in range(0, num):
            budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
            CostItem.objects.create(parent_budget=budget, **COST_ITEM_OUTLINE)
            PlanBudget.objects.create(user=self.user, plan=original_plan, budget=budget, **PLAN_BUDGET_OUTLINE)

        viewset = PlanViewSet.as_view({'post': "copy"})
        request = self.factory.post('', {"scenario": scenario.id}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, pk=original_plan.pk)

        new_plan_budgets = PlanBudget.objects.filter(plan=response.data["id"])

        self.assertEqual(201, response.status_code)
        self.assertEqual(num, len(new_plan_budgets))


    def test_calculate_irr(self):
        """ Test the detail route '/calculate_irr/' returns the Plan's internal_rate_of_return property.
        """
        # FIXME: Test currently hangs, skip for now
        return True

        # FIXME: Need to mock MQTT client

        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        CostItem.objects.create(parent_budget=budget, **COST_ITEM_OUTLINE)
        PlanBudget.objects.create(user=self.user, plan=plan, budget=budget, **PLAN_BUDGET_OUTLINE)

        viewset = PlanViewSet.as_view({'get': "calculate_irr"})
        request = self.factory.get('', format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, pk=plan.pk)

        self.assertEqual(200, response.status_code)
        self.assertEqual(plan.internal_rate_of_return, response.data["internal_rate_of_return"])



################################################################################
#                            Helper Functions
################################################################################


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

    'time_unit': 'Year',
    'time_value': 1,
    'farm_unit': 'Acre',
    'farm_unit_quantity': 1,
}
INCOME_ITEM_OUTLINE = {
    'name': 'Test Income Item',
    'notes': "Test income item notes",

    'farm_unit': 'Acre',
    'farm_unit_quantity': 10,
    'sale_unit': 'Ton',
    'sale_unit_quantity': 100,
    'return_total': 1000.00,
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
SCENARIO_OUTLINE = {
    'title': "Test Scenario",
    'notes': "Some notes here",
}
PLAN_OUTLINE = {
    'title': "Test Plan",
    'notes': "Some plan notes here",

    'time_period_unit': "Year",
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

    'space_units': "Acre",
    'total_space_available': 250,
    'total_space_used': 150,
}
CONVERSION_TABLE = {
    'Day':   {'value': 1, 'Day': 1, 'Week': 1/7, 'Month': 1/30, 'Year': 1/365, 'unit': 'Day'},
    'Week':  {'value': 2, 'Day': 7, 'Week': 1, 'Month': 1/4, 'Year': 1/52, 'unit': 'Week'},
    'Month': {'value': 3, 'Day': 30, 'Week': 4, 'Month': 1, 'Year': 1/12, 'unit': 'Month'},
    'Year':  {'value': 4, 'Day': 365, 'Week': 52, 'Month': 12, 'Year': 1, 'unit': 'Year'},
}
