(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeCurrentSummary", {
      templateUrl: "/static/scenario/finance-current-summary/finance-current-summary.component.html",
      controller: financeCurrentSummaryComponenController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    financeCurrentSummaryComponenController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      'budgetService',
      "$uibModal"
    ];

    function financeCurrentSummaryComponenController(
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
    $ctrl.steps = ['Beginning Balance Sheet', 'Current Loans', 'Current Capital Leases', 'Current Summary'];
    $ctrl.collapse_list = []
    $ctrl.back = back;
    $ctrl.user=[];
    $ctrl.proceed = proceed;
    $ctrl.myFunction = myFunction;
    $ctrl.toggleCollapse = toggleCollapse;
    // Scenario variable


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      for (var x in [1,2,3,4]){
        console.log(x);
        $ctrl.collapse_list[x] = 'false';
      }

      $ctrl.module = $state.params['module'];

      commonService.retrieveCurrentUser()
      .then(function(user_response) {
        if(user_response !== undefined){
          $ctrl.user = user_response.data;
        }
        scenarioService.retrieveCurrentLoans('?username=',$ctrl.user.username )
        .then(function(current_loans_response) {
          if (current_loans_response !== undefined &&
              current_loans_response.data !== undefined) {
                console.log($ctrl.current_loans_list)
              $ctrl.current_loans_list = current_loans_response.data;
              console.log($ctrl.current_loans_list)
          }
        });

        scenarioService.listCurrentLease($ctrl.user.username)
        .then(function(current_lease_response) {
          if (current_lease_response !== undefined &&
              current_lease_response.data !== undefined) {
              $ctrl.current_lease_list = current_lease_response.data;
              console.log($ctrl.current_lease_list );
          }
        });

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

    function numberWithCommas() {
      angular.forEach($ctrl.beginning_balance_sheet, function(value, key) {
        if (value!=null){
        console.log(key)
        $ctrl.beginning_balance_sheet[key]=value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      });
    }
}


    function toggleCollapse(collapse) {
      console.log(collapse);
      if(collapse === 'false'){
        return 'true';
      }
      else{
        return 'false'
      }
    }

    function myFunction(findclass) {
      var element = document.getElementsByClassName(findclass);
      console.log(element);
      for(var i = 0; i < element.length; i++) {
        element[i].classList.toggle("collapse");
      }
    }

    function back() {
      $state.go("financeLeases", {
        'module':$ctrl.module
      });
    }


    function proceed() {
       $state.go("scenarioManager", {
         'module':'finance'
       });
    }





}

  }())
