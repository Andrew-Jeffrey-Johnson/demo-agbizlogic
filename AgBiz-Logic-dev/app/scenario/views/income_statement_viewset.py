from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.renderers import JSONRenderer
from scenario.serializers import IncomeStatementSerializer
from budget.models import Budget, IncomeItem, CostItem
from scenario.models import IncomeStatement, Scenario
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
import paho.mqtt.client as mqtt
import copy
import json



class IncomeStatementViewSet(ModelViewSet):
    """ API endpoint for the IncomeStatement model
    """

    serializer_class = IncomeStatementSerializer
    queryset = IncomeStatement.objects.all()
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Scenario objects. Invalid arguments return empty queryset.
        """

        queryset = IncomeStatement.objects.all()
        query_params = self.request.query_params

        # Filter by scenario
        if "scenario" in query_params:
            scenario_query = Scenario.objects.filter(id=query_params["scenario"])

            if scenario_query:
                queryset = IncomeStatement.objects.filter(scenario=scenario_query[0])
            else:
                queryset = None

        # If there are query parameters that aren't supported, return empty array
        for key in query_params.keys():
            if key not in {'scenario', 'fields'}:
                queryset = None

        return queryset


    def perform_create(self, serializer):
        """ Add user to new object, then save to database.
        """
        serializer.save()

    def perform_destroy(self, instance):

        instance.delete()
