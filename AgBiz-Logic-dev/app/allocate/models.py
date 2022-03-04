from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _


# Nested tuples containing short and long business types
BUSINESS_TYPE = (
    ('Crop','Crops: Food, Feed, Seed, Fiber and Oil'),
    ('Custom_Hire', 'Custom Hire'),
    ('Direct_Farm_Sales', 'Direct Farm Sales'),
    ('Forest','Forest and Woodlands'),
    ('Nursery', 'Nursery and Christmas Tree Production'),
    ('Livestock', 'Livestock'),
    ('Management_Service', 'Management Services'),
    ('Seafood', 'Seafood'),
    ('Value_Added', 'Value-added Processing'),
)
CATEGORY_TYPE = (
    ('Breed', 'Breed'),
    ('Commodity', 'Commodity'),
    ('Class', 'Class'),
    ('Gear_Type', 'Gear_Type'),
    ('Housing_System_Type', 'Housing_System_Type'),
    ('Market', 'Market'),
    ('Sub-Category', 'Sub-Category'),
    ('Operation', 'Operation'),
    ('Parlor_Type', 'Parlor_Type'),
    ('Species', 'Species'),
    ('Sub-Market', 'Sub-Market'),
    ('Type', 'Type'),
    ('Variety', 'Variety'),
)



