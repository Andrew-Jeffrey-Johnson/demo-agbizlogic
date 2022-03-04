from rest_framework.viewsets import ModelViewSet
from scenario.serializers import OperatingLoanSerializer
from scenario.models import OperatingLoan
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from scenario.models import OperatingLoan, Scenario





class OperatingLoanViewSet(ModelViewSet):
    """ API endpoint for the OperatingLoan model.
    """

    serializer_class = OperatingLoanSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Plan objects. Invalid arguments return empty queryset.
        """

        queryset = OperatingLoan.objects.all()

        # If there are query parameters that aren't supported, return empty array
        for key in self.request.query_params.keys():
            if key not in {'scenario', 'fields'}:
                queryset = None

        # Filter by parent scenario id
        if "scenario" in self.request.query_params:
            try:
                scenario_query = Scenario.objects.filter(pk=self.request.query_params['scenario'])

                if scenario_query:
                    queryset = OperatingLoan.objects.filter(scenario=scenario_query[0])
                else:
                    queryset = None

            except (ValueError):
                queryset = None

        return queryset
