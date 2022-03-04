from django.shortcuts import HttpResponseRedirect, HttpResponse
from formtools.wizard.views import SessionWizardView
from schedule_f.forms import IncomeForm, ExpenseForm, ConfirmIncomeForm
from registration.models import ScheduleF
from django.contrib.auth.models import User
from registration.forms import InfoForm
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required
import json as simplejson

FORM1040_WIZARD = [("step2", IncomeForm),
                   ("step3", ExpenseForm),
                   ("step4", ConfirmIncomeForm)]

# Form1040 Wizard
TAX_TEMPLATES = {"step2": "tax/income.html",
                 "step3": "tax/expense.html",
                 "step4": "tax/confirm.html"}


class Form1040Wizard(SessionWizardView):

    def get_template_names(self):
        return [TAX_TEMPLATES[self.steps.current]]

    def get_context_data(self, form, **kwargs):

        context = super(Form1040Wizard, self).get_context_data(form=form, **kwargs)
        if self.steps.current == 'step4':
            other_expense = {
                'other_1': self.get_cleaned_data_for_step("step3")["other_expense_1"] if
                self.get_cleaned_data_for_step("step3")["other_expense_1"] else "Other Expenses 1",
                'other_2': self.get_cleaned_data_for_step("step3")["other_expense_2"] if
                self.get_cleaned_data_for_step("step3")["other_expense_2"] else "Other Expenses 2",
                'other_3': self.get_cleaned_data_for_step("step3")["other_expense_3"] if
                self.get_cleaned_data_for_step("step3")["other_expense_3"] else "Other Expenses 3",
                'other_4': self.get_cleaned_data_for_step("step3")["other_expense_4"] if
                self.get_cleaned_data_for_step("step3")["other_expense_4"] else "Other Expenses 4",
                'other_5': self.get_cleaned_data_for_step("step3")["other_expense_5"] if
                self.get_cleaned_data_for_step("step3")["other_expense_5"] else "Other Expenses 5 ",
                'other_6': self.get_cleaned_data_for_step("step3")["other_expense_6"] if
                self.get_cleaned_data_for_step("step3")["other_expense_6"] else "Other Expenses 6",
            }

            self.request.session['other_expense'] = other_expense

            income_line_item = self.get_cleaned_data_for_step("step2")
            expense_line_item = self.get_cleaned_data_for_step("step3")
            context.update({'income_line_item': income_line_item, 'expense_line_item': expense_line_item,
                            'other_expense': other_expense})

        return context

    def get_form_kwargs(self, step=None):
        kwargs = {}

        if step == 'step3':
            other_expense = self.request.session.get('other_expense', {})
            kwargs.update({'other_expense': other_expense})

        if step == 'step4':
            net_returns = 0

            income = self.storage.get_step_data("step2")['step2-gross_income']
            expenses = self.storage.get_step_data("step3")['step3-total_expenses']

            kwargs.update({'gross_income': income})
            kwargs.update({'total_expenses': expenses})

            income = income.replace(',', '')
            expenses = expenses.replace(',', '')
            net_returns = int(income) - int(expenses)

            kwargs.update({'net_returns': net_returns})

        return kwargs

    def get_next_step(self, step=None):
        return self.request.POST.get('wizard_next_step', super(Form1040Wizard, self).get_next_step(step))

    def done(self, form_list, **kargs):

        data = {}

        for form in form_list:
            data.update(form.cleaned_data)

        other_expense = self.request.session.get('other_expense', {})

        if ScheduleF.objects.filter(user=self.request.user):
            ScheduleF.objects.filter(user=self.request.user).update(

                line_1_a=data['line_1_a'] if data['line_1_a'] else 0,
                line_1_b=data['line_1_b'] if data['line_1_b'] else 0,
                line_1_c=data['line_1_c'] if data['line_1_c'] else 0,
                line_2=data['line_2'] if data['line_2'] else 0,
                line_3_a=data['line_3_a'] if data['line_3_a'] else 0,
                line_3_b=data['line_3_b'] if data['line_3_b'] else 0,
                line_4_a=data['line_4_a'] if data['line_4_a'] else 0,
                line_4_b=data['line_4_b'] if data['line_4_b'] else 0,
                line_5_a=data['line_5_a'] if data['line_5_a'] else 0,
                line_5_b=data['line_5_b'] if data['line_5_b'] else 0,
                line_5_c=data['line_5_c'] if data['line_5_c'] else 0,
                line_6_a=data['line_6_a'] if data['line_6_a'] else 0,
                line_6_b=data['line_6_b'] if data['line_6_b'] else 0,
                line_6_d=data['line_6_d'] if data['line_6_d'] else 0,
                line_7=data['line_7'] if data['line_7'] else 0,
                line_8=data['line_8'] if data['line_8'] else 0,
                gross_income=data['gross_income'] if data['gross_income'] else 0,
                line_10=data['line_10'] if data['line_10'] else 0,
                line_11=data['line_11'] if data['line_11'] else 0,
                line_12=data['line_12'] if data['line_12'] else 0,
                line_13=data['line_13'] if data['line_13'] else 0,
                line_14=data['line_14'] if data['line_14'] else 0,
                line_15=data['line_15'] if data['line_15'] else 0,
                line_16=data['line_16'] if data['line_16'] else 0,
                line_17=data['line_17'] if data['line_17'] else 0,
                line_18=data['line_18'] if data['line_18'] else 0,
                line_19=data['line_19'] if data['line_19'] else 0,
                line_20=data['line_20'] if data['line_20'] else 0,
                line_21_a=data['line_21_a'] if data['line_21_a'] else 0,
                line_21_b=data['line_21_b'] if data['line_21_b'] else 0,
                line_22=data['line_22'] if data['line_22'] else 0,
                line_23=data['line_23'] if data['line_23'] else 0,
                line_24_a=data['line_24_a'] if data['line_24_a'] else 0,
                line_24_b=data['line_24_a'] if data['line_24_b'] else 0,
                line_25=data['line_25'] if data['line_25'] else 0,
                line_26=data['line_26'] if data['line_26'] else 0,
                line_27=data['line_27'] if data['line_27'] else 0,
                line_28=data['line_28'] if data['line_28'] else 0,
                line_29=data['line_29'] if data['line_29'] else 0,
                line_30=data['line_30'] if data['line_30'] else 0,
                line_31=data['line_31'] if data['line_31'] else 0,
                line_32_a=data['line_32_a'] if data['line_32_a'] else 0,
                line_32_b=data['line_32_b'] if data['line_32_b'] else 0,
                line_32_c=data['line_32_c'] if data['line_32_c'] else 0,
                line_32_d=data['line_32_d'] if data['line_32_d'] else 0,
                line_32_e=data['line_32_e'] if data['line_32_e'] else 0,
                line_32_f=data['line_32_f'] if data['line_32_f'] else 0,
                other_expense_1=other_expense.get("other_1", "Other Expenses 1"),
                other_expense_2=other_expense.get("other_2", "Other Expenses 2"),
                other_expense_3=other_expense.get("other_3", "Other Expenses 3"),
                other_expense_4=other_expense.get("other_4", "Other Expenses 4"),
                other_expense_5=other_expense.get("other_5", "Other Expenses 5"),
                other_expense_6=other_expense.get("other_6", "Other Expenses 6"),
                total_expenses=data['total_expenses'] if data['total_expenses'] else 0,
                net_profit=data['net_returns']

            )
        else:
            tax = ScheduleF.objects.create(

                user=self.request.user,
                line_1_a=data['line_1_a'] if data['line_1_a'] else 0,
                line_1_b=data['line_1_b'] if data['line_1_b'] else 0,
                line_1_c=data['line_1_c'] if data['line_1_c'] else 0,
                line_2=data['line_2'] if data['line_2'] else 0,
                line_3_a=data['line_3_a'] if data['line_3_a'] else 0,
                line_3_b=data['line_3_b'] if data['line_3_b'] else 0,
                line_4_a=data['line_4_a'] if data['line_4_a'] else 0,
                line_4_b=data['line_4_b'] if data['line_4_b'] else 0,
                line_5_a=data['line_5_a'] if data['line_5_a'] else 0,
                line_5_b=data['line_5_b'] if data['line_5_b'] else 0,
                line_5_c=data['line_5_c'] if data['line_5_c'] else 0,
                line_6_a=data['line_6_a'] if data['line_6_a'] else 0,
                line_6_b=data['line_6_b'] if data['line_6_b'] else 0,
                line_6_d=data['line_6_d'] if data['line_6_d'] else 0,
                line_7=data['line_7'] if data['line_7'] else 0,
                line_8=data['line_8'] if data['line_8'] else 0,
                gross_income=data['gross_income'] if data['gross_income'] else 0,
                line_10=data['line_10'] if data['line_10'] else 0,
                line_11=data['line_11'] if data['line_11'] else 0,
                line_12=data['line_12'] if data['line_12'] else 0,
                line_13=data['line_13'] if data['line_13'] else 0,
                line_14=data['line_14'] if data['line_14'] else 0,
                line_15=data['line_15'] if data['line_15'] else 0,
                line_16=data['line_16'] if data['line_16'] else 0,
                line_17=data['line_17'] if data['line_17'] else 0,
                line_18=data['line_18'] if data['line_18'] else 0,
                line_19=data['line_19'] if data['line_19'] else 0,
                line_20=data['line_20'] if data['line_20'] else 0,
                line_21_a=data['line_21_a'] if data['line_21_a'] else 0,
                line_21_b=data['line_21_b'] if data['line_21_b'] else 0,
                line_22=data['line_22'] if data['line_22'] else 0,
                line_23=data['line_23'] if data['line_23'] else 0,
                line_24_a=data['line_24_a'] if data['line_24_a'] else 0,
                line_24_b=data['line_24_b'] if data['line_24_b'] else 0,
                line_25=data['line_25'] if data['line_25'] else 0,
                line_26=data['line_26'] if data['line_26'] else 0,
                line_27=data['line_27'] if data['line_27'] else 0,
                line_28=data['line_28'] if data['line_28'] else 0,
                line_29=data['line_29'] if data['line_29'] else 0,
                line_30=data['line_30'] if data['line_30'] else 0,
                line_31=data['line_31'] if data['line_31'] else 0,
                line_32_a=data['line_32_a'] if data['line_32_a'] else 0,
                line_32_b=data['line_32_b'] if data['line_32_b'] else 0,
                line_32_c=data['line_32_c'] if data['line_32_c'] else 0,
                line_32_d=data['line_32_d'] if data['line_32_d'] else 0,
                line_32_e=data['line_32_e'] if data['line_32_e'] else 0,
                line_32_f=data['line_32_f'] if data['line_32_f'] else 0,
                other_expense_1=other_expense.get("other_1", "Other Expenses 1"),
                other_expense_2=other_expense.get("other_2", "Other Expenses 2"),
                other_expense_3=other_expense.get("other_3", "Other Expenses 3"),
                other_expense_4=other_expense.get("other_4", "Other Expenses 4"),
                other_expense_5=other_expense.get("other_5", "Other Expenses 5"),
                other_expense_6=other_expense.get("other_6", "Other Expenses 6"),
                total_expenses=data['total_expenses'] if data['total_expenses'] else 0,
                net_profit=data['net_returns']

            )

            tax.save()

        return HttpResponseRedirect('/dashboard/')


tax_wizard_view = Form1040Wizard.as_view(FORM1040_WIZARD)


@login_required
def wrapped_tax_wizard_view(request):
    return tax_wizard_view(request)
