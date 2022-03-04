from budget.views import *
from rest_framework import routers
from django.conf.urls import include, url


router = routers.DefaultRouter()

router.register(r'budgets', BudgetViewSet, base_name="budgets")
router.register(r'variable_cost_items', VariableCostItemViewSet)
router.register(r'fixed_cost_items', FixedCostItemViewSet)
router.register(r'general_cost_items', GeneralCostItemViewSet)
router.register(r'income_items', IncomeItemViewSet)


urlpatterns = [
    url('api/', include(router.urls)),

    url('$', BudgetHomeView.as_view(), name='budget_home'),
]
