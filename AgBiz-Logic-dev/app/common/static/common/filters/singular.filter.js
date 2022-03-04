(function() {
  'use strict';

  angular
    .module("commonModule")
    .filter("singular", singular);

  function singular() {
    return function(input) {
      var string = input;

      if (angular.isString(input) && input.length > 0 && input[input.length - 1] == "s") {
        string = input.slice(0, -1);
      }

      return string;
    }
  }

}());
