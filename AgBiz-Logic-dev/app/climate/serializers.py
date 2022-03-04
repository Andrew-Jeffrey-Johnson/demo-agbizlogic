from rest_framework import serializers
from django.contrib.auth.models import User
from climate.models import *
from budget.serializers import BudgetSerializer
from common.serializers import DynamicFieldsModelSerializer


class ClimateFactorSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    """ Serializer for ClimateFactor model.
    """

    class Meta:
        model = ClimateFactor
        fields = (
            'id',
            'climate_budget',
            'name',
            'state',
            'region',
            'user_estimate',
        )


class ClimateBudgetSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    """ Serializer for ClimateBudget model.
    """

    climate_factors = ClimateFactorSerializer(many=True, required=False, read_only=True)
    position = serializers.IntegerField(required=False)

    class Meta:
        model = ClimateBudget
        fields = (
            'id',
            'climate_scenario',
            'budget',
            'title',
            'modeling_estimate',
            'focus_group_estimate',
            'user_estimate',
            'climate_factors',
            'change_net_returns',

            'is_original',
            'position',

            'net_returns',
            'total_yields',
            'farm_unit',
            'sale_unit',
            'sale_quantity'
        )


class ClimateDataSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    """ Serializer for ClimateData model.
    """

    class Meta:
        # model = ClimateFactor
        fields = (
            'name',
            'data_chart',
            'data',
            'labels',
            'series',
        )


class ClimateScenarioSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    """ Serializer for ClimateScenario model.
    """

    climate_budgets = ClimateBudgetSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = ClimateScenario
        fields = (
            'id',
            'title',
            'notes',
            'projection_type',
            'created_date',
            'modified_date',
            'climate_budgets',
        )
