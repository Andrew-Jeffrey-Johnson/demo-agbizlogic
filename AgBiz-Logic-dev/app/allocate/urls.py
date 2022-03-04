from rest_framework import routers
from django.conf.urls import include, url
from allocate.views import AllocateHomeView, BusinessDataViewSet, EnterpriseDataViewSet, ConvertToGoldStandardView, ScheduleFViewSet

router = routers.DefaultRouter()
router.register(r'businessdata', BusinessDataViewSet, base_name='businessdata')
router.register(r'enterprisedata', EnterpriseDataViewSet, base_name='enterprisedata')
router.register(r'schedule_f', ScheduleFViewSet, base_name='allocate_schedule_f')


urlpatterns = [
    url('api/', include(router.urls)),
    url('api/convert/', ConvertToGoldStandardView.as_view(), name="convert"),
    url('$', AllocateHomeView.as_view(), name="allocate_home"),
]
