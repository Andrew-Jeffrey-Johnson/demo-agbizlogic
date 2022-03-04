from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Field, ButtonHolder, Button, Fieldset, HTML, Div
from django.utils.safestring import mark_safe
import os
import csv


class CSVForm(forms.Form):

        file = forms.FileField(label="Please select a .csv, .xls or .xlsx file under 2.5MB:", required=True)

        
