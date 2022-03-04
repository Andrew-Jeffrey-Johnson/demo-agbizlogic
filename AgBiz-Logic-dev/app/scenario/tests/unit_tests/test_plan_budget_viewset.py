from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate, APIClient
from scenario.views import PlanBudgetViewSet
import copy
from budget.models import Budget, IncomeItem, CostItem
from scenario.models import Plan, PlanBudget, IncomeItemInflationRate, CostItemInflationRate
from django.contrib.auth.models import User


class PlanBudgetAPITestCase(APITestCase):
    """ Test suite for the PlanBudget model REST resource.
    """

    def setUp(self):
        self.factory = APIRequestFactory()

        self.user = User.objects.create(**USER_OUTLINE)
        self.user2 = User.objects.create(**USER_OUTLINE_2)
        self.plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        self.budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        self.not_found_response_data = {'detail': "Not found."}

    def test_list(self):
        """ Test lists all objects in database.
        """

        PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(1, len(response.data))

    def test_list_with_user_parameter(self):
        """ Tests lists only objects relating to a single user.
        """

        PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )
        PlanBudget.objects.create(
            user=self.user2,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(1, len(response.data))
        self.assertEquals(200, response.status_code)

    def test_list_with_user_parameter_does_not_exist(self):
        """ Tests suppling nonexistant username returns empty
            queryset.
        """

        PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )
        PlanBudget.objects.create(
            user=self.user2,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=bob', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(0, len(response.data))
        self.assertEquals(200, response.status_code)

    def test_list_with_invalid_query_parameter_returns_empty_list(self):
        """ Tests that supplying an invalid query parameter returns an empty list.
        """

        PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?shirt=banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEqual(0, len(response.data))
        self.assertEquals(200, response.status_code)

    def test_list_field_parameter_returns_only_requested_fields(self):
        """ Test that requesting a subset of the fields via the fields
            query param returns those fields and only those fields.
        """

        PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title,position', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"position\"")
        self.assertNotContains(response, "\"space_units\"")
        self.assertNotContains(response, "\"total_space_available\"")
        self.assertNotContains(response, "\"total_space_used\"")

        self.assertEquals(200, response.status_code)

    def test_list_field_parameter_returns_ignores_invalid_fields(self):
        """ Test that requesting a subset of the fields via the fields
            query param returns those fields and only those fields
            while ignoring fields not in the model.
        """

        PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title,position,banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"position\"")
        self.assertNotContains(response, "\"space_units\"")
        self.assertNotContains(response, "\"total_space_available\"")
        self.assertNotContains(response, "\"total_space_used\"")
        self.assertNotContains(response, "\"banana\"")

        self.assertEquals(200, response.status_code)

    def test_list_no_field_parameter_returns_complete_object(self):
        """ Test that request with no fields parameter returns a complete object.
        """

        PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"position\"")
        self.assertContains(response, "\"space_units\"")
        self.assertContains(response, "\"total_space_available\"")
        self.assertContains(response, "\"total_space_used\"")

        self.assertEquals(200, response.status_code)

    def test_list_only_invalid_field_parameter_returns_complete_object(self):
        """ Test that request with only invalid fields specified returns a complete object.
        """

        PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"position\"")
        self.assertContains(response, "\"space_units\"")
        self.assertContains(response, "\"total_space_available\"")
        self.assertContains(response, "\"total_space_used\"")

        self.assertEquals(200, response.status_code)

    def test_list_field_parameter_returns_with_username(self):
        """ Test that requesting a subset of the fields via the fields
            query param returns those fields and only those fields
            works correctly when also filtered by username.
        """

        PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )
        PlanBudget.objects.create(
            user=self.user2,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title,position&username=' + self.user.username, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"position\"")
        self.assertNotContains(response, "\"space_units\"")
        self.assertNotContains(response, "\"total_space_available\"")
        self.assertNotContains(response, "\"total_space_used\"")

        self.assertEquals(1, len(response.data))
        self.assertEquals(200, response.status_code)

    def test_list_filtered_by_parent_plan(self):
        """ Test that filtering using scenario query parameter returns only PlanBudget objects associated with
            that plan.
        """

        plan1 = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        plan2 = Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        PlanBudget.objects.create(
            user=self.user,
            plan=plan1,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )
        PlanBudget.objects.create(
            user=self.user,
            plan=plan2,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?plan=' + str(plan1.pk), format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(1, len(response.data))

    def test_list_filtered_by_parent_plan_does_not_exist(self):
        """ Test that filtering using scenario query param returns
            an empty query set when the specified scenario does not exist.
        """

        plan1 = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        plan2 = Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        PlanBudget.objects.create(
            user=self.user,
            plan=plan1,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )
        PlanBudget.objects.create(
            user=self.user,
            plan=plan2,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?plan=' + str(plan1.pk + plan2.pk), format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(0, len(response.data))

    def test_list_filtered_by_parent_plan_NaN(self):
        """ Test that filtering using scenario query param returns
            an empty query set when the specified is Not A Number.
        """

        plan1 = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        plan2 = Plan.objects.create(user=self.user, **PLAN_OUTLINE)

        PlanBudget.objects.create(
            user=self.user,
            plan=plan1,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )
        PlanBudget.objects.create(
            user=self.user,
            plan=plan2,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?plan=b', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(200, response.status_code)
        self.assertEqual(0, len(response.data))

    def test_create(self):
        """ Test save object in database.
        """

        new_plan_budget = copy.deepcopy(PLAN_BUDGET_OUTLINE)
        new_plan_budget.update({
            'budget': self.budget.pk,
            'plan': self.plan.pk
        })

        viewset = PlanBudgetViewSet.as_view({'post': "create"})
        request = self.factory.post('', new_plan_budget, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(201, response.status_code)
        self.assertEqual(1, len(PlanBudget.objects.all()))

    def test_retrieve(self):
        """ Test retrieve single object instance from database.
        """

        plan_budget = PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'get': "retrieve"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, id=plan_budget.pk)

        self.assertEqual(200, response.status_code)
        self.assertEqual(plan_budget.id, response.data['id'])

    def test_update(self):
        """ Test update single instance in database.
        """

        plan_budget = PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        new_title = "Updated Plan Budget"
        updated_plan_budget = copy.deepcopy(PLAN_BUDGET_OUTLINE)
        updated_plan_budget.update({
            'plan': self.plan.pk,
            'budget': self.budget.pk,
            'title': new_title
        })

        viewset = PlanBudgetViewSet.as_view({'put': "update"})
        request = self.factory.put('', updated_plan_budget, format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, id=plan_budget.pk)

        self.assertEqual(200, response.status_code)
        self.assertEqual(new_title, response.data['title'])

    def test_destroy(self):
        """ Test destroy instance from database.
        """

        plan_budget = PlanBudget.objects.create(
            user=self.user,
            plan=self.plan,
            budget=self.budget,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = PlanBudgetViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('', format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, id=plan_budget.pk)

        self.assertEqual(204, response.status_code)

    def test_generate(self):
        """ Test /generate API route.
        """

        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=self.budget, **COST_ITEM_OUTLINE)
        fixed_cost_item = CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)
        general_cost_item = CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)

        generatePayload = {
            'plan': self.plan.pk,
            'budget': self.budget.pk,
            'module': 'profit'
        }

        viewset = PlanBudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', generatePayload, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        # Check response
        self.assertEqual(201, response.status_code)
        self.assertEqual(self.budget.title, response.data['title'])
        self.assertEqual(self.plan.id, response.data['plan'])

        # Check that objects were created
        self.assertEqual(1, len(PlanBudget.objects.all()))
        self.assertEqual(2, len(Budget.objects.all()))
        self.assertEqual(2, len(IncomeItem.objects.all()))
        self.assertEqual(6, len(CostItem.objects.all()))

    def test_generate_budget_does_not_exist(self):
        """ Test sending id of nonexistent budget to generate endpoint returns HTTP 404.
        """

        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=self.budget, **COST_ITEM_OUTLINE)
        fixed_cost_item = CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)
        general_cost_item = CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)

        generatePayload = {
            'plan': self.plan.pk,
            'budget': (self.budget.pk + 1)
        }

        viewset = PlanBudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', generatePayload, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(404, response.status_code)
        self.assertEqual(self.not_found_response_data, response.data)

    def test_generate_plan_does_not_exist(self):
        """ Test sending id of nonexistent plan to generate endpoint returns HTTP 404.
        """

        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=self.budget, **COST_ITEM_OUTLINE)
        fixed_cost_item = CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)
        general_cost_item = CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)

        generatePayload = {
            'plan': (self.plan.pk + 1),
            'budget': self.budget.pk
        }

        viewset = PlanBudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', generatePayload, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEqual(404, response.status_code)
        self.assertEqual(self.not_found_response_data, response.data)

    def test_generate_creates_inflation_rate_items(self):
        """ Test generated plan budget has inflation rate items created for each of its income/cost items.
        """

        income_item = IncomeItem.objects.create(parent_budget=self.budget, **INCOME_ITEM_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=self.budget, **COST_ITEM_OUTLINE)
        fixed_cost_item = CostItem.objects.create(parent_budget=self.budget, **FIXED_COST_ITEM_OUTLINE)
        general_cost_item = CostItem.objects.create(parent_budget=self.budget, **GENERAL_COST_ITEM_OUTLINE)

        generatePayload = {
            'plan': self.plan.pk,
            'budget': self.budget.pk,
            'module': 'profit'
        }

        viewset = PlanBudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', generatePayload, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        income_item_inflation_rates = IncomeItemInflationRate.objects.all()
        cost_item_inflation_rates = CostItemInflationRate.objects.all()

        self.assertEqual(len(IncomeItem.objects.filter(parent_budget=self.budget)), len(income_item_inflation_rates))
        # self.assertEqual(len(CostItem.objects.filter(parent_budget=self.budget)), len(cost_item_inflation_rates))


