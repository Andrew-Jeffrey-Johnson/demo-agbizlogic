(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeAccrualAdjustments", {
      templateUrl: "/static/scenario/finance-accrual-adjustments/finance-accrual-adjustments.html",
      controller: AccrualAdjustmentsComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    AccrualAdjustmentsComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'modalService',
      'scenarioService',
      '$uibModal',
    ];

    function AccrualAdjustmentsComponentController(
      $state,
      $filter,
      commonService,
      modalService,
      scenarioService,
      $uibModal) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.proceed = proceed;
      $ctrl.back = back;
      $ctrl.get_total = get_total;
      //$ctrl.update = update;
      $ctrl.check= true;
      // Scenario variable
      $ctrl.scenario;
      $ctrl.module;
      $ctrl.asset_type_list = ["Intermediate Assets", "Long Term Assets - Facilities and Other Improvements", "Long Term Assets - Real Estate"];

      $ctrl.supplies=[];
      $ctrl.account_receivable=[];
      $ctrl.accounts_payable=[];
      $ctrl.breeding_livestock=[];
      $ctrl.contracts_and_notes_receivable=[];
      $ctrl.deferred_taxes=[];
      $ctrl.valorem_taxes=[]
      $ctrl.employee_payroll_withholding=[];
      $ctrl.income_taxes=[];
      $ctrl.investment=[];
      $ctrl.investment_in_capital_leases=[];
      $ctrl.marketable_livestock=[];
      $ctrl.other_accured_expenses=[];
      $ctrl.other_assets=[];
      $ctrl.other_current_liabilites=[];
      $ctrl.other_intermediate=[];
      $ctrl.other_noncurrent_assets=[];
      $ctrl.prepaid_expenses=[];
      $ctrl.purchased_feed=[];
      $ctrl.real_estate_land=[];
      $ctrl.stored_crops_and_feed=[];
      $ctrl.supplies=[];
      $ctrl.vehicles=[];
      $ctrl.user;
      $ctrl.user_id;


      $ctrl.cash_and_checking=[];
      $ctrl.machinery_equipment=[];
      $ctrl.buildings_and_improvements=[];

      $ctrl.market_value_of_all_intermediate_assets=[]
      $ctrl.book_value_of_all_intermediate_and_long_term_assets=[0,0,0,0,0,0,0,0,0,0,0] //11 of 0s
      $ctrl.investments_in_cooperatives=[]
      $ctrl.other_intermediate_assets=[]
      $ctrl.other_long_term_assets=[]


      //use for store old item // new - old == adjustments
      $ctrl.old=[];
      $ctrl.scenario_id;
      $ctrl.accrual_adjustment=[];


      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        open_remind_modal()
        var scenario_id = $state.params['scenario'];
        $ctrl.scenario_id=scenario_id;
        $ctrl.module = $state.params['module'];
        // this code is to find begining balance_sheets, we dont need it in other place.
        commonService.retrieveCurrentUser()
        .then(function(user_response) {
          if(user_response !== undefined){
            $ctrl.user = user_response.data.username;
            $ctrl.user_id=user_response.data.id
            console.log($ctrl.user)
          }
        })
        //
        console.log(scenario_id)
        // scenarioService.retrieveBalanceSheet('?scenario=',scenario_id)
        // .then(function(balancesheet_response) {
          // console.log(balancesheet_response)
          // $ctrl.user_id=balancesheet_response.data[0].user//this code is for building accrual_adjustment with zero
          // =balancesheet_response.data[0].user
          scenarioService.retrieveAccrualAdjustment('?scenario=',scenario_id).then(function(data){
            console.log(data.data)
            var acc_filter =  data.data.filter(function(hero) {
               return hero.scenario == scenario_id;
             });//scenarioService.retrieveAccrualAdjustment doesnt work it return all the accural adjustment
             console.log(acc_filter)
             $ctrl.accrual_adjustment=acc_filter
            if(acc_filter.length==0){
              var year=[1,2,3,4,5,6,7,8,9,10]
              angular.forEach(year, function(year, key) {
              var data=initialization_acc_with_zero(year)
              console.log(data)
              scenarioService.createAccrualAdjustment(data).then(function(data){
                location.reload();
              })

            })

            }

            // start
            console.log(acc_filter)
            initialization($ctrl.user,acc_filter)


          })

        // })


      }

      function initialization(user,acc_adjustment) {
        acc_adjustment.sort((a, b) => (a.year > b.year) ? 1 : -1)
        console.log(acc_adjustment)
        // acc_adjustment.sort((a, b) => (a.year > b.year) ? 1 : -1)
        // console.log(acc_adjustment)
        // console.log(data)
        scenarioService.retrieveBalanceSheet('?username=',user)
        .then(function(balancesheet_response) {
          console.log(balancesheet_response)
          balancesheet_response=balancesheet_response.data[0]
          console.log(balancesheet_response.machinery_equipment)
          $ctrl.cash_and_checking[0]=parseFloat(balancesheet_response.cash_and_checking);
          $ctrl.machinery_equipment[0]=parseFloat(balancesheet_response.machinery_equipment);
          $ctrl.buildings_and_improvements[0]=parseFloat(balancesheet_response.buildings_and_improvements);
          $ctrl.supplies[0]=parseFloat(balancesheet_response.supplies);
          $ctrl.account_receivable[0]=parseFloat(balancesheet_response.account_receivable);
          $ctrl.accounts_payable[0]=parseFloat(balancesheet_response.accounts_payable);
          $ctrl.breeding_livestock[0]=parseFloat(balancesheet_response.breeding_livestock);
          $ctrl.contracts_and_notes_receivable[0]=parseFloat(balancesheet_response.contracts_and_notes_receivable);
          $ctrl.deferred_taxes[0]=parseFloat(balancesheet_response.deferred_taxes);
          $ctrl.valorem_taxes[0]=parseFloat(balancesheet_response.valorem_taxes);
          $ctrl.employee_payroll_withholding[0]=parseFloat(balancesheet_response.employee_payroll_withholding);
          $ctrl.income_taxes[0]=parseFloat(balancesheet_response.income_taxes);
          $ctrl.investment[0]=parseFloat(balancesheet_response.investment);
          $ctrl.investment_in_capital_leases[0]=parseFloat(balancesheet_response.investment_in_capital_leases);
          $ctrl.marketable_livestock[0]=parseFloat(balancesheet_response.marketable_livestock);
          $ctrl.other_accured_expenses[0]=parseFloat(balancesheet_response.other_accured_expenses);
          $ctrl.other_assets[0]=parseFloat(balancesheet_response.other_assets);
          $ctrl.other_current_liabilites[0]=parseFloat(balancesheet_response.other_liabilites);
          $ctrl.other_intermediate[0]=parseFloat(balancesheet_response.other_intermediate);
          $ctrl.other_noncurrent_assets[0]=parseFloat(balancesheet_response.other_noncurrent_assets)
          $ctrl.prepaid_expenses[0]=parseFloat(balancesheet_response.prepaid_expenses);
          $ctrl.purchased_feed[0]=parseFloat(balancesheet_response.purchased_feed);
          $ctrl.real_estate_land[0]=parseFloat(balancesheet_response.real_estate_land);
          $ctrl.stored_crops_and_feed[0]=parseFloat(balancesheet_response.stored_crops_and_feed);

          $ctrl.market_value_of_all_intermediate_assets[0]=parseFloat(balancesheet_response.machinery_equipment);
          $ctrl.book_value_of_all_intermediate_and_long_term_assets[0]=0;
          $ctrl.investments_in_cooperatives[0]=parseFloat(balancesheet_response.investing_in_cooperatives);
          $ctrl.other_intermediate_assets[0]=parseFloat(balancesheet_response.other_intermediate)
          $ctrl.other_long_term_assets[0]=parseFloat(balancesheet_response.other_longterm_assets)
          console.log($ctrl.investments_in_cooperatives[0])
        for(var i=1;i<11;i++){
          $ctrl.cash_and_checking[i]=parseFloat(acc_adjustment[i-1].cash_and_checking )
          //$ctrl.machinery_equipment[i]=parseFloat(acc_adjustment[i-1].machinery_equipment)
          $ctrl.buildings_and_improvements[i]=parseFloat(acc_adjustment[i-1].buildings_and_improvements)
          $ctrl.supplies[i]=parseFloat(acc_adjustment[i-1].supplies);
          $ctrl.account_receivable[i]=parseFloat(acc_adjustment[i-1].account_receivable);
          $ctrl.accounts_payable[i]=parseFloat(acc_adjustment[i-1].accounts_payable);
          $ctrl.breeding_livestock[i]=parseFloat(acc_adjustment[i-1].breeding_livestock);
          $ctrl.contracts_and_notes_receivable[i]=parseFloat(acc_adjustment[i-1].contracts_and_notes_receivable);
          $ctrl.deferred_taxes[i]=parseFloat(acc_adjustment[i-1].deferred_taxes);
          $ctrl.valorem_taxes[i]=parseFloat(acc_adjustment[i-1].valorem_taxes);
          $ctrl.employee_payroll_withholding[i]=parseFloat(acc_adjustment[i-1].employee_payroll_withholding)
          $ctrl.income_taxes[i]=parseFloat(acc_adjustment[i-1].income_taxes)
          $ctrl.investment[i]=parseFloat(acc_adjustment[i-1].investment)
          $ctrl.investment_in_capital_leases[i]=parseFloat(acc_adjustment[i-1].investment_in_capital_leases);
          $ctrl.marketable_livestock[i]=parseFloat(acc_adjustment[i-1].marketable_livestock);
          $ctrl.other_accured_expenses[i]=parseFloat(acc_adjustment[i-1].other_accured_expenses);
          $ctrl.other_assets[i]=parseFloat(acc_adjustment[i-1].other_assets);
          $ctrl.other_current_liabilites[i]=parseFloat(acc_adjustment[i-1].other_current_liabilites);
          // $ctrl.other_intermediate[i]=parseFloat(acc_adjustment[i-1].other_intermediate_assets);
          $ctrl.other_noncurrent_assets[i]=parseFloat(acc_adjustment[i-1].other_noncurrent_assets);
          $ctrl.prepaid_expenses[i]=parseFloat(acc_adjustment[i-1].prepaid_expenses);
          $ctrl.purchased_feed[i]=parseFloat(acc_adjustment[i-1].purchased_feed);
          $ctrl.real_estate_land[i]=parseFloat(acc_adjustment[i-1].real_estate_land);
          $ctrl.stored_crops_and_feed[i]=parseFloat(acc_adjustment[i-1].stored_crops_and_feed);

          $ctrl.investments_in_cooperatives[i]=parseFloat(acc_adjustment[i-1].investments_in_cooperatives);
          $ctrl.other_intermediate_assets[i]=parseFloat(acc_adjustment[i-1].other_intermediate_assets);
          $ctrl.other_long_term_assets[i]=parseFloat(acc_adjustment[i-1].other_long_term_assets)
          $ctrl.market_value_of_all_intermediate_assets[i]=parseFloat(acc_adjustment[i-1].market_value_of_all_intermediate_assets);
          $ctrl.book_value_of_all_intermediate_and_long_term_assets[i]=parseFloat(acc_adjustment[i-1].book_value_of_all_intermediate_and_long_term_assets);

          $ctrl.vehicles[i]=parseFloat(acc_adjustment[i-1].vehicles);
        }
        console.log($ctrl.investments_in_cooperatives)
        console.log($ctrl.other_intermediate)
        console.log($ctrl.other_current_liabilites)

      })

    }


      function initialization_acc_with_zero(year){
        var a={}
        a.user= $ctrl.user_id
        a.scenario=$ctrl.scenario_id
        a.year= year
        a.account_receivable= 0
        a.accounts_payable= 0
        a.breeding_livestock= 0
        a.contracts_and_notes_receivable= 0
        a.deferred_taxes= 0
        a.employee_payroll_withholding= 0
        a.income_taxes= 0
        a.investment= 0
        a.investment_in_capital_leases= 0
        a.marketable_livestock= 0
        a.other_accured_expenses= 0
        a.other_assets= 0
        a.other_current_liabilites= 0
        a.purchased_feed= 0
        a.real_estate_land= 0
        a.supplies= 0
        a.prepaid_expenses=0
        return a
      }

      // function acc_adjustment(data){
      //
      //   data.sort((a, b) => (a.year > b.year) ? 1 : -1)
      //   angular.forEach(data, function(data, key) {
      //     key=key+1;
      //     console.log(data)
      //     var  accrual_adjustment={};
      //     accrual_adjustment.user= data.user
      //     accrual_adjustment.year= data.year
      //     accrual_adjustment.account_receivable= parseFloat($ctrl.account_receivable[key])-parseFloat(data.account_receivable)
      //     accrual_adjustment.accounts_payable= parseFloat($ctrl.accounts_payable[key])-parseFloat(data.accounts_payable)
      //     accrual_adjustment.breeding_livestock= parseFloat($ctrl.breeding_livestock[key])-parseFloat(data.breeding_livestock)
      //     accrual_adjustment.contracts_and_notes_receivable= parseFloat($ctrl.contracts_and_notes_receivable[key])-parseFloat(data.contracts_and_notes_receivable)
      //     accrual_adjustment.deferred_taxes= parseFloat($ctrl.deferred_taxes[key])-parseFloat(data.deferred_taxes)
      //     accrual_adjustment.valorem_taxes= parseFloat($ctrl.valorem_taxes[key])-parseFloat(data.valorem_taxes)
      //     accrual_adjustment.employee_payroll_withholding= parseFloat($ctrl.employee_payroll_withholding[key])-parseFloat(data.employee_payroll_withholding)
      //     accrual_adjustment.income_taxes= parseFloat($ctrl.income_taxes[key])-parseFloat(data.income_taxes)
      //     accrual_adjustment.investment= parseFloat($ctrl.investment[key])-parseFloat(data.investment)
      //     accrual_adjustment.investment_in_capital_leases= parseFloat($ctrl.investment_in_capital_leases[key])-parseFloat(data.investment_in_capital_leases)
      //     accrual_adjustment.marketable_livestock= parseFloat($ctrl.marketable_livestock[key])-parseFloat(data.marketable_livestock)
      //     accrual_adjustment.other_accured_expenses= parseFloat($ctrl.other_accured_expenses[key])-parseFloat(data.other_accured_expenses)
      //     accrual_adjustment.other_assets= parseFloat($ctrl.other_assets[key])-parseFloat(data.other_assets)
      //     accrual_adjustment.other_current_liabilites= parseFloat($ctrl.other_current_liabilites[key])-parseFloat(data.other_current_liabilites)
      //     accrual_adjustment.other_intermediate= parseFloat($ctrl.other_intermediate[key])-parseFloat(data.other_intermediate)
      //     accrual_adjustment.purchased_feed= parseFloat($ctrl.purchased_feed[key])-parseFloat(data.purchased_feed)
      //     accrual_adjustment.real_estate_land= parseFloat($ctrl.real_estate_land[key])-parseFloat(data.real_estate_land)
      //     accrual_adjustment.supplies= parseFloat($ctrl.supplies[key])-parseFloat(data.supplies)
      //     accrual_adjustment.prepaid_expenses= parseFloat($ctrl.prepaid_expenses[key])-parseFloat(data.prepaid_expenses)
      //     accrual_adjustment.stored_crops_and_feed= parseFloat($ctrl.stored_crops_and_feed[key])-parseFloat(data.stored_crops_and_feed)
      //     $ctrl.accrual_adjustment.push(accrual_adjustment)
      //   })
      //   console.log($ctrl.accrual_adjustment)
      //
      // }

      function open_remind_modal(){
        var message = "Accrual adjustments calculated values in any year can not be negative, please change the number to make sure the calculated values positive"
        modalService.alert(message);
      }
      // to check if all the calculated values not negative
      function check_calculated_values(){
        $ctrl.check=true
        var table=[]
        table.push(get_total($ctrl.account_receivable))
        table.push(get_total($ctrl.prepaid_expenses))
        table.push(get_total($ctrl.investment))
        table.push(get_total($ctrl.marketable_livestock))
        table.push(get_total($ctrl.stored_crops_and_feed))
        table.push(get_total($ctrl.purchased_feed))
        table.push(get_total($ctrl.supplies))
        table.push(get_total($ctrl.other_assets))
        table.push(get_total($ctrl.accounts_payable))
        table.push(get_total($ctrl.contracts_and_notes_receivable))
        table.push(get_total($ctrl.employee_payroll_withholding))
        table.push(get_total($ctrl.income_taxes))
        table.push(get_total($ctrl.deferred_taxes))
        table.push(get_total($ctrl.valorem_taxes))
        table.push(get_total($ctrl.other_accured_expenses))
        table.push(get_total($ctrl.other_current_liabilites))
        table.push(get_total($ctrl.other_intermediate))
        console.log(get_total($ctrl.other_current_liabilites))
        angular.forEach(table, function(line, key) {
          angular.forEach(line,function(data,key_2){
            if (data<0){
              $ctrl.check=false
            }
          })
        })
      }

      function proceed() {
        check_calculated_values()

        if ($ctrl.check){
          calculate_acc()
          $state.go("scenarioManager", {
            'scenario': $state.params['scenario'],
            'module':'finance'
          });
        }
        else{
          open_remind_modal()
        }
      }


      function calculate_acc(){

        $ctrl.account_receivable=$ctrl.account_receivable.map(function(value) {
            return value
        } );
        $ctrl.machinery_equipment=$ctrl.machinery_equipment.map(function(value) {
            return value
        } );
        $ctrl.supplies=$ctrl.supplies.map(function(value) {
            return value
        } );
        $ctrl.account_receivable=$ctrl.account_receivable.map(function(value) {
            return value
        } );
        $ctrl.accounts_payable=$ctrl.accounts_payable.map(function(value) {
            return value
        } );
        $ctrl.deferred_taxes=$ctrl.deferred_taxes.map(function(value) {
            return value
        } );
        $ctrl.valorem_taxes=$ctrl.valorem_taxes.map(function(value) {
            return value
        } );
        $ctrl.employee_payroll_withholding=$ctrl.employee_payroll_withholding.map(function(value) {
            return value
        } );
        $ctrl.income_taxes=$ctrl.income_taxes.map(function(value) {
            return value
        } );
        $ctrl.investment=$ctrl.investment.map(function(value) {
            return value
        } );
        $ctrl.marketable_livestock=$ctrl.marketable_livestock.map(function(value) {
            return value
        } );
        $ctrl.other_accured_expenses=$ctrl.other_accured_expenses.map(function(value) {
            return value
        } );
        $ctrl.other_assets=$ctrl.other_assets.map(function(value) {
            return value
        } );
        $ctrl.other_current_liabilites=$ctrl.other_current_liabilites.map(function(value) {
            return value
        } );
        $ctrl.other_intermediate=$ctrl.other_intermediate.map(function(value) {
            return value
        } );
        $ctrl.prepaid_expenses=$ctrl.prepaid_expenses.map(function(value) {
            return value
        } );
        $ctrl.purchased_feed=$ctrl.purchased_feed.map(function(value) {
            return value
        } );
        $ctrl.stored_crops_and_feed=$ctrl.stored_crops_and_feed.map(function(value) {
            return value
        } );
        $ctrl.contracts_and_notes_receivable=$ctrl.contracts_and_notes_receivable.map(function(value) {
            return value
        } );
        $ctrl.investments_in_cooperatives=$ctrl.investments_in_cooperatives.map(function(value) {
            return value
        } );
        $ctrl.other_intermediate_assets=$ctrl.other_intermediate_assets.map(function(value) {
            return value
        } );
        $ctrl.other_long_term_assets=$ctrl.other_long_term_assets.map(function(value) {
            return value
        } );
        $ctrl.market_value_of_all_intermediate_assets=$ctrl.market_value_of_all_intermediate_assets.map(function(value) {
            return value
        } );
        $ctrl.book_value_of_all_intermediate_and_long_term_assets=$ctrl.book_value_of_all_intermediate_and_long_term_assets.map(function(value) {
            return value
        } );

        console.log($ctrl.accrual_adjustment)
        angular.forEach($ctrl.accrual_adjustment, function(data, key) {
          console.log(data)
          data.account_receivable=$ctrl.account_receivable[key+1]
          data.accounts_payable= $ctrl.accounts_payable[key+1]
          data.breeding_livestock= $ctrl.breeding_livestock[key+1]
          data.contracts_and_notes_receivable= $ctrl.contracts_and_notes_receivable[key+1]
          data.deferred_taxes= $ctrl.deferred_taxes[key+1]
          data.valorem_taxes= $ctrl.valorem_taxes[key+1]
          data.employee_payroll_withholding= $ctrl.employee_payroll_withholding[key+1]
          data.income_taxes= $ctrl.income_taxes[key+1]
          data.investment= $ctrl.investment[key+1]
          data.investment_in_capital_leases= $ctrl.investment_in_capital_leases[key+1]
          data.marketable_livestock= $ctrl.marketable_livestock[key+1]
          data.other_accured_expenses= $ctrl.other_accured_expenses[key+1]
          data.other_assets= $ctrl.other_assets[key+1]
          data.other_current_liabilites= $ctrl.other_current_liabilites[key+1]
          data.other_intermediate= $ctrl.other_intermediate[key+1]
          data.purchased_feed= $ctrl.purchased_feed[key+1]
          data.real_estate_land= $ctrl.real_estate_land[key+1]
          data.stored_crops_and_feed=$ctrl.stored_crops_and_feed[key+1]
          data.supplies= $ctrl.supplies[key+1]
          data.prepaid_expenses=$ctrl.prepaid_expenses[key+1]

          data.investments_in_cooperatives=$ctrl.investments_in_cooperatives[key+1]
          data.other_intermediate_assets= $ctrl.other_intermediate_assets[key+1]
          data.other_long_term_assets=$ctrl.other_long_term_assets[key+1]
          data.market_value_of_all_intermediate_assets=$ctrl.market_value_of_all_intermediate_assets[key+1]
          data.book_value_of_all_intermediate_and_long_term_assets=$ctrl.book_value_of_all_intermediate_and_long_term_assets[key+1]
          console.log(data)
          scenarioService.updateAccrualAdjustment(data).then(function(data){
          });
        })



      }
      function update_acc_adjustmen(data){
        console.log(data)
        console.log($ctrl.accrual_adjustment)
        angular.forEach($ctrl.accrual_adjustment, function(data_1, key_1) {
          angular.forEach(data.data, function(data_2, key_2) {
            if(data_1.year==data_2.year){
              $ctrl.accrual_adjustment[key_1].id=data_2.id
            }
        })
      })
        angular.forEach($ctrl.accrual_adjustment, function(data, key) {
          console.log(data)
          scenarioService.updateAccrualAdjustment(data);
        })

      }

      function back() {
        $state.go("scenarioManager", {
          'scenario': $state.params['scenario'],
          'module':'finance'
        });
      }
      function get_total(data){
        var calculated = []
        var temp = data[0]
        calculated.push(data[0])
        angular.forEach(data, function(date_of_year, key) {
          if (key!=0){
            temp=temp+date_of_year
            calculated.push(temp)
          }
        })
        return calculated
      }


      /****************************************************************
                           Private Helper Functions
      ****************************************************************/






    }

}());
