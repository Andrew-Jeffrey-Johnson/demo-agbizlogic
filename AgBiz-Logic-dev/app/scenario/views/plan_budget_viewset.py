from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from budget.models import Budget, IncomeItem, CostItem
from scenario.serializers import PlanBudgetSerializer
from scenario.models import Plan, PlanBudget, IncomeItemInflationRate, CostItemInflationRate
from django.contrib.auth.models import User
from functools import wraps
import json
import copy
import pdb


class PlanBudgetViewSet(ModelViewSet):
    """ API endpoint for PlanBudget model.
    """

    serializer_class = PlanBudgetSerializer
    lookup_field = 'id'
    lookup_value_regex = '[0-9]+'
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.

            Default queryset is all PlanBudget objects. Invalid arguments return empty queryset.
        """

        queryset = PlanBudget.objects.all()
        query_params = self.request.query_params

        # Filter by username
        if "username" in query_params:
            user_query = User.objects.filter(username=query_params["username"])

            if user_query:
                queryset = PlanBudget.objects.filter(user=user_query[0])
            else:
                queryset = None

        # Filter by parent plan id
        elif "plan" in query_params:
            try:
                plan_query = Plan.objects.filter(pk=query_params['plan'])

                if plan_query:
                    queryset = PlanBudget.objects.filter(plan=plan_query[0])
                else:
                    queryset = None

            except (ValueError):
                queryset = None

        # If there are query parameters that aren't supported, return empty array
        d = query_params

        for key in d.keys():
            if key not in {'username', 'plan', 'fields'}:
                queryset = None

        return queryset

    def perform_create(self, serializer):
        """ Add user to new object, then save to database.
        """

        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        """ Takes JSON with the id of a plan and a budget, copies the budget
            and returns a new PlanBudget using the copy of the budget.
            If Plan or Budget in payload does not exist, return 404 with appropriate message.

            Payload:
            {
                'plan': <int>,
                'budget': <int>
                'module' : <unicode>
            }
        """

        try:
            rest_cost_items = [
                "Car and Truck Expenses",
                "Chemicals",
                "Conservation Expenses",
                "Cost of Goods Sold",
                "Custom Hire",
                "Employee Benefit Programs",
                "Feed",
                "Fertilizers and Lime",
                "Freight and Trucking",
                "Gasoline, Fuel, and Oil",
                "Insurance (other than health)",
                "Interest on Loans and Mortgages",
                "L-T asset replacement & section 179 expenses",
                "Labor Hired (less employment credits)",
                "Other expenses",
                "Pension and Profit-Sharing Plans",
                "Property Taxes",
                "Rent and leases: Land and animals",
                "Rent and leases: Machinery, equipment and vehicles",
                "Repairs and Maintenance",
                "Seeds and Plants",
                "Storage and Warehousing",
                "Supplies",
                "Utilities",
                "Veterinary, Breeding and Medicine"
            ]
            budget = Budget.objects.get(pk=request.data['budget'])
            plan = Plan.objects.get(id=request.data['plan'])
        except ObjectDoesNotExist:
            raise NotFound

        # Create copy of budget
        new_budget = copy.deepcopy(budget)
        new_budget.id = None
        new_budget.module = request.data['module'].encode('ascii', 'ignore')
        new_budget.save()

        # Create copy of income/cost items
        for income_item in IncomeItem.objects.filter(parent_budget=budget.id):
            new_income_item = copy.deepcopy(income_item)
            new_income_item.parent_budget = new_budget
            new_income_item.id = None
            new_income_item.save()
        for cost_item in CostItem.objects.filter(parent_budget=budget.id):
            new_cost_item = copy.deepcopy(cost_item)
            new_cost_item.parent_budget = new_budget
            new_cost_item.id = None
            new_cost_item.save()

        # Create new plan budget
        plan_budget = PlanBudget.objects.create(
            plan=plan,
            budget=new_budget,
            title=new_budget.title,
            space_units='Acre',
            total_space_available=0,
            total_space_used=0,
            user=self.request.user
        )

        # Create inflation rate items
        for income_item in IncomeItem.objects.filter(parent_budget=new_budget):
            IncomeItemInflationRate.objects.create(income_item=income_item, plan_budget=plan_budget, name=income_item.name)
        for cost_item in CostItem.objects.filter(parent_budget=new_budget):
            CostItemInflationRate.objects.create(cost_item=cost_item, plan_budget=plan_budget,
                                                 name=cost_item.name)

            if cost_item.name in rest_cost_items:
                rest_cost_items.remove(cost_item.name)


        for rest_item in rest_cost_items:
            CostItemInflationRate.objects.create(cost_item=None, plan_budget=plan_budget, name=rest_item)

        serializer = PlanBudgetSerializer(plan_budget)

        return Response(serializer.data, status=201)
