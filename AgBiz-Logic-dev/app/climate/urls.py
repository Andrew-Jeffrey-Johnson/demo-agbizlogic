from climate.views import ClimateFactorViewSet, ClimateBudgetViewSet, ClimateScenarioViewSet, ClimateDataView, ClimateHomeView
from . import views
from rest_framework import routers
from django.urls import include, path, re_path

router = routers.DefaultRouter()

router.register(r'climate_scenarios', ClimateScenarioViewSet, base_name="climate_scenarios")
router.register(r'climate_budgets', ClimateBudgetViewSet, base_name="climate_budgets")
router.register(r'climate_factors', ClimateFactorViewSet, base_name="climate_factors")

urlpatterns = [
    path('api/', include(router.urls)),
    path('', ClimateHomeView.as_view(), name="climate_home"),
    #may need to be changed
    #url(r'climate_data/(?P<state>.+)/(?P<county>.+)/', ClimateDataView.as_view()),
    path('climate_data/<str:state>/<str:county>/', views.ClimateDataView.as_view()),
]
