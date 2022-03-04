from rest_framework.viewsets import ModelViewSet
from scenario.serializers import BalanceSheetOutputSerializer
from scenario.models import BalanceSheetOutput,Scenario
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


class BalanceSheetOutputViewSet(ModelViewSet):
    serializer_class = BalanceSheetOutputSerializer
    queryset = BalanceSheetOutput.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = BalanceSheetOutput.objects.all()
        query_params = self.request.query_params

        # Filter by scenario
        if "scenario" in query_params:
            scenario_query = Scenario.objects.filter(id=query_params["scenario"])

            if scenario_query:
                queryset = BalanceSheetOutput.objects.filter(scenario=scenario_query[0])
            else:
                queryset = None

        # If there are query parameters that aren't supported, return empty array
        for key in query_params.keys():
            if key not in {'scenario', 'fields'}:
                queryset = None

        return queryset
