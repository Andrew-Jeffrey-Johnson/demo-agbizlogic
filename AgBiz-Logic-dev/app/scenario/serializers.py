from rest_framework import serializers
from django.contrib.auth.models import User
from scenario.models import *
from budget.serializers import BudgetSerializer
from common.serializers import DynamicFieldsModelSerializer


class BalanceSheetSerializer(serializers.ModelSerializer):
    """ Serializer for BalanceSheet model
    """

    class Meta:
        model = BalanceSheet
        fields = (
            'id',
            'year',
            'user',
            'scenario',
            # current Assets
            'cash_and_checking',
            'prepaid_expenses',
            'marketable_livestock',
            'investment',
            'account_receivable',
            'other_assets',
            'stored_crops_and_feed',
            'purchased_feed',
            'supplies',

            # Intermediate Assets
            'breeding_livestock',
            'vehicles',
            'machinery_equipment',
            'book_value',
            'investment_in_capital_leases',
            'contracts_and_notes_receivable',
            'investing_in_cooperatives',
            'other_intermediate',
            # Long Term Assets
            'real_estate_land',
            'other_longterm_assets',
            'other_noncurrent_assets',

            # Liabilities
            'accounts_payable',
            'accounts_payable',
            'accrued_interest',
            'employee_payroll_withholding',
            'income_taxes',
            'deferred_taxes',
            'other_accured_expenses',
            'other_liabilites',
            'valorem_taxes',
            # 'total_current_assets',
            'total_current_assets',
            'total_current_liabilites',
            'total_current_equity',
        )

class DepreciationsSerializer(serializers.ModelSerializer):
    """ Serializer for Depreciations model
    """
    class Meta:
        model= Depreciations
        fields = (
            'id',

            'year',
            'scenario',
            'depreciation',
            'depreciation_allocated_to_intermediate_assets',
            'capital_expenditures',
            'capital_expenditures_to_intermediate_assets',
            'replacement_costs',
            'replacement_costs_for_intermediate_assets'
        )

class AccrualAdjustmentsSerializer(serializers.ModelSerializer):
    """ Serializer for AccrualAdjustments model
    """
    class Meta:
        model= AccrualAdjustments
        fields = (
            'id',
            'user',
            'scenario',
            'year',
            'prepaid_expenses',
            'account_receivable',
            'accounts_payable',
            'breeding_livestock',
            'contracts_and_notes_receivable',
            'deferred_taxes',
            'employee_payroll_withholding',
            'income_taxes',
            'investment',
            'investment_in_capital_leases',
            'marketable_livestock',
            'other_accured_expenses',
            'other_assets',
            'other_current_liabilites',
            'purchased_feed',
            'real_estate_land',
            'supplies',
            'stored_crops_and_feed',
            #'notes_receivable',
            # 'investing_in_cooperatives',
            'valorem_taxes',
            # 'depreciation_expense',
            "market_value_of_all_intermediate_assets" ,
            "book_value_of_all_intermediate_and_long_term_assets",
            "investments_in_cooperatives" ,
            "other_intermediate_assets",
            "other_long_term_assets"
        )

class CashFlowItemSerializer (serializers.ModelSerializer):
        class Meta:
            model= CashFlowItem
            fields = (
                'id',
                'scenario',
                'year',
                'type',
                'name',
                'total',
            )



class IncomeStatementSerializer(serializers.ModelSerializer):
    """ Serializer for IncomeStatement model
    """

    class Meta:
        model = IncomeStatement
        fields = (
            'id',
            'scenario',
            'year',
            'farm_ranch_gross_income',
            'farm_ranch_costs',
            'annual_net_income',
            'accumulated_net_income',
        )

class CashFlowIncomeItemSerializer(serializers.ModelSerializer):
    """ Serializer for IncomeStatement model
    """

    class Meta:
        model = CashFlowIncomeItem
        fields = (
            'id',
            'cash_flow',
            'name',
            'total',
        )

class CashFlowCostItemSerializer(serializers.ModelSerializer):
    """ Serializer for IncomeStatement model
    """

    class Meta:
        model = CashFlowCostItem
        fields = (
            'id',
            'cash_flow',
            'name',
            'total',
        )

class CashFlowSerializer(serializers.ModelSerializer):
    """ Serializer for CashFlow model
    """

    class Meta:
        model = CashFlow
        fields = (
            'id',
            'scenario',
            'year',
            'total_value',
        )

class NewTransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = NewTransaction
        fields = '__all__'





class OperatingLoanSerializer(serializers.ModelSerializer):
    """ Serializer for OperatingLoan model
    """

    class Meta:
        model = OperatingLoan
        fields = (
            'id',
            "scenario",
            "select_year",
            "financed_through",
            "loan_amount",
            "interest_rate",
            "number_month",
        )


