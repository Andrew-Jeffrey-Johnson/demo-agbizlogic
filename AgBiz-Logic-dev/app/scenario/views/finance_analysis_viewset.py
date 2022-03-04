from rest_framework.viewsets import ModelViewSet
from scenario.serializers import FinanceAnalysisSerializer
from scenario.models import FinanceAnalysis
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User


class FinanceAnalysisViewSet(ModelViewSet):
    """ API endpoint for the CurrnetLoans model.
    """

    serializer_class = FinanceAnalysisSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = FinanceAnalysis.objects.all()
        query_params = self.request.query_params

        # Filter by username
        if "username" in query_params:
            user_query = User.objects.filter(username=query_params["username"])

            if user_query:
                queryset = FinanceAnalysis.objects.filter(user=user_query[0])
            else:
                queryset = None

        # If there are query parameters that aren't supported, return empty array
        for key in query_params.keys():
            if key not in {'username', 'fields'}:
                queryset = None



        return queryset


    def perform_create(self, serializer):
        """ Add user to new object, then save to database.
        """
        serializer.save(user=self.request.user)
