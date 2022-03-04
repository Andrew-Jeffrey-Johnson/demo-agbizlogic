from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from climate.views import ClimateFactorViewSet
from django.contrib.auth.models import User
from climate.models import ClimateFactor, ClimateBudget, ClimateScenario
from climate.views import ClimateDataView
from budget.models import Budget
import requests
import os
import shutil
from netCDF4 import Dataset
import numpy as np
import math
from datetime import date, timedelta
from rest_framework.test import APIClient
import json

class ClimateDataAPITestCase(APITestCase):
    """ Test suite for the ClimateData model REST API.
    """


# Outlines for creating test objects
USER_OUTLINE = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}
