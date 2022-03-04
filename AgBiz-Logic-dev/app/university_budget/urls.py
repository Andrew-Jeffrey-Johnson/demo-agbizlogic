from university_budget.views import *
from rest_framework import routers
from django.conf.urls import include, url

# Django Rest Framework API router
router = routers.DefaultRouter()

router.register(r'university_budgets', UniversityBudgetViewSet, base_name="university_budgets")
router.register(r'university_variable_cost_items', UniversityVariableCostItemViewSet)
router.register(r'university_fixed_cost_items', UniversityFixedCostItemViewSet)
router.register(r'university_general_cost_items', UniversityGeneralCostItemViewSet)
router.register(r'university_income_items', UniversityIncomeItemViewSet)



urlpatterns = [
    url('api/', include(router.urls)),
]
