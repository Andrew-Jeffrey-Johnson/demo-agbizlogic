from django.db import models
from university_budget.models import *
from localflavor.us.models import USStateField
from localflavor.us.us_states import STATE_CHOICES
from common.units import TIME_UNITS, FARM_UNITS, SALE_UNITS
from django.contrib.auth.models import User
from decimal import Decimal
import datetime

COST_TYPES = (
    ('variable', 'Variable'),
    ('fixed', 'Fixed'),
    ('general', 'General'),
)


class Budget(models.Model):
    """ Represents a user's budget.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE,)
    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)

    title = models.CharField(max_length=200, blank=False)
    temp = models.CharField(max_length=50, default="False", blank=False)
    notes = models.CharField(max_length=1200, default="", blank=True)
    enterprise = models.CharField(max_length=100, default="", blank=False)
    descriptor1 = models.CharField(max_length=100, default="", blank=False)
    descriptor2 = models.CharField(max_length=100, default="", blank=False)
    descriptor3 = models.CharField(max_length=100, default="", blank=True)
    descriptor4 = models.CharField(max_length=100, default="", blank=True)
    descriptor5 = models.CharField(max_length=100, default="", blank=True)
    descriptor6 = models.CharField(max_length=100, default="", blank=True)
    market = models.CharField(max_length=100, default="", blank=True)

    state = USStateField(choices=STATE_CHOICES)
    region = models.CharField(max_length=100, default="", blank=True)

    time_unit = models.CharField(max_length=50, choices=TIME_UNITS, default='Year', blank=False)
    time_value = models.IntegerField(default=1, blank=False)
    farm_unit = models.CharField(max_length=100, default="Total", blank=False, choices=FARM_UNITS)
    # farm_unit_quantity = models.IntegerField(default=1, blank=False)
    farm_unit_quantity = models.DecimalField(default=1, max_digits=20, decimal_places=2, blank=False)

    expense_unit = models.CharField(max_length=100, default="", blank=True, choices=FARM_UNITS)
    expense_unit_quantity = models.IntegerField(default=1, blank=True)

    source = models.CharField(max_length=50, default='0', blank=True)
    module = models.CharField(max_length=50, blank=True)

    fips_codes = models.ManyToManyField(FIPSRegion, blank=True)


    def __str__(self):
        return u"%s" % (self.title)

    def save(self, *args, **kwargs):
        """ Override this method to set all associated IncomeItem and CostItem objects' 'farm_unit', 'farm_unit_quantity',
            'sale_unit_quantity', and 'unit_quantity' fields to equal the this Budget's 'farm_unit' and 'farm_unit_quantity'
            values.
        """

        for income_item in IncomeItem.objects.filter(parent_budget=self):
            income_item.farm_unit = self.farm_unit
            income_item.farm_unit_quantity = self.farm_unit_quantity
            # income_item.sale_unit_quantity = self.farm_unit_quantity
            income_item.save()
        for cost_item in CostItem.objects.filter(parent_budget=self):
            cost_item.farm_unit_quantity = self.farm_unit_quantity
            # cost_item.unit_quantity = self.farm_unit_quantity
            cost_item.save()

        return super(Budget, self).save(*args, **kwargs)

    def scale_farm_unit(self, new_farm_unit_quantity):
        """ Change the 'farm_unit_quantity' to the given value, and scale the 'return_total', 'cost_total',
            'sale_unit_quantity', and 'unit_quantity' of any associated IncomeItem and CostItem objects such that the
            ratio between the total and 'farm_unit_quantity' remains the same.
        """

        for income_item in IncomeItem.objects.filter(parent_budget=self):
            income_item.return_total = income_item.price_per_farm_unit * Decimal(new_farm_unit_quantity)
            income_item.sale_unit_quantity = (
                                                     income_item.sale_unit_quantity / income_item.farm_unit_quantity) * Decimal(
                new_farm_unit_quantity)
            income_item.save()
        for cost_item in CostItem.objects.filter(parent_budget=self):
            cost_item.cost_total = cost_item.cost_per_farm_unit * Decimal(new_farm_unit_quantity)
            cost_item.unit_quantity = (cost_item.unit_quantity / cost_item.farm_unit_quantity) * Decimal(
                new_farm_unit_quantity)
            cost_item.save()

        self.farm_unit_quantity = new_farm_unit_quantity
        self.save()

    @property
    def total_costs(self):
        total_costs = 0
        cost_items = CostItem.objects.filter(parent_budget=self)

        if cost_items:
            for item in cost_items:
                total_costs = total_costs + item.cost_total

        return total_costs

    @property
    def total_variable_costs(self):
        total_costs = 0
        variable_cost_items = CostItem.objects.filter(parent_budget=self, cost_type="variable")

        if variable_cost_items:
            for item in variable_cost_items:
                total_costs = total_costs + item.cost_total

        return total_costs

    @property
    def total_fixed_costs(self):
        total_costs = 0
        fixed_cost_items = CostItem.objects.filter(parent_budget=self, cost_type="fixed")

        if fixed_cost_items:
            for item in fixed_cost_items:
                total_costs = total_costs + item.cost_total

        return total_costs

    @property
    def total_general_costs(self):
        total_costs = 0
        general_cost_items = CostItem.objects.filter(parent_budget=self, cost_type="general")

        if general_cost_items:
            for item in general_cost_items:
                total_costs = total_costs + item.cost_total

        return total_costs

    @property
    def total_income_less_variable_costs(self):
        return (self.total_gross_returns - self.total_variable_costs)

    @property
    def total_gross_returns(self):
        total_gross_returns = 0
        income_items = IncomeItem.objects.filter(parent_budget=self)

        if income_items:
            for item in income_items:
                total_gross_returns = total_gross_returns + item.return_total

        return total_gross_returns

    @property
    def profit(self):
        return (self.total_gross_returns - self.total_costs)

    @property
    def breakeven_yield(self):
        breakeven_yield = 0
        income_items = IncomeItem.objects.filter(parent_budget=self)

        if income_items:
            if income_items[0].price_per_sale_unit:
                breakeven_yield = self.total_costs / income_items[0].price_per_sale_unit

        return breakeven_yield

    @property
    def breakeven_price(self):
        breakeven_price = 0
        income_items = IncomeItem.objects.filter(parent_budget=self)

        if income_items:
            if income_items[0].sale_unit_quantity:
                breakeven_price = (
                    Decimal(self.total_costs / income_items[0].sale_unit_quantity).quantize(Decimal('0.01')))

        return breakeven_price

    @property
    def total_yields(self):
        total_yields = 0
        income_items = IncomeItem.objects.filter(parent_budget=self)

        if income_items:
            for item in income_items:
                total_yields = total_yields + item.sale_unit_quantity

        return int(total_yields)

    @property
    def primary_income_quantity(self):
        income_items = IncomeItem.objects.filter(parent_budget=self)
        primary = 0
        income_return = 0
        if income_items:
            for item in income_items:
                if item.return_total > income_return:
                    primary = item.sale_unit_quantity
                    income_return = item.return_total

        return int(primary)

    @property
    def primary_income_unit(self):
        income_items = IncomeItem.objects.filter(parent_budget=self)
        primary = "none"
        income_return = 0
        if income_items:
            for item in income_items:
                if item.return_total > income_return:
                    primary = item.sale_unit
                    income_return = item.return_total

        return primary


class IncomeItem(models.Model):
    """ Represents a return income item.
        Has a many-to-one relationship with a Budget object.
        Contains 2 types of units:
            farm_unit - measures the commodity on the farm (acres, field, etc)
            sale_unit - measures how the commodity is sold (tons, gallons, etc)
    """

    parent_budget = models.ForeignKey(Budget, related_name="income_items", on_delete=models.CASCADE,)

    name = models.CharField(max_length=100, blank=False)
    enterprise = models.CharField(max_length=100, default="", blank=True)
    descriptor1 = models.CharField(max_length=100, default="", blank=True)
    descriptor2 = models.CharField(max_length=100, default="", blank=True)
    descriptor3 = models.CharField(max_length=100, default="", blank=True)
    descriptor4 = models.CharField(max_length=100, default="", blank=True)
    descriptor5 = models.CharField(max_length=100, default="", blank=True)
    descriptor6 = models.CharField(max_length=100, default="", blank=True)
    notes = models.CharField(max_length=1000, default="", blank=True)

    weight = models.DecimalField(max_digits=20, decimal_places=2, blank=True, default=1)
    farm_unit = models.CharField(max_length=100, blank=True, default="Total", choices=FARM_UNITS)
    farm_unit_quantity = models.DecimalField(max_digits=20, decimal_places=2, blank=True)
    sale_unit = models.CharField(max_length=100, blank=False, default="Total", choices=SALE_UNITS)
    sale_unit_quantity = models.DecimalField(max_digits=20, decimal_places=2, blank=True)
    return_total = models.DecimalField(max_digits=20, decimal_places=2, blank=False)

    def __str__(self):
        return u"%s" % (self.name)

    @property
    def price_per_farm_unit(self):
        if self.farm_unit_quantity:
            return ((self.return_total / self.weight) / self.farm_unit_quantity)

    @property
    def price_per_sale_unit(self):
        if self.sale_unit_quantity:
            return ((self.return_total / self.weight) / self.sale_unit_quantity)


class CostItem(models.Model):
    """ Represents a cost item.
        Has a many-to-one relationship with a Budget object.
    """

    parent_budget = models.ForeignKey(Budget, related_name="cost_items", on_delete=models.CASCADE,)

    name = models.CharField(max_length=100, default="", blank=False)
    notes = models.CharField(max_length=1000, default="", blank=True)
    parent_category = models.CharField(max_length=100, default="", blank=True)
    category = models.CharField(max_length=100, default="", blank=True)
    sub_category = models.CharField(max_length=100, default="", blank=True)
    cost_type = models.CharField(max_length=100, default="", blank=False, choices=COST_TYPES)

    # farm_unit_quantity = models.IntegerField(default=1, blank=True)
    farm_unit_quantity = models.DecimalField(default=1, max_digits=20, decimal_places=2, blank=True)
    unit = models.CharField(max_length=100, default="Total", blank=False)
    unit_quantity = models.DecimalField(max_digits=20, decimal_places=2, default=1, blank=False, null=False)
    cost_total = models.DecimalField(max_digits=20, decimal_places=2, blank=False, null=False)

    def save(self, *args, **kwargs):
        """ Override this method to create/delete/edit general cost items when their child variable or fixed cost items
            are modified.


        try:
            parent_cost_item = CostItem.objects.filter(
                parent_budget=self.parent_budget,
                cost_type="general",
                name=self.parent_category
            )[0]

            parent_cost_item.cost_total -= Decimal(self.cost_total)

            if parent_cost_item.cost_total <= 0:
                parent_cost_item.delete()

            else:
                parent_cost_item.save()

        except IndexError:
            pass
        """

        super(CostItem, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """ Override this method to create/modify general cost items when their child variable or fixed cost items are
            deleted.
        """

        # if self.cost_type != "general":
        #     try:
        #         parent_cost_item = CostItem.objects.filter(
        #             parent_budget=self.parent_budget,
        #             cost_type="general",
        #             name=self.parent_category
        #         )[0]
        #
        #         parent_cost_item.cost_total += Decimal(self.cost_total)
        #         parent_cost_item.save()
        #
        #     except IndexError:
        #         CostItem.objects.create(
        #             parent_budget=self.parent_budget,
        #             cost_type="general",
        #             name=self.parent_category,
        #             cost_total=self.cost_total,
        #         )
                # pass

        super(CostItem, self).delete(*args, **kwargs)

    def __str__(self):
        return u"%s" % (self.name)

    @property
    def cost_per_unit(self):
        if self.unit_quantity:
            return (self.cost_total / self.unit_quantity)

    @property
    def cost_per_farm_unit(self):
        if self.farm_unit_quantity:
            return (self.cost_total / self.farm_unit_quantity)

    @property
    def descriptor1(self):
        if self.parent_budget.descriptor1:
            return self.parent_budget.descriptor1

    @property
    def farm_unit(self):
        return self.parent_budget.farm_unit
