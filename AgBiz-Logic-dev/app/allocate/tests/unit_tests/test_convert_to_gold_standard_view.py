from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from django.contrib.auth.models import User
from allocate.views import ConvertToGoldStandardView
from registration.models import ScheduleF
from collections import OrderedDict
import copy



class ConvertToGoldStandardViewTestCase(APITestCase):
    """ Test suite for the '/convert' REST API endpoint.
    """

    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create(**USER)
        self.view = ConvertToGoldStandardView.as_view()


    def test_convert_valid_payload(self):
        """ Test sending the '/convert' endpoint a valid ScheduleF id returns HTTP 200 response and converted payload.
        """

        schedule_f = ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)

        request = self.factory.post('', {'schedulef': schedule_f.id}, format="json")
        response = self.view(request)

        self.assertEqual(200, response.status_code)
        for field in response.data:
            self.assertTrue("name" in response.data[field])
            self.assertTrue("label" in response.data[field])
            self.assertTrue("type" in response.data[field])
            self.assertTrue("total" in response.data[field])


    def test_convert_correct_values(self):
        """ Test sending the '/convert' endpoint correctly converts to a Gold Standard object.
        """

        schedule_f = ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)

        request = self.factory.post('', {'schedulef': schedule_f.id}, format="json")
        response = self.view(request)

        expected_income_sales = int(SCHEDULE_F_OUTLINE['line_1_a'].replace(",", "")) + int(SCHEDULE_F_OUTLINE['line_2'].replace(",", ""))
        expected_interest = int(SCHEDULE_F_OUTLINE['line_21_a'].replace(",", "")) + int(SCHEDULE_F_OUTLINE['line_21_b'].replace(",", ""))

        for line in SCHEDULE_F_OUTLINE:
            if line in SCHEDULE_F_TO_GOLD_STANDARD and "line_32" not in line:
                category = SCHEDULE_F_TO_GOLD_STANDARD[line]
                if category == "income_sales":
                    self.assertEqual(response.data[category]['total'], expected_income_sales)
                elif category == "expenses_interest_mortgages":
                    self.assertEqual(response.data[category]['total'], expected_interest)
                else:
                    self.assertEqual(response.data[category]['total'], int(SCHEDULE_F_OUTLINE[line].replace(",", "")), line)


    def test_convert_sets_other_expenses_labels(self):
        """ Test that the labels for other expenses in ScheduleF replace 'other_expense_?' in Gold Standard object.
        """

        schedule_f = ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)

        request = self.factory.post('', {'schedulef': schedule_f.id}, format="json")
        response = self.view(request)

        # TODO: test


    def test_convert_invalid_payload(self):
        """ Test sending '/convert' endpoint an invalid payload returns HTTP 400 error response.
        """

        request = self.factory.post('', {'bananas': "johncleese"}, format="json")
        response = self.view(request)

        self.assertEqual(400, response.status_code)


    def test_convert_schedulef_does_not_exist(self):
        """ Test sending '/convert' endpoint the id of a nonexistent ScheduleF object returns HTTP 404 error response.
        """

        schedule_f = ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)

        request = self.factory.post('', {'schedulef': 1234}, format="json")
        response = self.view(request)

        self.assertEqual(404, response.status_code)


    def test_correct_return_order(self):
        """ Test that the categories are returned in the correct order.
        """

        schedule_f = ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)
        var = copy.deepcopy(GOLD_STANDARD_DATA)
        expected_gold_standard = OrderedDict(copy.deepcopy(GOLD_STANDARD_DATA))

        request = self.factory.post('', {'schedulef': schedule_f.id}, format="json")
        response = self.view(request)

        for category in response.data:
            self.assertEqual(response.data.keys().index(category), expected_gold_standard.keys().index(category))


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
    "label": "Custom hire",
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
    "label": "Custom hire income",
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
SCHEDULE_F_TO_GOLD_STANDARD = {
    "line_1_c": "income_sales",
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
