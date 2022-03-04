(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("climateManagerList", {
      templateUrl: "/static/common/climate-manager/manager-list/manager-list.component.html",
      controller: ClimateListComponentController,
      bindings: {
        itemList: "<",
        editable: "<",
        showNotes: "<",
        showDate: "<",
        showType: "<",
        emptyFlex: "<",
        deleteOnly: "<",
        height: "<",
        onDelete: "&",
        onEdit: "&",
        ordered: "<",
        onOrderChange: "&",
        customButtonText: "<",
        onCustomButton: "&",
        module: "<"
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ClimateListComponentController.$inject = [];

  function ClimateListComponentController() {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.$onChanges = $onChanges;
    $ctrl.onShiftUp = onShiftUp;
    $ctrl.onShiftDown = onShiftDown;
    $ctrl.filter_name_down = filter_name_down;
    $ctrl.filter_name_up= filter_name_up;
    $ctrl.filter_created_date_up=filter_created_date_up;
    $ctrl.filter_created_date_down=filter_created_date_down;
    $ctrl.filter_modified_date_down=filter_modified_date_down
    $ctrl.filter_modified_date_up=filter_modified_date_up;

    // Inputs
    $ctrl.itemList;
    $ctrl.editable;
    $ctrl.ordered;
    $ctrl.height;
    $ctrl.showNotes;
    $ctrl.showDate;
    $ctrl.customButtonText;
    $ctrl.showType;
    $ctrl.emptyFlex;
    $ctrl.deleteOnly;

    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      console.log(12312)
      initialize();
      if($ctrl.itemList !== undefined){
        filter_modified_date_down();
      }
    }


    function $onChanges(changes) {
      initialize();
      if($ctrl.itemList !== undefined){
        filter_modified_date_down();
      }
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    function initialize() {
      if ($ctrl.height === undefined) {
        $ctrl.height = "small";
      }
      if ($ctrl.showNotes === undefined) {
        $ctrl.showNotes = true;
      }
      if ($ctrl.showDate === undefined) {
        $ctrl.showDate = false;
      }
      if ($ctrl.ordered === undefined) {
        $ctrl.ordered = false;
      }
      if($ctrl.showType === undefined){
        $ctrl.showType = false;
      }
      if($ctrl.emptyFlex === undefined){
        $ctrl.emptyFlex = true;
      }
      if($ctrl.deleteOnly === undefined){
        $ctrl.deleteOnly = false;
      }
    }

    function onShiftUp(item) {
      if (item !== undefined &&
          $ctrl.itemList.indexOf(item.item) != -1 &&
          $ctrl.itemList.indexOf(item.item) > 0) {
        item = item.item;
        var current_position = $ctrl.itemList.indexOf(item);
        var temp = $ctrl.itemList[current_position - 1];
        $ctrl.itemList[current_position - 1] = item;
        $ctrl.itemList[current_position] = temp;

        $ctrl.onOrderChange({items: $ctrl.itemList});
      }
    }


    function onShiftDown(item) {
      if (item !== undefined &&
          $ctrl.itemList.indexOf(item.item) != -1 &&
          $ctrl.itemList.indexOf(item.item) < ($ctrl.itemList.length - 1)) {
        item = item.item;
        var current_position = $ctrl.itemList.indexOf(item);
        var temp = $ctrl.itemList[current_position + 1];
        $ctrl.itemList[current_position + 1] = item;
        $ctrl.itemList[current_position] = temp;

        $ctrl.onOrderChange({items: $ctrl.itemList});
      }
    }


    function filter_name_up(){

      if($ctrl.itemList.length !=0){
        $ctrl.itemList.sort(function(a, b) {
            var a = a.title.toUpperCase();
            var b = b.title.toUpperCase();
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
      }
    }

    function filter_name_down(){

      if($ctrl.itemList.length !=0){
        $ctrl.itemList.sort(function(a, b) {
            var a = a.title.toUpperCase();
            var b = b.title.toUpperCase();
            return (a > b) ? -1 : (a < b) ? 1 : 0;
        });
      }
    }

    function filter_created_date_up(){
      if($ctrl.itemList.length !=0){
        $ctrl.itemList.sort(function(a, b) {
            var a = a.created_date;
            var b = b.created_date;
            return (a < b) ? -1 : (a > b) ? 1 : 0;

        });
      }
    }

    function filter_created_date_down(){
      if($ctrl.itemList.length !=0){
        $ctrl.itemList.sort(function(a, b) {
          var a = a.created_date;
          var b = b.created_date;
            return (a > b) ? -1 : (a < b) ? 1 : 0;
        });
      }
    }

    function filter_modified_date_up(){
      if($ctrl.itemList.length !=0){
        $ctrl.itemList.sort(function(a, b) {
          var a = a.modified_date;
          var b = b.modified_date;
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
      }
    }

    function filter_modified_date_down(){
      if($ctrl.itemList.length !=0){
        $ctrl.itemList.sort(function(a, b) {
            var a = a.modified_date;
            var b = b.modified_date;
            return (a > b) ? -1 : (a < b) ? 1 : 0;
        });
      }
    }

}

})();
