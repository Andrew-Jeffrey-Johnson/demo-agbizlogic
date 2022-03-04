from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from scenario.serializers import IncomeItemInflationRateSerializer
from scenario.models import IncomeItemInflationRate


class IncomeItemInflationRateViewSet(ModelViewSet):
    """ API endpoint for the IncomeItemInflationRate model.
    """

    serializer_class = IncomeItemInflationRateSerializer
    queryset = IncomeItemInflationRate.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['post'])
    def create_set(self, request):
        """ Takes an list of objects and creates each one.
        """

        serializers = []

        for inflation_item in request.data:
            serializer = IncomeItemInflationRateSerializer(data=inflation_item)
            if serializer.is_valid(raise_exception=True):
                serializers.append(serializer)

        for serializer in serializers:
            serializer.save()

        return Response({'status': "objects created"}, status=201)
