from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.renderers import JSONRenderer
from scenario.serializers import PlanSerializer
from budget.models import Budget, IncomeItem, CostItem
from scenario.models import Scenario, Plan, PlanBudget, IncomeItemInflationRate, CostItemInflationRate
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
import paho.mqtt.client as mqtt
import copy
import json
from datetime import datetime



class PlanViewSet(ModelViewSet):
    """ API endpoint for Plan model.
    """

    serializer_class = PlanSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Plan objects. Invalid arguments return empty queryset.
        """
        queryset = Plan.objects.all()

        # If there are query parameters that aren't supported, return empty array
        for key in self.request.query_params.keys():
            if key not in {'username', 'scenario', 'module', 'fields'}:
                queryset = None

        # Filter by username
        if "username" in self.request.query_params:
            try:
                user = User.objects.filter(username=self.request.query_params["username"])[0]

                # Filter by module
                if "module" in self.request.query_params:
                    module = self.request.query_params["module"]
                    queryset = Plan.objects.filter(user=user, module=module)
                else:
                    queryset = Plan.objects.filter(user=user)

            except IndexError:
                queryset = None

        # Filter by parent scenario id
        elif "scenario" in self.request.query_params:
            try:
                scenario_query = Scenario.objects.filter(pk=self.request.query_params['scenario'])

                if scenario_query:
                    queryset = Plan.objects.filter(scenario=scenario_query[0])
                else:
                    queryset = None

            except (ValueError):
                queryset = None

        return queryset


    def perform_create(self, serializer):
        """ Override this method to add user to new object, then save to database.
        """

        serializer.save(user=self.request.user)


    @action(detail=False, methods=['get'])
    def set_time_period(self, request, pk=None):
        """ DEPRECATED: Time period logic moved to data layer. This endpoint now simply returns the requested Plan,
            because all time period logic occurs when PlanBudget objects are added or removed.
        """

        plan = Plan.objects.filter(id=pk)[0]
        serializer = self.get_serializer(plan)

        return Response(serializer.data)


    @action(detail=True, methods=['post'])
    def copy(self, request, pk=None):
        """ Accepts a POST request containing a payload with the id of a Scenario. Creates a copy of the Plan resource,
            including all associated PlanBudgets, Budgets, and their associated IncomeItem and CostItem objects.
            Associates the new Plan with the Scenario matching the id in the payload.

            If the copied plan is not attached to scenario, copy_plan.scenario = None (used when copy a plan in plan manager).

            Returns the new Plan.
        """

        response = None

        if request.data["scenario"] != -1:
            try:
                scenario = Scenario.objects.get(pk=request.data["scenario"])
            except KeyError:
                response = Response({"error": "Missing 'scenario' in payload body."}, 400)
            except ObjectDoesNotExist:
                response = Response({"error": "Scenario with given ID does not exist."}, 404)


        if response is None:
            #copy_plan = None
            try:
                plan = Plan.objects.get(pk=pk)
                copy_plan = copy.deepcopy(plan)
                copy_plan.id = None
                copy_plan.module = "copy"
                copy_plan.source = pk
                #clear profit fields
                copy_plan.discount_rate = 0
                copy_plan.beginning_investment = 0
                copy_plan.ending_investment = 0
                copy_plan.internal_rate_of_return = 0

                if request.data["scenario"] != -1:
                    copy_plan.scenario = scenario
                    copy_plan.title = copy_plan.title
                    copy_plan.scenario_list = scenario.title
                else:
                    copy_plan.scenario = None

                now = datetime.now()
                copy_plan.modified_date= now.strftime("%Y-%m-%d %H:%M:%S+00:00")

                copy_plan.save()


                for plan_budget_item in PlanBudget.objects.filter(plan=plan):
                    copy_budget = copy.deepcopy(plan_budget_item.budget)
                    copy_budget.id = None
                    copy_budget.save()

                    for income_item in IncomeItem.objects.filter(parent_budget=plan_budget_item.budget):
                        copy_income_item = copy.deepcopy(income_item)
                        copy_income_item.id = None
                        copy_income_item.parent_budget = copy_budget
                        copy_income_item.save()

                    for cost_item in CostItem.objects.filter(parent_budget=plan_budget_item.budget):
                        copy_cost_item = copy.deepcopy(cost_item)
                        copy_cost_item.id = None
                        copy_cost_item.parent_budget = copy_budget
                        copy_cost_item.save()

                    copy_plan_budget = copy.deepcopy(plan_budget_item)
                    copy_plan_budget.id = None
                    copy_plan_budget.plan = copy_plan
                    copy_plan_budget.budget = copy_budget
                    copy_plan_budget.save()

                    for income_item_inflation_rate_item in IncomeItemInflationRate.objects.filter(plan_budget=plan_budget_item):
                        copy_income_item_inflation_rate_item = copy.deepcopy(income_item_inflation_rate_item)
                        copy_income_item_inflation_rate_item.id = None
                        copy_income_item_inflation_rate_item.income_item = None
                        try:
                            new_item = IncomeItem.objects.filter(parent_budget=copy_budget, name=copy_income_item_inflation_rate_item.name).get()
                            copy_income_item_inflation_rate_item.income_item = new_item
                        except ObjectDoesNotExist:
                            copy_income_item_inflation_rate_item.income_item = None
                        copy_income_item_inflation_rate_item.plan_budget = copy_plan_budget
                        copy_income_item_inflation_rate_item.save()

                    for cost_item_inflation_rate_item in CostItemInflationRate.objects.filter(plan_budget=plan_budget_item):
                        copy_cost_item_inflation_rate_item = copy.deepcopy(cost_item_inflation_rate_item)
                        copy_cost_item_inflation_rate_item.id = None
                        copy_cost_item_inflation_rate_item.cost_item = None
                        try:
                            new_item = CostItem.objects.filter(parent_budget=copy_budget, name=copy_cost_item_inflation_rate_item.name).get()
                            copy_cost_item_inflation_rate_item.cost_item = new_item
                        except ObjectDoesNotExist:
                            copy_cost_item_inflation_rate_item.cost_item = None

                        copy_cost_item_inflation_rate_item.plan_budget = copy_plan_budget
                        copy_cost_item_inflation_rate_item.save()

                serializer = PlanSerializer(copy_plan)
                response = Response(serializer.data, status=201)

            except ObjectDoesNotExist:
                response = Response({"error": "Plan does not exist"}, status=404)

        return response


    @action(detail=True, methods=['get'])
    def calculate_irr(self, request, pk=None):
        """ Returns the 'internal_rate_of_return' property of the Plan. This is a seperate method because it is
            computationally slow and should not be serialized with the rest of the fields to improve UX.

            Works by retrieving the plan, publishing the JSON to an MQTT broker, subscribing to the result, and
            returning the calculated IRR payload.
        """

        try:
            plan = Plan.objects.get(pk=pk)
        except:
            raise ObjectDoesNotExist

        response = {
            "id": plan.pk,
            "internal_rate_of_return": 0
        }

        def on_connect(client, userdata, flags, rc):
            payload = JSONRenderer().render({'action': 'retrieve', 'data': PlanSerializer(plan).data})

            client.subscribe('plans/' + str(plan.pk) + '/calculate_irr')
            client.publish('plans/' + str(plan.pk) + '/calculate_irr', payload=payload)

        def on_message(client, userdata, msg):
            payload = json.loads(msg.payload)

            if payload['action'] == 'response':
                response['internal_rate_of_return'] = payload['data']['internal_rate_of_return']
                client.disconnect()

        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_message = on_message
        client.connect(host="54.202.148.216", port=1883)
        client.loop_forever()

        return Response(response, status=200)



################################################################################
#                            Helper Functions
################################################################################


# Converion table
CONVERSION_TABLE = {
    'Day':   {'value': 1, 'Day': 1, 'Week': 0.14, 'Month': 0.03, 'Year': 0.003, 'unit': 'Day', 'n': 365},
    'Week':  {'value': 2, 'Day': 7, 'Week': 1, 'Month': 0.25, 'Year': 0.019, 'unit': 'Week', 'n': 52},
    'Month': {'value': 3, 'Day': 30, 'Week': 4, 'Month': 1, 'Year': 0.08, 'unit': 'Month', 'n': 12},
    'Year':  {'value': 4, 'Day': 365, 'Week': 52, 'Month': 12, 'Year': 1, 'unit': 'Year', 'n': 1},
}
