from rest_framework.viewsets import ModelViewSet
from climate.serializers import ClimateFactorSerializer
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from climate.models import ClimateBudget, ClimateFactor



class ClimateFactorViewSet(ModelViewSet):
    """ API endpoint for ClimateFactor model.
    """

    queryset = ClimateFactor.objects.filter()
    serializer_class = ClimateFactorSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.

            Default queryset is all ClimateFactor objects. Invalid arguments return empty queryset.
        """

        queryset = ClimateFactor.objects.all()

        query_params = self.request.query_params

        # Filter by parent budget
        if "climate_budget" in query_params:
            try:
                budget_query = ClimateBudget.objects.filter(pk=query_params['climate_budget'])

                if budget_query:
                    queryset = ClimateFactor.objects.filter(climate_budget=budget_query[0])
                else:
                    queryset = None

            except (ValueError):
                queryset = None


        # If there are query parameters that aren't supported, return empty array
        d = query_params

        for key in d.keys():
            if key not in {'climate_budget', 'fields'}:
                queryset = None

        return queryset
