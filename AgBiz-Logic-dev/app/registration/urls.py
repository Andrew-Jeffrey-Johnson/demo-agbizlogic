from rest_framework import routers

from django.conf.urls import include, url
from registration.views import *

# Django Rest Framework API router
router = routers.DefaultRouter()

router.register(r'schedule_f', ScheduleFViewSet, base_name='registration_schedule_f')
router.register(r'userbusinessdata',UserBusinessDataView, base_name='user_business_data')

urlpatterns = [
    url('api/', include(router.urls)),
]
