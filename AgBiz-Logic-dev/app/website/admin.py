from django.contrib import admin

from website.models import *

class CategoryOneAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ['name']

# Register your models here.
