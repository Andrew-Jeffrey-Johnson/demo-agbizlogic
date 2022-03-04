(function() {
  'use strict';

  angular
    .module("commonModule")
    .directive("commaNumberInput", commaNumberInput);

  function commaNumberInput() {
    return {
      restrict: "A",
      bindToController: true,
      link: function(scope, element, attrs) {
        var element = element[0],
            arrow_keys = [9, 37, 38, 39, 40],
            delete_key = 190;

        // Event listeners
        element.addEventListener("keyup", format);
        element.addEventListener("keydown", unformat);

        // Initialize
        setTimeout(function() {
          element.value = Number(element.value.replace(/,/gi, "")).toLocaleString('en-us');
        }, 1);


        /****************************************************************
                             Methods
        ****************************************************************/

        function format(event) {
          if (event != undefined) {
            if (arrow_keys.indexOf(event.which) == -1 &&
                event.which != delete_key &&
                element.selectionStart == element.selectionEnd) {
              // FIXME: Hook into Angular lifecycle to set model bindings, then apply commas instead of setTimeout
              setTimeout(function() {
                if (element.value != "" && !isNaN(element.value)) {
                  element.value = Number(element.value.replace(/,/gi, "")).toLocaleString('en-us');
                }
              }, 10);
            }
          }
        }


        function unformat(event) {
          if (event != undefined) {
            if (arrow_keys.indexOf(event.which) == -1 &&
                event.which != delete_key &&
                element.selectionStart == element.selectionEnd) {
              element.value = element.value.replace(/,/g, "");
            }
          }
        }
      }
    };


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

  }

}());
