(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("managerListItem", {
      templateUrl: "/static/common/manager/manager-list-item/manager-list-item.component.html",
      controller: ManagerListItemComponentController,
      bindings: {
        item: "<",
        editable: "<",
        type: "<",
        showNotes: "<",
        showDate: "<",
        showType: "<",
        emptyFlex: "<",
        deleteOnly: "<",
        onDelete: "&",
        onEdit: "&",
        ordered: "<",
        onShiftUp: "&",
        onShiftDown: "&",
        customButtonText: "<",
        shortcutpdf:"<",
        onCustomButton: "&",
        buttonDisabled: "=",
        module: "<",
      }
    })
    .filter('ascendingorder', function(){
       return function(a){
      }

    });

    /****************************************************************
     Controller
     ****************************************************************/

    ManagerListItemComponentController.$inject = [
        "$state",
        "$uibModal",
        "scenarioService"
    ];

    function ManagerListItemComponentController(
        $state,
        $uibModal,
        scenarioService) {

        var $ctrl = this;

        /****************************************************************
         Bindable Members
         ****************************************************************/

        // Methods
        $ctrl.$onInit = $onInit;
        $ctrl.$onChanges = $onChanges;
        $ctrl.delete_reloadCurPage = delete_reloadCurPage;
        $ctrl.farmUnitAdjustment = farmUnitAdjustment;
        $ctrl.openShortPDf=openShortPDf

        // Outputs
        $ctrl.onEdit;
        $ctrl.onDelete;
        $ctrl.onShiftUp;
        $ctrl.onShiftDown;
        $ctrl.onCustomButton;

        // Inputs
        $ctrl.item;
        $ctrl.confirm;
        $ctrl.editable;
        $ctrl.type;
        $ctrl.showNotes;
        $ctrl.showDate;
        $ctrl.ordered;
        $ctrl.emptyFlex;
        $ctrl.deleteOnly;
        $ctrl.customButtonText;
        $ctrl.buttonDisabled;
        $ctrl.shortcutpdf;


        /****************************************************************
         Methods
         ****************************************************************/
        //let sorted_array = []

        function $onInit() {
          console.log($ctrl.item)
            $ctrl.confirm = false;
            if ($ctrl.module==='finance') {
              scenarioService.retrievePlan($ctrl.item.id, ["plan_budgets"])
              .then(function(plan_response) {
                console.log(plan_response.data)
                  checkUnit(plan_response.data.plan_budgets);
              })

            }
        }
        function openShortPDf(){
          var modal = $uibModal.open({
            animation: true,
            templateUrl: '/static/scenario/scenario-manager/shortcut-pdf-modal/shortcut-pdf-modal.html',
            controller: 'ShortCutModalController',
            controllerAs: '$ctrl',
            resolve: {
              scenario: function() {
                return $ctrl.item;
              }
            },
          });
        }
        function farmUnitAdjustment(item) {
          var modal = $uibModal.open({
            animation: true,
            templateUrl: '/static/scenario/finance-analysis/farm-unit-adjustment/farm-unit-adjustment.component.html',
            controller: 'farmUnitAdjustmentComponentController',
            controllerAs: '$ctrl',
            resolve: {
              plan: function() {
                return item;
              }
            },
          });
        }

        function $onChanges(changes) {
            $ctrl.confirm = false;
        }

        function delete_reloadCurPage() {
            $ctrl.onDelete({item: $ctrl.item});
            $state.reload();
        }


        /****************************************************************
                             Private Helper Functions
        ****************************************************************/

        /*Check the budget units under the plan. Show the convert button if there are different budget units.
          Cannot break angular.forEach, so using for-loop here*/
        function checkUnit(plan_budgets) {
          var farm_unit;
          for(var j = 0; j < plan_budgets.length; j++) {
            var budget = plan_budgets[j];

            if (farm_unit === undefined) {
              farm_unit = budget.farm_unit;
            } else if (farm_unit != budget.farm_unit) {
              $ctrl.convert = true;
              //farmUnitAdjustment($ctrl.item);
              break;
            }
            $ctrl.farmUnit = farm_unit;
            $ctrl.convert = false;
          }
        }


  }

})();
