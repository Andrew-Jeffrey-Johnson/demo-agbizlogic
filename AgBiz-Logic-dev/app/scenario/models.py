from django.db import models
from django.contrib.auth.models import User
from budget.models import Budget, IncomeItem, CostItem
from collections import OrderedDict
import datetime
from decimal import Decimal
from django.core.validators import MaxValueValidator, MinValueValidator
import copy
from math import pow


class FinanceAnalysis(models.Model):
    """ Represents the data associated with a collection of Scenario objects.
        Has a many-to-one relationship with a Scenario object.
    """

    user = models.ForeignKey(User, related_name="analyses", on_delete=models.CASCADE,)

    title = models.CharField(max_length=100, default=None, blank=False)
    notes = models.CharField(max_length=1000, default="", blank=True)
    temp = models.CharField(max_length=50, default="False", blank=False)
    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)


    def __str__(self):
        return u"%s" % (self.title)

class Scenario(models.Model):
    """ Represents the data associated with a collection of Plan objects.
    """

    user = models.ForeignKey(User, related_name="scenarios", on_delete=models.CASCADE,)
    finance_analysis = models.ManyToManyField(FinanceAnalysis, related_name="scenarios", blank=True, null=True)

    type = models.CharField(max_length=100, default=None, blank=False)
    title = models.CharField(max_length=100, default=None, blank=False)
    notes = models.CharField(max_length=1000, default="", blank=True)


    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return u"%s" % (self.title)


