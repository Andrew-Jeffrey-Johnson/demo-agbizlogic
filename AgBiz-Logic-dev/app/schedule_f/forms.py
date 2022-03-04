from django import forms
from registration.models import Business, ScheduleF
from django.utils.safestring import mark_safe
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Field, ButtonHolder, Button, Fieldset, HTML, Div
from crispy_forms.bootstrap import TabHolder, Tab, PrependedAppendedText
import datetime
from django.utils.translation import ugettext_lazy as _

form_option = (

    ('Schedule F Profit or Loss From Farming', 'Schedule F Profit or Loss From Farming'),
    ('Schedule C Profit or Loss From Farming', 'Schedule C Profit or Loss From Farming'),
    ('Form 4835 Rental Income and Expenses', 'Form 4835 Rental Income and Expenses')

)



class YearForm(forms.Form):

    def __init__(self, *args, **kwargs):

        super(YearForm, self).__init__(*args, **kwargs)

        tax_year = (datetime.datetime.now().year - 1)
        year_dropdown = []
        for y in range((tax_year - 5), tax_year + 1):
            year_dropdown.append((y, y))

        self.fields['year'] = forms.ChoiceField(widget=forms.Select, choices=year_dropdown, initial=tax_year, label="Begin by selecting the tax year of the Schedule F (Form 1040) you'll be utilizing:")

        self.helper = FormHelper(self)
        self.helper.form_tag = False

        self.helper.label_class = "col-lg-7"
        self.helper.field_class = "col-lg-2"
        self.helper.layout = Layout()

        self.helper.layout.append(Div(Field('form'),Field('year'), css_class="row"))



class ConfirmIncomeForm(forms.Form):
    def __init__(self, *args, **kwargs):
        self.option = kwargs.pop('gross_income', None)
        self.option2 = kwargs.pop('total_expenses', None)
        self.option3 = kwargs.pop('net_returns', None)
        super(ConfirmIncomeForm, self).__init__(*args, **kwargs)

        self.fields['gross_income'] = forms.IntegerField(label="Gross Income:",initial=self.option, localize=True)
        self.fields['gross_income'].widget.attrs['readonly'] = True

        self.fields['total_expenses'] = forms.IntegerField(label="Total Expenses:",initial=self.option2, localize=True)
        self.fields['total_expenses'].widget.attrs['readonly'] = True

        self.fields['net_returns'] = forms.IntegerField(label="Net Profit or Loss:",initial=self.option3, localize=True)
        self.fields['net_returns'].widget.attrs['readonly'] = True

        self.helper = FormHelper(self)
        self.helper.form_tag = False

        self.helper.label_class = "col-lg-4"
        self.helper.field_class = "col-lg-4"
        self.helper.layout = Layout()

        self.helper.layout.append(Div(Field(PrependedAppendedText('gross_income', "$", ".00")), css_class="row"))
        self.helper.layout.append(Div(Field(PrependedAppendedText('total_expenses', "$", ".00")), css_class="row"))
        self.helper.layout.append(Div(Field(PrependedAppendedText('net_returns', "$", ".00")), css_class="row"))



