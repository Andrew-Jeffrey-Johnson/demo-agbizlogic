from django.db import models
from django.contrib.auth.models import User
from budget.models import Budget
import datetime



class ClimateScenario(models.Model):
    """ Represents a climate scenario composed of different budgets and climate factors.
    """

    user =  models.ForeignKey(User, on_delete=models.CASCADE,)
    title = models.CharField(max_length=100, default=None, blank=False)
    notes = models.CharField(max_length=1000, default="", blank=True)
    projection_type = models.CharField(max_length=20, default="long", blank=True)

    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)


    def __str__(self):
        return u"%s" % (self.title)



class ClimateBudget(models.Model):
    """ Represents the climate data associated with a Budget.

        Has a many-to-one relationship with a Budget object.
        Has a many-to-one relationship with a ClimateScenario object.
    """

    user = models.ForeignKey(User, related_name="climate_budgets", on_delete=models.CASCADE,)
    climate_scenario = models.ForeignKey(ClimateScenario, related_name="climate_budgets", on_delete=models.CASCADE,)
    budget = models.ForeignKey(Budget, related_name="climate_data", on_delete=models.CASCADE,)

    # Climate fields
    modeling_estimate = models.DecimalField(max_digits=10, decimal_places=1, default=0, blank=False)
    focus_group_estimate = models.DecimalField(max_digits=10, decimal_places=1, default=0, blank=False)
    user_estimate = models.DecimalField(max_digits=10, decimal_places=1, default=0, blank=False)
    change_net_returns = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True)

    is_original = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=None, null=False, blank=False)

    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)



    def __str__(self):
        return u"%s" % (self.budget.title)


    def delete(self, *args, **kwargs):
        """ Override this method to shift the 'position' fields of all ClimateBudget objects with the same
            ClimateScenario.
        """

        climate_budgets = []

        if self.is_original == True:
            climate_budgets = ClimateBudget.objects.filter(climate_scenario=self.climate_scenario, is_original=True)
        else:
            climate_budgets = ClimateBudget.objects.filter(climate_scenario=self.climate_scenario, is_original=False)

        for climate_budget in climate_budgets:
            if climate_budget.position > self.position:
                climate_budget.position -= 2
                climate_budget.save()

        super(ClimateBudget, self).delete(*args, **kwargs)


    def save(self, *args, **kwargs):
        """ Override this method to set the 'position' field based on ClimateBudget objects with the same
            ClimateScenario. Assumes that new ClimateBudget objects are always added to the end of the list.
            If 'is_original' field is True, assign the next highest even integer.
            Else if 'is_original' field is False, assign the next highest odd integer.
        """

        if self.position == None:
            climate_budgets = ClimateBudget.objects.filter(climate_scenario=self.climate_scenario)
            # Negative starting values to account for the case of saving first climate budget
            highest_even_position = -2
            highest_odd_position = -1

            # Find the highest odd and even positions
            for climate_budget in climate_budgets:
                if (climate_budget.position % 2 == 0) and highest_even_position < climate_budget.position:
                    highest_even_position = climate_budget.position
                elif (climate_budget.position % 2 == 1) and highest_odd_position < climate_budget.position:
                    highest_odd_position = climate_budget.position

            if self.is_original == True:
                self.position = highest_even_position + 2
            else:
                self.position = highest_odd_position + 2

        return super(ClimateBudget, self).save(*args, **kwargs)


    @property
    def budget_data(self):
        return self.budget

    @property
    def title(self):
        return self.budget.title

    @property
    def net_returns(self):
        return self.budget.profit

    @property
    def total_yields(self):
        return self.budget.total_yields

    @property
    def farm_unit(self):
        return self.budget.farm_unit

    @property
    def sale_unit(self):
        return self.budget.primary_income_unit

    @property
    def sale_quantity(self):
        return self.budget.primary_income_quantity



class ClimateFactor(models.Model):
    """ Represents a climate factor that affects a given climate budget.
    """

    climate_budget = models.ForeignKey(ClimateBudget, related_name="climate_factors", on_delete=models.CASCADE,)

    name = models.CharField(max_length=150, blank=False)
    state = models.CharField(max_length=30, blank=False)
    region = models.CharField(max_length=100, default="", blank=True)
    user_estimate = models.DecimalField(max_digits=10, decimal_places=1, blank=False)

    created_date = models.DateTimeField(default=datetime.datetime.now)
    modified_date = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return u"%s" % (self.name)



TIME_UNITS = (
    ("years","Year(s)"),
    ("months","Month(s)"),
    ("weeks","Week(s)"),
    ("days","Day(s)"),
)
FARM_UNITS = (
    ('acres', 'Acre(s)'),
)
SALE_UNITS = (
    ('tons', 'Ton(s)'),
)
COST_TYPES = (
    ('variable', 'Variable'),
    ('fixed', 'Fixed'),
    ('general', 'General'),
)

SCENARIO_TYPE = (
    ('short', 'Short Term Scenario'),
    ('long', 'Long Term Scenario'),
)
