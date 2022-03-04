from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from climate.serializers import ClimateBudgetSerializer
from climate.models import ClimateBudget, ClimateScenario
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from budget.models import Budget, IncomeItem, CostItem
import copy



class ClimateBudgetViewSet(ModelViewSet):
    """ API endpoint for ClimateBudget model.
    """

    queryset = ClimateBudget.objects.filter()
    serializer_class = ClimateBudgetSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.

            Default queryset is all ClimateBudget objects. Invalid arguments return empty queryset.
        """

        queryset = ClimateBudget.objects.all()

        query_params = self.request.query_params

        # Filter by username
        if "username" in query_params:
            user_query = User.objects.filter(username=query_params["username"])

            if user_query:
                queryset = ClimateBudget.objects.filter(user=user_query[0])
            else:
                queryset = None

        # Filter by parent scenario id
        elif "scenario" in query_params:
            try:
                scenario_query = ClimateScenario.objects.filter(pk=query_params['scenario'])

                if scenario_query:
                    queryset = ClimateBudget.objects.filter(climate_scenario=scenario_query[0])
                else:
                    queryset = None

            except (ValueError):
                queryset = None



        # If there are query parameters that aren't supported, return empty array
        d = query_params

        for key in d.keys():
            if key not in {'username', 'scenario', 'fields'}:
                queryset = None

        return queryset


    def perform_create(self, serializer):
        """ Add user to new object and save to database.
        """

        serializer.save(user=self.request.user)



    @action(detail=False, methods=['post'])
    def generate(self, request):
        """ Sending a POST request to this endpoint will create a copy of the Budget with the id in the payload, and
            associate a new ClimateBudget with it.
        """

        try:
            budget = Budget.objects.get(pk=request.data['budget'])

            new_budget = copy.deepcopy(budget)
            new_budget.id = None
            new_budget.module = "climate"
            new_budget.save()

            for i in IncomeItem.objects.filter(parent_budget = budget.id):
                new_income_item = copy.deepcopy(i)
                new_income_item.parent_budget = new_budget
                new_income_item.id = None
                new_income_item.save()

            for i in CostItem.objects.filter(parent_budget = budget.id):
                new_cost_item = copy.deepcopy(i)
                new_cost_item.parent_budget = new_budget
                new_cost_item.id = None
                new_cost_item.save()

            scenario = ClimateScenario.objects.get(id = request.data['climate_scenario'])

            new_climate_budget = ClimateBudget.objects.create(
                climate_scenario=scenario,
                budget=new_budget,
                user=self.request.user
            )

            serializer = ClimateBudgetSerializer(new_climate_budget)
            response = Response(serializer.data, status=201)

        except ObjectDoesNotExist:
            raise NotFound
        except KeyError:
            response = Response({"error": "Invalid payload"}, status=400)

        return response
