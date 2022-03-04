from registration.models import ScheduleF
from django.test import TestCase
from django.contrib.auth.models import User
import copy
from collections import OrderedDict



class ScheduleFModelTestCase(TestCase):
    """ Test suite for the ScheduleF model.
    """

    def setUp(self):
        """ Create test user.
        """

        self.user = User.objects.create(**USER)


    def test_convert_to_gold_standard_correct_values(self):
        """ Test converts to a Gold Standard object.
        """

        schedule_f = ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)
        gold_standard_data = schedule_f.convert_to_gold_standard()

        expected_income_sales = int(SCHEDULE_F_OUTLINE['line_1_a'].replace(",", "")) + int(SCHEDULE_F_OUTLINE['line_2'].replace(",", ""))
        expected_interest = int(SCHEDULE_F_OUTLINE['line_21_a'].replace(",", "")) + int(SCHEDULE_F_OUTLINE['line_21_b'].replace(",", ""))

        for line in SCHEDULE_F_TO_GOLD_STANDARD:
            category = SCHEDULE_F_TO_GOLD_STANDARD[line]
            if category == "income_sales":
                self.assertEqual(gold_standard_data[category]['total'], expected_income_sales)

            elif category == "expenses_interest_mortgages":
                self.assertEqual(gold_standard_data[category]['total'], expected_interest)

            elif "expenses_other_" in category:
                for item in gold_standard_data:
                    if gold_standard_data[item]['name'] == category:
                        self.assertEqual(gold_standard_data[item]['total'], int(SCHEDULE_F_OUTLINE[line].replace(",", "")))

            else:
                self.assertEqual(gold_standard_data[category]['total'], int(SCHEDULE_F_OUTLINE[line].replace(",", "")), line)


    def test_convert_to_gold_standard_sets_other_expenses_labels(self):
        """ Test that the labels for other expenses in ScheduleF replace 'other_expense_?' in Gold Standard object.
        """

        schedule_f = ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)
        gold_standard_data = schedule_f.convert_to_gold_standard()

        for category in gold_standard_data:
            if "expenses_other_" in gold_standard_data[category]["name"]:
                self.assertEqual(gold_standard_data[category]["label"], SCHEDULE_F_OUTLINE[category.replace("expenses_other_", "other_expense_")])


    def test_convert_to_gold_standard_returns_correct_order(self):
        """ Test that the categories are returned in the correct order.
        """

        schedule_f = ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)
        gold_standard_data = schedule_f.convert_to_gold_standard()
        expected_gold_standard = OrderedDict(copy.deepcopy(GOLD_STANDARD_DATA))

        for category in gold_standard_data:
            self.assertEqual(gold_standard_data.keys().index(category), expected_gold_standard.keys().index(category))



# Dictionaries for creating test objects

USER = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}
SCHEDULE_F_OUTLINE = {
    'line_1_a': "350,000",
    'line_1_b': "50,000",
    'line_1_c': "300,000",
    'line_2': "3,500,000",
    'line_3_a': "3,000",
    'line_3_b': "1,500",
    'line_4_a': "60,000",
    'line_4_b': "60,000",
    'line_5_a': "0",
    'line_5_b': "0",
    'line_5_c': "0",
    'line_6_a': "200,000",
    'line_6_b': "200,000",
    'line_6_d': "0",
    'line_7': "150,000",
    'line_8': "12,500",
    'gross_income': "4,224,000",
    'line_10': "10,000",
    'line_11': "160,000",
    'line_12': "25,000",
    'line_13': "20,000",
    'line_14': "250,000",
    'line_15': "300,000",
    'line_16': "13,000",
    'line_17': "75,000",
    'line_18': "28,000",
    'line_19': "100,000",
    'line_20': "50,000",
    'line_21_a': "300,000",
    'line_21_b': "50,000",
    'line_22': "200,000",
    'line_23': "15,000",
    'line_24_a': "52,000",
    'line_24_b': "150,000",
    'line_25': "30,000",
    'line_26': "60,000",
    'line_27': "25,000",
    'line_28': "10,000",
    'line_29': "9,000",
    'line_30': "40,000",
    'line_31': "40,000",
    'line_32_a': "10,000",
    'line_32_b': "50,000",
    "line_32_c": "10,000",
    "line_32_d": "10,000",
    "line_32_e": "10,000",
    "line_32_f": "10,000",
    'total_expenses': "2,112,000",
    'net_profit': "2,152,000",
    'other_expense_1': "miscellaneous",
    'other_expense_2': "Other miscellaneous",
    'other_expense_3': "More miscellaneous",
    'other_expense_4': "Another miscellaneous",
    'other_expense_5': "Again miscellaneous",
    'other_expense_6': "'Tis miscellaneous",
}

