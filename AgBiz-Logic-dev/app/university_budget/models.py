from django.db import models
from localflavor.us.models import USStateField
from localflavor.us.us_states import STATE_CHOICES
from django.utils.translation import ugettext_lazy as _
from decimal import Decimal
import datetime


COST_TYPES = (
    ('variable', 'Variable'),
    ('fixed', 'Fixed'),
    ('general', 'General'),
)


class FIPSRegion(models.Model):
        name = models.CharField(max_length=100, default="", blank=False)
        FIPS = models.IntegerField(default=0, blank=False)
        ersregion = models.IntegerField(default=0, blank=False)
        ersregionstring = models.CharField(max_length=100, default="", blank=True)
        state = models.CharField(max_length=2, default="", blank=True)
        county = models.CharField(max_length=100, default="", blank=True)


        def __str__(self):
            return u"%s" % (self.name)



class UniversityBudget(models.Model):
    """ Represents University Bugdet, which is similar to a Budget but with no User associated.
    """

    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)

    title = models.CharField(max_length=200, blank=False)
    notes = models.CharField(max_length=1200, default="", blank=True)
    enterprise = models.CharField(max_length=100, default="", blank=False)
    descriptor1 = models.CharField(max_length=100, default="", blank=False)
    descriptor2 = models.CharField(max_length=100, default="", blank=False)
    descriptor3 = models.CharField(max_length=100, default="", blank=True)
    descriptor4 = models.CharField(max_length=100, default="", blank=True)
    descriptor5 = models.CharField(max_length=100, default="", blank=True)
    descriptor6 = models.CharField(max_length=100, default="", blank=True)
    market = models.CharField(max_length=100, default="", blank=True)

    state = USStateField(max_length=50, blank=False)
    region = models.CharField(max_length=100, default="", blank=True)

    time_unit = models.CharField(max_length=50, default='years', blank=False)
    time_value = models.IntegerField(default=1, blank=False)
    farm_unit = models.CharField(max_length=100, default="", blank=False)
    farm_unit_quantity = models.IntegerField(default=1, blank=False)

    expense_unit = models.CharField(max_length=100, default="", blank=True)
    expense_unit_quantity = models.IntegerField(default=1 , blank=True)

    budget_source = models.CharField(max_length=50 , default='0', blank=True)
    budget_module = models.CharField(max_length=50, default='allocate', blank=True)

    fips_codes = models.ManyToManyField(FIPSRegion, blank=True)


    def __str__(self):
        return u"%s" % (self.title)


    @property
    def total_costs(self):
        total_costs = 0
        cost_items = UniversityCostItem.objects.filter(parent_budget=self)

        if cost_items:
            # Iterate through every cost item and add to total
            for item in cost_items:
                total_costs = total_costs + item.cost_total

        return total_costs


    @property
    def total_variable_costs(self):
        total_costs = 0
        variable_cost_items = UniversityCostItem.objects.filter(parent_budget=self, cost_type="variable")

        if variable_cost_items:
            # Iterate through every cost item and add to total
            for item in variable_cost_items:
                total_costs = total_costs + item.cost_total

        return total_costs


    @property
    def total_fixed_costs(self):
        total_costs = 0
        fixed_cost_items = UniversityCostItem.objects.filter(parent_budget=self, cost_type="fixed")

        if fixed_cost_items:
            # Iterate through every cost item and add to total
            for item in fixed_cost_items:
                total_costs = total_costs + item.cost_total

        return total_costs


    @property
    def total_general_costs(self):
        total_costs = 0
        general_cost_items = UniversityCostItem.objects.filter(parent_budget=self, cost_type="general")

        if general_cost_items:
            # Iterate through every cost item and add to total
            for item in general_cost_items:
                total_costs = total_costs + item.cost_total

        return total_costs


    @property
    def total_income_less_variable_costs(self):
        return (self.total_gross_returns - self.total_variable_costs)


    @property
    def total_gross_returns(self):
        total_gross_returns = 0
        income_items = UniversityIncomeItem.objects.filter(parent_budget=self)

        if income_items:
            # Iterate through every income item and add to total
            for item in income_items:
                total_gross_returns = total_gross_returns + item.return_total

        return total_gross_returns


    @property
    def profit(self):
        return (self.total_gross_returns - self.total_costs)


    @property
    def breakeven_yield(self):
        breakeven_yield = 0
        income_items = UniversityIncomeItem.objects.filter(parent_budget=self)

        if income_items:
            # Avoid division by zero error
            if income_items[0].price_per_sale_unit:
                breakeven_yield = self.total_costs / income_items[0].price_per_sale_unit

        return breakeven_yield


    @property
    def breakeven_price(self):
        breakeven_price = 0
        income_items = UniversityIncomeItem.objects.filter(parent_budget=self)

        if income_items:
            # Avoid division by zero error
            if income_items[0].sale_unit_quantity:
                breakeven_price = (Decimal(self.total_costs / income_items[0].sale_unit_quantity).quantize(Decimal('0.01')))

        return breakeven_price


    @property
    def total_yields(self):
        total_yields = 0
        income_items = UniversityIncomeItem.objects.filter(parent_budget=self)

        if income_items:
            for item in income_items:
                total_yields = total_yields + item.sale_unit_quantity

        return int(total_yields)


    def make_fips_connections(self):
        budgets = UniversityBudget.objects.all()

        print(budgets)
        fipsCodes = FIPSRegion.objects.filter(State=self.state, County=self.region)
        print(fipsCodes)



