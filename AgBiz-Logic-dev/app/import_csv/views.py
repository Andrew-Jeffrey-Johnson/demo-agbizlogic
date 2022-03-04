from AgBiz_Logic.settings import *
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, render_to_response, HttpResponse
from django.template.context import RequestContext
from django.utils.safestring import mark_safe
from email import header
from formtools.wizard.views import SessionWizardView
from import_csv.forms import CSVForm
from import_csv.models import Parser, Categorizer
from registration.forms import InfoForm
from registration.models import ScheduleF
import csv
import json as simplejson
import numpy as np
import os
import pandas as pd
import re
import xlrd


CSV_TEMPLATES = {"step1": "upload/step1.html", 
                 "step2": "upload/step2.html", 
                 "step3": "upload/confirm.html"}

IMPORT_CSV = [("step1", CSVForm), 
              ("step2", InfoForm), 
              ("step3", InfoForm)]

def get_user_draggable(request):
    print("Get user draggable")
    if request.method == "POST" and request.is_ajax:

        cost = simplejson.loads(request.POST['cost'])
        cost_with_label = {}


        if ScheduleF.objects.filter(user=request.user):
            ScheduleF.objects.filter(user=request.user).update(

                    year = 2014,
                    line_1_a = 0,
                    line_1_b = int(float(simplejson.loads(cost['expense-panel-1-total']))),
                    line_1_c = int(float(simplejson.loads(cost['income-panel-1-total']))),
                    line_2 = 0,
                    line_3_a = int(float(simplejson.loads(cost['income-panel-2-total']))),
                    line_3_b = 0,
                    line_4_a = int(float(simplejson.loads(cost['income-panel-3-total']))),
                    line_4_b = 0,
                    line_5_a = int(float(simplejson.loads(cost['income-panel-4-total']))),
                    line_5_b = 0,
                    line_5_c = 0,
                    line_6_a = int(float(simplejson.loads(cost['income-panel-5-total']))),
                    line_6_b = 0,
                    line_6_d = 0,
                    line_7 = int(float(simplejson.loads(cost['income-panel-6-total']))),
                    line_8 = int(float(simplejson.loads(cost['income-panel-7-total']))),
                    gross_income = 0,
                    line_10 = int(float(simplejson.loads(cost['expense-panel-2-total']))),
                    line_11 = int(float(simplejson.loads(cost['expense-panel-3-total']))),
                    line_12 = int(float(simplejson.loads(cost['expense-panel-4-total']))),
                    line_13 = int(float(simplejson.loads(cost['expense-panel-5-total']))),
                    line_14 = int(float(simplejson.loads(cost['expense-panel-6-total']))),
                    line_15 = int(float(simplejson.loads(cost['expense-panel-7-total']))),
                    line_16 = int(float(simplejson.loads(cost['expense-panel-8-total']))),
                    line_17 = int(float(simplejson.loads(cost['expense-panel-9-total']))),
                    line_18 = int(float(simplejson.loads(cost['expense-panel-10-total']))),
                    line_19 = int(float(simplejson.loads(cost['expense-panel-11-total']))),
                    line_20 = int(float(simplejson.loads(cost['expense-panel-12-total']))),
                    line_21_a = int(float(simplejson.loads(cost['expense-panel-13-total']))),
                    line_21_b = 0,
                    line_22 = int(float(simplejson.loads(cost['expense-panel-14-total']))),
                    line_23 = int(float(simplejson.loads(cost['expense-panel-15-total']))),
                    line_24_a = int(float(simplejson.loads(cost['expense-panel-16-total']))),
                    line_24_b = int(float(simplejson.loads(cost['expense-panel-17-total']))),
                    line_25 = int(float(simplejson.loads(cost['expense-panel-18-total']))),
                    line_26 = int(float(simplejson.loads(cost['expense-panel-19-total']))),
                    line_27 = int(float(simplejson.loads(cost['expense-panel-20-total']))),
                    line_28 = int(float(simplejson.loads(cost['expense-panel-21-total']))),
                    line_29 = int(float(simplejson.loads(cost['expense-panel-22-total']))),
                    line_30 = int(float(simplejson.loads(cost['expense-panel-23-total']))),
                    line_31 = int(float(simplejson.loads(cost['expense-panel-24-total']))),
                    line_32_a = 0,
                    line_32_b = 0,
                    line_32_c = 0,
                    line_32_d = 0,
                    line_32_e = 0,
                    line_32_f = int(float(simplejson.loads(cost['expense-panel-25-total']))),
                    other_expense_1 = "Other Expenses",
                    other_expense_2 = "Other Expenses",
                    other_expense_3 = "Other Expenses",
                    other_expense_4 = "Other Expenses",
                    other_expense_5 = "Other Expenses",
                    other_expense_6 = "Other Expenses",
                    total_expenses = 0,
                    net_profit = 0

            )
        else:
            tax = ScheduleF.objects.create(
                    user = request.user,
                    year = 2014,
                    line_1_a = 0,
                    line_1_b = int(float(simplejson.loads(cost['expense-panel-1-total']))),
                    line_1_c = int(float(simplejson.loads(cost['income-panel-1-total']))),
                    line_2 = 0,
                    line_3_a = int(float(simplejson.loads(cost['income-panel-2-total']))),
                    line_3_b = 0,
                    line_4_a = int(float(simplejson.loads(cost['income-panel-3-total']))),
                    line_4_b = 0,
                    line_5_a = int(float(simplejson.loads(cost['income-panel-4-total']))),
                    line_5_b = 0,
                    line_5_c = 0,
                    line_6_a = int(float(simplejson.loads(cost['income-panel-5-total']))),
                    line_6_b = 0,
                    line_6_d = 0,
                    line_7 = int(float(simplejson.loads(cost['income-panel-6-total']))),
                    line_8 = int(float(simplejson.loads(cost['income-panel-7-total']))),
                    gross_income = 0,
                    line_10 = int(float(simplejson.loads(cost['expense-panel-2-total']))),
                    line_11 = int(float(simplejson.loads(cost['expense-panel-3-total']))),
                    line_12 = int(float(simplejson.loads(cost['expense-panel-4-total']))),
                    line_13 = int(float(simplejson.loads(cost['expense-panel-5-total']))),
                    line_14 = int(float(simplejson.loads(cost['expense-panel-6-total']))),
                    line_15 = int(float(simplejson.loads(cost['expense-panel-7-total']))),
                    line_16 = int(float(simplejson.loads(cost['expense-panel-8-total']))),
                    line_17 = int(float(simplejson.loads(cost['expense-panel-9-total']))),
                    line_18 = int(float(simplejson.loads(cost['expense-panel-10-total']))),
                    line_19 = int(float(simplejson.loads(cost['expense-panel-11-total']))),
                    line_20 = int(float(simplejson.loads(cost['expense-panel-12-total']))),
                    line_21_a = int(float(simplejson.loads(cost['expense-panel-13-total']))),
                    line_21_b = 0,
                    line_22 = int(float(simplejson.loads(cost['expense-panel-14-total']))),
                    line_23 = int(float(simplejson.loads(cost['expense-panel-15-total']))),
                    line_24_a = int(float(simplejson.loads(cost['expense-panel-16-total']))),
                    line_24_b = int(float(simplejson.loads(cost['expense-panel-17-total']))),
                    line_25 = int(float(simplejson.loads(cost['expense-panel-18-total']))),
                    line_26 = int(float(simplejson.loads(cost['expense-panel-19-total']))),
                    line_27 = int(float(simplejson.loads(cost['expense-panel-20-total']))),
                    line_28 = int(float(simplejson.loads(cost['expense-panel-21-total']))),
                    line_29 = int(float(simplejson.loads(cost['expense-panel-22-total']))),
                    line_30 = int(float(simplejson.loads(cost['expense-panel-23-total']))),
                    line_31 = int(float(simplejson.loads(cost['expense-panel-24-total']))),
                    line_32_a = 0,
                    line_32_b = 0,
                    line_32_c = 0,
                    line_32_d = 0,
                    line_32_e = 0,
                    line_32_f = int(float(simplejson.loads(cost['expense-panel-25-total']))),
                    other_expense_1 = "Other Expenses",
                    other_expense_2 = "Other Expenses",
                    other_expense_3 = "Other Expenses",
                    other_expense_4 = "Other Expenses",
                    other_expense_5 = "Other Expenses",
                    other_expense_6 = "Other Expenses",
                    total_expenses = 0,
                    net_profit = 0

            )
            tax.save()

        success = True
        response = simplejson.dumps(success)
        return HttpResponse(response,content_type='application/json')
    else:
        return HttpResponse()


