from budget.models import IncomeItem
from budget.serializers import IncomeItemSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated



class IncomeItemViewSet(ModelViewSet):
    """ API endpoint for IncomeItem model.
    """

    queryset = IncomeItem.objects.all()
    serializer_class = IncomeItemSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)
