from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate, APIClient
from allocate.models import *
from allocate.views import BusinessDataViewSet, EnterpriseDataViewSet, ScheduleFViewSet
from allocate.serializers import *
from registration.models import *
from django.core import serializers
import copy
from collections import OrderedDict
import json



class BusinessDataAPITestCase(APITestCase):
    """ Test suite for allocate REST API.
    """

    def setUp(self):
        self.factory = APIRequestFactory()

        self.user = User.objects.create(**USER)
        self.user_2 = User.objects.create(**USER_2)


    def test_list_noparam(self):
        """ Test sending GET request to this endpoint with no query parameters returns list of all BusinessData objects.
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)
        BusinessData.objects.create(user=self.user_2, **BUSINESS_DATA_2)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        response = viewset(request)

        self.assertEquals(2, len(response.data))

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_2)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        response = viewset(request)

        self.assertEquals(3, len(response.data))


    def test_retrieve_invalid_query_params(self):
        """ Test retieve with invalid params returns 400.
        """

        businessdata = BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?bread=white', format='json')
        response = viewset(request)

        self.assertEquals(403, response.status_code)


    def test_retrieve_query_user(self):
        """ Test filtering of objects using 'username' URL query argument returns an array of objects associated with that user.

            URL pattern: '/businessdata/?{username}={username}/'.
            depends:    test_list_noparam maybe?
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)
        BusinessData.objects.create(user=self.user_2, **BUSINESS_DATA_2)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('',{'username' : 'johncleese'}, format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(1, len(response.data))

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_2)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=' + self.user.get_username(), format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(2, len(response.data))


    def test_retrieve_query_user_invalid(self):
        """ Test filtering using a username that does not exist returns empty array.
            depends:    test_retrieve_query_user
                        test_list_noparam maybe?
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=gumby_surgeon', format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(0, len(response.data))


    def test_retrieve_query_field_valid(self):
        """ Test filtering of fields based on fields parameter
            depends:    test_list_noparam maybe?
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=business_type,income_sales', format='json')
        response = viewset(request)

        self.assertEquals([OrderedDict([("business_type", "Livestock"), ("income_sales", 1000000)])], response.data)


    def test_retrieve_query_ignores_invalid_fields(self):
        """ Test filtering of fields based on fields parameter ignores invalid fields
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=business_type,income_sales,banana', format='json')
        response = viewset(request)

        self.assertEquals([OrderedDict([("business_type", "Livestock"), ("income_sales", 1000000)])], response.data)


    def test_retrieve_query_does_not_return_user_object(self):
        """ Test filtering of fields based on fields will not return user object if requested
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=business_type,income_sales,user', format='json')
        response = viewset(request)

        self.assertEquals([OrderedDict([("business_type", "Livestock"), ("income_sales", 1000000)])], response.data)


    def test_retrieve_query_no_fields_returns_entire_object(self):
        """ Supplying no fields parameter should return a complete object
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('')
        response = viewset(request)

        self.assertContains(response, "\"business_type\"")
        self.assertContains(response, "\"income_sales\"")
        self.assertContains(response, "\"income_cooperative\"")
        self.assertContains(response, "\"income_agriculture_programs\"")
        self.assertContains(response, "\"income_insurance\"")
        self.assertContains(response, "\"income_custom_hire\"")
        self.assertContains(response, "\"income_other\"")
        self.assertContains(response, "\"expenses_goods\"")
        self.assertContains(response, "\"expenses_car\"")
        self.assertContains(response, "\"expenses_chemicals\"")
        self.assertContains(response, "\"expenses_conservation\"")
        self.assertContains(response, "\"expenses_custom_hire\"")
        self.assertContains(response, "\"expenses_depreciation\"")
        self.assertContains(response, "\"expenses_employee_benefit\"")
        self.assertContains(response, "\"expenses_feed\"")
        self.assertContains(response, "\"expenses_fertilizers\"")
        self.assertContains(response, "\"expenses_freight\"")
        self.assertContains(response, "\"expenses_gasoline\"")
        self.assertContains(response, "\"expenses_insurance\"")
        self.assertContains(response, "\"expenses_interest_mortgages\"")
        self.assertContains(response, "\"expenses_labor\"")
        self.assertContains(response, "\"expenses_pension\"")
        self.assertContains(response, "\"expenses_machinery_rent\"")
        self.assertContains(response, "\"expenses_land_rent\"")
        self.assertContains(response, "\"expenses_repairs\"")
        self.assertContains(response, "\"expenses_seeds\"")
        self.assertContains(response, "\"expenses_storage\"")
        self.assertContains(response, "\"expenses_supplies\"")
        self.assertContains(response, "\"expenses_property_taxes\"")
        self.assertContains(response, "\"expenses_utilities\"")
        self.assertContains(response, "\"expenses_veterinary\"")
        self.assertContains(response, "\"expenses_other_1\"")
        self.assertContains(response, "\"expenses_other_2\"")
        self.assertContains(response, "\"expenses_other_3\"")
        self.assertContains(response, "\"expenses_other_4\"")
        self.assertContains(response, "\"expenses_other_5\"")
        self.assertContains(response, "\"expenses_other_6\"")


    def test_retrieve_query_no_fields_returns_entire_object_without_user(self):
        """ Supplying no fields parameter should not return the user
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('')
        response = viewset(request)

        self.assertNotContains(response, "\"user\":")


    def test_retrieve_query_only_invalid_fields_returns_entire_object(self):
        """ Supplying no only invalid fields parameters should return a complete object
            depends: test_list_retrieve_query_no_param
        """

        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        viewset = BusinessDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=banana')
        response = viewset(request)

        self.assertContains(response, "\"business_type\"")
        self.assertContains(response, "\"income_sales\"")
        self.assertContains(response, "\"income_cooperative\"")
        self.assertContains(response, "\"income_agriculture_programs\"")
        self.assertContains(response, "\"income_insurance\"")
        self.assertContains(response, "\"income_custom_hire\"")
        self.assertContains(response, "\"income_other\"")
        self.assertContains(response, "\"expenses_goods\"")
        self.assertContains(response, "\"expenses_car\"")
        self.assertContains(response, "\"expenses_chemicals\"")
        self.assertContains(response, "\"expenses_conservation\"")
        self.assertContains(response, "\"expenses_custom_hire\"")
        self.assertContains(response, "\"expenses_depreciation\"")
        self.assertContains(response, "\"expenses_employee_benefit\"")
        self.assertContains(response, "\"expenses_feed\"")
        self.assertContains(response, "\"expenses_fertilizers\"")
        self.assertContains(response, "\"expenses_freight\"")
        self.assertContains(response, "\"expenses_gasoline\"")
        self.assertContains(response, "\"expenses_insurance\"")
        self.assertContains(response, "\"expenses_interest_mortgages\"")
        self.assertContains(response, "\"expenses_labor\"")
        self.assertContains(response, "\"expenses_pension\"")
        self.assertContains(response, "\"expenses_machinery_rent\"")
        self.assertContains(response, "\"expenses_land_rent\"")
        self.assertContains(response, "\"expenses_repairs\"")
        self.assertContains(response, "\"expenses_seeds\"")
        self.assertContains(response, "\"expenses_storage\"")
        self.assertContains(response, "\"expenses_supplies\"")
        self.assertContains(response, "\"expenses_property_taxes\"")
        self.assertContains(response, "\"expenses_utilities\"")
        self.assertContains(response, "\"expenses_veterinary\"")
        self.assertContains(response, "\"expenses_other_1\"")
        self.assertContains(response, "\"expenses_other_2\"")
        self.assertContains(response, "\"expenses_other_3\"")
        self.assertContains(response, "\"expenses_other_4\"")
        self.assertContains(response, "\"expenses_other_5\"")
        self.assertContains(response, "\"expenses_other_6\"")


    def test_create(self):
        """ Test create action.
        """

        viewset = BusinessDataViewSet.as_view({'post': "create"})
        request = self.factory.post('', BUSINESS_DATA, format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(201, response.status_code)

        self.assertEquals(BUSINESS_DATA["business_type"], response.data["business_type"])
        self.assertEquals(BUSINESS_DATA["expenses_feed"], response.data["expenses_feed"])
        self.assertEquals(BUSINESS_DATA["expenses_pension"], response.data["expenses_pension"])


    def test_update(self):
        """ Test update action.
        """

        businessdata = BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        businessdata_updated = copy.deepcopy(BUSINESS_DATA)
        businessdata_updated.update({'business_type': "Crop"})

        viewset = BusinessDataViewSet.as_view({'put': "update"})
        request = self.factory.put('', businessdata_updated)
        response = viewset(request,id=businessdata.pk)

        self.assertEquals(200, response.status_code)
        self.assertEquals(businessdata_updated['business_type'], response.data['business_type'])


    def test_destroy(self):
        """ Test destroy action.
        """

        businessdata = BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        viewset = BusinessDataViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('', format='json')
        response = viewset(request, id=businessdata.pk)

        self.assertEquals(204, response.status_code)


    def test_list_whole_farm_valid(self):
        """ Test sending GET request to '/list_whole_farm' endpoint returns a BusinessData-like object, with each field
            containing the remainder of ScheduleF minus the total from each BusinessData object.
        """

        ScheduleF.objects.create(user=self.user, **SCHEDULE_F_DATA_2)
        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)
        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_2)
        gold_standard_data = get_allocate_data(self.user)

        viewset = BusinessDataViewSet.as_view({'get': "list_whole_farm"})
        request = self.factory.get('')
        request.user = self.user
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        for field in gold_standard_data:
            expected_value = gold_standard_data[field]['total']
            for business in BusinessData.objects.filter(user=self.user):
                expected_value -= getattr(business, gold_standard_data[field]['name'])
            self.assertEqual(expected_value, response.data[gold_standard_data[field]['name']])


    def test_list_whole_farm_total_income(self):
        """ Test whole farm BusinessData object has 'total_income' field which equals the sum of all income fields.
        """

        ScheduleF.objects.create(user=self.user, **SCHEDULE_F_DATA_2)
        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)
        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_2)
        gold_standard_data = get_allocate_data(self.user)

        viewset = BusinessDataViewSet.as_view({'get': "list_whole_farm"})
        request = self.factory.get('')
        request.user = self.user
        response = viewset(request)

        expected_total = 0
        for category, value in response.data.iteritems():
            if "income" in category and "total" not in category:
                expected_total += value

        self.assertEqual(expected_total, response.data["total_income"])


    def test_list_whole_farm_total_expenses(self):
        """ Test Whole Farm BusinessData object has 'total_expenses' field which equals the sum of all expense fields.
        """

        ScheduleF.objects.create(user=self.user, **SCHEDULE_F_DATA_2)
        BusinessData.objects.create(user=self.user, **BUSINESS_DATA)
        BusinessData.objects.create(user=self.user, **BUSINESS_DATA_2)
        gold_standard_data = get_allocate_data(self.user)

        viewset = BusinessDataViewSet.as_view({'get': "list_whole_farm"})
        request = self.factory.get('')
        request.user = self.user
        response = viewset(request)

        expected_total = 0
        for category, value in response.data.iteritems():
            if "expenses" in category and "total" not in category:
                expected_total += value

        self.assertEqual(expected_total, response.data["total_expenses"])


    def test_list_whole_farm_no_schedule_f(self):
        """ Test endpoint returns HTTP 400 if the request user has no ScheduleF objects associated.
        """

        viewset = BusinessDataViewSet.as_view({'get': "list_whole_farm"})
        request = self.factory.get('')
        request.user = self.user
        response = viewset(request)

        self.assertEqual(400, response.status_code)


    def test_complete_exists(self):
        """ Test sending POST to '/enterprise_data/{id}/complete/' sets the BusinessData 'completed' field to True and
            returns HTTP 200.
        """

        businessdata = BusinessData.objects.create(user=self.user, **BUSINESS_DATA)

        viewset = BusinessDataViewSet.as_view({'post': "complete"})
        request = self.factory.post('', {}, format="json")
        response = viewset(request, id=businessdata.pk)

        businessdata_updated = BusinessData.objects.get(pk=businessdata.pk)

        self.assertEqual(200, response.status_code)
        self.assertTrue(businessdata_updated.completed)


    def test_complete_does_not_exist(self):
        """ Test sending POST to '/enterprise_data/{id}/complete/' when resource does not exist
            returns HTTP 404.
        """

        viewset = BusinessDataViewSet.as_view({'post': "complete"})
        request = self.factory.post('', {}, format="json")
        response = viewset(request, id=73)

        self.assertEqual(404, response.status_code)



