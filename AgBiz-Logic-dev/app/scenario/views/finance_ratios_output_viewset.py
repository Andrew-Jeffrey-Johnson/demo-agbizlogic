from rest_framework.viewsets import ModelViewSet
from scenario.serializers import FinancialRatiosOutputSerializer
from scenario.models import FinancialRatiosOutput,Scenario
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


class FinanceRatiosOutputViewSet(ModelViewSet):
    serializer_class = FinancialRatiosOutputSerializer
    queryset = FinancialRatiosOutput.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = FinancialRatiosOutput.objects.all()
        query_params = self.request.query_params

        # Filter by scenario
        if "scenario" in query_params:
            queryset = FinancialRatiosOutput.objects.filter(scenario=query_params["scenario"])


        return queryset
