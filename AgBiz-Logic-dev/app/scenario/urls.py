from rest_framework import routers
from django.conf.urls import include, url
from scenario.views import (ScenarioHomeView, ScenarioViewSet, PlanViewSet, PlanBudgetViewSet, IncomeItemInflationRateViewSet,
                            CostItemInflationRateViewSet, IncomeStatementViewSet, OperatingLoanViewSet, CapitalPurchaseViewSet, CapitalLeaseViewSet,
                            CashFromAssetLoanViewSet, CapitalSalesViewSet, CurrentLoansViewSet, FinanceAnalysisViewSet,CashFromAssetLoanViewSet,
                            BalanceSheetViewSet,FutureLoansViewSet,FutureCapitalLeaseViewSet,DistributionsViewSet,FutureLoansViewSet,InflationViewSet,DepreciationsViewSet,
                            CashFlowItemViewSet,NewTransactionViewSet,AccrualAdjustmentsViewset,CashflowPdfOutputItemViewSet,CashflowPdfOutputViewSet,BalanceSheetOutputItemViewSet,
                            BalanceSheetOutputViewSet,IncomeStatementOutputItemViewSet,IncomeStatementOutputViewSet,FinanceRatiosOutputViewSet)

router = routers.DefaultRouter()

router.register(r'scenarios', ScenarioViewSet, base_name="scenarios")
router.register(r'plans', PlanViewSet, base_name="plans")
router.register(r'plan_budgets', PlanBudgetViewSet, base_name="plan_budgets")
router.register(r'income_item_inflation_rates', IncomeItemInflationRateViewSet, base_name="income_item_inflation_rates")
router.register(r'cost_item_inflation_rates', CostItemInflationRateViewSet, base_name="cost_item_inflation_rates")
router.register(r'income_statement',IncomeStatementViewSet, base_name="income_statement")
router.register(r'operating_loans', OperatingLoanViewSet, base_name="operating_loans")
router.register(r'capital_purchases', CapitalPurchaseViewSet, base_name="capital_purchases")
router.register(r'capital_sales', CapitalSalesViewSet, base_name="capital_sales")
router.register(r'capital_leases', CapitalLeaseViewSet, base_name="capital_leases")
router.register(r'cash_from_asset_loans', CashFromAssetLoanViewSet, base_name="cash_from_asset_loans")
router.register(r'current_loans', CurrentLoansViewSet, base_name="current_loans")
router.register(r'finance_analysis', FinanceAnalysisViewSet, base_name="finance_analysis")
router.register(r'balance_sheets', BalanceSheetViewSet, base_name="balance_sheets")
router.register(r'distributions',DistributionsViewSet, base_name="distributions")
router.register(r'future_loans',FutureLoansViewSet, base_name="future_loans")
router.register(r'inflation',InflationViewSet, base_name="inflation")
router.register(r'future_capital_leases',FutureCapitalLeaseViewSet, base_name="future_capital_leases")
router.register(r'depreciations',DepreciationsViewSet, base_name="depreciations")
router.register(r'cashflowitem',CashFlowItemViewSet, base_name="cashflowitem")
router.register(r'new_transaction',NewTransactionViewSet, base_name="new_transaction")
router.register(r'accrual_adjustments',AccrualAdjustmentsViewset, base_name="accrual_adjustments")
router.register(r'pdf_item',CashflowPdfOutputItemViewSet, base_name="pdf_item")
router.register(r'cash_flow_pdf',CashflowPdfOutputViewSet, base_name="cash_flow_pdf")
router.register(r'balance_sheet_output',BalanceSheetOutputViewSet, base_name="balance_sheet_output")
router.register(r'balance_sheet_output_items',BalanceSheetOutputItemViewSet, base_name="balance_sheet_output_items")
router.register(r'income_statement_output',IncomeStatementOutputViewSet, base_name="income_statement_output")
router.register(r'income_statement_output_items',IncomeStatementOutputItemViewSet, base_name="income_statement_output_items")
router.register(r'finance_ratios_output',FinanceRatiosOutputViewSet, base_name="finance_ratios_output")

urlpatterns = [
    url('api/', include(router.urls)),
    url('$', ScenarioHomeView.as_view(), name="scenario_home"),
]
