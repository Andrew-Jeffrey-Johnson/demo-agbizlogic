from allocate.models import BusinessData, EnterpriseData
from budget.models import Budget
from registration.models import Business, ScheduleF
from .convert_to_gold_standard_view import ConvertToGoldStandardView
from rest_framework.test import APIRequestFactory
from django.contrib.auth.models import User
from allocate.serializers import BusinessDataSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework.exceptions import ParseError



class BusinessDataViewSet(ModelViewSet):
    """ API endpoint for Budget model.
    """

    lookup_field = 'id'
    lookup_value_regex = '[0-9]+'
    serializer_class = BusinessDataSerializer


    def dispatch(self, *args, **kwargs):
        """ Overriding this method to disallow unwanted http methods.
        """

        self.http_method_names = ['get', 'post', 'put', 'delete']
        return super(BusinessDataViewSet, self).dispatch(*args, **kwargs)


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
        """

        queryset = BusinessData.objects.all()
        query_params = self.request.query_params

        # Check for invalid query parameters
        for key in query_params.keys():
            if key not in {'username', 'fields'}:
                raise PermissionDenied("Invalid Request")

        username = query_params.get('username', None)
        if username is not None:
            if username == self.request.user.get_username():
                try:
                    queryset = queryset.filter(user=User.objects.get(username=username))
                except User.DoesNotExist:
                    queryset = None
            else:
                queryset = None

        return queryset


    def perform_create(self, serializer):
        """ Add user to new object, then save to database.
        """

        serializer.save(user=self.request.user)


    @action(detail=True, methods=["post"])
    def complete(self, request, id):
        """ Marks the BusinessData object's 'completed' field to True.
        """

        try:
            businessdata = BusinessData.objects.get(pk=id)
            businessdata.completed = True
            businessdata.save()

            response = Response({}, status=200)

        except ObjectDoesNotExist:
            response = Response({"error": "BusinessData object does not exist."}, status=404)

        return response


    @action(detail=False, methods=['get'])
    def list_whole_farm(self,request):
        """ Calculate Whole farm and return a dictionary of it.
        """

        business_list = BusinessData.objects.filter(user=request.user)
        gold_standard_data = get_allocate_data(request.user)

        if gold_standard_data is None:
            response = Response({"No ScheduleF objects associated with this user."}, status=400)
        else:
            whole_farm_data = {
                "total_income": 0,
                "total_expenses": 0,
            }

            for field in gold_standard_data:
                field_name = gold_standard_data[field]['name']

                if "income" in field:
                    whole_farm_data[field_name] = gold_standard_data[field]['total']

                    for business in business_list:
                        whole_farm_data[field_name] -= getattr(business, field_name)

                    whole_farm_data["total_income"] += whole_farm_data[field_name]

                elif "expenses" in field_name:
                    whole_farm_data.setdefault(field, 0)
                    whole_farm_data[field_name] = gold_standard_data[field]['total']

                    for business in business_list:
                        whole_farm_data[field_name] -= getattr(business, field_name)

                    whole_farm_data["total_expenses"] += whole_farm_data[field_name]

            response = Response(whole_farm_data, status=200)

        return response



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



# Dictionary of Gold Standard expenses field names mapped to labels
EXPENSES_LABELS = {
    'expenses_goods': 'Cost of Goods Sold',
    'expenses_car': 'Car and Truck Expenses',
    'expenses_chemicals': 'Chemicals',
    'expenses_conservation': 'Conservation Expenses',
    'expenses_custom_hire': 'Custom Hire',
    'expenses_depreciation': 'L-T asset replacement & section 179 expenses',
    'expenses_employee_benefit': 'Employee Benefit Programs',
    'expenses_feed': 'Feed',
    'expenses_fertilizers': 'Fertilizers and Lime',
    'expenses_freight': 'Freight and Trucking',
    'expenses_gasoline': 'Gasoline, Fuel, and Oil',
    'expenses_insurance': 'Insurance (other than health)',
    'expenses_interest_mortgages': 'Interest on Loans and Mortgages',
    'expenses_labor': 'Labor Hired (less employment credits)',
    'expenses_pension': 'Pension and Profit-Sharing Plans',
    'expenses_property_taxes': 'Property Taxes',
    'expenses_machinery_rent': 'Rent and leases: Machinery, equipment and vehicles',
    'expenses_land_rent': 'Rent and leases: Land and animals',
    'expenses_repairs': 'Repairs and Maintenance',
    'expenses_seeds': 'Seeds and Plants',
    'expenses_storage': 'Storage and Warehousing',
    'expenses_supplies': 'Supplies',
    'expenses_utilities': 'Utilities',
    'expenses_veterinary': 'Veterinary, Breeding, and Medicine',
    'expenses_other_1': 'Other expenses 1',
    'expenses_other_2': 'Other expenses 2',
    'expenses_other_3': 'Other expenses 3',
    'expenses_other_4': 'Other expenses 4',
    'expenses_other_5': 'Other expenses 5',
    'expenses_other_6': 'Other expenses 6',

}
