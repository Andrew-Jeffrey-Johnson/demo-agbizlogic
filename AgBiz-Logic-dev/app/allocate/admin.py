from django.contrib import admin

from allocate.models import *

class CategoryOneAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ['name']

# Register your models here.
admin.site.register(BusinessData)
admin.site.register(EnterpriseData)