class Plan(models.Model):
    """ Represents the data associated with a collection of PlanBudget objects.
        Has a one-to-one relationship with a Scenario object.
    """

    user = models.ForeignKey(User, related_name="plans", on_delete=models.CASCADE,)
    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="plans", on_delete=models.CASCADE,)

    title = models.CharField(max_length=100, default=None, blank=False)
    notes = models.CharField(max_length=1000, default=None, blank=True)

    time_period_unit = models.CharField(max_length=20, default="Year", blank=True)
    time_period_value = models.IntegerField(default=0, null=False, blank=True)

    scenario_list = models.CharField(max_length=600, default="", blank=True)

    # Profit fields
    discount_rate = models.DecimalField(max_digits=6, decimal_places=2, default=0, null=False, blank=False, validators=[MinValueValidator(Decimal('0.00'))])
    beginning_investment = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False, validators=[MinValueValidator(Decimal('0.00'))])
    ending_investment = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False, validators=[MinValueValidator(Decimal('0.00'))])
    use_investment_values = models.BooleanField(default=True)
    internal_rate_of_return = models.DecimalField(max_digits=5, decimal_places=2, default=0, null=False, blank=True)

    # Lease fields
    lease_type = models.CharField(max_length=100, default=None, blank=True)
    land_market_value = models.DecimalField(max_digits=20, decimal_places=2, default=None, null=False, blank=True)
    annual_land_rate = models.DecimalField(max_digits=5, decimal_places=2, default=None, null=False, blank=True)
    required_roi = models.DecimalField(max_digits=20, decimal_places=2, default=None, null=False, blank=True)
    investment_inflation = models.DecimalField(max_digits=5, decimal_places=2, default=None, null=False, blank=True)

    source = models.CharField(max_length=50, default='0', blank=True)
    module = models.CharField(max_length=100, blank=False, default="original")

    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)

    @property
    def full_title(self):

        if self.scenario_list:
            return self.title + " (" +self.scenario_list + ")"
        else:
            if self.scenario:
                scenario = Scenario.objects.filter(id=self.scenario.id).first()
                self.scenario_list = scenario.title
                return self.title + " (" +self.scenario_list + ")"
        return self.title

    @property
    def net_returns_with_inflation(self):
        """ Returns the sum of all associated PlanBudget objects' 'net_returns_with_inflation' fields combined with
            difference of ending_investment - beginning_investment.
        """

        # FIXME: Check to make sure this is the correct starting value
        net_returns_with_inflation = self.ending_investment - self.beginning_investment

        for plan_budget in PlanBudget.objects.filter(plan=self):
            net_returns_with_inflation += Decimal(plan_budget.net_returns_with_inflation)

        return net_returns_with_inflation

    @property
    def net_present_value(self):
        """ Returns the sum of the present_value fields of the all associated PlanBudgets, subtracted by the beginning_investment.
        """

        net_present_value = 0 - self.beginning_investment

        for plan_budget in PlanBudget.objects.filter(plan=self):
            net_present_value += Decimal(plan_budget.present_value)

        # FIXME: Add ending_investment to last Budget's net_returns, then calculate present_value and add to NPV

        return net_present_value

    @property
    def equivalent_annual_annuity(self):
        """ Returns the equivalent annual annuity of the Plan.
        """

        if self.discount_rate == 0:
            eaa = 0

        else:
            discount_rate = percent_to_decimal(self.discount_rate)
            eaa = Decimal((discount_rate * self.net_present_value)) / (1 - Decimal((1 + discount_rate)) ** (
                        0 - Decimal((CONVERSION_TABLE[self.time_period_unit]['Year'] * self.time_period_value))))

        return eaa

    def __str__(self):
        return u"%s" % (self.title)

    @property
    def cash_flow_breakeven(self):
        """ Returns the first time period value in which the net returns (with inflation) of the Plan are positive.
        """

        cash_flow_breakeven = 0
        if self.use_investment_values:
            net_returns_with_inflation = 0 - Decimal(self.beginning_investment)
        else:
            net_returns_with_inflation = 0

        for plan_budget in PlanBudget.objects.filter(plan=self).order_by("position"):
            net_returns_with_inflation = Decimal(plan_budget.net_returns_with_inflation)

            # Add ending_investment if last Budget in Plan
            if plan_budget.time_period_position == self.time_period_value and self.use_investment_values:
                net_returns_with_inflation += Decimal(self.ending_investment)

            if net_returns_with_inflation > 0:
                cash_flow_breakeven = plan_budget.time_period_position
                break

        return cash_flow_breakeven

    @property
    def cash_flow_total_breakeven(self):
        """ Returns the time period in which my Plan has total annual returns greater than the
            total annual costs of all previous years.
        """

        cash_flow_breakeven = 0
        if self.use_investment_values:
            net_returns_with_inflation = 0 - Decimal(self.beginning_investment)
        else:
            net_returns_with_inflation = 0

        for plan_budget in PlanBudget.objects.filter(plan=self).order_by("position"):
            net_returns_with_inflation += Decimal(plan_budget.net_returns_with_inflation)

            # Add ending_investment if last Budget in Plan
            if plan_budget.time_period_position == self.time_period_value and self.use_investment_values:
                net_returns_with_inflation += self.ending_investment

            if net_returns_with_inflation > 0:
                cash_flow_breakeven = Decimal(plan_budget.time_period_position)
                break

        return cash_flow_breakeven

    @property
    def net_returns_over_time(self):
        """ Returns an ordered list of the Plan's cumulative net returns per time period unit. Includes beginning and
            ending investments.
        """

        net_returns_over_time = []
        if self.use_investment_values:
            cumulative_net_returns = 0 - self.beginning_investment
            net_return = 0 - self.beginning_investment
        else:
            cumulative_net_returns = 0
            net_return = 0

        net_returns = {
            "position": 0,
            "time_period_position": 0,
            "return_with_inflation": 0,
            "cost_with_inflation": 0,
            "cumulative_net_returns": cumulative_net_returns,
            "net_return": net_return,
        }
        net_returns_over_time.append(copy.deepcopy(net_returns))
        for plan_budget in PlanBudget.objects.filter(plan=self).order_by("position"):
            net_returns["position"] = plan_budget.position
            net_returns["time_period_position"] = plan_budget.time_period_position
            net_returns["return_with_inflation"] = plan_budget.return_total_with_inflation
            net_returns["cost_with_inflation"] = plan_budget.cost_total_with_inflation
            net_returns["cumulative_net_returns"] += Decimal(plan_budget.net_returns_with_inflation)
            net_returns["net_return"] = Decimal(plan_budget.net_returns_with_inflation)
            if net_returns["time_period_position"] == Decimal(self.time_period_value):
                if self.use_investment_values:
                    net_returns["cumulative_net_returns"] += self.ending_investment
                    net_returns["net_return"] += Decimal(self.ending_investment)

            net_returns_over_time.append(copy.deepcopy(net_returns))

        return net_returns_over_time

