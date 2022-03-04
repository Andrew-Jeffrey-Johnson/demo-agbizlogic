from django.contrib import admin
from climate.models import *

admin.site.register(ClimateScenario)
admin.site.register(ClimateBudget)
admin.site.register(ClimateFactor)