class UniversityIncomeItem(models.Model):
    """ Represents a return income item.

        Has a many-to-one relationship with a UniversityBudget object.

        Contains 2 types of units:
            farm_unit - measures the commodity on the farm (acres, field, etc)
            sale_unit - measures how the commodity is sold (tons, gallons, etc)
    """

    parent_budget = models.ForeignKey(UniversityBudget, related_name="income_items", on_delete=models.CASCADE,)

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

    farm_unit = models.CharField(max_length=100, blank=False)
    farm_unit_quantity = models.DecimalField(max_digits=20, decimal_places=2, blank=True)
    sale_unit = models.CharField(max_length=100, blank=False)
    sale_unit_quantity = models.DecimalField(max_digits=20, decimal_places=2, blank=True)
    return_total = models.DecimalField(max_digits=20, decimal_places=2, blank=False)


    def __str__(self):
        return u"%s" % (self.name)


    @property
    def price_per_farm_unit(self):
        if self.farm_unit_quantity:
            return ((self.return_total / self.weight ) / self.farm_unit_quantity)


    @property
    def price_per_sale_unit(self):
        if self.sale_unit_quantity:
            return ((self.return_total / self.weight ) / self.sale_unit_quantity)



class UniversityCostItem(models.Model):
    """ Represents a cost item.

        Has a many-to-one relationship with a UniversityBudget object. The values associated with this item represent
        the total in the budget, NOT per acre or other farm unit.
    """

    parent_budget = models.ForeignKey(UniversityBudget, related_name="cost_items", on_delete=models.CASCADE,)

    name = models.CharField(max_length=100, default="", blank=False)
    notes = models.CharField(max_length=1000, default="", blank=True)
    parent_category = models.CharField(max_length=100, default="", blank=True)
    category = models.CharField(max_length=100, default="", blank=True)
    sub_category = models.CharField(max_length=100, default="", blank=True)
    cost_type = models.CharField(max_length=100, default="general", blank=False)

    farm_unit_quantity = models.IntegerField(default=1, blank=True)
    unit = models.CharField(max_length=100, default="", blank=False)
    unit_quantity = models.DecimalField(max_digits=20, decimal_places=2, default=1, blank=False, null=False)
    cost_total = models.DecimalField(max_digits=20, decimal_places=2, blank=False, null=False)


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