class PlanBudget(models.Model):
    """ Represents the plan data associated with a Budget object.

        Has a one-to-one relationship with a Budget object.
        Has a many-to-one relationship with a Plan object.
    """

    user = models.ForeignKey(User, related_name="plan_budgets", on_delete=models.CASCADE,)
    plan = models.ForeignKey(Plan, related_name="plan_budgets", on_delete=models.CASCADE,)
    budget = models.ForeignKey(Budget, related_name="plan_data", on_delete=models.CASCADE,)

    title = models.CharField(max_length=100, default=None, blank=False)
    position = models.PositiveIntegerField(default=None, null=False, blank=True)

    space_units = models.CharField(max_length=20, default=None, blank=True)
    total_space_available = models.PositiveIntegerField(default=None, null=False, blank=True)
    total_space_used = models.DecimalField(max_digits=9, default=None, decimal_places=2, null=False, blank=True)

    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return u"%s" % (self.title)

    def save(self, *args, **kwargs):
        """ Override this method to update the convert the Plan and all associated PlanBudget objects time period units
            and values to the lowest unit in the Plan.
            Also, set the 'position' field to the next highest integer of all PlanBudget objects with the same
            associated Scenario.
        """

        plan = self.plan
        plan_budgets = PlanBudget.objects.filter(plan=plan)

        # FIXME: Refactor into single loop
        if self.position is not None:
            conflicting = False
            for plan_budget in plan_budgets:
                if self.position == plan_budget.position and self.id != plan_budget.id:
                    conflicting = True

            if conflicting:
                for plan_budget in plan_budgets.order_by('-position'):
                    if (plan_budget.position >= self.position):
                        plan_budget.position += 1
                        plan_budget.save()

        else:
            highest_position = -1
            for plan_budget in plan_budgets:
                if plan_budget.position > highest_position:
                    highest_position = plan_budget.position

            self.position = highest_position + 1

        super(PlanBudget, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """ Override this method to shift the 'position' fields of all PlanBudget objects with the same
            Scenario and subtract the deleted PlanBudget's 'time_value' from its parent Plan's 'time_period_value'.
        """

        plan_budgets = PlanBudget.objects.filter(plan=self.plan)

        for plan_budget in plan_budgets:
            if plan_budget.position > self.position:
                plan_budget.position -= 1
                plan_budget.save()

        self.plan.time_period_value -= self.time_value
        if self.plan.time_period_value < 0:
            self.plan.time_period_value = 0

        self.plan.save()

        super(PlanBudget, self).delete(*args, **kwargs)

    @property
    def income_items_with_inflation(self):
        """ Returns dictionary of income items with inflation
        """
        income_items_dic = {}
        for income_item in IncomeItem.objects.filter(parent_budget=self.budget):
            try:
                inflation_rate = percent_to_decimal(
                    IncomeItemInflationRate.objects.filter(income_item=income_item, plan_budget=self)[
                        0].compound_inflation_rate)
            except:
                inflation_rate = 0

            income_items_dic[income_item.name] = Decimal(income_item.return_total) * Decimal(1 + inflation_rate)

        return income_items_dic

    @property
    def cost_items_with_inflation(self):
        """ Returns dictionary of income items with inflation
        """
        cost_items_dic = {}
        for cost_item in CostItem.objects.filter(parent_budget=self.budget):
            try:
                inflation_rate = percent_to_decimal(
                    CostItemInflationRate.objects.filter(cost_item=cost_item, plan_budget=self)[
                        0].compound_inflation_rate)
            except IndexError:
                inflation_rate = 0

            cost_items_dic[cost_item.name] = Decimal(cost_item.cost_total) * (1 + inflation_rate)

        return cost_items_dic

    @property
    def return_total_with_inflation(self):
        """ Returns the total income of the associated Budget with inflation.
        """

        return_total = 0
        for income_item in IncomeItem.objects.filter(parent_budget=self.budget):
            try:
                inflation_rate = percent_to_decimal(
                    IncomeItemInflationRate.objects.filter(income_item=income_item, plan_budget=self)[
                        0].compound_inflation_rate)
            except:
                inflation_rate = 0

            return_total += Decimal(income_item.return_total) * (1 + inflation_rate)

        return return_total

    @property
    def cost_total_with_inflation(self):
        """ Returns the total cost of the associated Budget with inflation.
        """

        cost_total = 0
        for cost_item in CostItem.objects.filter(parent_budget=self.budget):
            try:
                inflation_rate = percent_to_decimal(
                    CostItemInflationRate.objects.filter(cost_item=cost_item, plan_budget=self)[
                        0].compound_inflation_rate)
            except IndexError:
                inflation_rate = 0

            cost_total += Decimal(cost_item.cost_total) * (1 + inflation_rate)

        if self.total_space_available > 0:
            cost_total = Decimal(cost_total) / (Decimal(self.total_space_used) / Decimal(self.total_space_available))


        return cost_total

    @property
    def net_returns_with_inflation(self):
        """ Returns the difference of return_total_with_inflation - cost_total_with_inflation.
        """

        return self.return_total_with_inflation - self.cost_total_with_inflation

    @property
    def present_value(self):
        """ Returns the present value of the associated Budget at the end of the Budget's time period.
        """

        return present_value(self, percent_to_decimal(self.plan.discount_rate))

    @property
    def time_unit(self):
        """ Returns the time unit of the associated Budget object.
        """

        return self.budget.time_unit

    @property
    def time_value(self):
        """ Returns the time value of the associated Budget object.
        """

        return self.budget.time_value

    @property
    def farm_unit(self):
        """ Returns the farm unit of the associated Budget object.
        """

        return self.budget.farm_unit

    @property
    def farm_unit_quantity(self):
        """ Returns the farm unit of the associated Budget object.
        """

        return self.budget.farm_unit_quantity

    @property
    def time_period_position(self):
        """ Returns the time period position of the PlanBudget in its Plan.
        """

        return get_time_period_position(self, self.plan)

    @property
    def notes(self):
        """ Returns the budget note of the associated Budget object
        """

        return self.budget.notes


class IncomeItemInflationRate(models.Model):
    """ Represents the inflation rate associated with a IncomeItem.
    """

    plan_budget = models.ForeignKey(PlanBudget, related_name="income_item_inflation_rates", on_delete=models.CASCADE,)
    income_item = models.ForeignKey(IncomeItem, related_name="inflation_rates", null=True, blank=True, on_delete=models.CASCADE,)
    #TODO: review how to change this to a property
    name = models.CharField(max_length=100, default="", blank=False, null=False)
    inflation_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0, null=False)
    compound_inflation_rate = models.DecimalField(max_digits=12, decimal_places=9, default=0, null=False)

    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return u"%s" % (self.name)


