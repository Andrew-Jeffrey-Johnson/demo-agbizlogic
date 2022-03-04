from django.contrib import admin
from budget.models import *

admin.site.register(Budget)
admin.site.register(CostItem)
admin.site.register(IncomeItem)