class EnterpriseDataAPITestCase(APITestCase):
    """ Test suite for allocate REST API.
    """

    def setUp(self):
        self.factory = APIRequestFactory()

        self.user = User.objects.create(**USER)
        self.user_2 = User.objects.create(**USER_2)


    def test_list_noparam(self):
        """ Test GET /enterprisedata/
        """
        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)
        EnterpriseData.objects.create(user=self.user_2, **ENTERPRISE_DATA_2)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        response = viewset(request)

        self.assertEquals(2, len(response.data))

        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA_2)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('', format='json')
        response = viewset(request)

        self.assertEquals(3, len(response.data))


    def test_retrieve_invalid_query_params(self):
        """ Test retieve with invalid params returns 400.
        """

        enterprisedata = EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?bread=white', format='json')
        response = viewset(request)

        self.assertEquals(403, response.status_code)



    def test_retrieve_query_user(self):
        """ Test filtering of objects using 'username' URL query argument returns an array of objects associated with that user.

            URL pattern: '/enterprisedata/?{username}={username}/'.
        """

        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)
        EnterpriseData.objects.create(user=self.user_2, **ENTERPRISE_DATA_2)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('',{'username' : 'johncleese'}, format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(1, len(response.data))

        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA_2)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=' + self.user.get_username(), format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(2, len(response.data))


    def test_retrieve_query_user_invalid(self):
        """ Test filtering using a username that does not exist returns empty array.
        """

        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?username=gumby_surgeon', format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(0, len(response.data))


    def test_retrieve_query_field_valid(self):
        """ Test filtering of fields based on fields parameter
        """

        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=enterprise,category_1', format='json')
        response = viewset(request)

        self.assertEquals([OrderedDict([("enterprise", "Livestock"), ("category_1", "Poultry")])], response.data)


    def test_retrieve_query_ignores_invalid_fields(self):
        """ Test filtering of fields based on fields parameter ignores invalid fields
        """

        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=enterprise,category_1,banana', format='json')
        response = viewset(request)

        self.assertEquals([OrderedDict([("enterprise", "Livestock"), ("category_1", "Poultry")])], response.data)

    def test_retrieve_query_will_not_return_user_object(self):
        """ Test filtering of fields based on fields will not return user object
        """

        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=enterprise,category_1,user', format='json')
        response = viewset(request)

        self.assertEquals([OrderedDict([("enterprise", "Livestock"), ("category_1", "Poultry")])], response.data)


    def test_retrieve_query_no_fields_returns_entire_object(self):
        """ Supplying no fields parameter should return a complete object
        """

        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('')
        response = viewset(request)

        self.assertContains(response,"\"enterprise\"")
        self.assertContains(response,"\"category_1\"")
        self.assertContains(response,"\"category_2\"")
        self.assertContains(response,"\"category_3\"")
        self.assertContains(response,"\"category_4\"")
        self.assertContains(response,"\"category_5\"")
        self.assertContains(response,"\"category_6\"")
        self.assertContains(response,"\"market\"")
        self.assertContains(response,"\"income_sales\"")
        self.assertContains(response,"\"income_cooperative\"")
        self.assertContains(response,"\"income_agriculture_programs\"")
        self.assertContains(response,"\"income_insurance\"")
        self.assertContains(response,"\"income_custom_hire\"")
        self.assertContains(response,"\"income_other\"")
        self.assertContains(response,"\"expenses_goods\"")
        self.assertContains(response,"\"expenses_car\"")
        self.assertContains(response,"\"expenses_chemicals\"")
        self.assertContains(response,"\"expenses_conservation\"")
        self.assertContains(response,"\"expenses_custom_hire\"")
        self.assertContains(response,"\"expenses_depreciation\"")
        self.assertContains(response,"\"expenses_employee_benefit\"")
        self.assertContains(response,"\"expenses_feed\"")
        self.assertContains(response,"\"expenses_fertilizers\"")
        self.assertContains(response,"\"expenses_freight\"")
        self.assertContains(response,"\"expenses_gasoline\"")
        self.assertContains(response,"\"expenses_insurance\"")
        self.assertContains(response,"\"expenses_interest_mortgages\"")
        self.assertContains(response,"\"expenses_labor\"")
        self.assertContains(response,"\"expenses_pension\"")
        self.assertContains(response,"\"expenses_machinery_rent\"")
        self.assertContains(response,"\"expenses_land_rent\"")
        self.assertContains(response,"\"expenses_repairs\"")
        self.assertContains(response,"\"expenses_seeds\"")
        self.assertContains(response,"\"expenses_storage\"")
        self.assertContains(response,"\"expenses_supplies\"")
        self.assertContains(response,"\"expenses_property_taxes\"")
        self.assertContains(response,"\"expenses_utilities\"")
        self.assertContains(response,"\"expenses_veterinary\"")
        self.assertContains(response,"\"expenses_other_1\"")
        self.assertContains(response,"\"expenses_other_2\"")
        self.assertContains(response,"\"expenses_other_3\"")
        self.assertContains(response,"expenses_other_4\"")
        self.assertContains(response,"\"expenses_other_5\"")
        self.assertContains(response,"\"expenses_other_6\"")


    def test_retrieve_query_no_fields_returns_entire_object_without_user(self):
        """ Supplying no fields parameter should not return the user
        """

        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('')
        response = viewset(request)

        self.assertNotContains(response, "\"user\":")

    def test_retrieve_query_only_invalid_fields_returns_entire_object(self):
        """ Supplying no only invalid fields parameters should return a complete object
        """

        EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        viewset = EnterpriseDataViewSet.as_view({'get': "list"})
        request = self.factory.get('?fields=banana')
        response = viewset(request)

        self.assertContains(response,"\"enterprise\"")
        self.assertContains(response,"\"category_1\"")
        self.assertContains(response,"\"category_2\"")
        self.assertContains(response,"\"category_3\"")
        self.assertContains(response,"\"category_4\"")
        self.assertContains(response,"\"category_5\"")
        self.assertContains(response,"\"category_6\"")
        self.assertContains(response,"\"market\"")
        self.assertContains(response,"\"income_sales\"")
        self.assertContains(response,"\"income_cooperative\"")
        self.assertContains(response,"\"income_agriculture_programs\"")
        self.assertContains(response,"\"income_insurance\"")
        self.assertContains(response,"\"income_custom_hire\"")
        self.assertContains(response,"\"income_other\"")
        self.assertContains(response,"\"expenses_goods\"")
        self.assertContains(response,"\"expenses_car\"")
        self.assertContains(response,"\"expenses_chemicals\"")
        self.assertContains(response,"\"expenses_conservation\"")
        self.assertContains(response,"\"expenses_custom_hire\"")
        self.assertContains(response,"\"expenses_depreciation\"")
        self.assertContains(response,"\"expenses_employee_benefit\"")
        self.assertContains(response,"\"expenses_feed\"")
        self.assertContains(response,"\"expenses_fertilizers\"")
        self.assertContains(response,"\"expenses_freight\"")
        self.assertContains(response,"\"expenses_gasoline\"")
        self.assertContains(response,"\"expenses_insurance\"")
        self.assertContains(response,"\"expenses_interest_mortgages\"")
        self.assertContains(response,"\"expenses_labor\"")
        self.assertContains(response,"\"expenses_pension\"")
        self.assertContains(response,"\"expenses_machinery_rent\"")
        self.assertContains(response,"\"expenses_land_rent\"")
        self.assertContains(response,"\"expenses_repairs\"")
        self.assertContains(response,"\"expenses_seeds\"")
        self.assertContains(response,"\"expenses_storage\"")
        self.assertContains(response,"\"expenses_supplies\"")
        self.assertContains(response,"\"expenses_property_taxes\"")
        self.assertContains(response,"\"expenses_utilities\"")
        self.assertContains(response,"\"expenses_veterinary\"")
        self.assertContains(response,"\"expenses_other_1\"")
        self.assertContains(response,"\"expenses_other_2\"")
        self.assertContains(response,"\"expenses_other_3\"")
        self.assertContains(response,"\"expenses_other_4\"")
        self.assertContains(response,"\"expenses_other_5\"")
        self.assertContains(response,"\"expenses_other_6\"")


    def test_create(self):
        """ Test create action.
        """

        viewset = EnterpriseDataViewSet.as_view({'post': "create"})
        request = self.factory.post('', ENTERPRISE_DATA, format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(201, response.status_code)

        self.assertEquals(ENTERPRISE_DATA["enterprise"], response.data["enterprise"])
        self.assertEquals(ENTERPRISE_DATA["expenses_car"], response.data["expenses_car"])
        self.assertEquals(ENTERPRISE_DATA["expenses_property_taxes"], response.data["expenses_property_taxes"])


    def test_create_limit_to_seven_per_business(self):
        """ Test that attempting to create a new EnterpriseData object when the limit has been reached for each business
            type returns HTTP 400 and does not create the object.
        """

        for i in range(0, 7):
            EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        viewset = EnterpriseDataViewSet.as_view({'post': "create"})
        request = self.factory.post('', ENTERPRISE_DATA, format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(400, response.status_code)


    def test_create_limit_different_business(self):
        """ Test that attempting to create a new EnterpriseData object when the limit has been reached for another business
            type completes normally.
        """

        for i in range(0, 7):
            EnterpriseData.objects.create(user=self.user, enterprise="Crop", category_1="Cereal Grains")

        viewset = EnterpriseDataViewSet.as_view({'post': "create"})
        request = self.factory.post('', ENTERPRISE_DATA, format='json')
        request.user = self.user
        response = viewset(request)

        self.assertEquals(201, response.status_code)


    def test_update(self):
        """ Test update action.
        """

        enterprisedata = EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        enterprisedata_updated = copy.deepcopy(ENTERPRISE_DATA)
        enterprisedata_updated.update({"enterprise": "Nursery"})

        viewset = EnterpriseDataViewSet.as_view({'put': "update"})
        request = self.factory.put('', enterprisedata_updated)
        response = viewset(request,id=enterprisedata.pk)

        self.assertEquals(200, response.status_code)
        self.assertEquals(enterprisedata_updated["enterprise"], response.data["enterprise"])


    def test_destroy(self):
        """ Test destroy action.
        """

        enterprisedata = EnterpriseData.objects.create(user=self.user, **ENTERPRISE_DATA)

        viewset = EnterpriseDataViewSet.as_view({'delete': "destroy"})
        request = self.factory.delete('', format='json')
        response = viewset(request, id=enterprisedata.pk)

        self.assertEquals(204, response.status_code)



################################################################################
#                            Helper Functions
################################################################################

def get_allocate_data(user):
    """ Returns a dictionary of Schedule F data for the given User in Gold Standard format.
        Returns None if no ScheduleF objects exist for the given User.
    """

    try:
        schedule_f = ScheduleF.objects.filter(user=user)[0]
        allocate_data = schedule_f.convert_to_gold_standard()

    except IndexError:
        allocate_data = None

    return allocate_data


# Dictionaries used to create test objects
USER = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}
USER_2 = {
    'username':'terrygillam',
    'first_name': 'Terry',
    'last_name': 'Gillam',
    'email':'terrygillam@holygrail.com'
}
BUSINESS_DATA = {
    "business_type": "Livestock",
    "income_sales": 1000000,
    "income_cooperative": 0,
    "income_agriculture_programs": 0,
    "income_insurance": 0,
    "income_custom_hire": 500000,
    "income_other": 150000,
    "expenses_goods": 900000,
    "expenses_car": 50000,
    "expenses_chemicals": 10000,
    "expenses_conservation": 10000,
    "expenses_custom_hire": 0,
    "expenses_depreciation": 10000,
    "expenses_employee_benefit": 15000,
    "expenses_feed": 50000,
    "expenses_fertilizers": 0,
    "expenses_freight": 25000,
    "expenses_gasoline": 25000,
    "expenses_insurance": 10000,
    "expenses_interest_mortgages": 0,
    "expenses_labor": 200000,
    "expenses_pension": 100000,
    "expenses_machinery_rent": 0,
    "expenses_land_rent": 0,
    "expenses_repairs": 25000,
    "expenses_seeds": 5000,
    "expenses_storage": 10000,
    "expenses_supplies": 10000,
    "expenses_property_taxes": 30000,
    "expenses_utilities": 10000,
    "expenses_veterinary": 50000,
    "expenses_other_1": 0,
    "expenses_other_2": 0,
    "expenses_other_3": 0,
    "expenses_other_4": 0,
    "expenses_other_5": 0,
    "expenses_other_6": 0
}
BUSINESS_DATA_2 = {
    "business_type": "Crop",
    "income_sales": 1520000,
    "income_cooperative": 0,
    "income_agriculture_programs": 0,
    "income_insurance": 0,
    "income_custom_hire": 500000,
    "income_other": 160000,
    "expenses_goods": 900000,
    "expenses_car": 60000,
    "expenses_chemicals": 10000,
    "expenses_conservation": 10000,
    "expenses_custom_hire": 0,
    "expenses_depreciation": 10000,
    "expenses_employee_benefit": 17000,
    "expenses_feed": 0,
    "expenses_fertilizers": 50000,
    "expenses_freight": 25000,
    "expenses_gasoline": 25000,
    "expenses_insurance": 12000,
    "expenses_interest_mortgages": 0,
    "expenses_labor": 290000,
    "expenses_pension": 100000,
    "expenses_machinery_rent": 0,
    "expenses_land_rent": 0,
    "expenses_repairs": 25000,
    "expenses_seeds": 10000,
    "expenses_storage": 10000,
    "expenses_supplies": 10000,
    "expenses_property_taxes": 30000,
    "expenses_utilities": 10000,
    "expenses_veterinary": 2000,
    "expenses_other_1": 0,
    "expenses_other_2": 0,
    "expenses_other_3": 0,
    "expenses_other_4": 3,
    "expenses_other_5": 0,
    "expenses_other_6": 0
}
ENTERPRISE_DATA = {
    "enterprise": "Livestock",
    "category_1": "Poultry",
    "category_2": "Ostrich",
    "category_3": "",
    "category_4": "",
    "category_5": "",
    "category_6": "",
    "market": "Natural",
    "income_sales": 1000000,
    "income_cooperative": 0,
    "income_agriculture_programs": 0,
    "income_insurance": 0,
    "income_custom_hire": 500000,
    "income_other": 150000,
    "expenses_goods": 900000,
    "expenses_car": 50000,
    "expenses_chemicals": 10000,
    "expenses_conservation": 10000,
    "expenses_custom_hire": 0,
    "expenses_depreciation": 10000,
    "expenses_employee_benefit": 15000,
    "expenses_feed": 50000,
    "expenses_fertilizers": 0,
    "expenses_freight": 25000,
    "expenses_gasoline": 25000,
    "expenses_insurance": 10000,
    "expenses_interest_mortgages": 0,
    "expenses_labor": 200000,
    "expenses_pension": 100000,
    "expenses_machinery_rent": 0,
    "expenses_land_rent": 0,
    "expenses_repairs": 25000,
    "expenses_seeds": 5000,
    "expenses_storage": 10000,
    "expenses_supplies": 10000,
    "expenses_property_taxes": 30000,
    "expenses_utilities": 10000,
    "expenses_veterinary": 50000,
    "expenses_other_1": 0,
    "expenses_other_2": 0,
    "expenses_other_3": 0,
    "expenses_other_4": 0,
    "expenses_other_5": 0,
    "expenses_other_6": 0
}
ENTERPRISE_DATA_2 = {
    "enterprise": "Livestock",
    "category_1": "Poultry",
    "category_2": "Chocobo",
    "category_3": "",
    "category_4": "",
    "category_5": "",
    "category_6": "",
    "market": "Racing",
    "income_sales": 1000000,
    "income_cooperative": 100000,
    "income_agriculture_programs": 0,
    "income_insurance": 0,
    "income_custom_hire": 50000,
    "income_other": 150000,
    "expenses_goods": 90000,
    "expenses_car": 50000,
    "expenses_chemicals": 10000,
    "expenses_conservation": 10000,
    "expenses_custom_hire": 0,
    "expenses_depreciation": 10000,
    "expenses_employee_benefit": 15000,
    "expenses_feed": 50000,
    "expenses_fertilizers": 0,
    "expenses_freight": 25000,
    "expenses_gasoline": 25000,
    "expenses_insurance": 10000,
    "expenses_interest_mortgages": 0,
    "expenses_labor": 200000,
    "expenses_pension": 100000,
    "expenses_machinery_rent": 0,
    "expenses_land_rent": 1000,
    "expenses_repairs": 25000,
    "expenses_seeds": 5000,
    "expenses_storage": 10000,
    "expenses_supplies": 10000,
    "expenses_property_taxes": 30000,
    "expenses_utilities": 10000,
    "expenses_veterinary": 50000,
    "expenses_other_1": 0,
    "expenses_other_2": 0,
    "expenses_other_3": 0,
    "expenses_other_4": 0,
    "expenses_other_5": 0,
    "expenses_other_6": 0
}
SCHEDULE_F_DATA = {
    'line_1_a':'350,000',
    'line_1_b': '50,000',
    'line_1_c': '300,000',
    'line_2': '3,500,000',
    'line_3_a': '3,000',
    'line_3_b': '1,500',
    'line_4_a': '60,000',
    'line_4_b': '60,000',
    'line_5_a': '0',
    'line_5_b': '0',
    'line_5_c': '0',
    'line_6_a': '200,000',
    'line_6_b': '200,000',
    'line_6_d': '0',
    'line_7': '150,000',
    'line_8': '12,500',
    'gross_income': '4,224,000',
    'line_10': '10,000',
    'line_11': '160,000',
    'line_12': '25,000',
    'line_13': '20,000',
    'line_14': '250,000',
    'line_15': '300,000',
    'line_16': '13,000',
    'line_17': '75,000',
    'line_18': '28,000',
    'line_19': '100,000',
    'line_20': '50,000',
    'line_21_a': '300,000',
    'line_21_b': '50,000',
    'line_22': '200,000',
    'line_23': '15,000',
    'line_24_a': '52,000',
    'line_24_b': '150,000',
    'line_25': '30,000',
    'line_26': '60,000',
    'line_27': '25,000',
    'line_28': '10,000',
    'line_29': '9,000',
    'line_30': '40,000',
    'line_31': '40,000',
    'line_32_a': '10,000',
    'line_32_b': '50,000',
    'total_expenses': '2,072,000'
}
SCHEDULE_F_DATA_2 = {
    'line_1_a':350000,
    'line_1_b': 50000,
    'line_1_c': 300000,
    'line_2': 3500000,
    'line_3_a': 3000,
    'line_3_b': 1500,
    'line_4_a': 60000,
    'line_4_b': 60000,
    'line_5_a': 0,
    'line_5_b': 0,
    'line_5_c': 0,
    'line_6_a': 200000,
    'line_6_b': 200000,
    'line_6_d': 0,
    'line_7': 150000,
    'line_8': 12500,
    'gross_income': 4224000,
    'line_10': 10000,
    'line_11': 160000,
    'line_12': 25000,
    'line_13': 20000,
    'line_14': 250000,
    'line_15': 300000,
    'line_16': 13000,
    'line_17': 75000,
    'line_18': 28000,
    'line_19': 100000,
    'line_20': 50000,
    'line_21_a': 300000,
    'line_21_b': 50000,
    'line_22': 200000,
    'line_23': 15000,
    'line_24_a': 52000,
    'line_24_b': 150000,
    'line_25': 30000,
    'line_26': 60000,
    'line_27': 25000,
    'line_28': 10000,
    'line_29': 9000,
    'line_30': 40000,
    'line_31': 40000,
    'line_32_a': 10000,
    'line_32_b': 50000,
    'total_expenses': 2072000
}
SCHEDULE_F_TO_GOLD_STANDARD = {
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
