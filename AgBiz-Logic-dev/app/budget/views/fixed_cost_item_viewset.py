from budget.models import CostItem
from budget.serializers import CostItemSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated



class FixedCostItemViewSet(ModelViewSet):
    """ API endpoint for CostItem objects with cost_type = 'fixed'.
    """

    queryset = CostItem.objects.filter(cost_type="fixed")
    serializer_class = CostItemSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)