class FileUploadWizard(SessionWizardView):
    #print("fileuploadinitializing")
    file_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, ''))

    def get_template_names(self):
        return [CSV_TEMPLATES[self.steps.current]]

    def get_context_data(self, form, **kwargs):

        context = super(FileUploadWizard, self).get_context_data(form=form, **kwargs)
        #print(type(context))
        #print(context)
        #print(self.steps.current)
        
        if self.steps.current == "step1":
            print("step1")
            BASE_DIR = os.path.dirname(os.path.dirname(__file__))

            context.update({'file_link':'static/download/expenses.xls'})

        if self.steps.current == "step2":
            #print("step2")
            fname = self.get_cleaned_data_for_step("step1")['file']
            #print(fname)
            #print(context)

            file_extension = str(fname).split('.')[-1]
            p = Parser(fname, "Category")
            p.run()
            print("Set")
            context.update({'excel_data':p})
            #print("Type of p:",type(p))

            #p.print_cat_dict()

           
                #context.update({'excel_data':csv_data})

        print(context)
        return context


    def get_next_step(self, step=None):
        return self.request.POST.get('wizard_next_step', super(FileUploadWizard, self).get_next_step(step))

    def done(self, form_list, **kargs):

        data = {}
        print("Hello",RequestContext(self.request))
        return render_to_response('upload/done.html', self.request,context_instance=RequestContext(self.request))

csv_wizard_view = FileUploadWizard.as_view(IMPORT_CSV)

@login_required
def wrapped_csv_wizard_view(request):
    #print("Here")
    return csv_wizard_view(request)
