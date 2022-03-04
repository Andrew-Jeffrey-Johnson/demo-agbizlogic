  (function() {
  'use strict';

  angular
    .module("scenarioModule")
    .factory("scenarioService", scenarioServiceFactory);

  scenarioServiceFactory.$inject = [
    '$http',
  ];

  function scenarioServiceFactory($http) {
    var url_base_scenarios = "/scenario/api/scenarios/",
        url_base_plans = "/scenario/api/plans/",
        url_base_plan_budgets = "/scenario/api/plan_budgets/",
        url_base_scale_income_items = '/budget/api/income_items/',
        url_base_plan_budgets_generate = url_base_plan_budgets + "generate/",
        url_base_plan_income_items = "/scenario/api/plan_income_items/",
        url_base_plan_cost_items = "/scenario/api/plan_cost_items/",
        url_base_income_item_inflation_rates = "/scenario/api/income_item_inflation_rates/",
        url_base_cost_item_inflation_rates = "/scenario/api/cost_item_inflation_rates/",
        url_base_balance_sheets = "/scenario/api/balance_sheets/",
        url_base_income_statement = "/scenario/api/income_statement/",
        url_base_cash_flows = "/scenario/api/cash_flows/",
        url_base_current_loans = "/scenario/api/current_loans/",
        url_base_finance_analysis = "/scenario/api/finance_analysis/",
        url_base_current_lease =" /scenario/api/capital_leases/",
        url_base_family_withdrawls="/scenario/api/family_withdrawls/",
        url_base_future_loans= "/scenario/api/future_loans/",
        url_base_inflation= "/scenario/api/inflation/",
        url_base_future_leases="/scenario/api/future_capital_leases/",
        url_base_depreciations="/scenario/api/depreciations/",
        url_base_distributions="/scenario/api/distributions/",
        url_base_accrual_adjustment="/scenario/api/accrual_adjustments/",
        url_base_new_transaction="/scenario/api/new_transaction/",
        url_base_operating_loans="/scenario/api/operating_loans/",
        url_base_capital_purchases="/scenario/api/capital_purchases/",
        url_base_capital_sales="/scenario/api/capital_sales/",
        url_base_future_capital_leases="/scenario/api/future_capital_leases/",
        url_base_cash_from_asset_loans="/scenario/api/cash_from_asset_loans/",
        url_base_cash_flow_pdf="/scenario/api/cash_flow_pdf/",
        url_base_cash_flow_item_output="/scenario/api/pdf_item/",
        url_base_balance_sheets_output="/scenario/api/balance_sheet_output/",
        url_base_balance_sheets_output_item="/scenario/api/balance_sheet_output_items/",
        url_base_income_statement_output="/scenario/api/income_statement_output/",
        url_base_income_statement_output_item="/scenario/api/income_statement_output_items/",
        url_base_finance_ratios_output="/scenario/api/finance_ratios_output/"


    return {
      listScenarios: listScenarios,
      createScenario: createScenario,
      retrieveScenario: retrieveScenario,
      updateScenario: updateScenario,
      destroyScenario: destroyScenario,
      copyScenario: copyScenario,

      createOperatingLoans:createOperatingLoans,
      createCapitalPurchases:createCapitalPurchases,
      createCapitalSales:createCapitalSales,
      createFutureCapitalLeases:createFutureCapitalLeases,
      createCashFromAssetLoans:createCashFromAssetLoans,
      listOperatingLoans:listOperatingLoans,
      listCapitalPurchases:listCapitalPurchases,
      listCapitalSales:listCapitalSales,
      listFutureCapitalLeases:listFutureCapitalLeases,
      listCashFromAssetLoans:listCashFromAssetLoans,

      setTimePeriod: setTimePeriod,

      listPlans: listPlans,
      listPlansByScenario: listPlansByScenario,
      listNewTransactions:listNewTransactions,
      createPlan: createPlan,
      retrievePlan: retrievePlan,
      updatePlan: updatePlan,
      destroyPlan: destroyPlan,
      copyPlan: copyPlan,
      calculatePlanIRR: calculatePlanIRR,
      updateCurrentLease: updateCurrentLease,
      destroyCashFlowForBalance: destroyCashFlowForBalance,
      retrieveCashFlowItem:retrieveCashFlowItem,
      retrieveCashFlowItemByName:retrieveCashFlowItemByName,
      updateOperatingLoans:updateOperatingLoans,
      updateCapitalPurchases:updateCapitalPurchases,
      updateCapitalSales:updateCapitalSales,
      updateFutureCapitalLeases:updateFutureCapitalLeases,
      updateCashFromAssetLoans:updateCashFromAssetLoans,
      listPlanBudgets: listPlanBudgets,
      createPlanBudget: createPlanBudget,
      retrievePlanBudget: retrievePlanBudget,
      updatePlanBudget: updatePlanBudget,
      destroyPlanBudget: destroyPlanBudget,
      generatePlanBudget: generatePlanBudget,
      createFutureLease: createFutureLease,
      createNewTransaction:createNewTransaction,
      createDistributions: createDistributions,
      updateDistributions: updateDistributions,
      listDistributions: listDistributions,

      listPlanIncomeItems: listPlanIncomeItems,
      createPlanIncomeItem: createPlanIncomeItem,
      retrievePlanIncomeItem: retrievePlanIncomeItem,
      updatePlanIncomeItem: updatePlanIncomeItem,
      destroyPlanIncomeItem: destroyPlanIncomeItem,
      destroyCurrentLoans:destroyCurrentLoans,
      updateFutureLease:updateFutureLease,
      destrroyNewTransaction:destrroyNewTransaction,
      destroyOperatingLoans:destroyOperatingLoans,
      destroyCapitalPurchases:destroyCapitalPurchases,
      destroyCapitalSales:destroyCapitalSales,
      destroyFutureCapitalLeases:destroyFutureCapitalLeases,
      destroyCashFromAssetLoans:destroyCashFromAssetLoans,


      listPlanCostItems: listPlanCostItems,
      createPlanCostItem: createPlanCostItem,
      retrievePlanCostItem: retrievePlanCostItem,
      updatePlanCostItem: updatePlanCostItem,
      destroyPlanCostItem: destroyPlanCostItem,
      destroyFutureLoans: destroyFutureLoans,

      createIncomeItemInflationRate: createIncomeItemInflationRate,
      updateIncomeItemInflationRate: updateIncomeItemInflationRate,

      createCostItemInflationRate: createCostItemInflationRate,
      updateCostItemInflationRate: updateCostItemInflationRate,

      listCurrentLoans: listCurrentLoans,
      listCurrentLease: listCurrentLease,
      retrieveCurrentLoans: retrieveCurrentLoans,
      createCurrentLoans: createCurrentLoans,
      updateCurrentLoans: updateCurrentLoans,
      updateFutureLoans: updateFutureLoans,
      updateInflation: updateInflation,
      destroyInflation: destroyInflation,
      listInflation: listInflation,
      createInflation: createInflation,
      destroyCurrentLease: destroyCurrentLease,
      createCurrentLease: createCurrentLease,
      createFutureLoans: createFutureLoans,
      retrieveDepreciation: retrieveDepreciation,
      destroyFutureLease: destroyFutureLease,




      listDepreciation: listDepreciation,
      getDepreciation: getDepreciation,
      createDepreciation: createDepreciation,
      retrieveBalanceSheet: retrieveBalanceSheet,
      listBalanceSheet: listBalanceSheet,
      listBalanceSheetByScenario: listBalanceSheetByScenario,

      retrieveFamiyWithdrawlsBySpecificScenario: retrieveFamiyWithdrawlsBySpecificScenario,
      listFutureLoans: listFutureLoans,
      listFutureLeases: listFutureLeases,
      updateFamilyWithDraws:updateFamilyWithDraws,
      destroyFamilyWithdraws: destroyFamilyWithdraws,
      createBalanceSheet: createBalanceSheet,
      createFamilyWithdrawls: createFamilyWithdrawls,
      updateBalanceSheet: updateBalanceSheet,
      destroyBalanceSheet: destroyBalanceSheet,
      retrieveBalanceSheetBySpecificYear: retrieveBalanceSheetBySpecificYear,
      createCashFlowForBalance: createCashFlowForBalance,

      listIncomeStatement: listIncomeStatement,
      retrieveIncomeStatement: retrieveIncomeStatement,
      createIncomeStatement: createIncomeStatement,
      updateIncomeStatement: updateIncomeStatement,
      destroyIncomeStatement: destroyIncomeStatement,

      listCashFlow: listCashFlow,
      createCashFlow: createCashFlow,
      updateCashFlow: updateCashFlow,
      destroyCashFlow: destroyCashFlow,

      retrieveFinanceAnalysis: retrieveFinanceAnalysis,
      listFinanceAnalysis: listFinanceAnalysis,
      createFinanceAnalysis: createFinanceAnalysis,
      updateFinanceAnalysis: updateFinanceAnalysis,
      destroyFinanceAnalysis: destroyFinanceAnalysis,
      updateDepreciation: updateDepreciation,

      retrieveAccrualAdjustment: retrieveAccrualAdjustment,
      createAccrualAdjustment: createAccrualAdjustment,
      updateAccrualAdjustment: updateAccrualAdjustment,
      retrieveCashFlowOutput: retrieveCashFlowOutput,
      createCashFlowOutput:createCashFlowOutput,
      createCashFlowItemOutput:createCashFlowItemOutput,
      destroyCashFlowOutput:destroyCashFlowOutput,
      createBalanceSheetItemOutput:createBalanceSheetItemOutput,
      destroyBalanceSheetOutput:destroyBalanceSheetOutput,
      retrieveIncomeStatementOutput:retrieveIncomeStatementOutput,
      retrieveBalanceSheetOutput:retrieveBalanceSheetOutput,
      createBalanceSheetOutput:createBalanceSheetOutput,
      createIncomeStatementOutput:createIncomeStatementOutput,
      createIncomeStatementItemOutput:createIncomeStatementItemOutput,
      destroyIncomeStatementOutput:destroyIncomeStatementOutput,
      retrieveCashFlowItemOutput:retrieveCashFlowItemOutput,
      retrieveBalanceSheetItemOutput:retrieveBalanceSheetItemOutput,
      retrieveIncomeStatementItemOutput:retrieveIncomeStatementItemOutput,
      retrieveFinanceRatiosOutput:retrieveFinanceRatiosOutput,
      createFinanceRatiosOutput:createFinanceRatiosOutput,
      destroyFinanceRatiosOutput:destroyFinanceRatiosOutput,

    };
    
    /****************************************************************
                         Methods
    ****************************************************************/


    // Scenario CRUD operations

    function listScenarios(username, fields) {
      var request = url_base_scenarios + "?username=" + username;
      if (fields !== undefined && fields.length > 0) {
        request = request.concat("&fields=" + fields);
      }
      return $http.get(request);
    }

    function retrieveAccrualAdjustment(filter, input) {
      return $http.get(url_base_accrual_adjustment +filter + input);
    }
    function createOperatingLoans(transaction) {
      return $http.post(url_base_operating_loans, transaction);
    }
    function createCapitalPurchases(transaction) {
      return $http.post(url_base_capital_purchases, transaction);
    }
    function createCapitalSales(transaction) {
      return $http.post(url_base_capital_sales, transaction);
    }
    function createFutureCapitalLeases(transaction) {
      return $http.post(url_base_future_capital_leases, transaction);
    }
    function createCashFromAssetLoans(transaction) {
      return $http.post(url_base_cash_from_asset_loans, transaction);
    }

    function listOperatingLoans(scenario_id) {
      return $http.get(url_base_operating_loans + "?scenario=" + scenario_id);
    }

    function listCapitalPurchases(scenario_id) {
      return $http.get(url_base_capital_purchases + "?scenario=" + scenario_id);
    }
    function listCapitalSales(scenario_id) {
      return $http.get(url_base_capital_sales + "?scenario=" + scenario_id);
    }
    function listFutureCapitalLeases(scenario_id) {
      return $http.get(url_base_future_capital_leases + "?scenario=" + scenario_id);
    }
    function listCashFromAssetLoans(scenario_id) {
      return $http.get(url_base_cash_from_asset_loans + "?scenario=" + scenario_id);
    }

    function destroyOperatingLoans(transaction) {
      return $http.delete(url_base_operating_loans + transaction + "/");
    }

    function destroyCapitalPurchases(transaction) {
      return $http.delete(url_base_capital_purchases + transaction + "/");
    }

    function destroyCapitalSales(transaction) {
      return $http.delete(url_base_capital_sales + transaction + "/");
    }

    function destroyFutureCapitalLeases(transaction) {
      return $http.delete(url_base_future_capital_leases + transaction + "/");
    }

    function destroyCashFromAssetLoans(transaction) {
      return $http.delete(url_base_cash_from_asset_loans + transaction + "/");
    }

    function updateOperatingLoans(transaction) {
      return $http.put(url_base_operating_loans + transaction.id + "/", transaction);
    }
    function updateCapitalPurchases(transaction) {
      return $http.put(url_base_capital_purchases + transaction.id + "/", transaction);
    }
    function updateCapitalSales(transaction) {
      return $http.put(url_base_capital_sales + transaction.id + "/", transaction);
    }
    function updateFutureCapitalLeases(transaction) {
      return $http.put(url_base_future_capital_leases + transaction.id + "/", transaction);
    }
    function updateCashFromAssetLoans(transaction) {
      return $http.put(url_base_cash_from_asset_loans + transaction.id + "/", transaction);
    }




    function createAccrualAdjustment(adjustment){
      return $http.post(url_base_accrual_adjustment , adjustment);
    }

    function updateAccrualAdjustment(transaction) {
      return $http.put(url_base_accrual_adjustment + transaction.id + "/", transaction);
    }


    function createDistributions(scenario){
      return $http.post(url_base_distributions , scenario);
    }

    function updateDistributions(transaction){
      return $http.put(url_base_distributions+transaction.id+ "/",transaction);
    }
    function listDistributions(scenario){
      return $http.get(url_base_distributions + "?scenario=" + scenario);
    }
    //Inflation
    function listInflation(scenario){
      return $http.get(url_base_inflation + "?scenario=" + scenario);
    }
    function createInflation(scenario){
      return $http.post(url_base_inflation , scenario);
    }
    function destroyInflation(transaction){
      return $http.delete(url_base_Inflation+transaction+"/");
    }
    function updateInflation(transaction){
      return $http.put(url_base_inflation + transaction.id + "/", transaction);
    }
    //Added
    function scaleIncomeItem(id){
      console.log($http.get(url_base_scale_income_items + id + "/"));
    }

    function copyScenario(scenario){
      return $http.post(url_base_scenarios + scenario.id + "/copy/", {});
    }

    function createScenario(new_scenario) {
      return $http.post(url_base_scenarios , new_scenario);
    }

    function createFutureLoans(future_loans){
      return $http.post(url_base_future_loans, future_loans);
    }




    function retrieveScenario(scenario_id, fields) {
      var request = url_base_scenarios + scenario_id + "/";
      if (fields !== undefined && fields.length > 0) {
        request = request.concat("?fields=" + fields);
      }

      return $http.get(request);
    }

    function destroyFutureLease(transaction){
        return $http.delete(url_base_future_leases + transaction + "/");
    }

    function destrroyNewTransaction(transaction) {
      return $http.delete(url_base_new_transaction + transaction + "/");
    }

    function createFutureLease(transaction){
      return $http.post(url_base_future_leases, transaction);
    }

    function createNewTransaction (transaction){
      return $http.post(url_base_new_transaction, transaction);
    }


    function updateScenario(updated_scenario) {
      return $http.put(url_base_scenarios + updated_scenario.id + "/", updated_scenario);
    }


    function destroyScenario(scenario_id) {
      // console.log("Attempted Deletion");
      return $http.delete(url_base_scenarios + scenario_id + "/");
    }

    function destroyFutureLoans(transaction){
      return $http.delete(url_base_future_loans+transaction+"/");
    }

    function updateFutureLease(transaction){
      return $http.put(url_base_future_leases+transaction.id,transaction);
    }



    // Plan operations
    function listPlans(username, module_name, fields) {
      var request = url_base_plans + "?username=" + username;
      if (module_name === undefined || typeof module_name != "string") {
        request = request.concat("&module=original");
      }
      else if (module_name != "all") {
        request = request.concat("&module=" + module_name);
      }
      if (fields !== undefined && fields.length > 0) {
        request = request.concat("&fields=" + fields);
      }
      return $http.get(request);
    }

    function listPlansByScenario(scenario, fields) {
      var request = url_base_plans + "?scenario=" + scenario;
      if (fields !== undefined && fields.length > 0) {
        request = request.concat("&fields=" + fields);
      }
      return $http.get(request);
    }


    function createPlan(new_plan) {
      return $http.post(url_base_plans, new_plan);
    }


    function retrievePlan(id, fields) {
      var request = url_base_plans + id + "/";
      if (fields !== undefined && fields.length > 0) {
        request = request.concat("?fields=" + fields);
      }

      return $http.get(request);
    }


    function updatePlan(updated_plan) {
      return $http.put(url_base_plans + updated_plan.id + "/", updated_plan);
    }

    function updateCurrentLease(transaction){
      return $http.put(" /scenario/api/capital_leases/"+ transaction.id,transaction);
    }


    function destroyPlan(id) {
      return $http.delete(url_base_plans + id + "/");
    }


    function copyPlan(plan_id, scenario_id) {
      /*Without attaching scenario, the scenario_id is -1*/
      return $http.post(url_base_plans + plan_id + "/copy/", {'scenario': scenario_id});
      //console.log("copyPlan is trying to use: ", plan_id);
      //return $http.post(url_base_plans + plan_id + "/copy/");
    }


    function calculatePlanIRR(plan_id) {
      return $http.get(url_base_plans + plan_id + "/calculate_irr");
    }


    // PlanBudget CRUD operations

    function listPlanBudgets(scenario_id) {
      return $http.get(url_base_plan_budgets + "?scenario=" + scenario_id);
    }


    function createPlanBudget(new_plan_budget) {
      return $http.post(url_base_plan_budgets, new_plan_budget);
    }


    function retrievePlanBudget(id) {
      return $http.get(url_base_plan_budgets + id + "/");
    }


    function updatePlanBudget(updated_plan_budget) {
      return $http.put(url_base_plan_budgets + updated_plan_budget.id + "/", updated_plan_budget);
    }


    function destroyPlanBudget(id) {
      return $http.delete(url_base_plan_budgets + id + "/");
    }


    function generatePlanBudget(plan_id, budget_id, module) {

      var payload = {
        'plan': plan_id,
        'budget': budget_id,
        'module' : module
      };
      return $http.post(url_base_plan_budgets_generate, payload);
    }


    function setTimePeriod(plan) {
      return $http.put(url_base_plans + plan.id + "/set_time_period/", plan);
    }


    // PlanIncomeItem CRUD operations

    function listPlanIncomeItems(plan_budget_id) {
      return $http.get(url_base_plan_income_items + "?plan_budget=" + plan_budget_id);
    }


    function createPlanIncomeItem(plan_income_item) {
      return $http.post(url_base_plan_income_items, plan_income_item);
    }


    function retrievePlanIncomeItem(plan_budget_id) {
      return $http.get(url_base_plan_income_items + plan_budget_id);
    }

    function retrieveCashFlowOutput(scenario_id) {
      return $http.get(url_base_cash_flow_pdf + "?scenario=" + scenario_id);
    }

    function retrieveIncomeStatementOutput(scenario_id) {
      return $http.get(url_base_income_statement_output + "?scenario=" + scenario_id);
    }

    function createIncomeStatementOutput(scenario_id) {
      return $http.post(url_base_income_statement_output , scenario_id);
    }

    function destroyIncomeStatementOutput(id) {
      return $http.delete(url_base_income_statement_output + id + "/");
    }

    function retrieveFinanceRatiosOutput(scenario_id) {
      return $http.get(url_base_finance_ratios_output + "?scenario=" + scenario_id);
    }

    function createFinanceRatiosOutput(scenario_id) {
      return $http.post(url_base_finance_ratios_output , scenario_id);
    }

    function destroyFinanceRatiosOutput(id) {
      return $http.delete(url_base_finance_ratios_output + id + "/");
    }

    function retrieveBalanceSheetOutput(scenario_id) {
      return $http.get(url_base_balance_sheets_output + "?scenario=" + scenario_id);
    }

    function destroyBalanceSheetOutput(id) {
      return $http.delete(url_base_balance_sheets_output + id + "/");
    }

    function createBalanceSheetOutput(scenario_id) {
      return $http.post(url_base_balance_sheets_output, scenario_id);
    }

    function destroyCashFlowOutput(id) {
      return $http.delete(url_base_cash_flow_pdf + id + "/");
    }

    function createCashFlowOutput(scenario_id) {
      return $http.post(url_base_cash_flow_pdf, scenario_id);
    }

    function createCashFlowItemOutput(scenario_id) {
      return $http.post(url_base_cash_flow_item_output, scenario_id);
    }

    function retrieveCashFlowItemOutput(id) {
      return $http.get(url_base_cash_flow_item_output + "?cashflow=" + id);
    }

    function retrieveIncomeStatementItemOutput(id) {
      return $http.get(url_base_income_statement_output_item + "?income_statement=" + id);
    }

    function retrieveBalanceSheetItemOutput(id){
      return $http.get(url_base_balance_sheets_output_item + "?balance_sheet=" + id);
    }

    function createBalanceSheetItemOutput(scenario_id) {
      return $http.post(url_base_balance_sheets_output_item, scenario_id);
    }

    function createIncomeStatementItemOutput(scenario_id) {
      return $http.post(url_base_income_statement_output_item, scenario_id);
    }




    function updatePlanIncomeItem(updated_plan_income_item) {
      return $http.put(url_base_plan_income_items + updated_plan_income_item.id + "/", updated_plan_income_item);
    }


    function destroyPlanIncomeItem(id) {
      return $http.delete(url_base_plan_income_items + id + "/");
    }


    // PlanCostItem CRUD operations

    function listPlanCostItems(plan_budget_id) {
      return $http.get(url_base_plan_cost_items + "?plan_budget=" + plan_budget_id);
    }


    function createPlanCostItem(plan_cost_item) {
      return $http.post(url_base_plan_cost_items, plan_cost_item);
    }


    function retrievePlanCostItem(id) {
      return $http.get(url_base_plan_cost_items + id + "/");
    }


    function updatePlanCostItem(updated_plan_cost_item) {
      return $http.put(url_base_plan_cost_items + updated_plan_cost_item.id + "/", updated_plan_cost_item);
    }


    function destroyPlanCostItem(id) {
      return $http.delete(url_base_plan_cost_items + id + "/");
    }


    // IncomeItemInflationRate CRUD

    function createIncomeItemInflationRate(income_item_inflation_rate) {
      return $http.post(url_base_income_item_inflation_rates, income_item_inflation_rate);
    }


    function updateIncomeItemInflationRate(income_item_inflation_rate) {
      return $http.put(url_base_income_item_inflation_rates + income_item_inflation_rate.id + "/", income_item_inflation_rate);
    }


    // CostItemInflationRate CRUD

    function createCostItemInflationRate(cost_item_inflation_rate) {
      return $http.post(url_base_cost_item_inflation_rates, cost_item_inflation_rate);
    }


    function updateCostItemInflationRate(cost_item_inflation_rate) {
      return $http.put(url_base_cost_item_inflation_rates + cost_item_inflation_rate.id + "/", cost_item_inflation_rate);
    }

    function updateFamilyWithDraws(family_withdrawls) {
      return $http.put(url_base_family_withdrawls + family_withdrawls.id + "/", family_withdrawls);
    }

    // CurrentLoans CRUD

    function listCurrentLoans(username) {
      return $http.get(url_base_current_loans + "?username=" + username);
    }

    function listCurrentLease(username) {
      return $http.get(url_base_current_lease + "?username=" + username);
    }


    function retrieveCurrentLoans(filter,input) {
      return $http.get(url_base_current_loans + filter + input);
    }


function createCurrentLease (transaction){
  return $http.post(url_base_current_lease, transaction);
}

    function createCurrentLoans(transaction) {
      return $http.post(url_base_current_loans, transaction);
    }


    function updateCurrentLoans(transaction) {
      return $http.put(url_base_current_loans + transaction.id + "/", transaction);
      // return $http.update("/scenario/api/current_loans/" + transaction.id,transaction);
    }
    function updateFutureLoans(transaction) {
      return $http.update(url_base_future_loans + transaction.id , transaction);
    }


    function destroyCurrentLoans(transaction_id) {
      return $http.delete(url_base_current_loans + transaction_id + "/");
    }

   function  destroyCurrentLease (transaction_id){
     return $http.delete(url_base_current_lease + transaction_id + "/");
   }



    // Depreciation CRUD
    function getDepreciation(scenario_id){
      return $http.get(url_base_depreciations + "?scenario=" + scenario_id);
    }

    function listDepreciation(scenario_id) {
      return $http.get("/scenario/api/scenarios/" + scenario_id + "/listDepreciation/");
    }


    // Beginning BalanceSheet operation

    function listBalanceSheet(username, fields) {
      var request = url_base_balance_sheets + "?username=" +username;
      if (fields !== undefined && fields.length > 0) {
        request = request.concat("&fields=" + fields);
      }
      return $http.get(request);
    }

    function listBalanceSheetByScenario(scenario, fields) {
      var request = url_base_balance_sheets + "?scenario=" +scenario;
      if (fields !== undefined && fields.length > 0) {
        request = request.concat("&fields=" + fields);
      }
      return $http.get(request);
    }

    function retrieveDepreciation(scenario_id){
      return $http.get("/scenario/api/depreciations/"+"?scenario=" +scenario_id);
    }
    function createDepreciation(scenario_id){
      return $http.post("/scenario/api/depreciations/", scenario_id);
    }

    function retrieveBalanceSheet(filter, input) {
      return $http.get(url_base_balance_sheets +filter + input);
    }

    function retrieveFamiyWithdrawlsBySpecificScenario(scenario) {
      return $http.get(url_base_family_withdrawls + scenario + "/specificScenario/");
    }
    function listFutureLoans(scenario) {
      return $http.get(url_base_future_loans + "?scenario=" +scenario );
    }
    function listFutureInflation(scenario) {
      return $http.update(url_base_inflation + "?scenario=" +scenario );
    }
    function retrieveCashFlowItem(scenario_id){
      return $http.get("/scenario/api/cashflowitem/" + "?scenario=" + scenario_id );
    }
    function retrieveCashFlowItemByName(scenario_id, name){
      return $http.get("/scenario/api/cashflowitem/" + "?scenario=" + scenario_id + "&name=" + name );
    }
    function listFutureLeases(scenario) {
      return $http.get("/scenario/api/future_capital_leases/" + "?scenario=" +scenario );
    }
    function listNewTransactions(scenario) {
      return $http.get(url_base_new_transaction + "?scenario=" +scenario );
    }

    function createBalanceSheet(new_balance_sheet) {
      return $http.post(url_base_balance_sheets, new_balance_sheet);
    }
    function createFamilyWithdrawls(new_family_withdrawls) {
      return $http.post(url_base_family_withdrawls, new_family_withdrawls);
    }

    function updateBalanceSheet(update_balance_sheet) {
      //console.log(url_base_balance_sheets + update_balance_sheet.id + "/", update_balance_sheet)
      return $http.put(url_base_balance_sheets + update_balance_sheet.id + "/", update_balance_sheet);
    }
    function updateDepreciation (update_depreciation) {
      return $http.put("/scenario/api/depreciations/" + update_depreciation.id + "/", update_depreciation);
    }
    function updateDistributions(transaction){
      return $http.put(url_base_distributions+transaction.id+"/",transaction);
    }

    function destroyBalanceSheet(id) {
      return $http.delete(url_base_balance_sheets + id + "/");
    }


    function destroyFamilyWithdraws(id){
      return $http.delete(url_base_family_withdrawls + id + "/");
    }
    function retrieveBalanceSheetBySpecificYear(year) {
      return $http.get(url_base_balance_sheets + year + "/specificYear/");
    }

    // IncomeStatement operation

    function listIncomeStatement(income_statement_id) {
        return $http.get(url_base_income_statement + "?income_statement=" + income_statement_id);
    }

    function retrieveIncomeStatement(scenario_id){
      return $http.get(url_base_income_statement + "?scenario=" + scenario_id );
    }

    function createIncomeStatement(new_income_statement) {
        return $http.post(url_base_income_statement, new_income_statement);
    }

    function updateIncomeStatement(update_income_statement) {
        return $http.put(url_base_income_statement + update_income_statement.id + "/", update_income_statement);
    }

    function destroyIncomeStatement(id) {
        return $http.delete(url_base_income_statement + id + "/");

    }

    // CashFlow operation

    function listCashFlow(cash_flow_id) {
        return $http.get(url_base_cash_flows + "?cash_flow=" + cash_flow_id)
    }

    function createCashFlow(new_cash_flow) {
        return $http.post(url_base_cash_flows, new_cash_flow);
    }

    function createCashFlowForBalance (new_cash_flow){
      return $http.post("/scenario/api/cashflowitem/", new_cash_flow);
    }
    function destroyCashFlowForBalance(id) {
        return $http.delete("/scenario/api/cashflowitem/" + id + "/")
    }

    function updateCashFlow(update_cash_flow) {
        return $http.put(url_base_cash_flows + update_cash_flow.id + "/", update_cash_flow);
    }

    function destroyCashFlow(id) {
        return $http.delete(url_base_cash_flows + id + "/")
    }

    // Finance Analysis CRUD

    function retrieveFinanceAnalysis(financeAnalysis_id) {
      return $http.get(url_base_finance_analysis + financeAnalysis_id + "/");
    }


    function listFinanceAnalysis(username, fields) {
      var request = url_base_finance_analysis + "?username=" + username;
      if (fields !== undefined && fields.length > 0) {
        request = request.concat("&fields=" + fields);
      }
      return $http.get(request);
    }


    function createFinanceAnalysis(new_financeAnalysis) {
      return $http.post("/scenario/api/finance_analysis/" , new_financeAnalysis);
    }


    function updateFinanceAnalysis(updated_financeAnalysis) {
      return $http.put(url_base_finance_analysis + updated_financeAnalysis.id + "/", updated_financeAnalysis);
    }


    function destroyFinanceAnalysis(financeAnalysis_id) {
      return $http.delete(url_base_finance_analysis + financeAnalysis_id + "/");
    }

  }

})();
