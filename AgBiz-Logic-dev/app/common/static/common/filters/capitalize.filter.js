(function() {
  'use strict';

  // Shamelessly taken from http://stackoverflow.com/questions/30207272

  angular
    .module("commonModule")
    .filter("capitalize", capitalize);

  function capitalize() {
    return function(input) {
      return (angular.isString(input) && input.length > 0) ? input[0].toUpperCase() + input.substr(1).toLowerCase() : input;
    }
  }

}());