class CapitalPurchaseSerializer(serializers.ModelSerializer):
    """ Serializer for CapitalPurchase model
    """

    class Meta:
        model = CapitalPurchase
        fields = (
            'id',
            'scenario',
            'financed_from',
            'financed_through',
            'select_beginning_year',
            'purchase_price',
            'trade_in_value',
            'down_payment',
            'percent_financed',
            'interest_rate',
            'years_of_loan',
            'years_of_interest',
            'asset_class',
            'annual_payment',
        )

class DistributionsSerializer (serializers.ModelSerializer):
    """ Serializer for Distributions model
    """
    class Meta:
        model = Distributions
        fields = (
            'id',
            'scenario',

            'year',
            'wages',
            'salaries',
            'family_withdrawls',
            'contributions',
            'capital_gains',
            'tax_rate',
            'inflated_wages',
            'inflated_salaries',
            'inflated_family_withdrawls',
            'inflated_contributions'

        )





class CapitalSalesSerializer(serializers.ModelSerializer):
    """ Serializer for CapitalSales model
    """

    class Meta:
        model = CapitalSales
        fields = (
            'id',
            'scenario',
            'sold_through',
            'select_year',
            'sale_price',
            'asset_class',
        )


class CapitalLeaseSerializer(serializers.ModelSerializer):
    """ Serializer for CapitalLease model
    """

    class Meta:
        model = CapitalLease
        fields = (
            'id',
            'user',
            'financed_through',
            'annual_payment',
            'years_before_leases_expired',
            'asset_class',
        )

class FutureCapitalLeaseSerializer(serializers.ModelSerializer):
    """ Serializer for FutureCapitalLease model
    """

    class Meta:
        model = FutureCapitalLease
        fields = (
            'id',
            'scenario',
            'financed_through',
            'select_year',
            'down_payment',
            'annual_payment',
            'year_of_lease',
            'asset_class',

        )


class CashFromAssetLoanSerializer(serializers.ModelSerializer):
    """ Serializer for CashFromAssetLoan model
    """

    class Meta:
        model = CashFromAssetLoan
        fields = (
            'id',
            'scenario',
            'financed_through',
            'select_year',
            'loan_amount',
            'interest_rate',
            'years_of_loan',
            'annual_payment',

        )


class CurrentLoansSerializer(serializers.ModelSerializer):
    """ Serializer for the Current Loans
    """

    class Meta:
        model = CurrentLoans
        fields = (
            'id',
            'user',
            'transaction_description',
            'loan_amount',
            'interest_rate',
            'years_of_loan',
            'years_before_loan_matures',
            'asset_type',
        )
class FutureLoansSerializer(serializers.ModelSerializer):
    """ Serializer for the Future Current Loans
    """

    class Meta:
        model = FutureLoans
        fields = (
            'id',
            'scenario',
            'transaction_description',
            'loan_amount',
            'interest_rate',
            'years_of_loan',
            'years_before_loan_matures',
            'asset_type',
        )

class InflationSerializer(serializers.ModelSerializer):
    """ Serializer for the Finance Inflation
    """

    class Meta:
        model = Inflation
        fields = (
            'id',
            'scenario',
            'wages_inflation',
            'bonuses_inflation',
            'salaries_inflation',
            'family_withdrawls_inflation',
            'contributions_inflation',
            'operating_loans_inflation',
            'current_assets_and_liabilities_inflation',
            'intermediate_assets_inflation',
            'value_of_facilities_and_other_improvements_inflation',
            'value_of_real_estate',
            'value_of_capital_expenditures',
        )


class IncomeItemInflationRateSerializer(serializers.ModelSerializer):
    """ Serializer for the IncomeItemInflationRate model.
    """

    class Meta:
        model = IncomeItemInflationRate
        fields = (
            'id',
            'plan_budget',
            'income_item',
            'name',
            'inflation_rate',
            'compound_inflation_rate',
        )


class CostItemInflationRateSerializer(serializers.ModelSerializer):
    """ Serializer for the CostItemInflationRate model.
    """

    class Meta:
        model = CostItemInflationRate
        fields = (
            'id',
            'plan_budget',
            'cost_item',
            'name',
            'inflation_rate',
            'compound_inflation_rate',
        )


class PlanBudgetSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    """ Serializer for PlanBudget model.
    """

    income_item_inflation_rates = IncomeItemInflationRateSerializer(many=True, required=False, read_only=True)
    cost_item_inflation_rates = CostItemInflationRateSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = PlanBudget
        fields = (
            'id',
            'plan',
            'budget',

            'title',
            'position',

            'space_units',
            'total_space_available',
            'total_space_used',

            'income_items_with_inflation',
            'cost_items_with_inflation',

            'return_total_with_inflation',
            'cost_total_with_inflation',
            'net_returns_with_inflation',
            'present_value',

            'time_unit',
            'time_value',
            'time_period_position',

            'farm_unit',
            'farm_unit_quantity',

            'income_item_inflation_rates',
            'cost_item_inflation_rates',

            'notes',
        )


class PlanSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    """ Serializer for Plan model.
    """

    plan_budgets = PlanBudgetSerializer(many=True, required=False, read_only=True)

    operating_loans = OperatingLoanSerializer(many=True, required=False, read_only=True)
    capital_purchases = CapitalPurchaseSerializer(many=True, required=False, read_only=True)
    capital_sales = CapitalSalesSerializer(many=True, required=False, read_only=True)
    capital_leases = CapitalLeaseSerializer(many=True, required=False, read_only=True)
    cash_from_asset_loans = CashFromAssetLoanSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Plan
        fields = (
            'id',
            'scenario',
            'plan_budgets',

            'title',
            'notes',

            'time_period_unit',
            'time_period_value',

            'discount_rate',
            'use_investment_values',
            'internal_rate_of_return',
            'beginning_investment',
            'ending_investment',
            'use_investment_values',
            'net_present_value',
            'equivalent_annual_annuity',
            'net_returns_with_inflation',
            'cash_flow_breakeven',
            'cash_flow_total_breakeven',
            'net_returns_over_time',
            'module',
            'created_date',
            'modified_date',

            'lease_type',
            'land_market_value',
            'annual_land_rate',
            'required_roi',
            'investment_inflation',

            'operating_loans',
            'capital_purchases',
            'capital_sales',
            'capital_leases',
            'cash_from_asset_loans',
            'scenario_list',
            'full_title',
        )


class ScenarioSerializer(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    """ Serializer for Scenario model.
    """

    #plans = PlanSerializer(many=True, required=False, read_only=True)
    #cash_flow= CashFlowSerializer(many=True, required=False, read_only=True)
    #finance_analysis = FinanceAnalysisSerializer(many=True, required=False, read_only=True)

    #beginning_balance_sheet = BeginningBalanceSheetSerializer(many=True, required=False, read_only=True)
    income_statements = IncomeStatementSerializer(many=True, required=False, read_only=True)
    cash_flow = CashFlowSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Scenario
        fields = (
            'id',
            'income_statements',
            'cash_flow',
            'finance_analysis',
            'type',
            'title',
            'notes',
            'created_date',
            'modified_date',
        )


class FinanceAnalysisSerializer(serializers.ModelSerializer):
    scenarios = ScenarioSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = FinanceAnalysis
        fields = (
            'id',
            'scenarios',
            'title',
            'notes',
            'temp',
            'created_date',
            'modified_date',
        )

class CashflowPdfOutputItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashflowPdfOutputItem
        fields = (
            'id',
            'cash_flow',
            'year',
            'item_name',
            'item_number',
            'type',
        )

class CashflowPdfOutputSerializer(serializers.ModelSerializer):

    class Meta:
        model = CashflowPdfOutput
        fields = (
            'id',
            'scenario',
        )


class BalanceSheetOutputSerializer(serializers.ModelSerializer):

    class Meta:
        model = BalanceSheetOutput
        fields = (
            'id',
            'scenario',
        )

class BalanceSheetOutputItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = BalanceSheetOutputItem
        fields = (
            'id',
            'balance_sheet',
            'year',
            'item_name',
            'item_number',
            'type',
        )

class IncomeStatementOutputSerializer(serializers.ModelSerializer):

    class Meta:
        model = IncomeStatementOutput
        fields = (
            'id',
            'scenario',
        )

class IncomeStatementOutputItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = IncomeStatementOutputItem
        fields = (
            'id',
            'income_statement',
            'year',
            'item_name',
            'item_number',
            'type',
        )


class FinancialRatiosOutputSerializer(serializers.ModelSerializer):

    class Meta:
        model = FinancialRatiosOutput
        fields = (
            'id',
            'scenario',
            'year',
            'asset_turnover',
            'current_ratio',
            'debt_asset',
            'debt_capacity',
            'depreciation_expense_ratio',
            'dept_margin',
            'ebitda',
            'equity_assest',
            'interest_expense_ratio',
            'net_farm_ratio',
            'net_income',
            'operating_expense_ratio',
            'operating_profit_margin',
            'rate_return_asset',
            'rate_return_equity',
            'replacement_margin',
            'replacement_margin_ratio',
            'term_debt_ratio',
            'working_capital',
            'working_to_rev',
        )
