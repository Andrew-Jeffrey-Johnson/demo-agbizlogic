from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from scenario.serializers import ScenarioSerializer
from scenario.models import Scenario, Plan, PlanBudget, CostItemInflationRate
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from django.core.exceptions import ObjectDoesNotExist
from common.units import TIME_UNITS, FARM_UNITS, SALE_UNITS
from decimal import Decimal
import copy

from budget.models import CostItem




class ScenarioViewSet(ModelViewSet):
    """ API endpoint for Scenario model.
    """

    serializer_class = ScenarioSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = Scenario.objects.all()
        query_params = self.request.query_params

        # Filter by username
        if "username" in query_params:
            user_query = User.objects.filter(username=query_params["username"])

            if user_query:
                queryset = Scenario.objects.filter(user=user_query[0])
            else:
                queryset = None

        # If there are query parameters that aren't supported, return empty array
        for key in query_params.keys():
            if key not in {'username', 'fields'}:
                queryset = None
        return queryset


    def perform_create(self, serializer):
        """ Add user to new object, then save to database.
        """
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        for plan in Plan.objects.filter(scenario=instance.id):
            plan.scenario = None
            plan.save()

        instance.delete()

    @action(detail=True, methods=['post'])
    def copy(self, request, pk):
        """ Creates a copy of the Scenario resource and returns the new Scenario. Takes no payload data.
        """

        try:
            scenario = Scenario.objects.get(id=pk)
        except ObjectDoesNotExist:
            raise ParseError

        copy_scenario = copy.deepcopy(scenario)
        copy_scenario.id = None
        copy_scenario.source = str(scenario.id)
        copy_scenario.save()

        """TODO: Get plans to copy over. I don't know what I'm doing here."""

        for plan in Plan.objects.filter(scenario=scenario.id):
            new_plan = copy.deepcopy(plan)
            new_plan.scenario = copy_scenario
            new_plan.id = None
            new_plan.save()

            for plan_budget in PlanBudget.objects.filter(plan=plan.id):
                new_plan_budget = copy.deepcopy(plan_budget)
                new_plan_budget.plan = new_plan
                new_plan_budget.id = None
                new_plan_budget.save()

        serializer = self.get_serializer(copy_scenario)

        return Response(serializer.data, status=201)


    @action(detail=True, methods=['get'])
    def listDepreciation(self, request, pk):

        try:
            scenario = Scenario.objects.get(id=pk)
        except ObjectDoesNotExist:
            raise ParseError

        # initialization
        cost_item_cost_total = [0] * 10

        for plan in Plan.objects.filter(scenario=scenario.id):
            for plan_budget in PlanBudget.objects.filter(plan=plan.id):
                for item in CostItemInflationRate.objects.filter(plan_budget=plan_budget):
                    if item.name == "L-T asset replacement & section 179 expenses" and item.cost_item:
                        for cost_item in CostItem.objects.filter(cost_type="general", id=item.cost_item.id):
                            cost_item_cost_total[plan_budget.position] += cost_item.cost_total * (1+item.compound_inflation_rate/100)

        return Response(cost_item_cost_total, status=201)
