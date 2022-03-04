(function() {
  'use strict';

  angular
    .module("allocateModule")
    .component("allocateItem", {
      templateUrl: "/static/allocate/allocate-item/allocate-item.component.html",
      controller: AllocateItemComponentController,
      bindings: {
        'source': '<',
        'targets': '<',
        'business': '<',
        'onChange': '&'
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  AllocateItemComponentController.$inject = [
    "$scope",
  ];

  function AllocateItemComponentController($scope) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.recalculateFor = recalculateFor;

    // Bound output methods
    $ctrl.onChange;

    // Inputs
    $ctrl.source;
    $ctrl.targets;
    $ctrl.method;
    $ctrl.business;

    // Calculated
    $ctrl.remainder;

    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      $ctrl.source.type == "income" ? $ctrl.method = "currency" : $ctrl.method = "percentage";
      $ctrl.targets = constructTargets();
      $ctrl.recalculateFor('percentage');
    }

    //console.log($ctrl.source.label)
    function recalculateFor(method) {
      $ctrl.remainder = {
        'value': $ctrl.source.total,
        'percentage': 0,
        'status': "valid",
      };
      angular.forEach($ctrl.targets, function(target) {
        if (method == 'currency' && (target.percentage)>=0) {

          target.currency = $ctrl.source.total > 0 ? parseInt((target.percentage / 100) * $ctrl.source.total) : 0;
        }
        else if (method == 'percentage' && (target.currency)>=0) {

          target.percentage = $ctrl.source.total > 0 ? parseInt((target.currency / $ctrl.source.total) * 100) : 0;
        }

        else{
          $ctrl.remainder.status="error"
        }

        $ctrl.remainder.value -= target.currency;
        $ctrl.remainder.percentage += target.percentage;

      });

      if ($ctrl.remainder.status!="error")
      {
          if ($ctrl.remainder.value > 1 && $ctrl.remainder.percentage != 100) {
          $ctrl.remainder.status = "underallocated";
        }
        else if ($ctrl.remainder.value < -1 && $ctrl.remainder.percentage != 100) {
          $ctrl.remainder.status = "overallocated";
        }
        else if ($ctrl.remainder.value == 0 || $ctrl.remainder.percentage == 100) {
          $ctrl.remainder.value = 0;
          $ctrl.remainder.status = "valid";
        }
        /*
        else if ($ctrl.remainder.value <= 1 && $ctrl.remainder.value >= -1 && $ctrl.source.total != 1) {
          $ctrl.remainder.value = 0;
          $ctrl.remainder.status = "valid";
        }
        else if ($ctrl.remainder.value == 0 && $ctrl.source.total == 1) {
          $ctrl.remainder.status = "valid";
        }
        */
        else {
          $ctrl.remainder.status = "error";
        }
    }

      var target_list = [];
      angular.forEach($ctrl.targets, function(target) {
        target_list.push({
          'index': target.index,
          'category': target.category,
          'value': target.currency,
          'business': $ctrl.business != undefined ? $ctrl.business : "",
        });
      });
      $ctrl.onChange({'targets': target_list, 'status': $ctrl.remainder.status});

    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    function constructTargets() {
      var targets = [];
       if ($ctrl.targets !== undefined) {
        $ctrl.targets.sort(compare);
       }

      angular.forEach($ctrl.targets, function(target, index) {
        // Avoid divide by zero error by percentage to zero if source is zero
        var percentage = $ctrl.source.total == 0 ? 0 : parseInt((target[$ctrl.source.name] / $ctrl.source.total) * 100);
        var new_target = {
          'index': index,
          'category': $ctrl.source.name,
          'currency': parseInt(target[$ctrl.source.name]),
          'percentage': percentage,
          'business': $ctrl.business,
        };
        targets.push(new_target);
      });

      return targets;
    }

    function compare(a,b) {
      if (a.category_2 < b.category_2)
        return -1;
      if (a.category_2 > b.category_2)
        return 1;
      return 0;
    }

  }

}());
