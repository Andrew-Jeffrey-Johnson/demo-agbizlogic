from rest_framework.viewsets import ModelViewSet
from scenario.serializers import CostItemInflationRateSerializer
from scenario.models import CostItemInflationRate
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


class CostItemInflationRateViewSet(ModelViewSet):
    """ API endpoint for the CostItemInflationRate model.
    """

    serializer_class = CostItemInflationRateSerializer
    queryset = CostItemInflationRate.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)
