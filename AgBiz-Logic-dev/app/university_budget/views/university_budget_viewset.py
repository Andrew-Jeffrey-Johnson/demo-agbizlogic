from django.views.generic.edit import CreateView
from university_budget.models import *
from university_budget.serializers import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ParseError
from django.shortcuts import get_object_or_404
from budget.models import *
import json
import copy


class UniversityBudgetViewSet(ModelViewSet):
    """ API endpoint for UniversityBudget model.
    """

    serializer_class = UniversityBudgetSerializer


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
            Default queryset is all Budget objects. Invalid arguments return empty queryset.
        """

        queryset = UniversityBudget.objects.all()

        return queryset

    def all_service_json(request, name):
        services = Service.objects.filter(name__icontains=name)
        serializer = ServiceSerializer(services)
        return HttpResponse(serializer.data)


    @action(detail=True, methods=['post'])
    def create_budget(self, request, pk):
        """ Creates a Budget from a copy of the UniversityBudget resource and returns the new Budget. Takes no payload data.
        """

        module = '';
        try:
            university_budget = UniversityBudget.objects.get(pk=pk)

        except ObjectDoesNotExist:
            return Response({"error": "University Budget with given id does not exist"}, status=404)


        if request.data['module'].encode('ascii','ignore'):
             module = request.data['module'].encode('ascii','ignore')
        else:
             module = 'allocate'


        copy_budget = Budget.objects.create(
            user=request.user,
            title=university_budget,
            enterprise=university_budget.enterprise,
            descriptor1=university_budget.descriptor1,
            descriptor2=university_budget.descriptor2,
            descriptor3=university_budget.descriptor3,
            descriptor4=university_budget.descriptor4,
            descriptor5=university_budget.descriptor5,
            descriptor6=university_budget.descriptor6,
            market=university_budget.market,
            # notes=university_budget.notes + " (copy of " + university_budget.title + ")",
            notes=university_budget.notes,
            state=university_budget.state,
            region=university_budget.region,

            time_unit=university_budget.time_unit,
            time_value=university_budget.time_value,
            farm_unit=university_budget.farm_unit,
            farm_unit_quantity=university_budget.farm_unit_quantity,

            source="0",
            module=module,
        )

        for university_income in UniversityIncomeItem.objects.filter(parent_budget=university_budget):
            IncomeItem.objects.create(
                parent_budget=copy_budget,
                name=university_income.name,
                enterprise=university_income.enterprise,
                descriptor1=university_income.descriptor1,
                descriptor2=university_income.descriptor2,
                descriptor3=university_income.descriptor3,
                descriptor4=university_income.descriptor4,
                descriptor5=university_income.descriptor5,
                descriptor6=university_income.descriptor6,
                # notes=university_income.notes + " (copy of " + university_income.name + ")",
                notes=university_income.notes,
                weight=university_income.weight,
                farm_unit=university_income.farm_unit,
                farm_unit_quantity=university_income.farm_unit_quantity,
                sale_unit=university_income.sale_unit,
                sale_unit_quantity=university_income.sale_unit_quantity,
                return_total=university_income.return_total,

            )

        for university_cost in UniversityCostItem.objects.filter(parent_budget=university_budget):
            CostItem.objects.create(
                parent_budget=copy_budget,
                name=university_cost.name,
                # notes=university_cost.notes + " (copy of " + university_cost.name + ")",
                notes=university_cost.notes,
                parent_category=university_cost.parent_category,
                category=university_cost.category,
                sub_category=university_cost.sub_category,
                cost_type=university_cost.cost_type,
                farm_unit_quantity=university_cost.farm_unit_quantity,
                unit=university_cost.unit,
                unit_quantity=university_cost.unit_quantity,
                cost_total=university_cost.cost_total,
            )

        serializer = self.get_serializer(copy_budget)

        return Response(serializer.data, status=201)



class UniversityVariableCostItemViewSet(ModelViewSet):
    """ API endpoint for CostItem objects with cost_type = 'variable'.
    """

    queryset = UniversityCostItem.objects.filter(cost_type="variable")
    serializer_class = UniversityCostItemSerializer



class UniversityFixedCostItemViewSet(ModelViewSet):
    """ API endpoint for CostItem objects with cost_type = 'fixed'.
    """

    queryset = UniversityCostItem.objects.filter(cost_type="fixed")
    serializer_class = UniversityCostItemSerializer



class UniversityGeneralCostItemViewSet(ModelViewSet):
    """ API endpoint for CostItem objects with cost_type = 'general'.
    """

    queryset = UniversityCostItem.objects.filter(cost_type="general")
    serializer_class = UniversityCostItemSerializer



class UniversityIncomeItemViewSet(ModelViewSet):
    """ API endpoint for IncomeItem model.
    """

    queryset = UniversityIncomeItem.objects.all()
    serializer_class = UniversityIncomeItemSerializer
