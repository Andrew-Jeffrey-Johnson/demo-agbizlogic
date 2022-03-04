from rest_framework.viewsets import ModelViewSet
from scenario.serializers import CurrentLoansSerializer
from scenario.models import CurrentLoans, Scenario
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.response import Response


class CurrentLoansViewSet(ModelViewSet):
    """ API endpoint for the CurrentLoans model
    """

    serializer_class = CurrentLoansSerializer
    queryset = CurrentLoans.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = CurrentLoans.objects.all()
        query_params = self.request.query_params


        # Filter by username
        if "username" in query_params:
            user_query = User.objects.filter(username=query_params["username"])

            if user_query:
                queryset = CurrentLoans.objects.filter(user=user_query[0])
            else:
                queryset = None

        # Filter by parent scenario id
        elif "scenario" in query_params:
            scenario_query = Scenario.objects.filter(id=query_params["scenario"])
            if scenario_query:
                queryset = CurrentLoans.objects.filter(scenario=scenario_query[0])
            else:
                queryset = None



        # If there are query parameters that aren't supported, return empty array
        for key in query_params.keys():
            if key not in {'username', 'scenario', 'fields'}:
                queryset = None

        return queryset


    def perform_create(self, serializer):
        """ Add user to new object, then save to database.
        """
        serializer.save(user=self.request.user)


    @action(detail=True, methods=['get','put'])
    def specificYear(self, request, pk):
        """ Given a specific year and return the balance sheets in that year
        """

        try:
            balance_sheets = CurrentLoans.objects.get(year=pk)
        except ObjectDoesNotExist:
            raise ParseError

        serializer = self.get_serializer(balance_sheets)
        return Response(serializer.data, status=201)
