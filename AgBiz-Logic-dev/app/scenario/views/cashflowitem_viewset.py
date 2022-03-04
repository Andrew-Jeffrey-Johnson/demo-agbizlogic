from rest_framework.viewsets import ModelViewSet
from scenario.serializers import CashFlowItemSerializer
from scenario.models import CashFlowItem, Scenario
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


class CashFlowItemViewSet(ModelViewSet):
    """ API endpoint for the CashFlow model
    """

    serializer_class = CashFlowItemSerializer
    queryset = CashFlowItem.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = CashFlowItem.objects.all()
        query_params = self.request.query_params

        # Filter by scenario
        if "scenario" in query_params:
            scenario_query = Scenario.objects.filter(id=query_params["scenario"])

            if scenario_query and "name" not in query_params:
                queryset = CashFlowItem.objects.filter(scenario=scenario_query[0])
            elif scenario_query and "name" in query_params:
                queryset = CashFlowItem.objects.filter(scenario=scenario_query[0],name=query_params["name"])
            else:
                queryset = None

        # If there are query parameters that aren't supported, return empty array
        for key in query_params.keys():
            if key not in {'scenario', 'fields','name'}:
                queryset = None

        return queryset
