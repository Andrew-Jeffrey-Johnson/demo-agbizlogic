from django.test import TestCase
from allocate.models import *
from django.contrib.auth.models import User
from registration.models import Business, ScheduleF



class BusinessDataModelTestCase(TestCase):
    """ Test suite for BusinessData model.
    """

    def setUp(self):
        """ Store multiple User objects for the testing functions.
        """

        self.user1 = User(**USER_1)
        self.user1.set_password("test")
        self.user1.save()

        self.user2 = User(**USER_2)
        self.user2.set_password("test")
        self.user2.save()


    def test_multiple_businesses_per_user(self):
        """ Test that multiple BusinessData objects can be associated with one User.

            Store multiple BusinessData objects associated with one User, assert the QuerySet contains correct number of objects
        """

        business_types = ("Crop", "Livestock")
        number_of_businesses = 2

        # Create multiple BusinessData objects associated with one User
        for i in range(0, number_of_businesses):
            BusinessData.objects.create(user=self.user1, business_type=business_types[i], **GOLD_STANDARD_DATA)

        # Test that there are BusinessData objects associated to the User
        query = self.user1.businessdata_set.all()
        self.assertEqual(number_of_businesses, len(query))


    def test_multiple_businesses_and_enterprises(self):
        """ Test that one User can have multiple businesses and enterprises

            Store multiple BusinessData and EnterpriseData objects associated with one User, assert the QuerySet contains correct number of objects
        """

        # Create first BusinessData with EnterpriseData objects
        business1 = BusinessData.objects.create(user=self.user1, business_type="Crop")
        EnterpriseData.objects.create(user=self.user1, enterprise="Crop", category_1="Wheat", category_2="Spelt")
        EnterpriseData.objects.create(user=self.user1, enterprise="Crop", category_1="Corn", category_2="White")

        # Create second BusinessData with EnterpriseData object
        business2 = BusinessData.objects.create(user=self.user1, business_type="Livestock")
        EnterpriseData.objects.create(user=self.user1, enterprise="Livestock", category_1="Beef", category_2="Longhorn")

        # Test queries
        query_businesses = self.user1.businessdata_set.all()
        query_enterprises = self.user1.enterprisedata_set.all()

        self.assertEqual(2, len(query_businesses))
        self.assertEqual(3, len(query_enterprises))


    def test_total_income(self):
        """ Test the 'total_income' property.
        """

        business = BusinessData.objects.create(user=self.user1, business_type="Crop", **GOLD_STANDARD_DATA)

        self.assertEqual(business.total_income, 46000)


    def test_total_expenses(self):
        """ Test the 'total_expenses' property.
        """

        business = BusinessData.objects.create(user=self.user1, business_type="Crop", **GOLD_STANDARD_DATA)

        self.assertEqual(business.total_expenses, 12400)


    def test_businessdata_str(self):
        """ Test the __str__ method of the BusinessData model.
        """

        business1 = BusinessData.objects.create(user=self.user1, business_type="Crop")

        self.assertEqual(str(business1), "Crop")



class EnterpriseDataModelTestCase(TestCase):
    """ Test suite for the EnterpriseData model.
    """

    def setUp(self):
        """ Create User objects for testing.
        """

        self.user1 = User(**USER_1)
        self.user1.set_password("test")
        self.user1.save()
        BusinessData.objects.create(user=self.user1, business_type="Crop", **GOLD_STANDARD_DATA)

        self.user2 = User(**USER_2)
        self.user2.set_password("test")
        self.user2.save()
        BusinessData.objects.create(user=self.user2, business_type="Livestock", **GOLD_STANDARD_DATA)


    def test_multiple_enterprises_per_user(self):
        """ Test that multiple Enterprise objects can be associated with one User.

            Store multiple Enterprise objects associated with one User, assert the QuerySet contains correct number of objects
        """

        enterprises = (
            ("Crop", "Wheat", "Spelt"),
            ("Livestock", "Cattle", "Longhorn")
        )

        # Create multiple EnterpriseData objects associated with one User
        for enterprise, category_1, category_2 in enterprises:
            EnterpriseData.objects.create(user=self.user1, enterprise=enterprise, category_1=category_1, category_2=category_2, **GOLD_STANDARD_DATA)

        # Test that there are EnterpriseData objects associated to the User
        query = self.user1.enterprisedata_set.all()

        self.assertEqual(len(enterprises), len(query))


    def test_total_income(self):
        """ Test the 'total_income' property.
        """

        enterprise = EnterpriseData.objects.create(user=self.user1, enterprise="Crop", category_1="Wheat", category_2="Spelt", **GOLD_STANDARD_DATA)

        self.assertEqual(enterprise.total_income, 46000)


    def test_total_expenses(self):
        """ Test the 'total_expenses' property.
        """

        enterprise = EnterpriseData.objects.create(user=self.user1, enterprise="Crop", category_1="Wheat", category_2="Spelt", **GOLD_STANDARD_DATA)

        self.assertEqual(enterprise.total_expenses, 12400)


    def test_enterprisedata_str(self):
        """ Test the __str__ method of the EnterpriseData model.
        """
        enterprise = EnterpriseData.objects.create(user=self.user1, enterprise="Crop", category_1="Wheat", category_2="Spelt", **GOLD_STANDARD_DATA)

        self.assertEqual(str(enterprise), "Wheat")



# Test users
USER_1 = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}
USER_2 = {
    'username': 'alecmerdler',
    'first_name': 'Alec',
    'last_name': 'Merdler',
    'email': 'alecmerdler@holygrail.com'
}

# Used for testing income/expenses allocation
GOLD_STANDARD_DATA = {
    'income_sales': 35000,
    'income_cooperative': 1000,
    'income_agriculture_programs': 1000,
    'income_insurance': 1000,
    'income_custom_hire': 3000,
    'income_other': 5000,

    'expenses_goods': 1000,
    'expenses_car':  2000,
    'expenses_chemicals': 1000,
    'expenses_conservation': 500,
    'expenses_custom_hire': 1000,
    'expenses_depreciation': 200,
    'expenses_employee_benefit': 400,
    'expenses_feed': 400,
    'expenses_fertilizers': 200,
    'expenses_freight': 1000,
    'expenses_gasoline': 200,
    'expenses_insurance': 300,
    'expenses_interest_mortgages': 100,
    'expenses_labor': 200,
    'expenses_pension': 200,
    'expenses_machinery_rent': 100,
    'expenses_land_rent': 200,
    'expenses_repairs': 200,
    'expenses_seeds': 0,
    'expenses_storage': 300,
    'expenses_supplies': 100,
    'expenses_property_taxes': 2000,
    'expenses_utilities': 300,
    'expenses_veterinary': 200,
    'expenses_other_1': 300,
    'expenses_other_2': 0,
    'expenses_other_3': 0,
    'expenses_other_4': 0,
    'expenses_other_5': 0,
}
