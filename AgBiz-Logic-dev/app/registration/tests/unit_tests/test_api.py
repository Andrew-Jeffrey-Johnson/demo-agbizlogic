from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from registration.views import ScheduleFViewSet
from registration.models import ScheduleF
from django.contrib.auth.models import User



class ScheduleFAPITestCase(APITestCase):
    """ Test suite for the ScheduleF model REST API.
    """

    def setUp(self):
        """ Set up the request factory, viewset, and users.
        """

        self.factory = APIRequestFactory()
        self.schedulef_view_set = ScheduleFViewSet.as_view({
            'get': 'list',
            'post': 'create',
            'delete': 'destroy',
            'put': 'update',
        })

        self.user = User.objects.create(**USER_OUTLINE)
        self.user_2 = User.objects.create(**USER_OUTLINE_2)


    def test_list(self):
        """ Test lists all objects in database.
        """

        ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)
        ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)

        request = self.factory.get('', format='json')
        response = self.schedulef_view_set(request)

        self.assertEqual(2, len(response.data))


    def test_retrieve_query_user(self):
        """ Test filtering of objects using 'username' URL query argument returns an array of objects associated with that user.

            URL pattern: '/schedulef/?{filter_field}={field_value}/'.
        """

        # Save objects to test
        ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)
        ScheduleF.objects.create(user=self.user_2, **SCHEDULE_F_OUTLINE)

        request = self.factory.get('?username=' + self.user.get_username(), format='json')
        response = self.schedulef_view_set(request)

        self.assertEquals(1, len(response.data))


    def test_retrieve_query_user_invalid(self):
        """ Test filtering using a username that does not exist returns empty array.
        """

        # Save object to test
        ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)

        request = self.factory.get('?username=ryan_reynolds', format='json')
        response = self.schedulef_view_set(request)

        self.assertEquals(0, len(response.data))


    def test_retrieve_query_invalid(self):
        """ Test filtering using an unsupported query parameter returns empty array.
        """

        # Save objects to test
        ScheduleF.objects.create(user=self.user, **SCHEDULE_F_OUTLINE)

        request = self.factory.get('?shirt=bananas', format='json')
        response = self.schedulef_view_set(request)

        self.assertEquals(0, len(response.data))

    # TODO: Write remaining CRUD tests



# Testing outlines
SCHEDULE_F_OUTLINE = {
    "net_profit": "171000",
    "line_31": "0",
    "line_30": "2,000",
    "line_1_c": "180,000",
    "line_1_b": "20,000",
    "line_1_a": "200,000",
    "line_15": "0",
    "line_14": "0",
    "line_17": "30,000",
    "line_16": "0",
    "line_11": "2,000",
    "line_10": "2,000",
    "line_13": "0",
    "line_12": "0",
    "year": "2015",
    "line_19": "2,000",
    "line_18": "0",
    "line_8": "0",
    "line_29": "0",
    "line_2": "10,000",
    "line_7": "12,000",
    "line_20": "0",
    "line_22": "3,000",
    "line_23": "0",
    "line_25": "0",
    "line_26": "2,000",
    "line_27": "0",
    "line_28": "0",
    "line_21_b": "0",
    "line_32_d": "0",
    "line_32_e": "0",
    "line_32_b": "0",
    "line_32_c": "0",
    "line_32_a": "0",
    "other_expense_1": "Other Expenses",
    "total_expenses": "43,000",
    "line_21_a": "0",
    "other_expense_3": "Other Expenses",
    "line_4_b": "0",
    "line_4_a": "10,000",
    "line_3_a": "10,000",
    "line_24_b": "0",
    "gross_income": "214,000",
    "line_3_b": "0",
    "other_expense_4": "Other Expenses",
    "line_6_d": "0",
    "line_32_f": "0",
    "line_6_a": "0",
    "line_6_b": "0",
    "line_5_c": "12,000",
    "line_5_b": "12,000",
    "line_5_a": "0",
    "other_expense_2": "Other Expenses",
    "other_expense_5": "Other Expenses",
    "line_24_a": "0",
    "other_expense_6": "Other Expenses"
}

USER_OUTLINE = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}

USER_OUTLINE_2 = {
    'username':'ryan_reynolds',
    'first_name': 'Ryan',
    'last_name': 'Reynolds',
    'email':'ryan_reynolds@deadpool.com'
}
