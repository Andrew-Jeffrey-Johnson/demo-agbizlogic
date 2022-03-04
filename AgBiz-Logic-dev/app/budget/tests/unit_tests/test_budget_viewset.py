from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate, force_authenticate
from allocate.models import BusinessData, EnterpriseData
from budget.models import Budget, IncomeItem, CostItem
from registration.models import Business, ScheduleF
from budget.views import BudgetViewSet, get_allocate_data
from budget.serializers import BudgetSerializer
from climate.models import ClimateBudget, ClimateScenario
from scenario.models import Plan, PlanBudget
from django.contrib.auth.models import User
from decimal import *
import copy



class BudgetAPITestCase(APITestCase):
    """ Test suite for the Budget model REST API.
    """

    def setUp(self):
        """ Set the request factory, viewset, users, and base URL.
        """

        self.factory = APIRequestFactory()
        self.user = User.objects.create(**USER)
        self.user_2 = User.objects.create(**USER_2)
        self.business = Business.objects.create(user=self.user, **BUSINESS_OUTLINE)
        self.schedule_f = ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)


    def test_list(self):
        """ Test list all objects in database.
        """

        Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(2, len(response.data))


    def test_list_filter_model_fields(self):
        """ Test list returns objects with only the fields specified in the 'fields' query parameter.

            URL pattern: '/budgets/?fields={comma_seperated_list}'
        """

        number_of_objects = 100
        fields = "enterprise,state,region"

        for i in range(0, number_of_objects):
            Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=' + fields, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(number_of_objects, len(response.data))
        for budget in response.data:
            self.assertEquals(3, len(budget.keys()))
            for key in budget.keys():
                self.assertEquals(True, key in fields)


    def test_list_fiter_by_username(self):
        """ Test filtering of objects using 'username' URL query argument returns an array of objects associated with that user.

            URL pattern: '/budgets/?username={username}/'
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        Budget.objects.create(user=self.user_2, **BUDGET_OUTLINE_2)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=' + self.user.get_username(), format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEquals(1, len(response.data))
        self.assertEquals(budget.title, response.data[0]['title'])


    def test_list_filter_by_module(self):
        """ Test filtering of objects using 'module' URL query parameter returns an array of objects with 'module'
            field value matching the parameter.
        """

        num = 10
        for i in range(0, num):
            Budget.objects.create(user=self.user, module="climate", **BUDGET_OUTLINE)
            Budget.objects.create(user=self.user, module="plan", **BUDGET_OUTLINE)
            Budget.objects.create(user=self.user, module="profit", **BUDGET_OUTLINE)
            Budget.objects.create(user=self.user, module="allocate", **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=' + self.user.get_username() + "&module=allocate", format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEquals(num, len(response.data))


    def test_retrieve_query_user_invalid(self):
        """ Test filtering using a username that does not exist returns empty array.
        """

        Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=ryan_reynolds', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(0, len(response.data))


    def test_retrieve_query_invalid(self):
        """ Test filtering using an unsupported query parameter returns empty array.
        """

        Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?shirt=bananas', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertEquals(0, len(response.data))


    def test_retrieve_query_field_valid(self):
        """Test filtering of fields based on fields parameter
        """

        Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title,notes', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"notes\"")

        self.assertNotContains(response, "\"enterprise\"")
        self.assertNotContains(response, "\"descriptor1\"")
        self.assertNotContains(response, "\"descriptor2\"")
        self.assertNotContains(response, "\"market\"")

        self.assertNotContains(response, "\"state\"")
        self.assertNotContains(response, "\"region\"")

        self.assertNotContains(response, "\"time_unit\"")
        self.assertNotContains(response, "\"time_value\"")
        self.assertNotContains(response, "\"farm_unit\"")
        self.assertNotContains(response, "\"farm_unit_quantity\"")

        self.assertEqual(200, response.status_code)


    def test_retrieve_query_field_ignores_invalid(self):
        """Test filtering of fields based on fields parameter ignore invalid fields
        """

        Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=title,notes,banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"notes\"")
        self.assertNotContains(response, "\"enterprise\"")
        self.assertNotContains(response, "\"descriptor1\"")
        self.assertNotContains(response, "\"descriptor2\"")
        self.assertNotContains(response, "\"market\"")

        self.assertNotContains(response, "\"state\"")
        self.assertNotContains(response, "\"region\"")

        self.assertNotContains(response, "\"time_unit\"")
        self.assertNotContains(response, "\"time_value\"")
        self.assertNotContains(response, "\"farm_unit\"")
        self.assertNotContains(response, "\"farm_unit_quantity\"")

        self.assertEqual(200, response.status_code)


    def test_retrieve_query_field_only_invalid_fields(self):
        """Test filtering of fields based on fields parameter
            with only invalid fields returns entire object
        """

        Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=banana', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertContains(response, "\"title\"")
        self.assertContains(response, "\"notes\"")
        self.assertContains(response, "\"enterprise\"")
        self.assertContains(response, "\"descriptor1\"")
        self.assertContains(response, "\"descriptor2\"")
        self.assertContains(response, "\"market\"")

        self.assertContains(response, "\"state\"")
        self.assertContains(response, "\"region\"")

        self.assertContains(response, "\"time_unit\"")
        self.assertContains(response, "\"time_value\"")
        self.assertContains(response, "\"farm_unit\"")
        self.assertContains(response, "\"farm_unit_quantity\"")

        self.assertEqual(200, response.status_code)


    def test_retrieve_user_object_not_being_returned(self):
        """test that the user object is not being returned as part of the Budget
       """

        Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        self.assertNotContains(response, "\"user\"")
        self.assertNotContains(response, "\"User\"")

        self.assertEquals(200, response.status_code)


    def test_retrieve_filter_model_fields(self):
        """ Test retrieve returns object with only the fields specified in the 'fields' query parameter.

            URL pattern: '/budgets/{budget_id}/?fields={comma_seperated_list}'
        """

        fields = "enterprise,state,region"
        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "retrieve"})
        request = self.factory.get('/?fields=' + fields, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, id=budget.pk)

        self.assertEquals(200, response.status_code)
        self.assertEquals(3, len(response.data.keys()))
        for key in response.data.keys():
            self.assertEquals(True, key in fields)


    def test_retrieve_cost_items(self):
        """ Test retrieve associated CostItem objects.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        cost_item = CostItem.objects.create(parent_budget=budget, **VARIABLE_COST_ITEM_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        cost_items = response.data[0]['cost_items']

        self.assertEquals(1, len(cost_items))
        self.assertEquals(cost_item.name, cost_items[0]['name'])


    def test_retrieve_income_items(self):
        """ Test retrieve associated IncomeItem objects.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        income_item = IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)

        viewset = BudgetViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request)

        income_items = response.data[0]['income_items']

        self.assertEquals(1, len(income_items))
        self.assertEquals(income_item.name, income_items[0]['name'])


    def test_create(self):
        """ Test create action.
        """

        viewset = BudgetViewSet.as_view({'post': "create"})
        request = self.factory.post('', BUDGET_OUTLINE, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEquals(201, response.status_code)
        self.assertEquals(BUDGET_OUTLINE['title'], response.data['title'])


    def test_update(self):
        """ Test update action.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        budget_updated = copy.deepcopy(BUDGET_OUTLINE)
        budget_updated.update({'title': "Updated Title"})

        viewset = BudgetViewSet.as_view({'put': "update"})
        request = self.factory.put('', budget_updated)
        force_authenticate(request, user=self.user)
        response = viewset(request, id=budget.pk)

        self.assertEquals(200, response.status_code)
        self.assertEquals(budget_updated['title'], response.data['title'])


    def test_destroy(self):
        """ Test destroy action.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, id=budget.pk)

        self.assertEquals(204, response.status_code)


    def test_destroy_resets_climate_budgets_positions(self):
        """ Test delete() method is explicitely called on the associated ClimateBudget
            (if there is one), resulting in the resetting the 'position' fields of
            the remaining ClimateBudget objects in the ClimateScenario.

            This is needed because the default Django behavior is to bypass the object's
            delete() method if it's ForeignKey object is deleted.
        """

        budget_1 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        budget_2 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        climate_scenario = ClimateScenario.objects.create(user=self.user, **CLIMATE_SCENARIO_OUTLINE)
        climate_budget_1 = ClimateBudget.objects.create(
            user=self.user,
            budget=budget_1,
            is_original=True,
            climate_scenario=climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )
        climate_budget_2 = ClimateBudget.objects.create(
            user=self.user,
            budget=budget_2,
            is_original=True,
            climate_scenario=climate_scenario,
            **CLIMATE_BUDGET_OUTLINE
        )

        viewset = BudgetViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, id=budget_1.pk)

        climate_budget_2 = ClimateBudget.objects.get(id=climate_budget_2.id)

        self.assertEquals(0, climate_budget_2.position)
        self.assertEqual(1, len(ClimateBudget.objects.all()))


    def test_destroy_resets_plan_budgets_positions(self):
        """ Test delete() method is explicitely called on the associated PlanBudget
            (if there is one), resulting in resetting the 'position' field of the
            remaining PlanBudget objects in the Scenario.

            This is needed because the default Django behavior is to bypass the object's
            delete() method if it's ForeignKey object is deleted.
        """

        budget_1 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        budget_2 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        plan = Plan.objects.create(user=self.user, **PLAN_OUTLINE)
        plan_budget_1 = PlanBudget.objects.create(
            user=self.user,
            budget=budget_1,
            plan=plan,
            **PLAN_BUDGET_OUTLINE
        )
        plan_budget_2 = PlanBudget.objects.create(
            user=self.user,
            budget=budget_2,
            plan=plan,
            **PLAN_BUDGET_OUTLINE
        )

        viewset = BudgetViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, id=budget_1.pk)

        plan_budget_2 = PlanBudget.objects.get(id=plan_budget_2.id)

        self.assertEquals(0, plan_budget_2.position)
        self.assertEqual(1, len(PlanBudget.objects.all()))



    def test_combine_budgets_valid(self):
        """ Test sending POST request to this endpoint creates a new combined budget
            from the POST data.
        """

        budget_1 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        budget_2 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE_2)
        income_item_1 = IncomeItem.objects.create(parent_budget=budget_1, **INCOME_ITEM_OUTLINE)
        income_item_2 = IncomeItem.objects.create(parent_budget=budget_2, **INCOME_ITEM_OUTLINE)
        cost_item_1 = CostItem.objects.create(parent_budget=budget_1, **VARIABLE_COST_ITEM_OUTLINE)
        cost_item_2 = CostItem.objects.create(parent_budget=budget_2, **GENERAL_COST_ITEM_OUTLINE)

        viewset = BudgetViewSet.as_view({'post': "combine"})
        request = self.factory.post("combine", {'budgets': [budget_1.id, budget_2.id]}, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        combined_budget = Budget.objects.get(id=response.data["id"])

        self.assertEquals("Combined Budget", response.data['title'])
        self.assertEquals(2, len(response.data['cost_items']))
        self.assertEquals(2, len(response.data['income_items']))
        self.assertEquals(201, response.status_code)


    def test_combine_budgets_sets_module_to_allocate(self):
        """ Test sending POST request to this endpoint creates a new combined budget
            from the POST data with 'module' field equal to 'allocate'.
        """

        budget_1 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        budget_2 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE_2)

        viewset = BudgetViewSet.as_view({'post': "combine"})
        request = self.factory.post("combine", {'budgets': [budget_1.id, budget_2.id]}, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        combined_budget = Budget.objects.get(id=response.data["id"])

        self.assertEqual("allocate", combined_budget.module)
        self.assertEquals(201, response.status_code)


    def test_combine_budgets_sets_source_to_source_ids(self):
        """ Test sending POST request to this endpoint creates a new combined budget
            from the POST data with 'source' field equal to a comma-seperated list of the id's of the combined budgets.
        """

        budget_1 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        budget_2 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE_2)

        viewset = BudgetViewSet.as_view({'post': "combine"})
        request = self.factory.post("combine", {'budgets': [budget_1.id, budget_2.id]}, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        combined_budget = Budget.objects.get(id=response.data["id"])

        self.assertEqual(str(budget_1.id) + "," + str(budget_2.id) + ",", combined_budget.source)
        self.assertEquals(201, response.status_code)



    def test_combine_budgets_invalid(self):
        """ Test sending id's of nonexistant Budget objects returns error message.
        """

        budget_1 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        budget_2 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE_2)

        viewset = BudgetViewSet.as_view({'post': "combine"})
        request = self.factory.post("combine", {'budgets': [929, 333]}, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEquals({u'detail': u'Malformed request.'}, response.data)
        self.assertEquals(400, response.status_code)


    def test_combine_empty_list_of_budgets(self):
        """ test sending an empty list of budgets to combine
        """

        budget_1 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        budget_2 = Budget.objects.create(user=self.user, **BUDGET_OUTLINE_2)

        viewset = BudgetViewSet.as_view({'post': "combine"})
        request = self.factory.post("combine", {'budgets': ""}, format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        self.assertEquals([], response.data)
        self.assertEquals(400, response.status_code)


    def test_copy(self):
        """ Test copying a Budget.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'post': "copy"})
        request = self.factory.post('', format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, id=budget.id)

        self.assertEquals(201, response.status_code)
        self.assertEquals(budget.title, response.data['title'])
        self.assertEqual(str(budget.id), Budget.objects.get(id=response.data['id']).source)


    def test_copy_with_subitems(self):
        """ Test copying a budget with income and cost items.
        """

        budget = Budget.objects.create(user = self.user, **BUDGET_OUTLINE)
        incomeItem = IncomeItem.objects.create(parent_budget = budget, **INCOME_ITEM_OUTLINE)
        fixedCostItem = CostItem.objects.create(parent_budget = budget, **FIXED_COST_ITEM_OUTLINE)
        variableCostItem = CostItem.objects.create(parent_budget = budget, **VARIABLE_COST_ITEM_OUTLINE)
        generalCostItem = CostItem.objects.create(parent_budget = budget, **GENERAL_COST_ITEM_OUTLINE)

        viewset = BudgetViewSet.as_view({'post': "copy"})
        request = self.factory.post('', format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, id = budget.id)

        self.assertEquals(budget.title, response.data['title'])
        self.assertEquals(3, len(response.data['cost_items']))
        self.assertEquals(1, len(response.data['income_items']))
        self.assertEquals(201, response.status_code)


    def test_copy_does_not_exist(self):
        """ Test that attempting to copy a budget that does not exist will
            return HTTP 400.
        """

        viewset = BudgetViewSet.as_view({'post': "copy"})
        request = self.factory.post('', format='json')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request, id=1)

        self.assertEquals(400, response.status_code)


    def test_generate_creates_allocate_budgets(self):
        """ Test that simple Budget objects are created based on the user's allocated EnterpriseData objects.
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_2)

        viewset = BudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        budgets = Budget.objects.filter(user=self.user)

        self.assertEquals(3, len(budgets))


    def test_generate_sets_farm_unit_to_total(self):
        """ Test that the generated Budgets and their associated IncomeItem and CostItem objects have 'farm_unit' set
            to 'Total'.
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_2)

        viewset = BudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        for budget in Budget.objects.filter(user=self.user):
            self.assertEqual('Total', budget.farm_unit)
            for income_item in IncomeItem.objects.filter(parent_budget=budget):
                self.assertEqual('Total', income_item.farm_unit)
            for cost_item in CostItem.objects.filter(parent_budget=budget):
                self.assertEqual('Total', cost_item.farm_unit)


    def test_generate_sets_module_to_allocate(self):
        """ Test that simple Budget objects are created with 'module' field equal to 'allocate'.
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_2)

        viewset = BudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        budgets = Budget.objects.filter(user=self.user)

        self.assertEquals(3, len(budgets))
        for budget in budgets:
            self.assertEqual("allocate", budget.module)


    def test_generate_sets_state_to_match_business(self):
        """ Test that the generated Budget objects 'state' field matches the 'state' field in the Business object
            from the registration module.
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_2)

        viewset = BudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        budgets = Budget.objects.filter(user=self.user)

        for budget in budgets:
            self.assertEqual(BUSINESS_OUTLINE["state"], budget.state)


    def test_generate_no_business_sets_default(self):
        """ Test that the generated Budget objects' 'state' field is set to default value of "OR" if no Business object
            exists for the request user.
        """

        self.business.delete()
        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_2)

        viewset = BudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        budgets = Budget.objects.filter(user=self.user)

        for budget in budgets:
            self.assertEqual("OR", budget.state)


    def test_generate_creates_whole_farm_budget(self):
        """ Test that a Budget object is created using the difference of the total BusinessData fields minus ScheduleF fields.
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)

        viewset = BudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        whole_farm_budget = Budget.objects.filter(title="Whole Farm Budget")[0]
        whole_farm_income = IncomeItem.objects.filter(parent_budget=whole_farm_budget)
        whole_farm_cost_list = CostItem.objects.filter(parent_budget=whole_farm_budget)
        allocate_data = get_allocate_data(self.user)

        income_total = 0
        for field, value in BUSINESS_DATA_OUTLINE_1.iteritems():
            if "expenses" in field and "other" not in field:
                cost_total = value - allocate_data[field]['total']
                if cost_total > 0:
                    self.assertEquals(cost_total, CostItem.objects.filter(parent_budget=whole_farm_budget, name=EXPENSES_LABELS[field])[0].cost_total)

            elif "_label" in field:
                cost_total = BUSINESS_DATA_OUTLINE_1[field.replace("_label", "")] - allocate_data[field.replace("_label", "")]['total']
                if cost_total > 0:
                    self.assertEquals(cost_total, CostItem.objects.filter(parent_budget=whole_farm_budget, name=value)[0].cost_total)

            elif "income" in field:
                income_total = (allocate_data[field]['total'] - value)

                if income_total > 0:
                    self.assertEquals(income_total, IncomeItem.objects.filter(parent_budget=whole_farm_budget).values('return_total')[0]['return_total'])


    def test_generate_creates_whole_farm_budget_when_existing_budgets(self):
        """ Tests that a Whole Farm budget is created correctly if there are existing budgets.
            Used to test the edge case if user deletes only their Whole Farm budget, then the budget home view auto-generates their budgets.
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)
        Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        whole_farm_budget = Budget.objects.filter(title="Whole Farm Budget")[0]
        whole_farm_income = IncomeItem.objects.filter(parent_budget=whole_farm_budget)[0]
        whole_farm_cost_list = CostItem.objects.filter(parent_budget=whole_farm_budget)
        allocate_data = get_allocate_data(self.user)

        income_total = 0
        for field, value in BUSINESS_DATA_OUTLINE_1.iteritems():
            if "expenses" in field and "other" not in field:
                cost_total = value - allocate_data[field]['total']
                if cost_total > 0:
                    self.assertEquals(cost_total, CostItem.objects.filter(parent_budget=whole_farm_budget, name=EXPENSES_LABELS[field])[0].cost_total)

            elif "_label" in field:
                cost_total = BUSINESS_DATA_OUTLINE_1[field.replace("_label", "")] - allocate_data[field.replace("_label", "")]['total']
                if cost_total > 0:
                    self.assertEquals(cost_total, CostItem.objects.filter(parent_budget=whole_farm_budget, name=value)[0].cost_total)

            elif "income" in field:
                income_total = (allocate_data[field]['total'] - value)

                if income_total > 0:
                    self.assertEquals(income_total, IncomeItem.objects.filter(parent_budget=whole_farm_budget).values('return_total')[0]['return_total'])


    def test_generate_creates_income_items(self):
        """ Test that an IncomeItem is created for each nonzero Gold Standard income category and associated with the
            Budget object.
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_3)

        viewset = BudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        budget = Budget.objects.filter(user=self.user)[0]
        income_items = IncomeItem.objects.filter(parent_budget=budget)
        income_categories = {}
        total_income = 0
        for field, value in BUSINESS_DATA_OUTLINE_1.iteritems():
            if "income_" in field:
                income_categories[field] = value
                total_income += value

        self.assertEqual(len(income_categories.keys()), len(income_items))
        self.assertEquals(total_income, budget.total_gross_returns)


    def test_generate_creates_general_cost_items(self):
        """ Test that CostItem objects are created for each nonzero Gold Standard category.
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_OUTLINE_1)
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)

        viewset = BudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = viewset(request)

        budget = Budget.objects.filter(title=ENTERPRISE_OUTLINE_1['category_1'] + " - " + ENTERPRISE_OUTLINE_1['category_2'])[0]
        cost_items = CostItem.objects.filter(parent_budget=budget)

        self.assertEquals(3, len(cost_items))
        self.assertEquals(600, budget.total_costs)


    def test_generate_does_not_create_duplicate_budgets(self):
        """ Test that duplicate Budget objects are not created if the view is called more than once.
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_OUTLINE_1)
        enterprise = EnterpriseData.objects.create(user=self.user, **ENTERPRISE_OUTLINE_1)

        viewset = BudgetViewSet.as_view({'post': "generate"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user

        # Call the view multiple times
        viewset(request)
        viewset(request)

        budgets = Budget.objects.filter(user=self.user)

        self.assertEquals(2, len(budgets))


    def test_adjust_net_returns_invalid_payload(self):
        """ Test sending POST with invalid payload to '/adjust_net_returns' returns HTTP 400.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        for i in range(0, 2):
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)

        viewset = BudgetViewSet.as_view({'post': "adjust_net_returns"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, id=budget.id)

        self.assertEqual(400, response.status_code)


    def test_adjust_net_returns_invalid(self):
        """ Test sending POST to nonexistant Budget returns HTTP 404.
        """

        viewset = BudgetViewSet.as_view({'post': "adjust_net_returns"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, id=765)

        self.assertEqual(404, response.status_code)


    def test_adjust_net_returns_valid(self):
        """ Test sending valid payload to endpoint multiplies all associated IncomeItem objects' 'return_total' fields
            by the 'percent' in request payload and returns HTTP 200 and empty response payload.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        for i in range(0, 2):
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        percent = 12.9

        viewset = BudgetViewSet.as_view({'post': "adjust_net_returns"})
        request = self.factory.post('', {'percent': percent}, format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, id=budget.id)

        self.assertEqual(200, response.status_code)
        for income_item in IncomeItem.objects.filter(parent_budget=budget.id):
            expected_total = Decimal(INCOME_ITEM_OUTLINE["return_total"] * ((percent / 100) + 1))
            self.assertEqual(expected_total, float(income_item.return_total))


    def test_adjust_net_returns_valid_sale_unit_quantity(self):
        """ Test sending valid payload to endpoint multiplies all associated IncomeItem objects' 'sale_unit_quantity'
            fields by the 'percent' in request payload and returns HTTP 200 and empty response payload.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        for i in range(0, 2):
            IncomeItem.objects.create(parent_budget=budget, **INCOME_ITEM_OUTLINE)
        percent = 54.2

        viewset = BudgetViewSet.as_view({'post': "adjust_net_returns"})
        request = self.factory.post('', {'percent': percent}, format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, id=budget.id)

        self.assertEqual(200, response.status_code)
        for income_item in IncomeItem.objects.filter(parent_budget=budget.id):
            expected_total = Decimal(INCOME_ITEM_OUTLINE["sale_unit_quantity"] * ((percent / 100) + 1)).quantize(Decimal('0.01'))
            self.assertEqual(expected_total, income_item.sale_unit_quantity)


    def test_scale_farm_unit_quantity_invalid(self):
        """ Test sending invalid payload to endpoint returns HTTP 400.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)

        viewset = BudgetViewSet.as_view({'post': "scale_farm_unit_quantity"})
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, id=budget.id)

        self.assertEqual(400, response.status_code)


    def test_scale_farm_unit_quantity_valid(self):
        """ Test sending valid payload to endpoint returns HTTP 200.
        """

        budget = Budget.objects.create(user=self.user, **BUDGET_OUTLINE)
        payload = {'new_farm_unit_quantity': 40}

        viewset = BudgetViewSet.as_view({'post': "scale_farm_unit_quantity"})
        request = self.factory.post('', payload, format="json")
        force_authenticate(request, user=self.user)
        response = viewset(request, id=budget.id)

        updated_budget = Budget.objects.get(id=budget.id)

        self.assertEqual(200, response.status_code)
        self.assertEqual({'status': "farm_unit_quantity updated"}, response.data)
        self.assertEqual(payload['new_farm_unit_quantity'], updated_budget.farm_unit_quantity)



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

    'unit': 'Acre',
    'unit_quantity': 10,
    'cost_total': 100.00,
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
PLAN_OUTLINE = {
    'title': "Test Plan Budget",
    'notes': "Notes on test plan budget",

    'time_period_unit': "Year",
    'time_period_value': 2,

    'discount_rate': 23.22,

    'beginning_investment': 10000.00,
    'ending_investment': 300000.00,

    'lease_type': "",
    'land_market_value': 20000.00,
    'annual_land_rate': 20.10,
    'required_roi': 200000.00,
    'investment_inflation': 18.29,
}
PLAN_BUDGET_OUTLINE = {
    'title': "Test Plan",

    'space_units': "acres",
    'total_space_available': 200,
    'total_space_used': 100,
}
BUSINESS_DATA_OUTLINE_1 = {
    'business_type': "Crop",

    'income_sales': 200000,
    'income_cooperative': 10000,
    'income_custom_hire': 15000,
    'income_other': 20000,

    'expenses_goods': 10000,
    'expenses_car': 10000,
    'expenses_other_1_label': "Another Expense",
    'expenses_other_1': 1000,
}
ENTERPRISE_OUTLINE_1 = {
    'enterprise': "Crop",
    'category_1': "Cereal Grains",
    'category_2': "Wheat",
    'market': "GMO",

    'income_sales': 100,

    'expenses_goods': 50,
    'expenses_car': 50,
    'expenses_other_1_label': "Another Expense",
    'expenses_other_1': 500,
}
ENTERPRISE_OUTLINE_2 = {
    'enterprise': "Crop",
    'category_1': "Cereal Grains",
    'category_2': "Barley",
    'market': "Conventional",

    'income_sales': 100,

    'expenses_goods': 50,
    'expenses_other_1_label': "Another Expense",
    'expenses_other_1': 500,
}
ENTERPRISE_OUTLINE_3 = {
    'enterprise': "Crop",
    'category_1': "Cereal Grains",
    'category_2': "Barley",
    'market': "Conventional",

    'income_sales': 200000,
    'income_cooperative': 10000,
    'income_custom_hire': 15000,
    'income_other': 20000,

    'expenses_goods': 10000,
    'expenses_car': 10000,
    'expenses_other_1': 1000,
}
BUSINESS_OUTLINE = {
    'name': "Flying Circus",
    'address1': "Somewhere in England",
    'address2': "Somewhere in...",
    'zipcode': "80085",
    'city': "Don't know",
    'state': "Louisiana",
    'industry': "Comedy",
    'primary_business': "Making funnies",
    'secondary_business': "World Domination",
}
SCHEDULE_F_OUTLINE = {
    'line_1_b': "50,000",
    'line_1_c': "500,000",
    'line_2': "3,500,000",
    'gross_income': "4,224,000",
    'line_10': "10,000",
    'line_21_a': "300,000",
    'line_21_b': "50,000",
    'line_32_a': "10,000",
    'line_32_b': "50,000",
    'total_expenses': "2,072,000",
    'net_profit': "2,152,000",
    'other_expense_1': "Another Expense",
    'other_expense_2': "Other miscellaneous",
}
INCOME_LABELS = {
    'income_sales': "",
    'income_cooperative': "Cooperative distributions received",
    'income_agriculture_programs': "Agricultural program payments",
    'income_insurance': "Crop insurance proceeds and federal crop disaster payments",
    'income_custom_hire': "Custom hire income",
    'income_other': "Other Income",
}
EXPENSES_LABELS = {
    'expenses_goods': 'Cost of Goods Sold',
    'expenses_car': 'Car and Truck Expenses',
    'expenses_chemicals': 'Chemicals',
    'expenses_conservation': 'Conservation Expenses',
    'expenses_custom_hire': 'Custom Hire',
    'expenses_depreciation': 'L-T asset replacement & section 179 expenses',
    'expenses_employee_benefit': 'Employee Benefit Programs',
    'expenses_feed': 'Feed',
    'expenses_fertilizers': 'Fertilizers and Lime',
    'expenses_freight': 'Freight and Trucking',
    'expenses_gasoline': 'Gasoline, Fuel, and Oil',
    'expenses_insurance': 'Insurance (other than health)',
    'expenses_interest_mortgages': 'Interest on Loans and Mortgages',
    'expenses_labor': 'Labor Hired (less employment credits)',
    'expenses_pension': 'Pension and Profit-Sharing Plans',
    'expenses_machinery_rent': 'Rent and leases: Machinery, equipment and vehicles',
    'expenses_land_rent': 'Rent and leases: Land and animals',
    'expenses_repairs': 'Repairs and Maintenance',
    'expenses_seeds': 'Seeds and Plants',
    'expenses_storage': 'Storage and Warehousing',
    'expenses_supplies': 'Supplies',
    'expenses_property_taxes': 'Property Taxes',
    'expenses_utilities': 'Utilities',
    'expenses_veterinary': 'Veterinary, Breeding, and Medicine',
    'expenses_other_1': 'Other expenses',
    'expenses_other_2': 'Other expenses',
    'expenses_other_3': 'Other expenses',
    'expenses_other_4': 'Other expenses',
    'expenses_other_5': 'Other expenses',
    'expenses_other_6': 'Other expenses',
}
