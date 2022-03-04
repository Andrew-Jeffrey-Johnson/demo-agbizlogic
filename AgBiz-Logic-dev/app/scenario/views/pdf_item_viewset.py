from rest_framework.viewsets import ModelViewSet
from scenario.serializers import CashflowPdfOutputItemSerializer
from scenario.models import CashflowPdfOutputItem,CashflowPdfOutput
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


class CashflowPdfOutputItemViewSet(ModelViewSet):
    """ API endpoint for the CostItemInflationRate model.
    """

    serializer_class = CashflowPdfOutputItemSerializer
    queryset = CashflowPdfOutputItem.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = CashflowPdfOutputItem.objects.all()
        query_params = self.request.query_params

        # Filter by cashflow
        if "cashflow" in query_params:
            queryset = CashflowPdfOutputItem.objects.filter(cash_flow=query_params["cashflow"])

        return queryset
