(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeBalanceSheet", {
      templateUrl: "/static/scenario/finance-balance-sheet/finance-balance-sheet.component.html",
      controller: FinanceBalanceSheetComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceBalanceSheetComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      'budgetService',
      "$uibModal"
    ];

    function FinanceBalanceSheetComponentController(
      $state,
      $filter,
      commonService,
      scenarioService,
      budgetService,
      $uibModal) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.proceed = proceed;
      $ctrl.back = back;
      $ctrl.itemAttributeMap = itemAttributeMap;
      $ctrl.update_BalanceSheet = update_BalanceSheet;
      // Variables
      $ctrl.user;
      $ctrl.module;
      $ctrl.activeTab = 0;
      $ctrl.years = [1,2,3,4,5];
      $ctrl.beginningYearForm = {
        "Current Assets":       ["Cash & Checking", "Accounts Receivable", "Prepaid Expenses", "Cash Investments in Growing Crops", "Marketable Livestock", "Stored Crops and Feed", "Purchased Feed", "Supplies",  "Other Current Assets"],
        //Seperate "Vehicles, Machinery, Equipment, and Breeding Livestock" in the future
        //hiding "Investment in Capital Leases", "Contracts & Notes Receivable" for MVP
        "Intermediate Assets":  ["Vehicles, Machinery, Equipment, and Breeding Livestock","Book Value of all Assets","Contracts & Notes Receivable","Investment in Cooperatives","Other Intermediate Assets"],
        //Hiding "Other Non-Current Assets" for MVP
        "Long Term Assets":     ["Real Estate, Land", "Other Long-Term Assets"],
        "Current Liabilities":  ["Accounts Payable", "Property Taxes","Employee Payroll Withholding", "Other Accrued Expenses", "Other Liabilities"]
      };
      $ctrl.steps = ['Beginning Balance Sheet', 'Current Loans', 'Current Capital Leases', 'Current Summary'];
      $ctrl.beginning_balance_sheet = {
        'year': 0,
        'cash_and_checking': 0.00,
        'cash_balance': 0.00,
        'prepaid_expenses': 0.00,
        'marketable_livestock': 0.00,
        'investment': 0.00,
        'account_receivable': 0.00,
        'other_assets': 0.00,
        'stored_crops_and_feed': 0.00,
        'purchased_feed': 0.00,
        'supplies': 0.00,
        //hiding for MVP, using machinery_equipment for all data now
        //'breeding_livestock': 0.00,
        //'vehicles': 0.00,
        'machinery_equipment': 0.00,
        'book_value': 0.00,
        'contracts_and_notes_receivable': 0.00,
        'investing_in_cooperatives':0.00,
        'other_intermediate':0.00,
        //hiding for MVP
        //'investment_in_capital_leases': 0.00,
        //'contracts_and_notes_receivable': 0.00,
        'real_estate_land': 0.00,
        'other_longterm_assets': 0.00,
        //hiding for MVP
        //'other_noncurrent_assets': 0.00,
        'accounts_payable': 0.00,
        'valorem_taxes':0.00,
        'employee_payroll_withholding': 0.00,
        'other_accured_expenses': 0.00,
        'other_liabilites': 0.00
      };


      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        $ctrl.module = $state.params['module'];
        commonService.retrieveCurrentUser()
        .then(function(user_response) {
          if(user_response !== undefined){
            $ctrl.user = user_response.data;
          }
          scenarioService.retrieveBalanceSheet('?username=', $ctrl.user.username)
          .then(function(balancesheet_response) {
            if (balancesheet_response === undefined ||
            balancesheet_response.data.length === 0) {
                  //create empty balance sheet object
                  commonService.retrieveCurrentUser()
                  .then(function(current_user_response){
                    var user = current_user_response.data;
                    $ctrl.beginning_balance_sheet.user = user.id;
                    scenarioService.createBalanceSheet($ctrl.beginning_balance_sheet)
                    .then(function(new_sheet_response) {
                      if (new_sheet_response !== undefined){
                        setTimeout(function(){
                            $state.reload();
                        }, 2000);
                      }

                  });
              });
            }
            else {
              $ctrl.beginning_balance_sheet = change_zeros_to_null(balancesheet_response.data[0]);
              numberWithCommas()
              console.log($ctrl.beginning_balance_sheet)
            }
          });
        });
      function change_zeros_to_null (data){
        angular.forEach(data, function(value, key) {
          if (value=="0.00")
          data[key]=null;
        });
        return data
      }

      }

      function itemAttributeMap(item) {
        var map = {
          "Cash & Checking": "cash_and_checking",
          "Accounts Receivable": "account_receivable",
          "Prepaid Expenses": "prepaid_expenses",
          "Cash Investments in Growing Crops": "investment",
          "Marketable Livestock": "marketable_livestock",
          "Stored Crops and Feed": "stored_crops_and_feed",
          "Purchased Feed": "purchased_feed",
          "Supplies": "supplies",
          "Other Current Assets": "other_assets",
          //hiding for MVP
          //"Breeding Livestock": 'breeding_livestock',
          //"Vehicles": 'vehicles',
          "Vehicles, Machinery, Equipment, and Breeding Livestock": 'machinery_equipment',
          "Book Value of all Assets": 'book_value',
          "Contracts & Notes Receivable": 'contracts_and_notes_receivable',
          "Investment in Cooperatives": 'investing_in_cooperatives',
          "Other Intermediate Assets": 'other_intermediate',
          //hiding for MVP
          //"Investment in Capital Leases": 'investment_in_capital_leases',
          //"Contracts & Notes Receivable": 'contracts_and_notes_receivable',
          "Real Estate, Land": 'real_estate_land',
          "Other Long-Term Assets": 'other_longterm_assets',
          "Buildings & Improvements": 'buildings_and_improvements',
          //hiding for MVP
          //"Other Non-Current Assets": 'other_noncurrent_assets',
          "Accounts Payable": 'accounts_payable',
          "Accrued Interest":'accrued_interest',
          "Property Taxes":'valorem_taxes',
          "Employee Payroll Withholding": 'employee_payroll_withholding',
          "Income Taxes": 'income_taxes',
          "Deferred Taxes": 'deferred_taxes',
          "Other Accrued Expenses": 'other_accured_expenses',
          "Other Liabilities": 'other_liabilites'
        }
        return map[item];
      }

      function proceed() {
        if ($ctrl.beginning_balance_sheet !== undefined) {
          change_null_to_zero($ctrl.beginning_balance_sheet)
          angular.forEach($ctrl.beginning_balance_sheet, function(value, key) {
            if (value!=null){
            $ctrl.beginning_balance_sheet[key]=value.toString().replace(/[^\d\.\-]/g, "");
          }
          });
          console.log($ctrl.beginning_balance_sheet)
          scenarioService.updateBalanceSheet($ctrl.beginning_balance_sheet)
          .then(function(updated_balanceSheet_response) {
            console.log($ctrl.beginning_balance_sheet)
            // if (updated_balanceSheet_response !== undefined &&
            //     updated_balanceSheet_response.data !== undefined &&
            //     updated_balanceSheet_response.data.id !== undefined) {
            //       $state.go("financeLoans", {
            //         'module': $ctrl.module
            //       });
            // }
            $state.go("financeLoans", {
                 'module': $ctrl.module
            });
          });
        }
      }
      function change_null_to_zero(data){
        angular.forEach(data, function(value, key) {
          if (value==null&&key!=="scenario")
          data[key]="0.00";
        });
      }
      function numberWithCommas() {
        angular.forEach($ctrl.beginning_balance_sheet, function(value, key) {
          if (value!=null){
          console.log(key)
          $ctrl.beginning_balance_sheet[key]=value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        });
      }

      function update_BalanceSheet(data){
        console.log(data)
        var copy = $. extend( {}, data )
        change_null_to_zero(copy)
        angular.forEach(copy, function(value, key) {
          if (value!=null){
          console.log()
          copy[key]=value.toString().replace(/[^\d\.\-]/g, "");
        }
        });
        console.log(copy)
        scenarioService.updateBalanceSheet(copy);
      }


      function back() {
        $state.go("scenarioManager", {
          'module': $ctrl.module
        });
      }

      /****************************************************************
                           Private Helper Functions
      ****************************************************************/

    }

}());
