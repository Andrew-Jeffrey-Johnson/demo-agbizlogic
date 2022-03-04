from rest_framework.viewsets import ModelViewSet
from scenario.serializers import FutureLoansSerializer
from scenario.models import FutureLoans
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.response import Response


class FutureLoansViewSet(ModelViewSet):
    """ API endpoint for the CashFromAssetLoan model.
    """

    serializer_class = FutureLoansSerializer
    queryset = FutureLoans.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['get'])
    def specificScenario(self, request, pk):
        """ Given a specific scenario and return the familywithdraws with that scenario
        """

        try:
            future_loans = FutureLoans.objects.get(scenario=pk)
        except ObjectDoesNotExist:
            raise ParseError

        serializer = self.get_serializer(future_loans)
        return Response(serializer.data, status=201)