# Outlines for creating test objects

USER_OUTLINE = {
    'username': 'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email': 'johncleese@holygrail.com'
}

USER_OUTLINE_2 = {
    'username': 'ryan_reynolds',
    'first_name': 'Ryan',
    'last_name': 'Reynolds',
    'email': 'ryan_reynolds@deadpool.com'
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
    'return_total': 100.00,
}

COST_ITEM_OUTLINE = {
    'name': "Test Cost Item",
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
    'category': "post_harvest",
    'sub_category': "insurance",
    'cost_type': "fixed",
    'unit': "Acre",
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
    'unit': "Acre",
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

    'time_period_unit': "Year",
    'time_period_value': 1,

    'discount_rate': 19.0,

    'beginning_investment': 100.00,
    'ending_investment': 200.00,

    'lease_type': "Default",
    'land_market_value': 1000.00,
    'annual_land_rate': 32.0,
    'required_roi': 20.0,
    'investment_inflation': 10.0,
}

PLAN_BUDGET_OUTLINE = {
    'title': "Test Plan Budget",
    'position': 0,

    'space_units': "Acre",
    'total_space_available': 250,
    'total_space_used': 150,
}

INCOME_ITEM_INFLATION_RATE_OUTLINE = {
    'inflation_rate': '10.00',
}

COST_ITEM_INFLATION_RATE_OUTLINE = {
    'inflation_rate': '15.00',
}