class CostItemInflationRate(models.Model):
    """ Represents the inflation rate associated with a CostItem.
    """

    plan_budget = models.ForeignKey(PlanBudget, related_name="cost_item_inflation_rates", on_delete=models.CASCADE,)
    cost_item = models.ForeignKey(CostItem, related_name="inflation_rates", null=True, blank=True, on_delete=models.CASCADE,)

    name = models.CharField(max_length=100, default="", blank=False, null=False)
    inflation_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0, null=False)
    compound_inflation_rate = models.DecimalField(max_digits=12, decimal_places=9, default=0, null=False)

    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)


    def __str__(self):
        return u"%s" % (self.name)


class BalanceSheet(models.Model):
    """ Represents the balance sheet data associated with a User object

        Has a one-to-many relationship with an User
    """

    user = models.ForeignKey(User, related_name="balance_sheets", on_delete=models.CASCADE,)
    year = models.PositiveIntegerField(default=None, null=False, blank=False)
    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="balance_sheets", on_delete=models.CASCADE,)

    # Current Assets
    cash_and_checking = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    prepaid_expenses = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    marketable_livestock = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    investment = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    account_receivable = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    other_assets = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    stored_crops_and_feed = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    purchased_feed = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    supplies = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)

    # Intermediate Assets
    breeding_livestock = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    vehicles = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    machinery_equipment = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    book_value = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    other_intermediate = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    investment_in_capital_leases = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    investing_in_cooperatives = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    contracts_and_notes_receivable = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)

    # Long Term Assets
    real_estate_land = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    other_longterm_assets = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    other_noncurrent_assets = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    total_current_assets = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)

    # Liabilities
    accounts_payable = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    accrued_interest = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    valorem_taxes=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    employee_payroll_withholding = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    income_taxes = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    deferred_taxes = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    total_current_liabilites = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    other_accured_expenses = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
    other_liabilites = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)

    total_current_equity = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)


    # @property
    # def total_current_assets(self):
    #     return self.cash_and_checking+self.prepaid_expenses+self.marketable_livestock+self.investment+self.account_receivable+self.other_assets+self.stored_crops_and_feed+self.purchased_feed

    def __str__(self):
        return u"%s" % ("Year"+str(self.year))



class AccrualAdjustments(models.Model):

          user = models.ForeignKey(User, related_name="accrual_adjustments", on_delete=models.CASCADE,)
          scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="accrual_adjustments", on_delete=models.CASCADE,)
          year = models.PositiveIntegerField(default=None, null=False, blank=False)
          prepaid_expenses=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          account_receivable=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          accounts_payable=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          breeding_livestock=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          contracts_and_notes_receivable=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          deferred_taxes=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          employee_payroll_withholding=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          income_taxes=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          investment=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          investment_in_capital_leases=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          marketable_livestock=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          other_accured_expenses=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          other_assets=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          other_current_liabilites=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          purchased_feed=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          real_estate_land=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          supplies= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          stored_crops_and_feed= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          total_current_assets = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          total_current_liabilites = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          total_current_equity = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          # investing_in_cooperatives = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          #notes_receivable= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          valorem_taxes=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          accrued_interest = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          # new add
          market_value_of_all_intermediate_assets = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          book_value_of_all_intermediate_and_long_term_assets = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          investments_in_cooperatives = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          other_intermediate_assets = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)
          other_long_term_assets = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=False, blank=True)

class IncomeStatement(models.Model):
    """ Represents the income statement data associated with a Scenario object

        Has a many-to-one relationship with a Scenario object
    """

    scenario = models.ForeignKey(Scenario, related_name="income_statement", on_delete=models.CASCADE,)

    year = models.PositiveIntegerField(default=None, null=False, blank=False)
    farm_ranch_gross_income = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)
    farm_ranch_costs = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)
    annual_net_income = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)
    accumulated_net_income = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)


class CashFlow(models.Model):
    """ Represents the cash flow data associated with a Scenario object

        Has a many-to-one relationship with a Scenario object
    """

    scenario = models.ForeignKey(Scenario, related_name="cash_flow", on_delete=models.CASCADE,)

    year = models.PositiveIntegerField(default=None, null=False, blank=False)
    total_value = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)

