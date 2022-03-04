from budget.models import Budget, IncomeItem, CostItem
from budget.serializers import BudgetSerializer
from climate.models import ClimateBudget
from scenario.models import PlanBudget
from registration.models import Business, ScheduleF
from django.contrib.auth.models import User
from allocate.models import EnterpriseData, BusinessData
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from django.core.exceptions import ObjectDoesNotExist
from common.units import TIME_UNITS, FARM_UNITS, SALE_UNITS
from decimal import Decimal
import copy



class BudgetViewSet(ModelViewSet):
    """ API endpoint for Budget model.
    """

    serializer_class = BudgetSerializer
    lookup_field = 'id'
    lookup_value_regex = '[0-9]+'
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Budget objects. Invalid arguments return empty queryset.
        """

        queryset = Budget.objects.all()
        query_params = self.request.query_params

        # If there are query parameters that aren't supported, return empty queryset
        for key in query_params.keys():
            if key not in {'username', 'fields', 'module'}:
                queryset = None

        # Filter by username
        if "username" in query_params:
            if query_params['username'] == self.request.user.get_username():
                try:
                    user = User.objects.filter(username=query_params["username"])[0]
                    # Filter by module
                    if "module" in query_params:
                        module = query_params["module"]
                        queryset = Budget.objects.filter(user=user, module=module)
                    else:
                        queryset = Budget.objects.filter(user=user)

                except IndexError:
                    queryset = None
            else:
                queryset = None

        return queryset


    def perform_create(self, serializer):
        """ Add user to new object, then save to database.
        """

        serializer.save(user=self.request.user)


    def perform_destroy(self, instance):
        """ Override this method in order to explicitly call the delete() method for the
            associated ClimateBudget object (if it exists) or PlanBudget object (if it exists).

            This needs to be done because otherwise Django uses ON DELETE CASCADE behavior
            to delete all ForeignKey objects, which does not call their delete() methods.
        """

        try:
            climate_budget = ClimateBudget.objects.filter(budget=instance.id)[0]
            climate_budget.delete()

        except IndexError:
            pass

        try:
            plan_budget = PlanBudget.objects.filter(budget=instance.id)[0]
            plan_budget.delete()

        except IndexError:
            pass

        instance.delete()


    @action(detail=False, methods=['post'])
    def combine(self, request):
        """ Sending a POST request containing an array of existing Budget id's to this endpoint
            will create and return a new Budget object with the combined budget cost and income
            items.
        """

        budgets = []
        source = ""

        for id in request.data['budgets']:
            try:
                budget = Budget.objects.get(id=id)
                budgets.append(budget)
                source += str(budget.id) + ","

            except ObjectDoesNotExist:
                raise ParseError

        # Only create new Budget if budgets list is not empty
        if budgets:
            # Create new Budget using values from first budget in POST request
            # FIXME: Figure out which values to use, especially time units
            combined_budget = Budget.objects.create(
                user=request.user,
                title="Combined Budget",
                enterprise=budgets[0].enterprise,
                descriptor1=budgets[0].descriptor1,
                descriptor2=budgets[0].descriptor2,
                descriptor3=budgets[0].descriptor3,
                descriptor4=budgets[0].descriptor4,
                descriptor5=budgets[0].descriptor5,
                descriptor6=budgets[0].descriptor6,
                market=budgets[0].market,
                notes="",
                state=budgets[0].state,
                region=budgets[0].region,
                module="allocate",
                source=source,
                time_unit=budgets[0].time_unit,
                time_value=budgets[0].time_value,
                farm_unit=budgets[0].farm_unit,
                farm_unit_quantity=budgets[0].farm_unit_quantity,
            )

            for budget in budgets:
                combined_budget.notes += budget.notes + " "
                income_items = IncomeItem.objects.filter(parent_budget=budget)
                cost_items = CostItem.objects.filter(parent_budget=budget)
                combined_cost_items = CostItem.objects.filter(parent_budget=combined_budget)

                # Copy all income items
                for income_item in income_items:
                    income_item.parent_budget = combined_budget
                    income_item.pk = None
                    income_item.save()

                combined_list = []
                for original_item in combined_cost_items:
                    combined_list.append(original_item.name)

                # Copy all cost items
                for cost_item in cost_items:
                    if cost_item.name in combined_list:
                        original_cost_item = CostItem.objects.filter(parent_budget=combined_budget,name=cost_item.name).first()
                        original_cost_item.unit_quantity += cost_item.unit_quantity
                        original_cost_item.cost_total += cost_item.cost_total
                        original_cost_item.save()
                    else:
                        cost_item.parent_budget = combined_budget
                        cost_item.pk = None
                        cost_item.save()


            combined_budget.save()

            combined_budget = Budget.objects.get(id=combined_budget.id)
            serializer = self.get_serializer(combined_budget)
            status = 201

        else:
            # Serialize empty queryset
            serializer = self.get_serializer(Budget.objects.filter(id=0), many=True)
            status = 400

        return Response(serializer.data, status)


    @action(detail=True, methods=['post'])
    def copy(self, request, id):
        """ Creates a copy of the Budget resource and returns the new Budget. Takes no payload data.
        """
        try:
            budget = Budget.objects.get(pk=id)

        except ObjectDoesNotExist:
            raise ParseError

        copy_budget = copy.deepcopy(budget)
        copy_budget.id = None
        copy_budget.source = str(budget.id)
        copy_budget.save()

        for income_item in IncomeItem.objects.filter(parent_budget=budget.id):
            new_income_item = copy.deepcopy(income_item)
            new_income_item.parent_budget = copy_budget
            new_income_item.id = None
            new_income_item.save()

        for cost_item in CostItem.objects.filter(parent_budget=budget.id):
            new_cost_item = copy.deepcopy(cost_item)
            new_cost_item.parent_budget = copy_budget
            new_cost_item.id = None
            new_cost_item.save()

        serializer = self.get_serializer(copy_budget)

        return Response(serializer.data, status=201)


    @action(detail=False, methods=['post'])
    def generate(self, request):
        """ On POST request, query for the user's EnterpriseData objects, and create associated Budget
            objects.
            Ensures that duplicate Budget objects are not created if the view is called again.
            Also saves a 'Whole Farm Budget' using the unallocated income and expenses.
        """

        # FIXME: Uniqueness is determined using the Budget title field.
        user = request.user
        enterprises = EnterpriseData.objects.filter(user=user)
        business_list = BusinessData.objects.filter(user=user)
        budgets = Budget.objects.filter(user=user).values_list('title', flat=True)

        try:
            business = Business.objects.filter(user=user)[0]
            state = business.state
        except IndexError:
            state = "OR"

        created_budgets = []

        # Create an template Budget object for each enterprise
        for enterprise in enterprises:
            # Create title using descriptors
            title = enterprise.category_1 + ' - ' + enterprise.category_2
            if enterprise.category_3:
                title = title + ' - ' + enterprise.category_3
            if enterprise.category_4:
                title = title + ' - ' + enterprise.category_4
            if enterprise.category_5:
                title = title + ' - ' + enterprise.category_5
            if enterprise.category_6:
                title = title + ' - ' + enterprise.category_6

            # Check that a budget with the same title does not exist
            if title not in budgets:
                new_budget = Budget.objects.create(
                    user=user,
                    title=title,
                    enterprise=enterprise.enterprise,
                    descriptor1=enterprise.category_1,
                    descriptor2=enterprise.category_2,
                    descriptor3=enterprise.category_3,
                    descriptor4=enterprise.category_4,
                    descriptor5=enterprise.category_5,
                    descriptor6=enterprise.category_6,
                    market=enterprise.market,
                    notes="Enter notes here",
                    module="allocate",
                    state=state,
                    region="",
                    time_unit='Year',
                    time_value=1,
                    farm_unit='Total',
                    farm_unit_quantity=1,
                )
                created_budgets.append(new_budget)

                income_dict = get_income(enterprise)
                expenses_dict = get_expenses(enterprise)

                # Create an income item for each nonzero income
                for name, value in income_dict.items():
                    if name == "Sales":
                        name = "Sales: " + new_budget.descriptor1 + " " + new_budget.descriptor2 + " " + new_budget.descriptor3 + " " + new_budget.descriptor4
                    if value != 0:
                        IncomeItem.objects.create(
                            parent_budget=new_budget,
                            name=name,
                            enterprise=new_budget.enterprise,
                            descriptor1=new_budget.descriptor1,
                            descriptor2=new_budget.descriptor2,
                            descriptor3=new_budget.descriptor3,
                            descriptor4=new_budget.descriptor4,
                            descriptor5=new_budget.descriptor5,
                            descriptor6=new_budget.descriptor6,
                            notes="",
                            farm_unit=new_budget.farm_unit,
                            farm_unit_quantity=new_budget.farm_unit_quantity,
                            sale_unit="Total",
                            sale_unit_quantity=1,
                            return_total=value,
                        )

                # Create a general cost item for each nonzero expense
                for name, value in expenses_dict.items():
                    if value != 0 and "_label" not in name:
                        # Replace the name with verbose name from dictionary
                        if name in EXPENSES_LABELS:
                            name = EXPENSES_LABELS[name]

                        CostItem.objects.create(
                            parent_budget=new_budget,
                            name=name,
                            category="",
                            sub_category="",
                            cost_type="general",
                            unit="Total",
                            cost_total=value,
                        )

        # Create Whole Farm budget using remainder of BusinessData - ScheduleF
        if "Whole Farm Budget" not in budgets and len(enterprises) != 0:
            gold_standard_data = get_allocate_data(request.user)

            if gold_standard_data is not None:
                whole_farm_income = 0
                whole_farm_expenses_dict = {}
                whole_farm_income_dict = {}
                for field in gold_standard_data:
                    if "income" in gold_standard_data[field]['name']:
                        whole_farm_expenses_dict.setdefault(field, 0)
                        whole_farm_income_dict[field] = gold_standard_data[field]['total']
                        #whole_farm_income += gold_standard_data[field]['total']

                        for business in business_list:
                            whole_farm_income_dict[field] -= getattr(business, gold_standard_data[field]['name'])

                    elif "expenses" in gold_standard_data[field]['name']:
                        whole_farm_expenses_dict.setdefault(field, 0)
                        whole_farm_expenses_dict[field] = gold_standard_data[field]['total']

                        for business in business_list:
                            whole_farm_expenses_dict[field] -= getattr(business, gold_standard_data[field]['name'])

                whole_farm_budget = Budget.objects.create(
                    user=user,
                    title="Whole Farm Budget",
                    enterprise="Whole Farm",
                    descriptor1="Whole",
                    descriptor2="Farm",
                    market="Other",
                    notes="This budget represents the unallocated income/costs from your business.",
                    module="allocate",
                    state=state,
                    time_unit='Year',
                    time_value=1,
                    farm_unit='Total',
                    farm_unit_quantity=1
                )
                created_budgets.append(whole_farm_budget)

                for field, value in whole_farm_income_dict.items():
                    if value > 0:
                        # Replace the name with verbose name from dictionary
                        if field in INCOME_LABELS:
                            name = INCOME_LABELS[field]
                        else:
                            name = field

                        IncomeItem.objects.create(
                            parent_budget=whole_farm_budget,
                            name=name,
                            farm_unit=whole_farm_budget.farm_unit,
                            farm_unit_quantity=whole_farm_budget.farm_unit_quantity,
                            sale_unit='Total',
                            sale_unit_quantity=1,
                            return_total=value

                        )
                for field, value in whole_farm_expenses_dict.items():
                    if value > 0:
                        # Replace the name with verbose name from dictionary
                        if field in EXPENSES_LABELS and "expenses_other" not in field:
                            name = EXPENSES_LABELS[field]
                        elif "expenses_other" in field:
                            name = gold_standard_data[field]['label']
                            if "Other Expenses" not in name:
                                name = "Other Expenses " + name
                        else:
                            name = field

                        CostItem.objects.create(
                            parent_budget=whole_farm_budget,
                            name=name,
                            category="",
                            sub_category="",
                            cost_type="general",
                            unit="Total",
                            cost_total=value
                        )

        serializer = BudgetSerializer(created_budgets, many=True)
        status = 201

        if not serializer.data:
            status = 200

        return Response(serializer.data, status)


    @action(detail=True, methods=['post'])
    def adjust_net_returns(self, request, id):
        """ Sending a POST request to this endpoint with 'percent' in the payload will multiply the 'return_total' and
            'sale_unit_quantity' fields of all IncomeItem objects associated with the Budget instance and returns HTTP 200.
            Returns 400 if invalid payload.
        """

        try:
            budget = Budget.objects.get(id=id)
            percent = (float(request.data["percent"]) / 100) + 1

            for income_item in IncomeItem.objects.filter(parent_budget=budget.id):
                income_item.return_total = float(income_item.return_total) * percent
                income_item.sale_unit_quantity = float(income_item.sale_unit_quantity) * percent
                income_item.save()

            response = {}
            status = 200

        except ObjectDoesNotExist:
            response = {'error': "Budget with given id does not exist"}
            status = 404
        except KeyError:
            response = {'error': "No 'percent' in request payload"}
            status = 400

        return Response(response, status=status)


    @action(detail=True, methods=['post'])
    def scale_farm_unit_quantity(self, request, id):
        """ Sending a POST request to this endpoint with 'new_farm_unit_quantity' in the payload will scale the Budget
            'farm_unit_quantity' to the given value.
        """

        try:
            budget = Budget.objects.get(id=id)
            new_farm_unit_quantity = request.data["new_farm_unit_quantity"]
            budget.scale_farm_unit(new_farm_unit_quantity)
            response = {'status': "farm_unit_quantity updated"}
            status = 200

        except ObjectDoesNotExist:
            response = {'error': "Budget with given id does not exist"}
            status = 404
        except KeyError:
            response = {'errors': [{'new_farm_unit_quantity': "Missing field"}]}
            status = 400

        return Response(response, status=status)



################################################################################
#                            Helper Functions
################################################################################

def get_total_income(model):
    """ Calculates and returns the sum of all the income fields from a given model.
    """

    total_income = 0

    for field in model._meta.get_fields():
        if "income" in field.name:
            total_income += getattr(model, field.name)

    return total_income


def get_income(model):
    """ Returns a dictionary of income fields from a given model.
    """

    income_dict = {}

    for field in model._meta.get_fields():
        if field.name in INCOME_LABELS:
            income_dict.setdefault(field.name, 0)
            income_dict[INCOME_LABELS[field.name]] = getattr(model, field.name)

    return income_dict


def get_expenses(model):
    """ Returns a dictionary of expense fields from a given model.
    """

    expenses_dict = {}

    for field in model._meta.get_fields():
        if "_label" in field.name and getattr(model, field.name) != "":
            expenses_dict.setdefault(field.name, 0)
            expenses_dict[getattr(model, field.name)] = getattr(model, field.name.replace("_label", ""))
        elif field.name in EXPENSES_LABELS and "expenses_other_" not in field.name:
            expenses_dict.setdefault(field.name, 0)
            expenses_dict[field.name] = getattr(model, field.name)

    return expenses_dict


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


# Dictionary of Gold Standard income field names mapped to labels
INCOME_LABELS = {
    'income_sales': "Sales",
    'income_cooperative': "Cooperative distributions received",
    'income_agriculture_programs': "Agricultural program payments",
    'income_insurance': "Crop insurance proceeds and federal crop disaster payments",
    'income_custom_hire': "Custom hire income",
    'income_other': "Other Income",
}
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
    'expenses_machinery_rent': 'Rent and leases: Machinery, equipment and vehicles',
    'expenses_land_rent': 'Rent and leases: Land and animals',
    'expenses_repairs': 'Repairs and Maintenance',
    'expenses_seeds': 'Seeds and Plants',
    'expenses_storage': 'Storage and Warehousing',
    'expenses_supplies': 'Supplies',
    'expenses_property_taxes': 'Property Taxes',
    'expenses_utilities': 'Utilities',
    'expenses_veterinary': 'Veterinary, Breeding, and Medicine',
    'expenses_other_1': 'Other expenses',
    'expenses_other_2': 'Other expenses',
    'expenses_other_3': 'Other expenses',
    'expenses_other_4': 'Other expenses',
    'expenses_other_5': 'Other expenses',
    'expenses_other_6': 'Other expenses',
}
