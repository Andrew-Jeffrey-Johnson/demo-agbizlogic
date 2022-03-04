from common.views import *
from rest_framework import routers
from django.conf.urls import include, url


router = routers.DefaultRouter()

router.register(r'users', UserViewSet, base_name="users")


urlpatterns = [
    url('api/', include(router.urls)),
    url('api/next_step/', NextStepView.as_view(), name="next_step"),
    url('api/current_user/', CurrentUserView.as_view(), name="current_user"),
    url('api/contact_us/', ContactUsView.as_view(), name="contact_us"),
]
