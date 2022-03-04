(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("climateManagerListItem", {
      templateUrl: "/static/common/climate-manager/manager-list-item/manager-list-item.component.html",
      controller: ClimateListItemComponentController,
      bindings: {
        item: "<",
        editable: "<",
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

    ClimateListItemComponentController.$inject = [
        "$state",
        "$uibModal"
    ];

    function ClimateListItemComponentController(
        $state,
        $uibModal) {

        var $ctrl = this;

        /****************************************************************
         Bindable Members
         ****************************************************************/

        // Methods
        $ctrl.$onInit = $onInit;
        $ctrl.$onChanges = $onChanges;
        $ctrl.delete_reloadCurPage = delete_reloadCurPage;

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
        $ctrl.showNotes;
        $ctrl.showDate;
        $ctrl.ordered;
        $ctrl.emptyFlex;
        $ctrl.deleteOnly;
        $ctrl.customButtonText;
        $ctrl.buttonDisabled;


        /****************************************************************
         Methods
         ****************************************************************/
        //let sorted_array = []

        function $onInit() {
            console.log(12312)
            $ctrl.confirm = false;
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


  }

})();
