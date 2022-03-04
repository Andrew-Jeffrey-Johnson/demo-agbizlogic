from rest_framework.viewsets import ModelViewSet
from scenario.serializers import IncomeStatementOutputItemSerializer
from scenario.models import IncomeStatementOutputItem
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


class IncomeStatementOutputItemViewSet(ModelViewSet):
    """ API endpoint for the CostItemInflationRate model.
    """

    serializer_class = IncomeStatementOutputItemSerializer
    queryset = IncomeStatementOutputItem.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)
    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = IncomeStatementOutputItem.objects.all()
        query_params = self.request.query_params

        # Filter by cashflow
        if "income_statement" in query_params:
            queryset = IncomeStatementOutputItem.objects.filter(income_statement=query_params["income_statement"])

        return queryset
