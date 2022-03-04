from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from registration.models import *
import unicodedata

class ScheduleFSerializer(ModelSerializer):
    """ Serializer for the ScheduleF model.
    """

    class Meta:
            model = ScheduleF
            fields = (
                "id",
                "year",
                "line_1_a",
                "line_1_b",
                "line_1_c",
                "line_2",
                "line_3_a",
                "line_3_b",
                "line_4_a",
                "line_4_b",
                "line_5_a",
                "line_5_b",
                "line_5_c",
                "line_6_a",
                "line_6_b",
                "line_6_d",
                "line_7",
                "line_8",
                "gross_income",
                "line_10",
                "line_11",
                "line_12",
                "line_13",
                "line_14",
                "line_15",
                "line_16",
                "line_17",
                "line_18",
                "line_19",
                "line_20",
                "line_21_a",
                "line_21_b",
                "line_22",
                "line_23",
                "line_24_a",
                "line_24_b",
                "line_25",
                "line_26",
                "line_27",
                "line_28",
                "line_29",
                "line_30",
                "line_31",
                "line_32_a",
                "line_32_b",
                "line_32_c",
                "line_32_d",
                "line_32_e",
                "line_32_f",
                "other_expense_1",
                "other_expense_2",
                "other_expense_3",
                "other_expense_4",
                "other_expense_5",
                "other_expense_6",

                "total_expenses",
                "net_profit"
            )


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

class UserBusinessSerializer(ModelSerializer):
    class Meta:
        model = Business
        fields = (
        "id",
        "user",
        "name",
        "address1",
        "address2",
        "zipcode",
        "city",
        "state",
        "industry",
        "primary_business",
        "secondary_business"
        )
