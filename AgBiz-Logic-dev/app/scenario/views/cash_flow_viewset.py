from rest_framework.viewsets import ModelViewSet
from scenario.serializers import CashFlowSerializer
from scenario.models import CashFlow
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


class CashFlowViewSet(ModelViewSet):
    """ API endpoint for the CashFlow model
    """

    serializer_class = CashFlowSerializer
    queryset = CashFlow.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)
