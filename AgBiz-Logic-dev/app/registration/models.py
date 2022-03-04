from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
import copy
from collections import OrderedDict
from django.core.validators import validate_comma_separated_integer_list



class Access_Code(models.Model):
    """ Represents the code used to gain access to certain areas and functionality of the application.
    """

    reason = models.CharField(max_length=100)
    code = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = 'Access_Code'



class Business(models.Model):
    """ Represents a user's business.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE,)
    name = models.CharField(max_length=100) #business name
    address1 = models.CharField(max_length=100)
    address2 = models.CharField(max_length=100, blank=True)
    zipcode = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)

    industry = models.CharField(max_length=100, default=None)
    primary_business = models.CharField(max_length=100, default=None)
    secondary_business = models.CharField(max_length=100, default=None)

    class Meta:
        db_table = 'Business'

    def __str__(self):
        return self.user

    def __unicode__(self):
        return unicode(self.user)


class ScheduleF(models.Model):
    """ Represents the Schedule F tax form used in the agriculture industry. Used as a basis to allocate income and
        expense items into the AgBiz Gold Standard.
    """

    # FIXME: Use PositiveIntegerField instead of CharField, commas should be added in the view layer.
    user = models.ForeignKey(User, on_delete=models.CASCADE,)
    year = models.CharField(max_length=100, default=0)
    line_1_a = models.CharField(db_column='1_a', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_1_b = models.CharField(db_column='1_b', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_1_c = models.CharField(db_column='1_c', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_2 = models.CharField(db_column='2', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_3_a = models.CharField(db_column='3_a', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_3_b = models.CharField(db_column='3_b', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_4_a = models.CharField(db_column='4_a', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_4_b = models.CharField(db_column='4_b', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_5_a = models.CharField(db_column='5_a', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_5_b = models.CharField(db_column='5_b', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_5_c = models.CharField(db_column='5_c', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_6_a = models.CharField(db_column='6_a', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_6_b = models.CharField(db_column='6_b', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_6_d = models.CharField(db_column='6_d', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_7 = models.CharField(db_column='7', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_8 = models.CharField(db_column='8', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    gross_income = models.CharField(default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_10 = models.CharField(db_column='10', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_11 = models.CharField(db_column='11', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_12 = models.CharField(db_column='12', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_13 = models.CharField(db_column='13', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_14 = models.CharField(db_column='14', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_15 = models.CharField(db_column='15', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_16 = models.CharField(db_column='16', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_17 = models.CharField(db_column='17', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_18 = models.CharField(db_column='18', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_19 = models.CharField(db_column='19', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_20 = models.CharField(db_column='20', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_21_a = models.CharField(db_column='21_a', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_21_b = models.CharField(db_column='21_b', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_22 = models.CharField(db_column='22', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_23 = models.CharField(db_column='23', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_24_a = models.CharField(db_column='24_a', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_24_b = models.CharField(db_column='24_b', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_25 = models.CharField(db_column='25', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_26 = models.CharField(db_column='26', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_27 = models.CharField(db_column='27', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_28 = models.CharField(db_column='28', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_29 = models.CharField(db_column='29', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_30 = models.CharField(db_column='30', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_31 = models.CharField(db_column='31', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_32_a = models.CharField(db_column='32_a', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_32_b = models.CharField(db_column='32_b', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_32_c = models.CharField(db_column='32_c', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_32_d = models.CharField(db_column='32_d', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_32_e = models.CharField(db_column='32_e', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    line_32_f = models.CharField(db_column='32_f', default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    other_expense_1 = models.CharField(null=True, max_length=100)
    other_expense_2 = models.CharField(null=True, max_length=100)
    other_expense_3 = models.CharField(null=True, max_length=100)
    other_expense_4 = models.CharField(null=True, max_length=100)
    other_expense_5 = models.CharField(null=True, max_length=100)
    other_expense_6 = models.CharField(null=True, max_length=100)

    total_expenses = models.CharField(default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])
    net_profit = models.CharField(default=0, null=True, max_length=12, validators=[validate_comma_separated_integer_list])


    def get_fields(self):
        """ Returns the key/value pairs of all model attributes
        """

        return [(field.name, field.value_to_string(self)) for field in ScheduleF._meta.fields]


    def convert_to_gold_standard(self):
        """ Converts the given ScheduleF object into Gold Standard format.
        """

        schedule_f = self
        gold_standard_data = OrderedDict(copy.deepcopy(GOLD_STANDARD_DATA))

        for line in schedule_f._meta.get_fields():
            clean_line = str(line).replace("registration.ScheduleF.", "")

            if clean_line in SCHEDULE_F_TO_GOLD_STANDARD:
                category = SCHEDULE_F_TO_GOLD_STANDARD[clean_line]
                value = int((getattr(schedule_f, line.name)).replace(",", ""))

                # Special case for 'income_sales'
                if category == "income_sales":
                    gold_standard_data["income_sales"]["total"] = int((getattr(schedule_f, "line_1_a")).replace(",", "")) + int((getattr(schedule_f, "line_2")).replace(",", ""))
                # Special case for 'expenses_interest_mortgages'
                elif category == "expenses_interest_mortgages":
                    gold_standard_data["expenses_interest_mortgages"]["total"] = int((getattr(schedule_f, "line_21_a")).replace(",", "")) + int((getattr(schedule_f, "line_21_b")).replace(",", ""))
                elif category in gold_standard_data:
                    gold_standard_data[category]["total"] += value

        # Set 'other expenses' labels
        for line in schedule_f._meta.get_fields():
            clean_line = str(line).replace("registration.ScheduleF.", "")

            if "other_expense_" in clean_line:
                replaced_line = clean_line.replace("other_expense_", "expenses_other_")

                # Search conversion dict values for matching-ish line
                for tax_line in SCHEDULE_F_TO_GOLD_STANDARD:
                    if replaced_line == SCHEDULE_F_TO_GOLD_STANDARD[tax_line]:
                        label = get_label(line, schedule_f)
                        gold_standard_data[SCHEDULE_F_TO_GOLD_STANDARD[tax_line]]['label'] = getattr(schedule_f, line.name)

        return gold_standard_data


    def __str__(self):
        return u"%s" % (self.user)

    class Meta:
        verbose_name_plural = _("ScheduleF")



################################################################################
#                            Helper Functions
################################################################################

def get_label(line, schedule_f):
    label = getattr(schedule_f, line.name)
    if label is None:
        label = "Other expenses"

    return label



# Reference dicts for creating objects

SCHEDULE_F_TO_GOLD_STANDARD = {
    "line_1_a": "income_sales",
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
    "line_21_b": "expenses_interest_mortgages",
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
GOLD_STANDARD_DATA = (
  ("expenses_goods", {
    "name": "expenses_goods",
    "label": "Cost of goods sold",
    "type": "expense",
    "total": 0
  }),
  ("expenses_car", {
    "name": "expenses_car",
    "label": "Car and truck expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_chemicals", {
    "name": "expenses_chemicals",
    "label": "Chemicals",
    "type": "expense",
    "total": 0
  }),
  ("expenses_conservation", {
    "name": "expenses_conservation",
    "label": "Conservation expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_custom_hire", {
    "name": "expenses_custom_hire",
    "label": "Custom hire",
    "type": "expense",
    "total": 0
  }),
  ("expenses_depreciation", {
    "name": "expenses_depreciation",
    "label": "L-T asset replacement and section 179 expense",
    "type": "expense",
    "total": 0
  }),
  ("expenses_employee_benefit", {
    "name": "expenses_employee_benefit",
    "label": "Employee benefit programs",
    "type": "expense",
    "total": 0
  }),
  ("expenses_feed", {
    "name": "expenses_feed",
    "label": "Feed",
    "type": "expense",
    "total": 0
  }),
  ("expenses_fertilizers", {
    "name": "expenses_fertilizers",
    "label": "Fertilizers and lime",
    "type": "expense",
    "total": 0
  }),
  ("expenses_freight", {
    "name": "expenses_freight",
    "label": "Freight and trucking",
    "type": "expense",
    "total": 0
  }),
  ("expenses_gasoline", {
    "name": "expenses_gasoline",
    "label": "Gas, fuel and oil",
    "type": "expense",
    "total": 0
  }),
  ("expenses_insurance", {
    "name": "expenses_insurance",
    "label": "Insurance (other than health)",
    "type": "expense",
    "total": 0
  }),
  ("expenses_interest_mortgages", {
    "name": "expenses_interest_mortgages",
    "label": "Interest on loans and mortgages",
    "type": "expense",
    "total": 0
  }),
  ("expenses_labor", {
    "name": "expenses_labor",
    "label": "Labor hired (less employment credits)",
    "type": "expense",
    "total": 0
  }),
  ("expenses_pension", {
    "name": "expenses_pension",
    "label": "Pension and profit-sharing plans",
    "type": "expense",
    "total": 0
  }),
   ("expenses_property_taxes", {
     "name": "expenses_property_taxes",
     "label": "Property taxes",
     "type": "expense",
     "total": 0
   }),
  ("expenses_machinery_rent", {
    "name": "expenses_machinery_rent",
    "label": "Rent and leases: Machinery, equipment and vehicles",
    "type": "expense",
    "total": 0
  }),
  ("expenses_land_rent", {
    "name": "expenses_land_rent",
    "label": "Rent and leases: Land and animals",
    "type": "expense",
    "total": 0
  }),
  ("expenses_repairs", {
    "name": "expenses_repairs",
    "label": "Repairs and maintenance",
    "type": "expense",
    "total": 0
  }),
  ("expenses_seeds", {
    "name": "expenses_seeds",
    "label": "Seeds and plants",
    "type": "expense",
    "total": 0
  }),
  ("expenses_storage", {
    "name": "expenses_storage",
    "label": "Storage and warehousing",
    "type": "expense",
    "total": 0
  }),
  ("expenses_supplies", {
    "name": "expenses_supplies",
    "label": "Supplies",
    "type": "expense",
    "total": 0
  }),
  ("expenses_utilities", {
    "name": "expenses_utilities",
    "label": "Utilities",
    "type": "expense",
    "total": 0
  }),
  ("expenses_veterinary", {
    "name": "expenses_veterinary",
    "label": "Veterinary, breeding, and medicine",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_1", {
    "name": "expenses_other_1",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_2", {
    "name": "expenses_other_2",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_3", {
    "name": "expenses_other_3",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_4", {
    "name": "expenses_other_4",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_5", {
    "name": "expenses_other_5",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("expenses_other_6", {
    "name": "expenses_other_6",
    "label": "Other expenses",
    "type": "expense",
    "total": 0
  }),
  ("income_sales", {
    "name": "income_sales",
    "label": "Sales of livestock, produce, grains and other products",
    "type": "income",
    "total": 0
  }),
  ("income_cooperative", {
    "name": "income_cooperative",
    "label": "Cooperative distributions received",
    "type": "income",
    "total": 0
  }),
  ("income_agriculture_programs", {
    "name": "income_agriculture_programs",
    "label": "Agricultural program payments",
    "type": "income",
    "total": 0
  }),
  ("income_insurance", {
    "name": "income_insurance",
    "label": "Crop insurance proceeds and federal crop disaster payments",
    "type": "income",
    "total": 0
  }),
  ("income_custom_hire", {
    "name": "income_custom_hire",
    "label": "Specified custom hire (machine work) income",
    "type": "income",
    "total": 0
  }),
  ("income_other", {
    "name": "income_other",
    "label": "Other income",
    "type": "income",
    "total": 0
  })
)
