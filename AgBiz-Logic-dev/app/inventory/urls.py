from inventory.views import InventoryHomeView
from rest_framework import routers
from django.conf.urls import include, url


urlpatterns = [
    url('$', InventoryHomeView.as_view(), name='inventory_home'),
]
