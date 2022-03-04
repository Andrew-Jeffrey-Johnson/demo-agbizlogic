from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Field, ButtonHolder, Button, Fieldset, HTML, Div
from django.utils.safestring import mark_safe
import os
import csv


class CSVForm(forms.Form):

        file = forms.FileField(label="Please select a .csv, .xls or .xlsx file under 2.5MB:", required=True)

        # def clean(self):

        #     error = {}
        #     cleaned_data = super(CSVForm, self).clean()

        #     uploaded_file = self.cleaned_data.get('file', False)


        #     if uploaded_file:
        #         file_type = str(uploaded_file).split('.')[-1]


        #         if file_type not in ['xls', 'csv']:

        #             error["file"] = mark_safe("File is not in an acceptable format. Please upload a valid .csv, .xls or .xlsx file. See valid formats (Transaction Sheet, Profit and Loss, Vendor Report).")

        #         elif uploaded_file._size > 2*1024*1024:

        #             error["file"] = mark_safe("Sorry, file too large ( > 2.5 MB)")



        #     if len(error):
        #         raise forms.ValidationError(error)


        #     return cleaned_data