class CashFlowIncomeItem(models.Model):
    cash_flow = models.ForeignKey(CashFlow, related_name="income_item", on_delete=models.CASCADE,)

    name = models.CharField(max_length=100, blank=False)
    total = models.DecimalField(max_digits=20, decimal_places=2, blank=False)

class CashFlowCostItem(models.Model):
    cash_flow = models.ForeignKey(CashFlow, related_name="cost_item", on_delete=models.CASCADE,)

    name = models.CharField(max_length=100, blank=False)
    total = models.DecimalField(max_digits=20, decimal_places=2, blank=False)

class CashFlowItem (models.Model):

    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="cash_flow_item", on_delete=models.CASCADE,)
    year=  models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    type= models.CharField(max_length=100, default=None, blank=False)
    name = models.CharField(max_length=100, blank=False)
    total = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)


class OperatingLoan(models.Model):
    """ Represents the operating loan data associated with a Plan object

        Has a many-to-one relationship with a Plan object
    """
    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="operating_loans", on_delete=models.CASCADE,)

    select_year = models.PositiveIntegerField(default=None, null=False, blank=False)
    financed_through = models.CharField(max_length=100, default=None, blank=False)
    loan_amount = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=None, null=False, blank=False)
    number_month = models.PositiveIntegerField(default=None, null=False, blank=False)

class NewTransaction(models.Model):

    financed_through=models.CharField(max_length=100, default=None, blank=True)
    sold_through=models.CharField(max_length=100, default=None, blank=True)
    select_year= models.PositiveIntegerField(default=None, null=True, blank=False)
    loan_amount= models.DecimalField(max_digits=11, decimal_places=2, default=None, null=True, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    select_beginning_year= models.PositiveIntegerField(default=None, null=True, blank=False)
    down_payment= models.DecimalField(max_digits=11, decimal_places=2, default=None, null=True, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    annual_payment= models.DecimalField(max_digits=11, decimal_places=2, default=None, null=True, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    year_of_lease= models.PositiveIntegerField(default=None, null=True, blank=False)
    interest_rate= models.DecimalField(max_digits=11, decimal_places=2, default=None, null=True, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    number_of_months_to_borrow= models.PositiveIntegerField(default=None, null=True, blank=False)
    purchase_price= models.DecimalField(max_digits=11, decimal_places=2, default=None, null=True, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    trade_in_value= models.DecimalField(max_digits=11, decimal_places=2, default=None, null=True, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    percent_financed= models.DecimalField(max_digits=11, decimal_places=2, default=None, null=True, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    years_of_loan= models.PositiveIntegerField(default=None, null=True, blank=False)
    years_of_interest_only_payment= models.PositiveIntegerField(default=None, null=True, blank=False)
    asset_type =models.CharField(max_length=100, default=None, blank=False)
    sale_price= models.DecimalField(max_digits=11, decimal_places=2, default=None, null=True, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    year_of_loan= models.PositiveIntegerField(default=None, null=True, blank=False)
    #type = models.PositiveIntegerField(default=None, null=False, blank=False)


class Distributions (models.Model):

    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="distributions", on_delete=models.CASCADE,)

    year= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    wages= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    salaries= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    family_withdrawls=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    contributions= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    capital_gains = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    tax_rate= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)

    @property
    def inflated_wages(self):
        scenario = Scenario.objects.filter(id=self.scenario.id).first()
        inflation = Inflation.objects.filter(scenario=scenario).first()
        wage = self.wages
        year = self.year
        rate = 0

        if inflation is not None:
            rate = percent_to_decimal(inflation.wages_inflation)

        calculated_wage = Decimal(wage) * Decimal(pow(Decimal(1 + rate),Decimal(year) ))

        return Decimal("{0:.2f}".format(calculated_wage))

    @property
    def inflated_salaries(self):
        scenario = Scenario.objects.filter(id=self.scenario.id).first()
        inflation = Inflation.objects.filter(scenario=scenario).first()
        salaries = self.salaries
        year = self.year
        rate = 0

        if inflation is not None:
            rate = percent_to_decimal(inflation.salaries_inflation)

        calculated_salaries = Decimal(salaries) * Decimal(pow(Decimal(1 + rate),Decimal(year) ))

        return Decimal("{0:.2f}".format(calculated_salaries))

    @property
    def inflated_family_withdrawls(self):
        scenario = Scenario.objects.filter(id=self.scenario.id).first()
        inflation = Inflation.objects.filter(scenario=scenario).first()
        family_withdrawls = self.family_withdrawls
        year = self.year
        rate = 0

        if inflation is not None:
            rate = percent_to_decimal(inflation.family_withdrawls_inflation)

        calculated_family_withdrawls = Decimal(family_withdrawls) * Decimal(pow(Decimal(1 + rate),Decimal(year) ))

        return Decimal("{0:.2f}".format(calculated_family_withdrawls))

    @property
    def inflated_contributions(self):
        scenario = Scenario.objects.filter(id=self.scenario.id).first()
        inflation = Inflation.objects.filter(scenario=scenario).first()
        contributions = self.contributions
        year = self.year
        rate = 0

        if inflation is not None:
            rate = percent_to_decimal(inflation.contributions_inflation)

        calculated_contributions = Decimal(contributions) * Decimal(pow(Decimal(1 + rate),Decimal(year) ))

        return Decimal("{0:.2f}".format(calculated_contributions))






class CapitalPurchase(models.Model):
    """ Represents the capital purchase data associated with a Plan object

        Has a many-to-one relationship with a Plan object
    """
    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="capital_purchases", on_delete=models.CASCADE,)
    financed_from = models.CharField(max_length=100, default=None, blank=False)
    financed_through = models.CharField(max_length=100, default=None, blank=False)
    select_beginning_year = models.PositiveIntegerField(default=None, null=False, blank=False)
    purchase_price = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)
    trade_in_value = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)
    down_payment = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)
    percent_financed = models.DecimalField(max_digits=5, decimal_places=2, default=None, null=False, blank=False)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=None, null=False, blank=False)
    years_of_loan = models.PositiveIntegerField(default=None, null=False, blank=False)
    years_of_interest = models.PositiveIntegerField(default=None, null=False, blank=False)

    asset_class = models.CharField(max_length=100, default="", blank=False)

    @property
    def annual_payment(self):
        #calc annual payment with inflation

        if self.financed_from == 'Annual Cash Flow':
            return 0

        scenario = Scenario.objects.filter(id=self.scenario.id).first()
        inflation = Inflation.objects.filter(scenario=scenario).first()
        inflation_rate = 0

        if self.asset_class == 'Intermediate assets':
            inflation_rate = inflation.intermediate_assets_inflation

        elif self.asset_class == 'Facilities and Other Improvement':
            inflation_rate = inflation.value_of_facilities_and_other_improvements_inflation

        elif self.asset_class == 'Real Estate':
            inflation_rate = inflation.value_of_real_estate

        inflated_purchase = float(self.purchase_price) * pow(1.0 + (.01 * float(inflation_rate)), float(self.select_beginning_year))
        inflated_trade_in = float(self.trade_in_value) * pow(1.0 + (.01 * float(inflation_rate)), float(self.select_beginning_year))

        loan_amount = inflated_purchase - inflated_trade_in - float(self.down_payment)

        if self.years_of_loan == 0:
            payment = float(loan_amount)
        elif self.interest_rate == 0:
            payment = float(loan_amount) / float(self.years_of_loan)
        else:
            payment = float(loan_amount) * ( (float(self.interest_rate) * .01 * pow( 1 + (.01 * float(self.interest_rate)) , float(self.years_of_loan) )) / ( pow( 1 + (.01 * float(self.interest_rate)), float(self.years_of_loan)) - 1) )

        return round(payment, 2)


class CapitalSales(models.Model):
    """ Represents the capital sales data associated with a Plan object

        Has a many-to-one relationship with a Plan object
    """

    scenario = models.ForeignKey(Scenario, null=True, blank=True,related_name="capital_sales", on_delete=models.CASCADE,)
    sold_through = models.CharField(max_length=100, default=None, blank=False)
    select_year = models.PositiveIntegerField(default=None, null=False, blank=False)
    sale_price = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)
    asset_class = models.CharField(max_length=100, default=None, blank=False)


