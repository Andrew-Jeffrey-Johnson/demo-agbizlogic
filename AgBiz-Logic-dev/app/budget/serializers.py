from rest_framework import serializers
from django.contrib.auth.models import User
from budget.models import *
from common.serializers import DynamicFieldsModelSerializer



class IncomeItemSerializer(serializers.ModelSerializer):
    """ Serializer for IncomeItem model.
    """

    class Meta:
        model = IncomeItem
        fields = (
            "id",
            "parent_budget",
            "name",
            "enterprise",
            "descriptor1",
            "descriptor2",
            "descriptor3",
            "descriptor4",
            "descriptor5",
            "descriptor6",
            "notes",
            "weight",
            "farm_unit",
            "farm_unit_quantity",
            "sale_unit",
            "sale_unit_quantity",
            "return_total",
            "price_per_farm_unit",
            "price_per_sale_unit",
        )



class CostItemSerializer(serializers.ModelSerializer):
    """ Serializer for CostItem model.
    """

    class Meta:
        model = CostItem
        fields = (
            "id",
            "parent_budget",
            "name",
            "notes",
            "parent_category",
            "category",
            "sub_category",
            "cost_type",
            "farm_unit_quantity",
            "unit",
            "unit_quantity",
            "cost_total",
            "cost_per_unit",
            "cost_per_farm_unit",
            "descriptor1",
            "farm_unit",
        )


class BudgetSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    """ Serializer for Budget model.
    """

    cost_items = CostItemSerializer(many=True, required=False, read_only=True)
    income_items = IncomeItemSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Budget
        fields = (
            "id",
            "title",
            "notes",
            "temp",
            "enterprise",
            "descriptor1",
            "descriptor2",
            "descriptor3",
            "descriptor4",
            "descriptor5",
            "descriptor6",
            "market",
            "state",
            "region",
            "time_unit",
            "time_value",
            "farm_unit",
            "farm_unit_quantity",
            "source",
            "module",
            "total_costs",
            "total_variable_costs",
            "total_fixed_costs",
            "total_general_costs",
            "total_income_less_variable_costs",
            "total_gross_returns",
            "profit",
            "breakeven_yield",
            "breakeven_price",
            "total_yields",
            "primary_income_quantity",
            "primary_income_unit",
            "cost_items",
            "income_items",
            "created_date",
            "modified_date",
        )
