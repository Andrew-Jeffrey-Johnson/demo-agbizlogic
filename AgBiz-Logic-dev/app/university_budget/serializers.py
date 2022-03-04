from rest_framework import serializers
from common.serializers import DynamicFieldsModelSerializer
from university_budget.models import *






class UniversityCostItemSerializer(serializers.ModelSerializer):
    """ Serializer for CostItem model.
    """

    class Meta:
        model = UniversityCostItem
        fields = (
            "id",
            "parent_budget",
            "name",
            "notes",
            "parent_category",
            "category",
            "sub_category",
            "cost_type",

            "unit",
            "unit_quantity",
            "cost_total",

            "cost_per_unit",
            "cost_per_farm_unit",
        )


class UniversityIncomeItemSerializer(serializers.ModelSerializer):
    """ Serializer for IncomeItem model.
    """

    class Meta:
        model = UniversityIncomeItem
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

            "farm_unit",
            "farm_unit_quantity",
            "sale_unit",
            "sale_unit_quantity",
            "return_total",

            "price_per_farm_unit",
            "price_per_sale_unit",
        )


class FIPSRegionSerializer(serializers.ModelSerializer):
    """ Serializer for FIPSRegion model.
    """

    class Meta:
        fields = '__all__'
        model = FIPSRegion
        
class UniversityBudgetSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    """ Serializer for Budget model.
    """

    # Use model serializers for relational fields
    cost_items = UniversityCostItemSerializer(many=True, required=False, read_only=True)
    income_items = UniversityIncomeItemSerializer(many=True, required=False, read_only=True)
    fips_codes = FIPSRegionSerializer(many=True, read_only=True)


    class Meta:
        model = UniversityBudget
        fields = (
            "id",
            "title",
            "notes",
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

            "cost_items",
            "income_items",

            "fips_codes",
        )