class CapitalLease(models.Model):
    """ Represents the capital lease data associated with a user object

        Has a many-to-one relationship with a user object
    """

    user = models.ForeignKey(User, default=1, related_name="capital_leases", on_delete=models.CASCADE,)

    financed_through = models.CharField(max_length=100, default=None, blank=False)
    annual_payment = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False)
    years_before_leases_expired= models.PositiveIntegerField(default=None, null=False, blank=False)
    asset_class = models.CharField(max_length=100, default="", blank=False)

class Depreciations(models.Model):
    """docstring for ."""
    year = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    scenario=models.ForeignKey(Scenario, null=True, blank=True, related_name="depreciations", on_delete=models.CASCADE,)
    capital_expenditures=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    capital_expenditures_to_intermediate_assets=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    depreciation = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    depreciation_allocated_to_intermediate_assets= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    replacement_costs_for_intermediate_assets= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    replacement_costs = models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)


    @property
    def inflated_intermediate_assets(self):
        scenario = Scenario.objects.filter(id=self.scenario.id).first()
        inflation = Inflation.objects.filter(scenario=scenario).first()
        intermediate_assets = (self.capital_expenditures * self.capital_expenditures_to_intermediate_assets) + (self.depreciation * self.depreciation_allocated_to_intermediate_assets)
        year = self.year
        rate = 0
        if inflation is not None:
            rate = percent_to_decimal(inflation.bonuses_inflation)
        calculated_intermediate_assets = Decimal(contributions) * pow(Decimal(1 + rate),Decimal(year) )
        return Decimal("{0:.2f}".format(intermediate_assets))