SCHEDULE_F_TO_GOLD_STANDARD = {
    "line_1_a": "income_sales",
    "line_2": "income_sales",
    "line_3_a": "income_cooperative",
    "line_4_a": "income_agriculture_programs",
    "line_6_a": "income_insurance",
    "line_7": "income_custom_hire",
    "line_8": "income_other",

    "line_1_b": "expenses_goods",
    "line_10": "expenses_car",
    "line_11": "expenses_chemicals",
    "line_12": "expenses_conservation",
    "line_13": "expenses_custom_hire",
    "line_14": "expenses_depreciation",
    "line_15": "expenses_employee_benefit",
    "line_16": "expenses_feed",
    "line_17": "expenses_fertilizers",
    "line_18": "expenses_freight",
    "line_19": "expenses_gasoline",
    "line_20": "expenses_insurance",
    "line_21_a": "expenses_interest_mortgages",
    "line_22": "expenses_labor",
    "line_23": "expenses_pension",
    "line_24_a": "expenses_machinery_rent",
    "line_24_b": "expenses_land_rent",
    "line_25": "expenses_repairs",
    "line_26": "expenses_seeds",
    "line_27": "expenses_storage",
    "line_28": "expenses_supplies",
    "line_29": "expenses_property_taxes",
    "line_30": "expenses_utilities",
    "line_31": "expenses_veterinary",
    "line_32_a": "expenses_other_1",
    "line_32_b": "expenses_other_2",
    "line_32_c": "expenses_other_3",
    "line_32_d": "expenses_other_4",
    "line_32_e": "expenses_other_5",
    "line_32_f": "expenses_other_6",
}
GOLD_STANDARD_DATA = (
  ("expenses_goods", {
    "name": "expenses_goods",
    "label": "Cost of goods sold",
    "type": "expense",
    "total": 0
  }),
  ("expenses_car", {
    "name": "expenses_car",
    "label": "Car and truck expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_chemicals", {
    "name": "expenses_chemicals",
    "label": "Chemicals",
    "type": "expense",
    "total": 0
  }),
  ("expenses_conservation", {
    "name": "expenses_conservation",
    "label": "Conservation expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_custom_hire", {
    "name": "expenses_custom_hire",
    "label": "Custom hire (machine work)",
    "type": "expense",
    "total": 0
  }),
  ("expenses_depreciation", {
    "name": "expenses_depreciation",
    "label": "L-T asset replacement and section 179 expense",
    "type": "expense",
    "total": 0
  }),
  ("expenses_employee_benefit", {
    "name": "expenses_employee_benefit",
    "label": "Employee benefit programs",
    "type": "expense",
    "total": 0
  }),
  ("expenses_feed", {
    "name": "expenses_feed",
    "label": "Feed",
    "type": "expense",
    "total": 0
  }),
  ("expenses_fertilizers", {
    "name": "expenses_fertilizers",
    "label": "Fertilizers and lime",
    "type": "expense",
    "total": 0
  }),
  ("expenses_freight", {
    "name": "expenses_freight",
    "label": "Freight and trucking",
    "type": "expense",
    "total": 0
  }),
  ("expenses_gasoline", {
    "name": "expenses_gasoline",
    "label": "Gasoline, fuel and oil",
    "type": "expense",
    "total": 0
  }),
  ("expenses_insurance", {
    "name": "expenses_insurance",
    "label": "Insurance (other than health)",
    "type": "expense",
    "total": 0
  }),
  ("expenses_interest_mortgages", {
    "name": "expenses_interest_mortgages",
    "label": "Interest on loans and mortgages",
    "type": "expense",
    "total": 0
  }),
  ("expenses_labor", {
    "name": "expenses_labor",
    "label": "Labor hired (less employment credits)",
    "type": "expense",
    "total": 0
  }),
  ("expenses_pension", {
    "name": "expenses_pension",
    "label": "Pension and profit-sharing plans",
    "type": "expense",
    "total": 0
  }),
    ("expenses_property_taxes", {
      "name": "expenses_property_taxes",
      "label": "Property taxes",
      "type": "expense",
      "total": 0
    }),
  ("expenses_machinery_rent", {
    "name": "expenses_machinery_rent",
    "label": "Rent and leases: Machinery, equipment and vehicles",
    "type": "expense",
    "total": 0
  }),
  ("expenses_land_rent", {
    "name": "expenses_land_rent",
    "label": "Rent and leases: Land and animals",
    "type": "expense",
    "total": 0
  }),
  ("expenses_repairs", {
    "name": "expenses_repairs",
    "label": "Repairs and maintenance",
    "type": "expense",
    "total": 0
  }),
  ("expenses_seeds", {
    "name": "expenses_seeds",
    "label": "Seeds and plants",
    "type": "expense",
    "total": 0
  }),
  ("expenses_storage", {
    "name": "expenses_storage",
    "label": "Storage and warehousing",
    "type": "expense",
    "total": 0
  }),
  ("expenses_supplies", {
    "name": "expenses_supplies",
    "label": "Supplies",
    "type": "expense",
    "total": 0
  }),
  ("expenses_utilities", {
    "name": "expenses_utilities",
    "label": "Utilities",
    "type": "expense",
    "total": 0
  }),
  ("expenses_veterinary", {
    "name": "expenses_veterinary",
    "label": "Veterinary, breeding, and medicine",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_1", {
    "name": "expenses_other_1",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_2", {
    "name": "expenses_other_2",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_3", {
    "name": "expenses_other_3",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_4", {
    "name": "expenses_other_4",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_5", {
    "name": "expenses_other_5",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_6", {
    "name": "expenses_other_6",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("income_sales", {
    "name": "income_sales",
    "label": "Sales of livestock, produce, grains and other products",
    "type": "income",
    "total": 0
  }),
  ("income_cooperative", {
    "name": "income_cooperative",
    "label": "Cooperative distributions received",
    "type": "income",
    "total": 0
  }),
  ("income_agriculture_programs", {
    "name": "income_agriculture_programs",
    "label": "Agricultural program payments",
    "type": "income",
    "total": 0
  }),
  ("income_insurance", {
    "name": "income_insurance",
    "label": "Crop insurance proceeds and federal crop disaster payments",
    "type": "income",
    "total": 0
  }),
  ("income_custom_hire", {
    "name": "income_custom_hire",
    "label": "Specified custom hire (machine work) income",
    "type": "income",
    "total": 0
  }),
  ("income_other", {
    "name": "income_other",
    "label": "Other income",
    "type": "income",
    "total": 0
  })
)
