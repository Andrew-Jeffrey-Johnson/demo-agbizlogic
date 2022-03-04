from rest_framework.viewsets import ModelViewSet
from scenario.serializers import DistributionsSerializer
from scenario.models import Distributions, Scenario
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.contrib.auth.models import User
from rest_framework.response import Response


class DistributionsViewSet(ModelViewSet):
    """ API endpoint for the CashFromAssetLoan model.
    """

    serializer_class = DistributionsSerializer
    queryset = Distributions.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = Distributions.objects.all()
        query_params = self.request.query_params

        # Filter by username
        if "scenario" in query_params:
            scenario_query = Scenario.objects.filter(id=query_params["scenario"])

            if scenario_query:
                queryset = Distributions.objects.filter(scenario=scenario_query[0])
            else:
                queryset = None

        # If there are query parameters that aren't supported, return empty array
        for key in query_params.keys():
            if key not in {'scenario', 'fields'}:
                queryset = None

        return queryset