class FutureCapitalLease(models.Model):
    """ Represents the capital lease data associated with a Plan object

        Has a many-to-one relationship with a Plan object
    """

    scenario=models.ForeignKey(Scenario, null=True, blank=True, related_name="future_capital_leases", on_delete=models.CASCADE,)

    financed_through = models.CharField(max_length=100, default=None, blank=False)
    select_year = models.PositiveIntegerField(default=None, null=False, blank=False)
    down_payment = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    annual_payment = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    year_of_lease = models.PositiveIntegerField(default=None, null=False, blank=False)
    asset_class = models.CharField(max_length=100, default="", blank=False)

class CashFromAssetLoan(models.Model):
    """ Represents the cash from asset loan data associated with a Plan object
        Has a many-to-one relationship with a Plan object
    """
    scenario = models.ForeignKey(Scenario, null=True, blank=True,related_name="cash_from_asset_loans", on_delete=models.CASCADE,)

    financed_through = models.CharField(max_length=100, default=None, blank=False)
    select_year = models.PositiveIntegerField(default=None, null=False, blank=False)
    loan_amount = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=None, null=False, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    years_of_loan = models.PositiveIntegerField(default=None, null=False, blank=False)

    @property
    def annual_payment(self):
        #calc annual payment with inflation
        scenario = Scenario.objects.filter(id=self.scenario.id).first()
        inflation = Inflation.objects.filter(scenario=scenario).first()
        inflation_rate = 0

        if self.asset_class == 'Intermediate assets':
            inflation_rate = inflation.intermediate_assets_inflation

        elif self.asset_class == 'Facilities and Other Improvement':
            inflation_rate = inflation.value_of_facilities_and_other_improvements_inflation

        elif self.asset_class == 'Real Estate':
            inflation_rate = inflation.value_of_real_estate

        # inflated_purchase = float(self.purchase_price) * pow(1.0 + (.01 * float(inflation_rate)), float(self.select_beginning_year))
        loan_amount = float(self.loan_amount) * pow(1.0 + (.01 * float(inflation_rate)), float(self.select_year))

        # loan_amount = inflated_purchase - inflated_trade_in - float(self.down_payment)

        if self.years_of_loan == 0:
            payment = float(loan_amount)
        elif self.interest_rate == 0:
            payment = float(loan_amount) / float(self.years_of_loan)
        else:
            payment = float(loan_amount) * ( (float(self.interest_rate) * .01 * pow( 1 + (.01 * float(self.interest_rate)) , float(self.years_of_loan) )) / ( pow( 1 + (.01 * float(self.interest_rate)), float(self.years_of_loan)) - 1) )

        return round(payment, 2)

class CurrentLoans(models.Model):
    """ Represents the current loan data associated with a User object
        Has a many-to-one relationship with a User object
    """

    user = models.ForeignKey(User, related_name="current_loans", on_delete=models.CASCADE,)

    transaction_description = models.CharField(max_length=100, default=None, blank=False)
    loan_amount = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=None, null=False, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    years_of_loan = models.PositiveIntegerField(default=None, null=False, blank=False)
    years_before_loan_matures = models.PositiveIntegerField(default=None, null=False, blank=False)
    asset_type =  models.CharField(max_length=100, default=None, blank=False)

    def __str__(self):
        return u"%s" % (self.transaction_description)


class FutureLoans(models.Model):
    """ Represents the future loan data associated with a User object
        Has a many-to-one relationship with a User object
    """

    user = models.ForeignKey(User, default=1, related_name="future_loans", on_delete=models.CASCADE,)

    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="future_loans", on_delete=models.CASCADE,)
    transaction_description = models.CharField(max_length=100, default=None, blank=False)
    loan_amount = models.DecimalField(max_digits=11, decimal_places=2, default=None, null=False, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=None, null=False, blank=False,validators=[MinValueValidator(Decimal('0.00'))])
    years_of_loan = models.PositiveIntegerField(default=None, null=False, blank=False)
    years_before_loan_matures = models.PositiveIntegerField(default=None, null=False, blank=False)

    asset_type =  models.CharField(max_length=100, default=None, blank=False)

    def __str__(self):
        return u"%s" % (self.transaction_description)

class Inflation(models.Model):
    """ Represents the inflation data associated with a User object
        Has a many-to-one relationship with a User object
    """


    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="inflation", on_delete=models.CASCADE,)

    wages_inflation= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    bonuses_inflation= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    salaries_inflation= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    family_withdrawls_inflation=models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    contributions_inflation= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    operating_loans_inflation= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    current_assets_and_liabilities_inflation= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    intermediate_assets_inflation= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    value_of_facilities_and_other_improvements_inflation= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    value_of_real_estate= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)
    value_of_capital_expenditures= models.DecimalField(max_digits=11, decimal_places=2, default=0, null=True, blank=True)




