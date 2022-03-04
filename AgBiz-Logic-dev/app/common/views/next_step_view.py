from django.contrib.auth.models import User
from rest_framework.views import APIView
from registration.models import ScheduleF
from allocate.models import *
from budget.models import *
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

class NextStepView(APIView):
    """ API endpoint for '/next_step/'.
    """

    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)


    def get(self, request):
        """ This endpoint makes database queries for the request user's objects and returns a string containing
            the next step for them to complete based on which objects they have created.
            Possible valid return values:
                schedule-f
                business-select
                business-allocate
                enterprise-select
                enterprise-allocate
                budget-creation
                agbiz
        """

        query_params = request.query_params
        response = None

        if "username" not in query_params:
            response = Response({'error': "Username required in query parameter"}, status=400)

        else:
            username = request.query_params['username']
            user = None

            try:
                user = User.objects.filter(username=username)[0]

            except IndexError:
                response = Response({'error': "Username does not match any user"}, status=404)

            if user and len(Budget.objects.filter(user=user)) > 0:
                response = Response({'next_step': "agbiz"}, status = 200)

            elif user and len(ScheduleF.objects.filter(user=user)) == 0:
                response = Response({'next_step': "schedule-f"}, status = 200)

            elif user and len(BusinessData.objects.filter(user=user)) == 0:
                response = Response({'next_step': "business-select"}, status = 200)

            elif user and len(EnterpriseData.objects.filter(user=user)) == 0:
                enterprise_allocate = True

                for business in BusinessData.objects.filter(user=user):
                    if not business.completed:
                        enterprise_allocate = False
                        break

                if not enterprise_allocate:
                    response = Response({'next_step': "business-allocate"}, status = 200)

                else:
                    response = Response({'next_step': "enterprise-select"}, status = 200)

            elif user and len(Budget.objects.filter(user=user)) == 0:
                if not isEnterpriseAllocationComplete(user):
                    response = Response({'next_step': "enterprise-allocate"}, status = 200)

                else:
                    response = Response({'next_step': "budget-creation"}, status = 200)

        return response



##############################################################################
#                           Helper functions
##############################################################################

def isEnterpriseAllocationComplete(user):
    """ Checks the sum of all EnterpriseData objects' income or expenses against the parent BusinessData object.
        If they are not equal, then there is a remainder and enterprise allocation is not completed, so return false.
        Otherwise return true.
    """

    complete = True

    for business in BusinessData.objects.filter(user=user):
        total_income = business.total_income
        total_expenses = business.total_expenses

        for enterprise in EnterpriseData.objects.filter(enterprise=business.business_type):
            total_income -= enterprise.total_income
            total_expenses -= enterprise.total_expenses

        if abs(total_income) > 0 or abs(total_expenses) > 0:
            complete = False
            break

    return complete



GOLD_STANDARD_DATA = [
    'income_sales',
    'income_cooperative',
    'income_agriculture_programs',
    'income_insurance',
    'income_custom_hire',
    'income_other',

    'expenses_goods',
    'expenses_car',
    'expenses_chemicals',
    'expenses_conservation',
    'expenses_custom_hire',
    'expenses_depreciation',
    'expenses_employee_benefit',
    'expenses_feed',
    'expenses_fertilizers',
    'expenses_freight',
    'expenses_gasoline',
    'expenses_insurance',
    'expenses_interest_mortgages',
    'expenses_labor',
    'expenses_pension',
    'expenses_machinery_rent',
    'expenses_land_rent',
    'expenses_repairs',
    'expenses_seeds',
    'expenses_storage',
    'expenses_supplies',
    'expenses_property_taxes',
    'expenses_utilities',
    'expenses_veterinary',
    'expenses_other_1',
    'expenses_other_2',
    'expenses_other_3',
    'expenses_other_4',
    'expenses_other_5',
]