class BusinessData(models.Model):
    """ Represents the allocated resources to a certain business using the AgBiz Gold Standard categories.
        Has a many-to-one relation with a unique User object.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE,)
    business_type = models.CharField(max_length=50, choices=BUSINESS_TYPE)

    income_sales = models.PositiveIntegerField(default=0, null=True)
    income_cooperative = models.PositiveIntegerField(default=0, null=True)
    income_agriculture_programs = models.PositiveIntegerField(default=0, null=True)
    income_insurance = models.PositiveIntegerField(default=0, null=True)
    income_custom_hire = models.PositiveIntegerField(default=0, null=True)
    income_other = models.PositiveIntegerField(default=0, null=True)

    expenses_goods = models.PositiveIntegerField(default=0, null=True)
    expenses_car = models.PositiveIntegerField(default=0, null=True)
    expenses_chemicals = models.PositiveIntegerField(default=0, null=True)
    expenses_conservation = models.PositiveIntegerField(default=0, null=True)
    expenses_custom_hire = models.PositiveIntegerField(default=0, null=True)
    expenses_depreciation = models.PositiveIntegerField(default=0, null=True)
    expenses_employee_benefit = models.PositiveIntegerField(default=0, null=True)
    expenses_feed = models.PositiveIntegerField(default=0, null=True)
    expenses_fertilizers = models.PositiveIntegerField(default=0, null=True)
    expenses_freight = models.PositiveIntegerField(default=0, null=True)
    expenses_gasoline = models.PositiveIntegerField(default=0, null=True)
    expenses_insurance = models.PositiveIntegerField(default=0, null=True)
    expenses_interest_mortgages = models.PositiveIntegerField(default=0, null=True)
    expenses_labor = models.PositiveIntegerField(default=0, null=True)
    expenses_pension = models.PositiveIntegerField(default=0, null=True)
    expenses_property_taxes = models.PositiveIntegerField(default=0, null=True)
    expenses_machinery_rent = models.PositiveIntegerField(default=0, null=True)
    expenses_land_rent = models.PositiveIntegerField(default=0, null=True)
    expenses_repairs = models.PositiveIntegerField(default=0, null=True)
    expenses_seeds = models.PositiveIntegerField(default=0, null=True)
    expenses_storage = models.PositiveIntegerField(default=0, null=True)
    expenses_supplies = models.PositiveIntegerField(default=0, null=True)
    expenses_utilities = models.PositiveIntegerField(default=0, null=True)
    expenses_veterinary = models.PositiveIntegerField(default=0, null=True)
    expenses_other_1_label = models.CharField(max_length=100, blank=True)
    expenses_other_1 = models.PositiveIntegerField(default=0, null=True)
    expenses_other_2_label = models.CharField(max_length=100, blank=True)
    expenses_other_2 = models.PositiveIntegerField(default=0, null=True)
    expenses_other_3_label = models.CharField(max_length=100, blank=True)
    expenses_other_3 = models.PositiveIntegerField(default=0, null=True)
    expenses_other_4_label = models.CharField(max_length=100, blank=True)
    expenses_other_4 = models.PositiveIntegerField(default=0, null=True)
    expenses_other_5_label = models.CharField(max_length=100, blank=True)
    expenses_other_5 = models.PositiveIntegerField(default=0, null=True)
    expenses_other_6_label = models.CharField(max_length=100, blank=True)
    expenses_other_6 = models.PositiveIntegerField(default=0, null=True)

    completed = models.BooleanField(default=False)


    @property
    def total_income(self):
        total_income = 0
        for field in self._meta.get_fields():
            if "income" in field.name:
                if getattr(self, field.name) is not None:
                    total_income = total_income + getattr(self, field.name)

        return total_income


    @property
    def total_expenses(self):
        total_expenses = 0
        for field in self._meta.get_fields():
            if "expenses" in field.name and not "label" in field.name:
                if getattr(self, field.name) is not None:
                    total_expenses = total_expenses + getattr(self, field.name)

        return total_expenses


    def __str__(self):
        return u"%s" % (self.business_type)


    class Meta:
        verbose_name_plural = _("BusinessData")



class EnterpriseData(models.Model):
    """ Represents the allocated resources to a certain enterprise using the AgBiz Gold Standard categories.
        Has a many-to-one relation with a unique BusinessData object (parent_business).
        Has a many-to -one relation with a unique User object (user).
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE,)

    enterprise = models.CharField(max_length=50, blank=False, default=None)
    category_1 = models.CharField(max_length=50, blank=False, default=None)
    category_2 = models.CharField(max_length=50, blank=True, default="")
    category_3 = models.CharField(max_length=50, blank=True, default="")
    category_4 = models.CharField(max_length=50, blank=True, default="")
    category_5 = models.CharField(max_length=50, blank=True, default="")
    category_6 = models.CharField(max_length=50, blank=True, default="")
    market = models.CharField(max_length=50)

    income_sales = models.PositiveIntegerField(default=0, null=True)
    income_cooperative = models.PositiveIntegerField(default=0, null=True)
    income_agriculture_programs = models.PositiveIntegerField(default=0, null=True)
    income_insurance = models.PositiveIntegerField(default=0, null=True)
    income_custom_hire = models.PositiveIntegerField(default=0, null=True)
    income_other = models.PositiveIntegerField(default=0, null=True)

    expenses_goods = models.PositiveIntegerField(default=0, null=True)
    expenses_car = models.PositiveIntegerField(default=0, null=True)
    expenses_chemicals = models.PositiveIntegerField(default=0, null=True)
    expenses_conservation = models.PositiveIntegerField(default=0, null=True)
    expenses_custom_hire = models.PositiveIntegerField(default=0, null=True)
    expenses_depreciation = models.PositiveIntegerField(default=0, null=True)
    expenses_employee_benefit = models.PositiveIntegerField(default=0, null=True)
    expenses_feed = models.PositiveIntegerField(default=0, null=True)
    expenses_fertilizers = models.PositiveIntegerField(default=0, null=True)
    expenses_freight = models.PositiveIntegerField(default=0, null=True)
    expenses_gasoline = models.PositiveIntegerField(default=0, null=True)
    expenses_insurance = models.PositiveIntegerField(default=0, null=True)
    expenses_interest_mortgages = models.PositiveIntegerField(default=0, null=True)
    expenses_labor = models.PositiveIntegerField(default=0, null=True)
    expenses_pension = models.PositiveIntegerField(default=0, null=True)
    expenses_property_taxes = models.PositiveIntegerField(default=0, null=True)
    expenses_machinery_rent = models.PositiveIntegerField(default=0, null=True)
    expenses_land_rent = models.PositiveIntegerField(default=0, null=True)
    expenses_repairs = models.PositiveIntegerField(default=0, null=True)
    expenses_seeds = models.PositiveIntegerField(default=0, null=True)
    expenses_storage = models.PositiveIntegerField(default=0, null=True)
    expenses_supplies = models.PositiveIntegerField(default=0, null=True)
    expenses_utilities = models.PositiveIntegerField(default=0, null=True)
    expenses_veterinary = models.PositiveIntegerField(default=0, null=True)
    expenses_other_1_label = models.CharField(max_length=100, blank=True)
    expenses_other_1 = models.PositiveIntegerField(default=0, null=True)
    expenses_other_2_label = models.CharField(max_length=100, blank=True)
    expenses_other_2 = models.PositiveIntegerField(default=0, null=True)
    expenses_other_3_label = models.CharField(max_length=100, blank=True)
    expenses_other_3 = models.PositiveIntegerField(default=0, null=True)
    expenses_other_4_label = models.CharField(max_length=100, blank=True)
    expenses_other_4 = models.PositiveIntegerField(default=0, null=True)
    expenses_other_5_label = models.CharField(max_length=100, blank=True)
    expenses_other_5 = models.PositiveIntegerField(default=0, null=True)
    expenses_other_6_label = models.CharField(max_length=100, blank=True)
    expenses_other_6 = models.PositiveIntegerField(default=0, null=True)


    @property
    def total_income(self):
        total_income = 0
        for field in self._meta.get_fields():
            if "income" in field.name:
                if getattr(self, field.name) is not None:
                    total_income = total_income + getattr(self, field.name)

        return total_income


    @property
    def total_expenses(self):
        total_expenses = 0
        for field in self._meta.get_fields():
            if "expenses" in field.name and not "label" in field.name:
                if getattr(self, field.name) is not None:
                    total_expenses = total_expenses + getattr(self, field.name)

        return total_expenses


    def __str__(self):
        return u"%s" % (self.category_1)


    class Meta:
        verbose_name_plural = _("EnterpriseData")
