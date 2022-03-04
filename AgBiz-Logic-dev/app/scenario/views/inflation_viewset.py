from rest_framework.viewsets import ModelViewSet
from scenario.serializers import InflationSerializer
from scenario.models import Inflation
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.response import Response


class InflationViewSet(ModelViewSet):
    """ API endpoint for the CashFromAssetLoan model.
    """

    serializer_class = InflationSerializer
    queryset = Inflation.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['get','put'])
    def specificScenario(self, request, pk):
        """ Given a specific scenario and return the inflation with that scenario
        """

        try:
            inflation = Inflation.get(scenario=pk)
        except ObjectDoesNotExist:
            raise ParseError

        serializer = self.get_serializer(inflation)
        return Response(serializer.data, status=201)
