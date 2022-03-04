from rest_framework.viewsets import ModelViewSet
from climate.serializers import ClimateScenarioSerializer, ClimateBudgetSerializer
from climate.models import ClimateScenario, ClimateBudget
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated



class ClimateScenarioViewSet(ModelViewSet):
    """ API endpoint for ClimateScenario model.
    """

    serializer_class = ClimateScenarioSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)


    @action(detail=True, methods=['post'])
    def next(self, request, pk=None):
        """ Find the ClimateBudget with the next highest 'position' and 'is_original' set to true and return it.
        """

        climate_budget_id = request.data['climate_budget']
        climate_scenario = ClimateScenario.objects.get(pk=pk)
        current_climate_budget = ClimateBudget.objects.get(pk=climate_budget_id)

        try:
            next_climate_budget = ClimateBudget.objects.filter(
                climate_scenario=climate_scenario,
                position=current_climate_budget.position + 2,
                is_original=True,
            )[0]

        except IndexError:
            next_climate_budget = current_climate_budget

        serializer = ClimateBudgetSerializer(next_climate_budget)

        return Response(serializer.data)


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.

            Default queryset is all ClimateScenario objects. Invalid arguments return empty queryset.
        """

        queryset = ClimateScenario.objects.all()

        query_params = self.request.query_params

        # Filter by username
        if "username" in query_params:
            user_query = User.objects.filter(username=query_params["username"])

            if user_query:
                queryset = ClimateScenario.objects.filter(user=user_query[0])
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


    @action(detail=False, methods=["get"])
    def most_recent(self, request):
        """ Sending a GET request to this endpoint will return the most recently edited ClimateScenario for the request
            user. All associated ClimateBudgets with 'is_original' equals True must have their 'user_estimate' field be nonzero.
            If none exist, returns HTTP 404 and empty object.
        """

        climate_scenario = {}
        status = 200

        try:
            queryset = ClimateScenario.objects.filter(user=request.user).order_by("modified_date")
            for climate_scenario in queryset:
                climate_budgets = ClimateBudget.objects.filter(climate_scenario=climate_scenario)
                for climate_budget in climate_budgets:
                    if climate_budget.user_estimate == 0 and climate_budget.is_original is True:
                        climate_scenario = {}
                if climate_scenario != {}:
                    break

        except (IndexError, TypeError):
            pass

        serializer = ClimateScenarioSerializer(climate_scenario)

        return Response(serializer.data, status=status)
