from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from allocate.models import *
from common.serializers import DynamicFieldsModelSerializer


class UserSerializer(ModelSerializer):
    """ Serializer for User model.
    """

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        )



class BusinessDataSerializer(DynamicFieldsModelSerializer, ModelSerializer):
    """ Serializer for CostItem model.
    """

    class Meta:
        model = BusinessData
        fields = (
            "id",
            "business_type",
            "income_sales",
            "income_cooperative",
            "income_agriculture_programs",
            "income_insurance",
            "income_custom_hire",
            "income_other",
            
            "expenses_goods",
            "expenses_car",
            "expenses_chemicals",
            "expenses_conservation",
            "expenses_custom_hire",
            "expenses_depreciation",
            "expenses_employee_benefit",
            "expenses_feed",
            "expenses_fertilizers",
            "expenses_freight",
            "expenses_gasoline",
            "expenses_insurance",
            "expenses_interest_mortgages",
            "expenses_labor",
            "expenses_pension",
            "expenses_property_taxes",
            "expenses_machinery_rent",
            "expenses_land_rent",
            "expenses_repairs",
            "expenses_seeds",
            "expenses_storage",
            "expenses_supplies",
            "expenses_utilities",
            "expenses_veterinary",
            "expenses_other_1_label",
            "expenses_other_1",
            "expenses_other_2_label",
            "expenses_other_2",
            "expenses_other_3_label",
            "expenses_other_3",
            "expenses_other_4_label",
            "expenses_other_4",
            "expenses_other_5_label",
            "expenses_other_5",
            "expenses_other_6_label",
            "expenses_other_6",

            "total_income",
            "total_expenses",
        )



class EnterpriseDataSerializer(DynamicFieldsModelSerializer, ModelSerializer):
    """ Serializer for CostItem model.
    """

    class Meta:
        model = EnterpriseData
        fields = (
            "id",
            "enterprise",
            "category_1",
            "category_2",
            "category_3",
            "category_4",
            "category_5",
            "category_6",
            "market",

            "income_sales",
            "income_cooperative",
            "income_agriculture_programs",
            "income_insurance",
            "income_custom_hire",
            "income_other",
            "expenses_goods",
            "expenses_car",
            "expenses_chemicals",
            "expenses_conservation",
            "expenses_custom_hire",
            "expenses_depreciation",
            "expenses_employee_benefit",
            "expenses_feed",
            "expenses_fertilizers",
            "expenses_freight",
            "expenses_gasoline",
            "expenses_insurance",
            "expenses_interest_mortgages",
            "expenses_labor",
            "expenses_pension",
            "expenses_property_taxes",
            "expenses_machinery_rent",
            "expenses_land_rent",
            "expenses_repairs",
            "expenses_seeds",
            "expenses_storage",
            "expenses_supplies",
            "expenses_utilities",
            "expenses_veterinary",
            "expenses_other_1_label",
            "expenses_other_1",
            "expenses_other_2_label",
            "expenses_other_2",
            "expenses_other_3_label",
            "expenses_other_3",
            "expenses_other_4_label",
            "expenses_other_4",
            "expenses_other_5_label",
            "expenses_other_5",
            "expenses_other_6_label",
            "expenses_other_6",

            "total_income",
            "total_expenses",
        )
