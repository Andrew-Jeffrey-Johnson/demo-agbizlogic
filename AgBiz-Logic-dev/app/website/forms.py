from django import forms

BUDGET = (

    ('A','Enter information from your Schedule F (Form 1040)'),
    ('B', 'Import data from your accounting system or spreadsheet'),
    ('C', 'Select an exisiting university enterprise budget (coming soon)'),


)

#transfer your business data
class AcquireIncomeForm(forms.Form):
     choice = forms.ChoiceField(widget=forms.RadioSelect,label="We provide three methods for collecting your business data. Select one from the list below, and proceed through the steps provided.",choices = BUDGET)