class CashflowPdfOutput(models.Model):

    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="cash_flow_pdf", on_delete=models.CASCADE,)


class CashflowPdfOutputItem(models.Model):
    cash_flow=models.ForeignKey(CashflowPdfOutput, null=True, blank=True, on_delete=models.CASCADE)
    year = models.PositiveIntegerField(default=None, null=False, blank=False)
    item_name=models.CharField(max_length=50,null=True, blank=True)
    item_number=models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    type = models.CharField(max_length=100, default=None, null=True, blank=True)




class BalanceSheetOutput(models.Model):

    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="balance_sheet_output", on_delete=models.CASCADE,)

class BalanceSheetOutputItem(models.Model):
    balance_sheet=models.ForeignKey(BalanceSheetOutput, null=True, blank=True, on_delete=models.CASCADE)
    year = models.PositiveIntegerField(default=None, null=False, blank=False)
    item_name=models.CharField(max_length=50,null=True, blank=True)
    item_number=models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    type = models.CharField(max_length=100, default=None, null=True, blank=True)

class IncomeStatementOutput(models.Model):

    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="income_statement_output", on_delete=models.CASCADE,)

class IncomeStatementOutputItem(models.Model):
    income_statement=models.ForeignKey(IncomeStatementOutput, null=True, blank=True, on_delete=models.CASCADE)
    year = models.PositiveIntegerField(default=None, null=False, blank=False)
    item_name=models.CharField(max_length=50,null=True, blank=True)
    item_number=models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    type = models.CharField(max_length=100, default=None, null=True, blank=True)

class FinancialRatiosOutput(models.Model):
    scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="finance_ratios_output", on_delete=models.CASCADE,)
    year = models.PositiveIntegerField(default=None, null=False, blank=False)
    asset_turnover = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    current_ratio = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    debt_asset = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    debt_capacity = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    depreciation_expense_ratio = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    dept_margin = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    ebitda = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    equity_assest = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    interest_expense_ratio = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    net_farm_ratio = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    net_income = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    operating_expense_ratio = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    operating_profit_margin = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    rate_return_asset = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    rate_return_equity = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    replacement_margin = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    replacement_margin_ratio = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    term_debt_ratio = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    working_capital = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)
    working_to_rev = models.DecimalField(max_digits=11, decimal_places=2, default=1, null=True, blank=True)

# class FinanceIncomeStatmentPdf(models.Model):
#
#     scenario = models.ForeignKey(Scenario, null=True, blank=True, related_name="finance_income_statment_pdf", on_delete=models.CASCADE,)
#     year = models.PositiveIntegerField(default=None, null=False, blank=False)
#
#     cashflowitem_income
#     cashflowitem_income_total


################################################################################
#                            Helper Functions
################################################################################

def get_time_period_position(current_plan_budget, plan):
    """ Returns the time period position (i.e. Week 4) of the given 'current_plan_budget' in the given 'plan'. The
        time period position of a budget is at the end of the budget.
    """

    time_period_position = current_plan_budget.time_value

    for plan_budget in PlanBudget.objects.filter(plan=plan):
        if plan_budget.position < current_plan_budget.position:
            time_period_position += plan_budget.time_value

    return time_period_position


def percent_to_decimal(percent):
    """ Converts a float in percentage form (i.e. 30.0) to a float in decimal form (0.300) and returns it.
    """

    return Decimal(float(percent) / 100.00)


def present_value(plan_budget, discount_rate):
    """ Calculates the present value of the given 'plan_budget' using the given decimal 'discount_rate'.
    """

    time_period_position = plan_budget.time_period_position
    net_returns = Decimal(plan_budget.net_returns_with_inflation)

    # If last Budget in Plan, add the ending_investment value to net_returns
    if time_period_position == plan_budget.plan.time_period_value:
        net_returns += Decimal(plan_budget.plan.ending_investment)

    present_value = net_returns / Decimal((1 + discount_rate)) ** Decimal((time_period_position * CONVERSION_TABLE[plan_budget.plan.time_period_unit]['Year']))

    return present_value


CONVERSION_TABLE = {
    'Day': {'value': 1, 'Day': 1, 'Week': 0.14, 'Month': 0.03, 'Year': 0.003, 'unit': 'Day', 'n': 365},
    'Week': {'value': 2, 'Day': 7, 'Week': 1, 'Month': 0.25, 'Year': 0.019230769, 'unit': 'Week', 'n': 52},
    'Month': {'value': 3, 'Day': 30, 'Week': 4, 'Month': 1, 'Year': 0.08, 'unit': 'Month', 'n': 12},
    'Year': {'value': 4, 'Day': 365, 'Week': 52, 'Month': 12, 'Year': 1, 'unit': 'Year', 'n': 1},
}
