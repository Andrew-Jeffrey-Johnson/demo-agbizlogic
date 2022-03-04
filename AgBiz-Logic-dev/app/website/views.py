from django.shortcuts import render, redirect
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required
from website.forms import AcquireIncomeForm
from django.template.context import RequestContext


@login_required
def choose_income(request):
    context = RequestContext(request)
    info = request.session.get('info', False)

    if request.method == 'POST':
        form = AcquireIncomeForm(request.POST)
        if form.is_valid() and form.cleaned_data['choice'] == "A":
            return redirect('/form1040/')
        elif form.is_valid() and form.cleaned_data['choice'] == "B":
            return redirect('/upload/')
        elif form.is_valid() and form.cleaned_data['choice'] == "C":
            return redirect('/budget/#/budget-manager?view-university-budgets=true')
        else:
            print (form.errors)

    else:
        form = AcquireIncomeForm()

    return render(request, 'income.html', {'form': form, 'info': info})
