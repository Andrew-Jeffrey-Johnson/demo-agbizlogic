from django.urls import include, path
from dashboard.views import DashboardHomeView, DashboardView


urlpatterns = [
    path('', DashboardHomeView.as_view(), name="dashboard"),
    path('api/dashboards/', DashboardView.as_view(), name="retrieve_dashboard")
]