class ExpenseForm(forms.ModelForm):

    line_10 = forms.CharField(label="Line 10. Car and truck expenses",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_11 = forms.CharField(label="Line 11. Chemicals",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_12 = forms.CharField(label="Line 12. Conservation expenses",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_13 = forms.CharField(label="Line 13. Custom hire (machine work)",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_14 = forms.CharField(label="Line 14. Depreciation and section 179 expense",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_15 = forms.CharField(label="Line 15. Employee benefit programs other than on line 23",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_16 = forms.CharField(label="Line 16. Feed",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_17 = forms.CharField(label="Line 17. Fertilizers and lime",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_18 = forms.CharField(label="Line 18. Freight and trucking",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_19 = forms.CharField(label="Line 19. Gasoline, fuel and oil",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_20 = forms.CharField(label="Line 20. Insurance (other than health)",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_21_b = forms.CharField(label="Line 21b. Interest: Other",required=False)
    line_21_a = forms.CharField(label="Line 21a. Interest: Mortgage (paid to banks, etc.)",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_22 = forms.CharField(label="Line 22. Labor hired (less employment credits)",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_23 = forms.CharField(label="Line 23. Pension and profit-sharing plans",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_24_a = forms.CharField(label="Line 24a. Rent or lease: Vehicles, machinery, equipment",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_24_b = forms.CharField(label="Line 24b. Rent or lease: Other (land, animals, etc.)",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_25 = forms.CharField(label="Line 25. Repairs and maintenance",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_26 = forms.CharField(label="Line 26. Seeds and plants",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_27 = forms.CharField(label="Line 27. Storage and warehousing",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_28 = forms.CharField(label="Line 28. Supplies",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_29 = forms.CharField(label="Line 29. Taxes",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_30 = forms.CharField(label="Line 30. Utilities",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_31 = forms.CharField(label="Line 31. Veterinary, breeding, and medicine",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    total_expenses = forms.CharField(label="Total Expenses",required=True)


    def __init__(self, *args, **kwargs):
        other_expense = kwargs.pop("other_expense", {})

        super(ExpenseForm, self).__init__(*args, **kwargs)

        self.other_expense_1 = other_expense.get("other_1", "Other Expenses")
        self.other_expense_2 = other_expense.get("other_2", "Other Expenses")
        self.other_expense_3 = other_expense.get("other_3", "Other Expenses")
        self.other_expense_4 = other_expense.get("other_4", "Other Expenses")
        self.other_expense_5 = other_expense.get("other_5", "Other Expenses")
        self.other_expense_6 = other_expense.get("other_6", "Other Expenses")
        self.fields['other_expense_1'] = forms.CharField(label="Other 1",required=False)
        self.fields['other_expense_1'].widget = forms.HiddenInput()
        self.fields['other_expense_2'] = forms.CharField(label="Other 2",required=False)
        self.fields['other_expense_2'].widget = forms.HiddenInput()
        self.fields['other_expense_3'] = forms.CharField(label="Other 3",required=False)
        self.fields['other_expense_3'].widget = forms.HiddenInput()
        self.fields['other_expense_4'] = forms.CharField(label="Other 4",required=False)
        self.fields['other_expense_4'].widget = forms.HiddenInput()
        self.fields['other_expense_5'] = forms.CharField(label="Other 5",required=False)
        self.fields['other_expense_5'].widget = forms.HiddenInput()
        self.fields['other_expense_6'] = forms.CharField(label="Other 6",required=False)
        self.fields['other_expense_6'].widget = forms.HiddenInput()
        self.fields['line_32_a'] = forms.CharField(label=mark_safe('Line 32a. <a id="other1" title="Click to specify.">%s</a>'%self.other_expense_1),required=False)
        self.fields['line_32_b'] = forms.CharField(label=mark_safe('Line 32b. <a title="Click to specify." id="other2">%s</a>'%self.other_expense_2),required=False)
        self.fields['line_32_c'] = forms.CharField(label=mark_safe('Line 32c. <a title="Click to specify." id="other3">%s</a>'%self.other_expense_3),required=False)
        self.fields['line_32_d'] = forms.CharField(label=mark_safe('Line 32d. <a title="Click to specify." id="other4">%s</a>'%self.other_expense_4),required=False)
        self.fields['line_32_e'] = forms.CharField(label=mark_safe('Line 32e. <a title="Click to specify." id="other5">%s</a>'%self.other_expense_5),required=False)
        self.fields['line_32_f'] = forms.CharField(label=mark_safe('Line 32f. <a title="Click to specify." id="other6">%s</a>'%self.other_expense_6),required=False)


    def clean(self):

        cleaned_data = super(ExpenseForm, self).clean()

        if not cleaned_data["line_10"]:
            self.cleaned_data['line_10'] = 0

        if not cleaned_data["line_11"]:
            self.cleaned_data['line_11'] = 0

        if not cleaned_data["line_12"]:
            self.cleaned_data['line_12'] = 0

        if not cleaned_data["line_13"]:
            self.cleaned_data['line_13'] = 0

        if not cleaned_data["line_14"]:
            self.cleaned_data['line_14'] = 0

        if not cleaned_data["line_15"]:
            self.cleaned_data['line_15'] = 0

        if not cleaned_data["line_16"]:
            self.cleaned_data['line_16'] = 0

        if not cleaned_data["line_17"]:
            self.cleaned_data['line_17'] = 0

        if not cleaned_data["line_18"]:
            self.cleaned_data['line_18'] = 0

        if not cleaned_data["line_19"]:
            self.cleaned_data['line_19'] = 0

        if not cleaned_data["line_20"]:
            self.cleaned_data['line_20'] = 0

        if not cleaned_data["line_21_a"]:
            self.cleaned_data['line_21_a'] = 0

        if not cleaned_data["line_21_b"]:
            self.cleaned_data['line_21_b'] = 0

        if not cleaned_data["line_22"]:
            self.cleaned_data['line_22'] = 0

        if not cleaned_data["line_23"]:
            self.cleaned_data['line_23'] = 0

        if not cleaned_data["line_24_a"]:
            self.cleaned_data['line_24_a'] = 0

        if not cleaned_data["line_24_b"]:
            self.cleaned_data['line_24_b'] = 0

        if not cleaned_data["line_25"]:
            self.cleaned_data['line_25'] = 0

        if not cleaned_data["line_26"]:
            self.cleaned_data['line_26'] = 0

        if not cleaned_data["line_27"]:
            self.cleaned_data['line_27'] = 0

        if not cleaned_data["line_28"]:
            self.cleaned_data['line_28'] = 0

        if not cleaned_data["line_29"]:
            self.cleaned_data['line_29'] = 0

        if not cleaned_data["line_30"]:
            self.cleaned_data['line_30'] = 0

        if not cleaned_data["line_31"]:
            self.cleaned_data['line_31'] = 0

        if not cleaned_data["line_32_a"]:
            self.cleaned_data['line_32_a'] = 0

        if not cleaned_data["line_32_b"]:
            self.cleaned_data['line_32_b'] = 0

        if not cleaned_data["line_32_c"]:
            self.cleaned_data['line_32_c'] = 0

        if not cleaned_data["line_32_d"]:
            self.cleaned_data['line_32_d'] = 0

        if not cleaned_data["line_32_e"]:
            self.cleaned_data['line_32_e'] = 0

        if not cleaned_data["line_32_f"]:
            self.cleaned_data['line_32_f'] = 0


    class Meta:
        model = ScheduleF
        exclude = ('user','year','line_1_a', 'line_1_b', 'line_1_c', 'line_2', 'line_3_a', 'line_3_b', 'line_4_a', 'line_4_b','line_5_a', 'line_5_b', 'line_5_c', 'line_6_a', 'line_6_b', 'line_6_d',  'line_7', 'line_8', 'gross_income', 'net_profit','other_expense_1','other_expense_2','other_expense_3','other_expense_4','other_expense_5','other_expense_6')



class IncomeForm(forms.ModelForm):

    line_1_a = forms.CharField(label="Line 1a. Sales of livestock and other resale items:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_1_b = forms.CharField(label="Line 1b. Cost or other basis of livestock or other items:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_1_c = forms.CharField(label="Line 1c. Subtract line 1b from line 1a:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_2 = forms.CharField(label="Line 2. Sales of livestock, produce, grains and other products you raised:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_3_a = forms.CharField(label="Line 3a. Cooperative distributions (1099-PATR):",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_3_b = forms.CharField(label="Line 3b. Taxable amount:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_4_a = forms.CharField(label="Line 4a. Agricultural program payments:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_4_b = forms.CharField(label="Line 4b. Taxable amount:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_5_a = forms.CharField(label="Line 5a. Commodity Credit Corporation (CCC) loans reported under election:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_5_b = forms.CharField(label="Line 5b. CCC loans forfeited:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_5_c = forms.CharField(label="Line 5c. Taxable amount:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_6_a = forms.CharField(label="Line 6a. Crop insurance proceeds & federal crop disaster payments:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_6_b = forms.CharField(label="Line 6b. Taxable amount:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_6_d = forms.CharField(label="Line 6d. Amount deferred from previous tax year:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_7 = forms.CharField(label="Line 7. Custom hire (machine work) income:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    line_8 = forms.CharField(label="Line 8. Other income:",required=False, error_messages={'max_length': 'Enter whole number upto 999,999,999'})
    gross_income = forms.CharField(label="Gross Income:",required=True)


    def clean(self):

        cleaned_data = super(IncomeForm, self).clean()

        if not cleaned_data["line_1_a"]:
            self.cleaned_data['line_1_a'] = 0

        if not cleaned_data["line_1_b"]:
            self.cleaned_data['line_1_b'] = 0

        if not cleaned_data["line_1_c"]:
            self.cleaned_data['line_1_c'] = 0

        if not cleaned_data["line_2"]:
            self.cleaned_data['line_2'] = 0

        if not cleaned_data["line_3_a"]:
            self.cleaned_data['line_3_a'] = 0

        if not cleaned_data["line_3_b"]:
            self.cleaned_data['line_3_b'] = 0

        if not cleaned_data["line_4_a"]:
            self.cleaned_data['line_4_a'] = 0

        if not cleaned_data["line_4_b"]:
            self.cleaned_data['line_4_b'] = 0

        if not cleaned_data["line_5_a"]:
            self.cleaned_data['line_5_a'] = 0

        if not cleaned_data["line_5_b"]:
            self.cleaned_data['line_5_b'] = 0

        if not cleaned_data["line_5_c"]:
            self.cleaned_data['line_5_c'] = 0

        if not cleaned_data["line_6_a"]:
            self.cleaned_data['line_6_a'] = 0

        if not cleaned_data["line_6_b"]:
            self.cleaned_data['line_6_b'] = 0

        if not cleaned_data["line_6_d"]:
            self.cleaned_data['line_6_d'] = 0

        if not cleaned_data["line_7"]:
            self.cleaned_data['line_7'] = 0

        if not cleaned_data["line_8"]:
            self.cleaned_data['line_8'] = 0


    class Meta:
        model = ScheduleF
        fields = ['line_1_a', 'line_1_b','line_1_c', 'line_2', 'line_3_a', 'line_3_b', 'line_4_a', 'line_4_b','line_5_a', 'line_5_b', 'line_5_c', 'line_6_a', 'line_6_b', 'line_6_d','line_7', 'line_8', 'gross_income']
