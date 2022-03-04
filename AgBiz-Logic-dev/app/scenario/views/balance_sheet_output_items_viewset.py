from rest_framework.viewsets import ModelViewSet
from scenario.serializers import BalanceSheetOutputItemSerializer
from scenario.models import BalanceSheetOutputItem
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


class BalanceSheetOutputItemViewSet(ModelViewSet):
    """ API endpoint for the CostItemInflationRate model.
    """

    serializer_class = BalanceSheetOutputItemSerializer
    queryset = BalanceSheetOutputItem.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = BalanceSheetOutputItem.objects.all()
        query_params = self.request.query_params

        # Filter by cashflow
        if "balance_sheet" in query_params:
            queryset = BalanceSheetOutputItem.objects.filter(balance_sheet=query_params["balance_sheet"])

        return queryset
